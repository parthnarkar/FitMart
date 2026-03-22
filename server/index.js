// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Display all missing variables at server startup
const REQUIRED_ENV_VARS = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "MONGO_DB", "MONGO_URI", "PORT"];
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

// Single CORS config — having two app.use(cors(...)) calls means the first
// one (permissive) wins. Use one explicit config instead.
app.use(cors({
  origin: "http://localhost:5173",   // your Vite dev server
  credentials: true,
}));

app.use(express.json());

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

// ── Razorpay / payment routes (NO prefix — mounted at root) ─────────────────
// These handle:  POST /create-order
//                POST /verify-payment
//                POST /clear-cart
app.use(require("./routes/payment"));

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
});