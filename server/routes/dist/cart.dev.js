"use strict";

var express = require('express');

var router = express.Router();

var Cart = require('../models/Cart');

var Product = require('../models/Product');

var verifyFirebaseToken = require('../middleware/verifyFirebaseToken'); // Helper: adjust product reserved count


function adjustReserved(productId, delta) {
  var prod;
  return regeneratorRuntime.async(function adjustReserved$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Product.findOne({
            productId: Number(productId)
          }));

        case 2:
          prod = _context.sent;

          if (prod) {
            _context.next = 5;
            break;
          }

          throw new Error('Product not found');

        case 5:
          prod.reserved = Math.max(0, (prod.reserved || 0) + delta);
          _context.next = 8;
          return regeneratorRuntime.awrap(prod.save());

        case 8:
          return _context.abrupt("return", prod);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
} // Helper: check that the token uid matches the userId in the route


function checkOwnership(req, res) {
  if (req.user.uid !== req.params.userId) {
    res.status(403).json({
      error: 'Forbidden — you can only access your own cart'
    });
    return false;
  }

  return true;
}
/**
 * @route   GET /api/cart/:userId
 * @desc    Get or create a cart for the given user
 * @access  Private
 */


router.get('/:userId', verifyFirebaseToken, function _callee(req, res) {
  var userId, cart;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (checkOwnership(req, res)) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return");

        case 2:
          _context2.prev = 2;
          userId = req.params.userId;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 6:
          cart = _context2.sent;

          if (cart) {
            _context2.next = 11;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(Cart.create({
            userId: userId,
            items: []
          }));

        case 10:
          cart = _context2.sent;

        case 11:
          res.json(cart);
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](2);
          res.status(500).json({
            error: 'Server error'
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 14]]);
});
/**
 * @route   POST /api/cart/:userId/add
 * @desc    Add an item to the user's cart and reserve stock; body: { productId, quantity }
 * @access  Private
 */

router.post('/:userId/add', verifyFirebaseToken, function _callee2(req, res) {
  var userId, _req$body, productId, quantity, qty, id, product, available, cart, itemIdx, fresh;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (checkOwnership(req, res)) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return");

        case 2:
          _context3.prev = 2;
          userId = req.params.userId;
          _req$body = req.body, productId = _req$body.productId, quantity = _req$body.quantity;

          if (!(productId == null || quantity == null)) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'productId and quantity required'
          }));

        case 7:
          qty = Number(quantity);

          if (!(!Number.isInteger(qty) || qty <= 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'quantity must be a positive number'
          }));

        case 10:
          id = Number(productId);

          if (!(!Number.isInteger(id) || id <= 0)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'productId must be a positive integer'
          }));

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(Product.findOne({
            productId: id
          }));

        case 15:
          product = _context3.sent;

          if (product) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Product not found'
          }));

        case 18:
          available = product.stock == null ? Infinity : product.stock - (product.reserved || 0);

          if (!(available < qty)) {
            _context3.next = 21;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Insufficient stock available'
          }));

        case 21:
          _context3.next = 23;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 23:
          cart = _context3.sent;
          if (!cart) cart = new Cart({
            userId: userId,
            items: []
          });
          itemIdx = cart.items.findIndex(function (i) {
            return i.productId === id;
          });

          if (itemIdx >= 0) {
            cart.items[itemIdx].quantity += qty;
          } else {
            cart.items.push({
              productId: id,
              quantity: qty
            });
          }

          _context3.next = 29;
          return regeneratorRuntime.awrap(adjustReserved(id, qty));

        case 29:
          _context3.next = 31;
          return regeneratorRuntime.awrap(cart.save());

        case 31:
          _context3.next = 33;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 33:
          fresh = _context3.sent;
          res.json(fresh);
          _context3.next = 41;
          break;

        case 37:
          _context3.prev = 37;
          _context3.t0 = _context3["catch"](2);
          console.error(_context3.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 41:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 37]]);
});
/**
 * @route   POST /api/cart/:userId/remove
 * @desc    Remove an item (or reduce its quantity) from the user's cart and release reserved stock; body: { productId, quantity }
 * @access  Private
 */

