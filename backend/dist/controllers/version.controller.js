"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = void 0;
const app_config_1 = require("../config/app.config");
const getVersion = (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Version information retrieved successfully',
            data: {
                version: app_config_1.AppConfig.version
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
exports.getVersion = getVersion;
