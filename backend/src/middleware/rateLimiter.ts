import rateLimit from 'express-rate-limit';
import { AppConfig } from '../config/app.config';

/**
 * In-memory rate limiter for project generation endpoint.
 *
 * NOTE: An in-memory limiter is suitable for the current single-instance deployment,
 * but a distributed limiter (e.g. Redis store) will be required later if the backend
 * is horizontally scaled.
 */
export const generateRateLimiter = rateLimit({
  windowMs: AppConfig.rateLimit.generate.windowMs,
  limit: AppConfig.rateLimit.generate.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many project generation requests. Please try again later.',
      data: null,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  }
});
