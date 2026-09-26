import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import rateLimit from 'express-rate-limit';

describe('Rate Limiter Middleware', () => {
  it('should allow requests under the limit and return 429 when limit is exceeded', async () => {
    const testApp = express();
    testApp.use(express.json());

    // Create isolated rate limiter with max: 2 for testing
    const testLimiter = rateLimit({
      windowMs: 60000,
      limit: 2,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: 'Too many project generation requests. Please try again later.',
          data: null,
          meta: {
            requestId: 'test-id',
            timestamp: new Date().toISOString()
          }
        });
      }
    });

    testApp.post('/api/generate', testLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Generated' });
    });

    // Request 1: Allowed
    const res1 = await request(testApp).post('/api/generate');
    expect(res1.status).toBe(200);
    expect(res1.body.success).toBe(true);

    // Request 2: Allowed
    const res2 = await request(testApp).post('/api/generate');
    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);

    // Request 3: Exceeded limit -> 429
    const res3 = await request(testApp).post('/api/generate');
    expect(res3.status).toBe(429);
    expect(res3.body.success).toBe(false);
    expect(res3.body.message).toContain('Too many project generation requests');
    expect(res3.body.meta).toHaveProperty('requestId');
    expect(res3.body.meta).toHaveProperty('timestamp');
  });
});
