// server/middleware/logger.js

//  Sensitive fields to redact
const SENSITIVE_FIELDS = ['token', 'password', 'secret', 'apiKey', 'authorization'];

//  Function to redact sensitive fields (recursive)
function redactSensitiveFields(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in newObj) {
    if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
      newObj[key] = '[REDACTED]';
    } else if (typeof newObj[key] === 'object') {
      newObj[key] = redactSensitiveFields(newObj[key]);
    }
  }

  return newObj;
}

// 🔹 Function to get base route only
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

// 🔹 Logger middleware (with timestamp, size guard, redaction)
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();

    const simplifiedUrl = getBaseRoute(req.originalUrl);

    //  Color coding for HTTP methods
    const methodColor = {
      'GET': '\x1b[34m',
      'POST': '\x1b[32m',
      'PUT': '\x1b[33m',
      'DELETE': '\x1b[31m',
      'PATCH': '\x1b[35m',
    }[req.method] || '\x1b[0m';

    // Color coding for status codes
    const statusColor = status >= 500 ? '\x1b[31m' :
      status >= 400 ? '\x1b[33m' :
        status >= 300 ? '\x1b[36m' :
          status >= 200 ? '\x1b[32m' :
            '\x1b[0m';

    // Main log with timestamp
    console.log(
      `[${timestamp}] ` +
      `${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
      `${statusColor}${status}\x1b[0m ` +
      `${simplifiedUrl}`
    );

    // Body logging with size guard + redaction
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
      const bodyStr = JSON.stringify(req.body);

      if (bodyStr.length < 1000) {
        const safeBody = redactSensitiveFields(req.body);
        console.log(`[${timestamp}] Body: ${JSON.stringify(safeBody)}`);
      } else {
        console.log(`[${timestamp}] Body: [body too large to log]`);
      }
    }
  });

  next();
};

module.exports = logger;