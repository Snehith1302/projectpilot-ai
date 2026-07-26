"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app_config_1 = require("./config/app.config");
const requestId_1 = require("./middleware/requestId");
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const api_routes_1 = require("./routes/api.routes");
const app = (0, express_1.default)();
// 1. Security & Global Request Context Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(requestId_1.requestIdMiddleware); // Assign unique ID to every request first
app.use(logger_1.loggerMiddleware); // Log requests structured
// 2. Register API Routes Gateway
app.use('/api', api_routes_1.apiRouter);
// 3. Catch-all Route Handler for Unmapped Paths
app.use('*', (req, res, next) => {
    next(new errorHandler_1.AppError(404, `Route ${req.originalUrl} not found`));
});
// 4. Centralized Error Handler Middleware
app.use(errorHandler_1.errorHandlerMiddleware);
// 5. Start Listening
app.listen(app_config_1.AppConfig.server.port, () => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        message: `[Server] ProjectPilot AI Backend listening on port ${app_config_1.AppConfig.server.port}`,
        port: app_config_1.AppConfig.server.port,
        version: app_config_1.AppConfig.version
    }));
});
exports.default = app;
