import { Request, Response, NextFunction } from 'express';
import { providerManager } from '../services/ai/provider.manager';

export const getProviders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await providerManager.getProviders();
    const providersData = await Promise.all(
      list.map(async (p) => {
        const health = await p.getHealth();
        return {
          name: p.name,
          available: health.available,
          status: health.status,
          models: health.models
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Providers retrieved successfully',
      data: {
        providers: providersData
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

export const getModels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const providerName = req.query.provider as string || 'ollama';
    const provider = await providerManager.getProvider(providerName);

    if (!provider) {
      res.status(404).json({
        success: false,
        message: `Provider '${providerName}' not found`,
        data: null,
        meta: {
          requestId: req.requestId || 'unknown',
          timestamp: new Date().toISOString()
        }
      });
      return;
    }

    const health = await provider.getHealth();

    res.status(200).json({
      success: true,
      message: `Models retrieved for provider '${providerName}'`,
      data: {
        provider: providerName,
        models: health.models
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
