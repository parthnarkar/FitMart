const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Helper: get the start date based on the time range filter
const getStartDate = (range) => {
  const now = new Date();
  if (range === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === 'week') {
    const day = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - day;
    return new Date(now.getFullYear(), now.getMonth(), diff);
  } else {
    // Default: this month
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
};

// GET /api/dashboard?range=today|week|month
router.get('/', async (req, res) => {
  try {
    const range = req.query.range || 'month';
    const startDate = getStartDate(range);

    // ── 1. KPI: Total Revenue & Total Orders (paid orders only) ─
    const orderStats = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.totalOrders || 0;

    // ── 2. KPI: Total Unique Customers ──
    const uniqueCustomers = await Order.distinct('userId', {
      status: 'paid',
      createdAt: { $gte: startDate },
    });
    const totalCustomers = uniqueCustomers.length;

    // ── 3. KPI: Products Low on Stock (stock < 10, stock not null) ───────────
    const LOW_STOCK_THRESHOLD = 10;
    const lowStockCount = await Product.countDocuments({
      stock: { $ne: null, $lt: LOW_STOCK_THRESHOLD },
    });

    // ── 4. Chart: Revenue Over Time ────
    // Groups by date (YYYY-MM-DD) for week/month, or by hour for today
    const revenueGroupFormat =
      range === 'today'
        ? { $dateToString: { format: '%H:00', date: '$createdAt' } }
        : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

    const revenueOverTime = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: revenueGroupFormat,
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
        },
      },
    ]);

    // ── 5. Chart: Top 5 Selling Products ───
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: 'paid',
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      // Lookup product name from Product collection
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'productId',
          as: 'productInfo',
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: { $arrayElemAt: ['$productInfo.name', 0] },
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    // ── 6. Recent Orders Table (latest 10 paid orders) ──
    const recentOrders = await Order.find({ status: 'paid' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userId items total status createdAt paymentId')
      .lean();

    // ── Response ───
    res.json({
      success: true,
      range,
      kpis: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount,
      },
      revenueOverTime,
      topProducts,
      recentOrders,
    });
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ success: false, message: 'Failed to load dashboard data' });
  }
});

module.exports = router;