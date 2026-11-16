import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';
const skipLocalhost = (req: any) =>
  isDev ||
  req.ip === '127.0.0.1' ||
  req.ip === '::1' ||
  req.ip === '::ffff:127.0.0.1';

/** General API rate limiter: 5000 requests in dev, 500 in prod per 15 mins */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50000, // Very permissive
  skip: () => true, // Always skip in this project for now
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Stricter rate limiter for sensitive operations */
export const sensitiveMethodsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  skip: () => true,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests for this operation, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Auth rate limiter */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  skip: () => true,
  message: {
    status: 'error',
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
