// server/middleware/logger.js

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

// 🔒 Redact sensitive fields
const sanitizeBody = (body) => {
  const sensitiveKeys = [
    "token",
    "password",
    "secret",
    "apikey",
    "api_key",
    "authorization",
    "credential"
  ];

  let newBody = { ...body };

  for (let key in newBody) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      newBody[key] = "***";
    }
  }

  return newBody;
};

const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;

    const timestamp = new Date().toISOString(); // ✅ ADD THIS

    const simplifiedUrl = getBaseRoute(req.originalUrl);

    const methodColor = {
      'GET': '\x1b[34m',
      'POST': '\x1b[32m',
      'PUT': '\x1b[33m',
      'DELETE': '\x1b[31m',
      'PATCH': '\x1b[35m',
    }[req.method] || '\x1b[0m';

    const statusColor = status >= 500 ? '\x1b[31m' :
      status >= 400 ? '\x1b[33m' :
        status >= 300 ? '\x1b[36m' :
          status >= 200 ? '\x1b[32m' :
            '\x1b[0m';

    // ✅ ADD timestamp in log
    console.log(
      `${timestamp} ` +  // 👈 NEW
      `${methodColor}${req.method.padEnd(6)}\x1b[0m ` +
      `${statusColor}${status}\x1b[0m ` +
      `${simplifiedUrl} (${duration}ms)`
    );

    // ✅ SAFE BODY LOGGING
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
      const bodyString = JSON.stringify(req.body);

      if (bodyString.length > 1000) {
        console.log(`${timestamp} Body too large (${bodyString.length} chars)`);
      } else {
        const safeBody = sanitizeBody(req.body);
        console.log(`${timestamp} Body: ${JSON.stringify(safeBody)}`);
      }
    }
  });

  next();
};

module.exports = logger;