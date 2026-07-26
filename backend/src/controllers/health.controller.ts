import { Request, Response, NextFunction } from 'express';
import { providerManager } from '../services/ai/provider.manager';
import { AppConfig } from '../config/app.config';

export const getHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const providerOverride = req.query.provider as string | undefined;
    const modelOverride = req.query.model as string | undefined;

    const systemHealth = await providerManager.getSystemHealth(providerOverride, modelOverride);

    const healthData = {
      ...systemHealth,
      uptimeSeconds: Math.floor(process.uptime()),
      version: AppConfig.version
    };

    res.status(200).json({
      success: true,
      message: 'System health status retrieved successfully',
      data: healthData,
      meta: {
        requestId: req.requestId || 'unknown',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
