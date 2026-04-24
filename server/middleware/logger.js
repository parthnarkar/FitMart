// server/middleware/logger.js

// Function to get base route only
const getBaseRoute = (url) => {
  // Match patterns like /api/cart, /api/products, /api/orders
  const match = url.match(/^(\/api\/(?:cart|products|orders))/);
  if (match) {
    // If it's a cart route with additional path, append the action
    if (url.includes('/cart/') && !url.match(/^\/api\/cart\/?$/)) {
      if (url.includes('/add')) return '/api/cart/add';
      if (url.includes('/remove')) return '/api/cart/remove';
    }
    return match[1];
  }
  return url;
};

// Simple logger with colors (without timestamps)
const logger = (req, res, next) => {
  const start = Date.now();

  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    // Get the simplified route
    const simplifiedUrl = getBaseRoute(req.originalUrl);

    // Color coding for HTTP methods
    const methodColor = {
      'GET': '\x1b[34m',    // Blue
      'POST': '\x1b[32m',   // Green
      'PUT': '\x1b[33m',    // Yellow
      'DELETE': '\x1b[31m', // Red
      'PATCH': '\x1b[35m',  // Magenta
    }[req.method] || '\x1b[0m'; // Default

    // Color coding for status codes
    const statusColor = status >= 500 ? '\x1b[31m' : // Red
      status >= 400 ? '\x1b[33m' : // Yellow
        status >= 300 ? '\x1b[36m' : // Cyan
          status >= 200 ? '\x1b[32m' : // Green
            '\x1b[0m'; // Default

    // Format the log message without timestamp
   const timestamp = new Date().toISOString();

// Safely stringify body
let bodyStr = "";
try {
  bodyStr = JSON.stringify(req.body);
} catch {
  bodyStr = "[unserializable body]";
}

// Redact sensitive fields
const redactFields = ["password", "token"];
let safeBody = { ...req.body };

redactFields.forEach((field) => {
  if (safeBody && safeBody[field]) {
    safeBody[field] = "[REDACTED]";
  }
});

// Logging logic
if (bodyStr.length < 1000) {
  console.log(
    `[${timestamp}] ${req.method} ${req.url}`,
    safeBody
  );
} else {
  console.log(
    `[${timestamp}] ${req.method} ${req.url} [body too large to log]`
  );
}

    // Log request body for non-GET requests (optional)
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
      console.log(`   Body: ${JSON.stringify(req.body)}`);
    }
  });

  next();
};

module.exports = logger;