const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - list all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/low-stock - get products with low stock
const LOW_STOCK_THRESHOLD = 5;

router.get('/low-stock', async (req, res) => {
  try {
    // only check products where stock is not null
    const products = await Product.find({ stock: { $ne: null } });
    const lowStock = products.filter(p => (p.stock - p.reserved) < LOW_STOCK_THRESHOLD);
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/products/:id - get product by productId
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/products - create a product
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const existing = await Product.findOne({ productId: body.productId });
    if (existing) return res.status(400).json({ error: 'productId already exists' });
    const p = new Product(body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/products/:id - update product by productId
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate({ productId: Number(req.params.id) }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id - delete product by productId
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ productId: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
