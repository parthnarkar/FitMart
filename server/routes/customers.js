// server/routes/customers.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const admin = require('firebase-admin');

// ── Initialize Firebase Admin once ────────────────────────────────────────
// Uses the same explicit env vars as the rest of your server
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // .env stores the private key with literal \n — replace to real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// ── Helper: resolve Firebase UID → { displayName, email, photoURL } ───────
async function resolveFirebaseUser(uid) {
  try {
    const u = await admin.auth().getUser(uid);
    return {
      displayName: u.displayName || '—',
      email: u.email || '—',
      photoURL: u.photoURL || null,
    };
  } catch {
    return { displayName: '—', email: '—', photoURL: null };
  }
}

// ── Segmentation logic ─────────────────────────────────────────────────────
function getSegment(orderCount, totalSpend) {
  if (orderCount >= 5 || totalSpend >= 50000) return 'high-value';
  if (orderCount >= 2) return 'returning';
  return 'new';
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/customers
// All customers aggregated from orders, enriched with Firebase user info
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpend: { $sum: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
        },
      },
      { $sort: { totalSpend: -1 } },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          orderCount: 1,
          totalSpend: 1,
          firstOrder: 1,
          lastOrder: 1,
        },
      },
    ]);

    // Deduplicate UIDs and resolve Firebase user info in parallel
    const uniqueUids = [...new Set(customers.map(c => c.userId).filter(Boolean))];
    const userMap = {};
    await Promise.all(
      uniqueUids.map(async uid => {
        userMap[uid] = await resolveFirebaseUser(uid);
      })
    );

    const result = customers.map(c => ({
      ...c,
      segment: getSegment(c.orderCount, c.totalSpend),
      customerName: userMap[c.userId]?.displayName ?? '—',
      customerEmail: userMap[c.userId]?.email ?? '—',
      customerPhoto: userMap[c.userId]?.photoURL ?? null,
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Customers list error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/customers/:userId
// Single customer stats + order history, enriched with Firebase user info
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId, status: 'paid' })
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    const orderCount = orders.length;
    const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
    const firstOrder = orders[orders.length - 1].createdAt;
    const lastOrder = orders[0].createdAt;
    const segment = getSegment(orderCount, totalSpend);

    // Resolve Firebase user info for this single UID
    const { displayName, email, photoURL } = await resolveFirebaseUser(userId);

    res.json({
      success: true,
      data: {
        userId,
        customerName: displayName,
        customerEmail: email,
        customerPhoto: photoURL,
        orderCount,
        totalSpend,
        firstOrder,
        lastOrder,
        segment,
        orders,
      },
    });
  } catch (err) {
    console.error('Customer detail error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;