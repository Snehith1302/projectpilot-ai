"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = void 0;
const requestIdMiddleware = (req, res, next) => {
    const reqId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    req.requestId = reqId;
    res.setHeader('x-request-id', reqId);
    next();
};
exports.requestIdMiddleware = requestIdMiddleware;
