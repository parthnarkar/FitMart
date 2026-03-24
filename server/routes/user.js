// server/routes/user.js
const express = require("express");
const UserProfile = require("../models/UserProfile");
const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/user/login
// Body: { userId }
// Called once after Firebase auth resolves.
// - If profile doesn't exist → create it (isFirstLogin: true) → return showBanner: true
// - If profile exists and isFirstLogin is true → flip it false → return showBanner: true
// - If profile exists and isFirstLogin is false → return showBanner: false
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Brand new user — create profile, banner should show
      profile = await UserProfile.create({ userId });
      return res.json({
        showBanner: true,
        discountUsed: false,
        discountPercent: profile.discountPercent,
      });
    }

    if (profile.isFirstLogin) {
      // Seen the app before but hasn't dismissed banner yet
      // (e.g. closed tab before seeing it)
      return res.json({
        showBanner: true,
        discountUsed: profile.discountUsed,
        discountPercent: profile.discountPercent,
      });
    }

    // Returning user — no banner
    return res.json({
      showBanner: false,
      discountUsed: profile.discountUsed,
      discountPercent: profile.discountPercent,
    });
  } catch (err) {
    console.error("user/login error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// POST /api/user/dismiss-banner
// Body: { userId }
// Called when user dismisses the welcome banner.
// Flips isFirstLogin → false so it never shows again.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/dismiss-banner", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { isFirstLogin: false } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("user/dismiss-banner error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// POST /api/user/use-discount
// Body: { userId }
// Called after a successful first order.
// Flips discountUsed → true so it can't be used again.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/use-discount", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const profile = await UserProfile.findOneAndUpdate(
      { userId, discountUsed: false },   // only update if not already used
      { $set: { discountUsed: true } },
      { new: true }
    );

    if (!profile) {
      return res.status(400).json({ error: "Discount already used or user not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("user/use-discount error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/discount-status/:userId
// Returns current discount eligibility for a user.
// Used by Checkout to decide whether to apply the 10% discount.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/discount-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.json({ eligible: false, discountPercent: 0 });
    }

    res.json({
      eligible: !profile.discountUsed,
      discountUsed: profile.discountUsed,
      discountPercent: profile.discountPercent,
    });
  } catch (err) {
    console.error("user/discount-status error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;