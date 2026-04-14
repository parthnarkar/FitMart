// server/models/UserProfile.js
const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // Firebase UID
    isFirstLogin: { type: Boolean, default: true },              // false after first login banner is shown
    discountUsed: { type: Boolean, default: false },              // true after first order is placed
    discountPercent: { type: Number, default: 10 },              // 10% welcome discount
    // Profile fields
    name: { type: String },
    phone: { type: String },
    // Addresses array for checkout/shipping
    addresses: [
      {
        id: { type: String },
        label: { type: String },
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String },
        phone: { type: String },
      },
    ],
    defaultAddressId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);