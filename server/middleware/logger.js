// server/middleware/logger.js

// Function to get base route only
const getBaseRoute = (url) => {
  const match = url.match(/^(\/api\/(?:cart|products|orders))/);
  if (match) {
    if (url.includes('/cart/') && !url.match(/^\/api\/cart\/?$/)) {
      if (url.includes('/add')) return '/api/cart/add';
      if (url.includes('/remove')) return '/api/cart/remove';
    }
    return match[1];
  }
  return url;
};

// 🔐 Helper to mask sensitive fields
const maskSensitiveData = (body) => {
  if (!body || typeof body !== 'object') return body;

  const sensitiveFields = [
    'password',
    'token',
    'auth',
    'authorization',
    'creditCard',
    'cardNumber',
    'cvv',
  ];

  const masked = { ...body };

  sensitiveFields.forEach((field) => {
    if (masked[field]) {
      masked[field] = '****';
    }
  });

  return masked;
};

// Enhanced logger with timestamp + safe logging
const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const simplifiedUrl = getBaseRoute(req.originalUrl);

    // Color coding for HTTP methods
    const methodColor = {
      GET: '\x1b[34m',
      POST: '\x1b[32m',
      PUT: '\x1b[33m',
      DELETE: '\x1b[31m',
      PATCH: '\x1b[35m',
    }[req.method] || '\x1b[0m';

    // Color coding for status codes
    const statusColor =
      status >= 500
        ? '\x1b[31m'
        : status >= 400
        ? '\x1b[33m'
        : status >= 300
        ? '\x1b[36m'
        : status >= 200
        ? '\x1b[32m'
        : '\x1b[0m';

    // 🆕 Improved log format with timestamp + duration
    console.log(
      `[${timestamp}] ` +
        `${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
        `${statusColor}${status}\x1b[0m ` +
        `${simplifiedUrl} ` +
        `(${duration}ms)`
    );

    // 🔐 Safe body logging (masked)
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
      const safeBody = maskSensitiveData(req.body);
      console.log(`   Body: ${JSON.stringify(safeBody)}`);
    }
  });

  next();
};

module.exports = logger;