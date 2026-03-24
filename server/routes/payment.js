// server/routes/payment.js

const axios = require("axios");
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Shared helper: release reserved stock for all cart items ───────────────
// Mirrors the logic in server/routes/cart.js  DELETE /:userId
async function releaseAndClearCart(userId) {
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items.length) return;

  for (const item of cart.items) {
    const prod = await Product.findOne({ productId: Number(item.productId) });
    if (prod) {
      prod.reserved = Math.max(0, (prod.reserved || 0) - item.quantity);
      await prod.save();
    }
  }

  cart.items = [];
  await cart.save();
}

/**
 * @route   POST /create-order
 * @desc    Creates a Razorpay payment order; body: { amount (₹), currency, userId }
 * @access  Private
 */
router.post("/create-order", verifyFirebaseToken, async (req, res) => {
  try {
    const { amount, currency = "INR", userId } = req.body;
    if (!amount || !userId)
      return res.status(400).json({ error: "amount and userId are required" });

    // receipt must be ≤ 40 chars
    const shortId = userId.slice(-8);
    const shortTs = String(Date.now()).slice(-8);
    const receipt = `r_${shortId}_${shortTs}`;   // always 18 chars

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),   // ₹ → paise
      currency,
      receipt,
    });

    res.json(order);
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /verify-payment
 * @desc    Verifies Razorpay HMAC signature, prevents duplicate orders, creates the
 *          order record, and attaches the paymentId with status "paid";
 *          body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId }
 * @access  Private
 */
router.post("/verify-payment", verifyFirebaseToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ error: "Missing required payment fields" });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ error: "Signature mismatch — payment not verified" });

    //  STEP 1: Prevent duplicate orders
    const Order = require("../models/Order");
    const existingOrder = await Order.findOne({ paymentId: razorpay_payment_id });

    if (existingOrder) {
      return res.json({ success: true, message: "Order already created" });
    }

    // STEP 2: Create order using existing route logic
    const orderResponse = await axios.post("http://localhost:5000/api/orders", {
      userId
    });

    //  STEP 3: Attach paymentId to order
    await Order.findByIdAndUpdate(orderResponse.data._id, {
      paymentId: razorpay_payment_id,
      status: "paid"
    });

    res.json({ success: true, order: orderResponse.data });

  } catch (err) {
    console.error("verify-payment error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /clear-cart
 * @desc    Releases all reserved stock and clears the user's cart without creating an order;
 *          body: { userId }
 * @access  Private
 */
router.post("/clear-cart", verifyFirebaseToken, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    await releaseAndClearCart(userId);
    res.json({ success: true });
  } catch (err) {
    console.error("clear-cart error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /demo-success   ← DEV / TEST ONLY — disabled in production
// Body: { userId }
// Skips Razorpay entirely, fakes a payment ID, clears cart, returns success.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @route   POST /demo-success
 * @desc    Simulates a successful payment for testing only — skips Razorpay, generates
 *          a fake paymentId, creates an order, and marks it as "paid"; body: { userId }
 * @access  Private — TESTING ONLY, remove before going live
 */
router.post("/demo-success", verifyFirebaseToken, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const fakePaymentId = `pay_DEMO_${Date.now()}`;

    const Order = require("../models/Order");

    // prevent duplicate
    const existingOrder = await Order.findOne({ paymentId: fakePaymentId });
    if (existingOrder) {
      return res.json({ success: true, message: "Order already exists" });
    }

    // create order
    const orderResponse = await axios.post("http://localhost:5000/api/orders", {
      userId
    });

    // attach payment id
    await Order.findByIdAndUpdate(orderResponse.data._id, {
      paymentId: fakePaymentId,
      status: "paid"
    });

    res.json({ success: true, order: orderResponse.data });

  } catch (err) {
    console.error("demo-success error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;