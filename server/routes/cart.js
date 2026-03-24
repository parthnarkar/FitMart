const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

// ================= VALIDATION =================
function validateCartInput(req) {
  const { productId, quantity } = req.body;

  if (productId === undefined) {
    return { error: "productId is required" };
  }

  if (quantity === undefined) {
    return { error: "quantity is required" };
  }

  const parsedProductId = Number(productId);
  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedProductId)) {
    return { error: "productId must be a valid integer" };
  }

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    return { error: "quantity must be a positive integer" };
  }

  return { productId: parsedProductId, quantity: parsedQuantity };
}

// ================= HELPERS =================

// Adjust reserved stock
async function adjustReserved(productId, delta) {
  const prod = await Product.findOne({ productId });
  if (!prod) throw new Error('Product not found');

  prod.reserved = Math.max(0, (prod.reserved || 0) + delta);
  await prod.save();
  return prod;
}

// Ensure user owns the cart
function checkOwnership(req, res) {
  if (req.user.uid !== req.params.userId) {
    res.status(403).json({ error: 'Forbidden — you can only access your own cart' });
    return false;
  }
  return true;
}

// ================= ROUTES =================

// GET CART
router.get('/:userId', verifyFirebaseToken, async (req, res) => {
  if (!checkOwnership(req, res)) return;

  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ADD TO CART
router.post('/:userId/add', verifyFirebaseToken, async (req, res) => {
  if (!checkOwnership(req, res)) return;

  try {
    const { userId } = req.params;

    // ✅ VALIDATION
    const result = validateCartInput(req);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const { productId, quantity } = result;

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const available =
      product.stock == null
        ? Infinity
        : product.stock - (product.reserved || 0);

    if (available < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const itemIdx = cart.items.findIndex(i => i.productId === productId);

    if (itemIdx >= 0) {
      cart.items[itemIdx].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await adjustReserved(productId, quantity);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// REMOVE FROM CART
router.post('/:userId/remove', verifyFirebaseToken, async (req, res) => {
  if (!checkOwnership(req, res)) return;

  try {
    const { userId } = req.params;

    // ✅ VALIDATION
    const result = validateCartInput(req);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const { productId, quantity } = result;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIdx = cart.items.findIndex(i => i.productId === productId);
    if (itemIdx === -1) {
      return res.status(404).json({ error: 'Item not in cart' });
    }

    const removeQty = Math.min(cart.items[itemIdx].quantity, quantity);

    cart.items[itemIdx].quantity -= removeQty;

    if (cart.items[itemIdx].quantity <= 0) {
      cart.items.splice(itemIdx, 1);
    }

    await adjustReserved(productId, -removeQty);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CLEAR CART
router.delete('/:userId', verifyFirebaseToken, async (req, res) => {
  if (!checkOwnership(req, res)) return;

  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    for (const item of cart.items) {
      await adjustReserved(item.productId, -item.quantity);
    }

    cart.items = [];
    await cart.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;