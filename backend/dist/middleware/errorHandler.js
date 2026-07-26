"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
const errorHandlerMiddleware = (err, req, res, next) => {
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
exports.errorHandlerMiddleware = errorHandlerMiddleware;
