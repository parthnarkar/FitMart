const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Segmentation logic — computed from order count and total spend
function getSegment(orderCount, totalSpend) {
  if (orderCount >= 5 || totalSpend >= 50000) return 'high-value';
  if (orderCount >= 2) return 'returning';
  return 'new';
}

// GET /api/customers — all customers aggregated from orders
router.get('/', async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        // Stage 1: only paid orders
        $match: { status: 'paid' },
      },
      {
        // Stage 2: group by userId — compute stats
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpend: { $sum: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
        },
      },
      {
        // Stage 3: sort by totalSpend descending (highest spenders first)
        $sort: { totalSpend: -1 },
      },
      {
        // Stage 4: rename _id to userId for cleaner response
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

    // Add segmentation tag to each customer
    const result = customers.map(c => ({
      ...c,
      segment: getSegment(c.orderCount, c.totalSpend),
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Customers list error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/customers/:userId — single customer stats + order history
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all paid orders for this user
    const orders = await Order.find({ userId, status: 'paid' }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Compute stats from orders
    const orderCount = orders.length;
    const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
    const firstOrder = orders[orders.length - 1].createdAt;
    const lastOrder = orders[0].createdAt;
    const segment = getSegment(orderCount, totalSpend);

    res.json({
      success: true,
      data: {
        userId,
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
