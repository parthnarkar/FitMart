// server/middleware/logger.js

// ── Configuration ───────────────────────────────────────────────────────────

/** Maximum body length (in characters) before the body is considered too large to log. */
const MAX_BODY_LENGTH = 1000;

/**
 * Set of request-body field names whose values should never appear in logs.
 * Matching is case-insensitive.
 */
const SENSITIVE_FIELDS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'creditcard',
  'credit_card',
  'cardnumber',
  'card_number',
  'cvv',
  'ssn',
  'razorpay_signature',
  'razorpay_payment_id',
]);

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Return a simplified base-route string so that logs are easier to scan.
 * e.g. `/api/cart/add?foo=1` → `/api/cart/add`
 */
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

/**
 * Deep-clone a plain object and replace the values of any keys whose names
 * appear in SENSITIVE_FIELDS with a `[REDACTED]` placeholder.
 *
 * @param {Record<string,any>} obj – the original body object
 * @returns {Record<string,any>}    – a sanitised copy safe for logging
 */
const redactSensitiveFields = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  const redacted = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.has(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactSensitiveFields(value);
    } else {
      redacted[key] = value;
    }
  }

  return redacted;
};

// ── Middleware ───────────────────────────────────────────────────────────────

/**
 * Express middleware that logs every request with:
 * - ISO-8601 timestamp
 * - Colour-coded HTTP method
 * - Colour-coded status code
 * - Simplified route
 * - Response time in ms
 * - Redacted request body (for non-GET requests, if body is under the size limit)
 */
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();

    const simplifiedUrl = getBaseRoute(req.originalUrl);

    // Colour coding for HTTP methods
    const methodColor = {
      'GET': '\x1b[34m',    // Blue
      'POST': '\x1b[32m',   // Green
      'PUT': '\x1b[33m',    // Yellow
      'DELETE': '\x1b[31m', // Red
      'PATCH': '\x1b[35m',  // Magenta
    }[req.method] || '\x1b[0m';

    // Colour coding for status codes
    const statusColor = status >= 500 ? '\x1b[31m' :
      status >= 400 ? '\x1b[33m' :
        status >= 300 ? '\x1b[36m' :
          status >= 200 ? '\x1b[32m' :
            '\x1b[0m';

    // Main log line — now prefixed with an ISO timestamp and includes duration
    console.log(
      `\x1b[90m[${timestamp}]\x1b[0m ` +
      `${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
      `${statusColor}${status}\x1b[0m ` +
      `${simplifiedUrl} ` +
      `\x1b[90m${duration}ms\x1b[0m`
    );

    // Log request body for non-GET requests (with size guard and redaction)
    if (req.method !== 'GET' && req.body && Object.keys(req.body).length > 0) {
      const bodyStr = JSON.stringify(req.body);

      if (bodyStr.length < MAX_BODY_LENGTH) {
        const safeBody = redactSensitiveFields(req.body);
        console.log(`   Body: ${JSON.stringify(safeBody)}`);
      } else {
        console.log(`   Body: [body too large to log – ${bodyStr.length} chars]`);
      }
    }
  });

  next();
};

module.exports = logger;