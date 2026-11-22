/**
 * Lightweight In-Memory Rate Limiter
 * Protects AI generation endpoints against abusive request bursts
 */

const requestCounts = new Map();

function rateLimiter({ windowMs = 60 * 1000, max = 30 } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown-client';
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip).filter(time => now - time < windowMs);
    timestamps.push(now);
    requestCounts.set(ip, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment before sending another query.'
      });
    }

    next();
  };
}

module.exports = rateLimiter;
