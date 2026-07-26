import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  const structuredErrorLog = {
    timestamp: new Date().toISOString(),
    requestId: req.requestId || 'unknown',
    error: message,
    stack: err.stack
  };
  // Structured error logging
  console.error(JSON.stringify(structuredErrorLog));

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    meta: {
      requestId: req.requestId || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
};
