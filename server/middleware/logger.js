// server/middleware/logger.js

const SENSITIVE_FIELDS = ['token', 'password', 'secret', 'apikey', 'api_key', 'authorization', 'credential'];

// Recursively redacts sensitive fields from request body
function redactSensitiveFields(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key of Object.keys(redacted)) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitiveFields(redacted[key]);
    }
  }

  return redacted;
}

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

// Logger middleware with timestamps, size guard, and sensitive field redaction
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();

    const simplifiedUrl = getBaseRoute(req.originalUrl);

    // Color coding for HTTP methods
    const methodColor = {
      'GET':    '\x1b[34m', // Blue
      'POST':   '\x1b[32m', // Green
      'PUT':    '\x1b[33m', // Yellow
      'DELETE': '\x1b[31m', // Red
      'PATCH':  '\x1b[35m', // Magenta
    }[req.method] || '\x1b[0m';

    // Color coding for status codes
    const statusColor = status >= 500 ? '\x1b[31m' : // Red
      status >= 400 ? '\x1b[33m' :                   // Yellow
      status >= 300 ? '\x1b[36m' :                   // Cyan
      status >= 200 ? '\x1b[32m' :                   // Green
      '\x1b[0m';

    // Main log line — always includes ISO timestamp
    console.log(
      `[${timestamp}] ${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
      `${statusColor}${status}\x1b[0m ` +
      `${simplifiedUrl} (${duration}ms)`
    );

    // Body logging — non-GET only, with size guard and redaction
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
      const bodyStr = JSON.stringify(req.body);

      if (bodyStr.length < 1000) {
        const redactedBody = redactSensitiveFields(req.body);
        console.log(`[${timestamp}]    Body: ${JSON.stringify(redactedBody)}`);
      } else {
        console.log(`[${timestamp}]    Body: [body too large to log — ${bodyStr.length} chars]`);
      }
    }
  });

  next();
};

module.exports = logger;