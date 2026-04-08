const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { body, param, validationResult } = require('express-validator');

const validateProduct = [
  body('productId').isNumeric().withMessage('productId must be a number'),
  body('name').isString().notEmpty().withMessage('name is required'),
  body('price').isFloat({ min: 0 }).withMessage('price must be a non-negative number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock must be a non-negative integer'),
];

const validateProductUpdate = [
  body('name').optional().isString().notEmpty().withMessage('name must be a non-empty string'),
  body('price').optional().isFloat({ min: 0 }).withMessage('price must be a non-negative number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock must be a non-negative integer'),
];

const validateIdParam = [
  param('id').isNumeric().withMessage('id must be a number'),
];

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

/**
 * @route   GET /api/products
 * @desc    Returns all products sorted by productId in ascending order
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/products/low-stock
 * @desc    Returns all products where available stock (stock - reserved) is below threshold of 5
 * @access  Public
 */
const LOW_STOCK_THRESHOLD = 5;

router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({ stock: { $ne: null } });
    const lowStock = products.filter(p => (p.stock - p.reserved) < LOW_STOCK_THRESHOLD);
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Returns a single product by its productId
 * @access  Public
 */
router.get('/:id', validateIdParam, checkValidation, async (req, res) => {
  try {
    const product = await Product.findOne({ productId: Number(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/products
 * @desc    Creates a new product; body: full product object including unique productId
 * @access  Public
 */
router.post('/', validateProduct, checkValidation, async (req, res) => {
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

/**
 * @route   PUT /api/products/:id
 * @desc    Updates an existing product by productId; body: fields to update
 * @access  Public
 */
router.put('/:id', validateIdParam, validateProductUpdate, checkValidation, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate({ productId: Number(req.params.id) }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Deletes a product by its productId
 * @access  Public
 */
router.delete('/:id', validateIdParam, checkValidation, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ productId: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;