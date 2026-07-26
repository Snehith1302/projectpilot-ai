import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error && (error instanceof ZodError || error.name === 'ZodError')) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: {
            details: error.errors.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          meta: {
            requestId: req.requestId || 'unknown',
            timestamp: new Date().toISOString()
          }
        });
      }
      next(error);
    }
  };
};
