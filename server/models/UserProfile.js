// server/models/UserProfile.js
const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // Firebase UID
    isFirstLogin: { type: Boolean, default: true },              // false after first login banner is shown
    discountUsed: { type: Boolean, default: false },              // true after first order is placed
    discountPercent: { type: Number, default: 10 },              // 10% welcome discount
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);