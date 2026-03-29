// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const allowedOrigins = allowedOrigin.split(",").map((s) => s.trim()).filter(Boolean);

// Display all missing variables at server startup
const REQUIRED_ENV_VARS = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "MONGO_DB",
  "MONGO_URI",
  "PORT",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];
const missingVars = [];
REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
})
if (missingVars.length > 0) {
  console.log(`⚠️ Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// ── Middleware ──────────────────────────────────────────────────────────────

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many payment requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json());
app.use("/api", apiLimiter);
app.use("/api/payment/create-order", paymentLimiter);
app.use("/api/payment/verify-payment", paymentLimiter);

// ── Database ────────────────────────────────────────────────────────────────
require("./db");

// ── Logger (after body parsing, before routes) ──────────────────────────────
const logger = require("./middleware/logger");
app.use(logger);
//Dashboard route needs logger to parse query params for logging

const dashboardRoutes = require('./routes/dashboard');

// ── API routes (prefixed) ───────────────────────────────────────────────────
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/reports", require("./routes/reports"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/user", require("./routes/user"));
app.use("/api/customers", require("./routes/customers"));

// ── // Razorpay / payment routes (prefixed with /api/payment) ─────────────────
// These handle:  POST /create-order
//                POST /verify-payment
//                POST /clear-cart
app.use("/api/payment", require("./routes/payment"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("FitMart server running"));

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
