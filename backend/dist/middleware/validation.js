"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error && (error instanceof zod_1.ZodError || error.name === 'ZodError')) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    data: {
                        details: error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message
                        }))
                    },
                    meta: {
                        requestId: req.requestId || 'unknown',
                        timestamp: new Date().toISOString()
                    }
                });
            }
            next(error);
        }
    };
};
exports.validateBody = validateBody;
