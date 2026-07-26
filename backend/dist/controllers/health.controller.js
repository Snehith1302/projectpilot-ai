"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const provider_manager_1 = require("../services/ai/provider.manager");
const app_config_1 = require("../config/app.config");
const getHealth = async (req, res, next) => {
    try {
        const providerOverride = req.query.provider;
        const modelOverride = req.query.model;
        const systemHealth = await provider_manager_1.providerManager.getSystemHealth(providerOverride, modelOverride);
        const healthData = {
            ...systemHealth,
            uptimeSeconds: Math.floor(process.uptime()),
            version: app_config_1.AppConfig.version
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
    }
    catch (error) {
        next(error);
    }
};
exports.getHealth = getHealth;
