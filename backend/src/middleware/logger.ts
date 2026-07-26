import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId || 'unknown',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration
    };
    // Structured console logging
    console.log(JSON.stringify(logData));
  });
  next();
};