router.post('/:userId/remove', verifyFirebaseToken, function _callee3(req, res) {
  var userId, _req$body2, productId, quantity, qty, cart, id, itemIdx, removeQty, fresh;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (checkOwnership(req, res)) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return");

        case 2:
          _context4.prev = 2;
          userId = req.params.userId;
          _req$body2 = req.body, productId = _req$body2.productId, quantity = _req$body2.quantity;

          if (!(productId == null || quantity == null)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'productId and quantity required'
          }));

        case 7:
          qty = Number(quantity);

          if (!(!Number.isInteger(qty) || qty <= 0)) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'quantity must be a positive number'
          }));

        case 10:
          _context4.next = 12;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 12:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Cart not found'
          }));

        case 15:
          id = Number(productId);

          if (!(!Number.isInteger(id) || id <= 0)) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'productId must be a positive integer'
          }));

        case 18:
          itemIdx = cart.items.findIndex(function (i) {
            return i.productId === id;
          });

          if (!(itemIdx === -1)) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Item not in cart'
          }));

        case 21:
          removeQty = Math.min(cart.items[itemIdx].quantity, qty);
          cart.items[itemIdx].quantity -= removeQty;
          if (cart.items[itemIdx].quantity <= 0) cart.items.splice(itemIdx, 1);
          _context4.next = 26;
          return regeneratorRuntime.awrap(adjustReserved(id, -removeQty));

        case 26:
          _context4.next = 28;
          return regeneratorRuntime.awrap(cart.save());

        case 28:
          _context4.next = 30;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 30:
          fresh = _context4.sent;
          res.json(fresh);
          _context4.next = 38;
          break;

        case 34:
          _context4.prev = 34;
          _context4.t0 = _context4["catch"](2);
          console.error(_context4.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 34]]);
});
/**
 * @route   DELETE /api/cart/:userId
 * @desc    Clear all items from the user's cart and release all reserved stock
 * @access  Private
 */

router["delete"]('/:userId', verifyFirebaseToken, function _callee4(req, res) {
  var userId, cart, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (checkOwnership(req, res)) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return");

        case 2:
          _context5.prev = 2;
          userId = req.params.userId;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Cart.findOne({
            userId: userId
          }));

        case 6:
          cart = _context5.sent;

          if (cart) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Cart not found'
          }));

        case 9:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 12;
          _iterator = cart.items[Symbol.iterator]();

        case 14:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 21;
            break;
          }

          item = _step.value;
          _context5.next = 18;
          return regeneratorRuntime.awrap(adjustReserved(item.productId, -item.quantity));

        case 18:
          _iteratorNormalCompletion = true;
          _context5.next = 14;
          break;

        case 21:
          _context5.next = 27;
          break;

        case 23:
          _context5.prev = 23;
          _context5.t0 = _context5["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 27:
          _context5.prev = 27;
          _context5.prev = 28;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 30:
          _context5.prev = 30;

          if (!_didIteratorError) {
            _context5.next = 33;
            break;
          }

          throw _iteratorError;

        case 33:
          return _context5.finish(30);

        case 34:
          return _context5.finish(27);

        case 35:
          cart.items = [];
          _context5.next = 38;
          return regeneratorRuntime.awrap(cart.save());

        case 38:
          res.json({
            success: true
          });
          _context5.next = 45;
          break;

        case 41:
          _context5.prev = 41;
          _context5.t1 = _context5["catch"](2);
          console.error(_context5.t1);
          res.status(500).json({
            error: 'Server error'
          });

        case 45:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 41], [12, 23, 27, 35], [28,, 30, 34]]);
});
module.exports = router;