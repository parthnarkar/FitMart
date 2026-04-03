const SENSITIVE_FIELDS = ['token', 'password'];

function redact(body) {
  const sanitized = { ...body };
  for (const field of SENSITIVE_FIELDS) {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  }
  return sanitized;
}

const timestamp = new Date().toISOString();
const bodyStr = JSON.stringify(req.body);

if (bodyStr.length < 1000) {
  console.log(`[${timestamp}] ${req.method} ${req.url}`, redact(req.body));
} else {
  console.log(`[${timestamp}] ${req.method} ${req.url} [body too large to log]`);
}