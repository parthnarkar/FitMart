const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/orders - create an order from provided cart or explicit items
router.post('/', async (req, res) => {
  try {
    const { userId, items } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    let orderItems = items;
    if (!orderItems || !orderItems.length) {
      const cart = await Cart.findOne({ userId });
      if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });
      orderItems = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
    }

    // Build order items with price snapshot
    const populated = [];
    let total = 0;
    for (const it of orderItems) {

      const p = await Product.findOne({ productId: Number(it.productId) });
      if (!p) return res.status(400).json({ error: `Product ${it.productId} not found` });
      // Oversell guard - skip check if stock is null (unlimited)
      if (p.stock !== null) {
        const available = p.stock - p.reserved;
        if (available < it.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${p.name}. Available: ${available}` 
          });
        }
      }
      populated.push({ productId: p.productId, quantity: it.quantity, price: p.price });
      total += p.price * it.quantity;
    }
    // After order is created, deduct stock and reserved for each item
    const order = await Order.create({ userId, items: populated, total });
    for (const it of orderItems) {
      const p = await Product.findOne({ productId: Number(it.productId) });
      if (p && p.stock !== null) {
        await Product.findOneAndUpdate(
          { productId: p.productId },
          { $inc: { stock: -it.quantity, reserved: -it.quantity } }
        );
      }
    }


    // clear cart (do NOT release reserved - purchasing finalizes reservation)
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/orders/:userId - list orders for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
