"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModels = exports.getProviders = void 0;
const provider_manager_1 = require("../services/ai/provider.manager");
const getProviders = async (req, res, next) => {
    try {
        const list = await provider_manager_1.providerManager.getProviders();
        const providersData = await Promise.all(list.map(async (p) => {
            const health = await p.getHealth();
            return {
                name: p.name,
                available: health.available,
                status: health.status,
                models: health.models
            };
        }));
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
    }
    catch (error) {
        next(error);
    }
};
exports.getProviders = getProviders;
const getModels = async (req, res, next) => {
    try {
        const providerName = req.query.provider || 'ollama';
        const provider = await provider_manager_1.providerManager.getProvider(providerName);
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
    }
    catch (error) {
        next(error);
    }
};
exports.getModels = getModels;
