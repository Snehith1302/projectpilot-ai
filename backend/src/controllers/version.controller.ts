import { Request, Response, NextFunction } from 'express';
import { AppConfig } from '../config/app.config';

export const getVersion = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Version information retrieved successfully',
      data: {
        version: AppConfig.version
      },
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
