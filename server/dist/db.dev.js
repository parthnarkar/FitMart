"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose');

require('dotenv').config();

var MONGO_URI = process.env.MONGO_URI;
var MONGO_DB = process.env.MONGO_DB;

if (!MONGO_URI) {
  console.error('MONGO_URI not set in server/.env');
  process.exit(1);
}

mongoose.set('strictQuery', true);

function connect() {
  return regeneratorRuntime.async(function connect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(MONGO_URI, _objectSpread({
            useNewUrlParser: true,
            useUnifiedTopology: true
          }, MONGO_DB ? {
            dbName: MONGO_DB
          } : {})));

        case 3:
          console.log("MongoDB connected successfully");
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error("MongoDB connection failed:", _context.t0.message);
          process.exit(1);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

connect();
module.exports = mongoose;