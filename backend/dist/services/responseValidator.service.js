"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseValidatorService = exports.ResponseValidatorService = void 0;
const shared_1 = require("shared");
const zod_1 = require("zod");
class ResponseValidatorService {
    /**
     * Sanitizes markdown wrappers (e.g. ```json ... ```) and parses the response.
     */
    cleanAndParseJson(raw) {
        let clean = raw.trim();
        // Strip markdown code block wrapper if present
        if (clean.startsWith('```')) {
            clean = clean.replace(/^```[a-zA-Z]*\n/, '');
            clean = clean.replace(/\n```$/, '');
        }
        clean = clean.trim();
        return JSON.parse(clean);
    }
    /**
     * Validates a string response against the ProjectGenerationResponse schema.
     */
    validateResponse(rawResponse) {
        try {
            const parsed = this.cleanAndParseJson(rawResponse);
            const validated = shared_1.ProjectGenerationResponseSchema.parse(parsed);
            return validated;
        }
        catch (e) {
            if (e instanceof zod_1.ZodError) {
                console.error('[ResponseValidator] Zod schema validation failed:', e.errors);
                throw new Error(`JSON does not match the blueprint schema: ${e.errors.map(x => x.path.join('.') + ': ' + x.message).join(', ')}`);
            }
            if (e instanceof SyntaxError) {
                console.error('[ResponseValidator] JSON parsing syntax error:', e.message);
                throw new Error(`Raw response was not valid JSON: ${e.message}`);
            }
            throw e;
        }
    }
    /**
     * A stub retry method that would repeat prompt requests in a real system.
     */
    async executeWithRetry(executionFn, retriesRemaining = 2) {
        try {
            const raw = await executionFn();
            return this.validateResponse(raw);
        }
        catch (error) {
            if (retriesRemaining > 0) {
                console.warn(`[ResponseValidator] Validation failed. Retrying... (${retriesRemaining} retries remaining). Error:`, error.message);
                return this.executeWithRetry(executionFn, retriesRemaining - 1);
            }
            throw error;
        }
    }
}
exports.ResponseValidatorService = ResponseValidatorService;
exports.responseValidatorService = new ResponseValidatorService();
