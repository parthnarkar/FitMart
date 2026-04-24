// server/middleware/logger.js

// ✅ Step 1: Define sensitive fields
const SENSITIVE_FIELDS = [
  'token', 'password', 'secret',
  'apikey', 'api_key', 'authorization',
  'credential'
];

// ✅ Step 2: Redact function
const redact = (body) => {
  if (!body || typeof body !== 'object') return body;
  const newBody = { ...body };
  SENSITIVE_FIELDS.forEach(field => {
    if (newBody[field]) {
      newBody[field] = '[REDACTED]';
    }
  });
  return newBody;
};

// ✅ Step 3: Helper to simplify route URLs
const getBaseRoute = (url) => {
  const match = url.match(/^(\/api\/(?:cart|products|orders))/);
  if (match) {
    if (url.includes('/cart/') && !url.match(/^\/api\/cart\/?$/)) {
      if (url.includes('/add'))    return '/api/cart/add';
      if (url.includes('/remove')) return '/api/cart/remove';
    }
    return match[1];
  }
  return url;
};

// ✅ Step 4: Single clean logger (fixed — no duplication)
const logger = (req, res, next) => {

  // FIX 1: ISO timestamp on every log
  const timestamp = new Date().toISOString();
  const start = Date.now();
  const simplifiedUrl = getBaseRoute(req.originalUrl);

  // Color coding for HTTP methods
  const methodColor = {
    'GET':    '\x1b[34m',
    'POST':   '\x1b[32m',
    'PUT':    '\x1b[33m',
    'DELETE': '\x1b[31m',
    'PATCH':  '\x1b[35m',
  }[req.method] || '\x1b[0m';

  // Color coding for status codes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const statusColor = status >= 500 ? '\x1b[31m' :
                        status >= 400 ? '\x1b[33m' :
                        status >= 300 ? '\x1b[36m' :
                        status >= 200 ? '\x1b[32m' : '\x1b[0m';

    // FIX 1: Timestamp added to response log
    console.log(
      `[${timestamp}] ` +
      `${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
      `${statusColor}${status}\x1b[0m ` +
      `${simplifiedUrl} ` +
      `(${duration}ms)`
    );
  });

  // FIX 2 & 3: Body logging with size guard + redaction
  if (req.method !== 'GET') {
    const bodyStr = JSON.stringify(req.body);
    const bodySize = bodyStr ? bodyStr.length : 0;

    if (bodySize >= 1000) {
      // FIX 2: Large body → log size only
      console.log(
        `[${timestamp}] ${req.method} ${simplifiedUrl}` +
        ` [body too large: ${bodySize} chars]`
      );
    } else {
      // FIX 3: Small body → redact sensitive fields
      console.log(
        `[${timestamp}] ${req.method} ${simplifiedUrl}`,
        redact(req.body)
      );
    }
  } else {
    console.log(`[${timestamp}] ${req.method} ${simplifiedUrl}`);
  }

  next(); // ✅ next() in correct place — inside logger, at the end
};

// ✅ Single export
module.exports = logger;