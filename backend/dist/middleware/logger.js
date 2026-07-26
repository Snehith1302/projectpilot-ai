"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const loggerMiddleware = (req, res, next) => {
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
exports.loggerMiddleware = loggerMiddleware;
