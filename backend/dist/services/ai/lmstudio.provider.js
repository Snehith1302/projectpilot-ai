"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LMStudioProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const app_config_1 = require("../../config/app.config");
class LMStudioProvider {
    name = 'lmstudio';
    getClientConfig() {
        return {
            host: app_config_1.AppConfig.providers.lmstudio.host,
            timeout: app_config_1.AppConfig.providers.lmstudio.timeoutMs
        };
    }
    async isAvailable() {
        try {
            const config = this.getClientConfig();
            const res = await axios_1.default.get(`${config.host}/v1/models`, { timeout: 3000 });
            return res.status === 200;
        }
        catch (e) {
            return false;
        }
    }
    async getHealth() {
        const config = this.getClientConfig();
        try {
            const res = await axios_1.default.get(`${config.host}/v1/models`, { timeout: 3000 });
            if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
                const modelNames = res.data.data.map((m) => m.id);
                return {
                    available: true,
                    status: 'online',
                    models: modelNames
                };
            }
        }
        catch (e) {
            return {
                available: false,
                status: 'offline',
                models: [],
                message: `Endpoint ${config.host} unreachable: ${e.message}`
            };
        }
        return {
            available: false,
            status: 'offline',
            models: []
        };
    }
    async generate(prompt, model) {
        const config = this.getClientConfig();
        // Auto-discover model if not explicitly specified
        let targetModel = model;
        if (!targetModel) {
            const health = await this.getHealth();
            targetModel = health.models[0] || 'default';
        }
        try {
            const res = await axios_1.default.post(`${config.host}/v1/chat/completions`, {
                model: targetModel,
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                response_format: { type: 'json_object' }
            }, { timeout: config.timeout });
            if (res.status === 200 && res.data?.choices?.[0]?.message?.content) {
                return res.data.choices[0].message.content;
            }
            throw new Error(`Invalid response format from LM Studio: ${JSON.stringify(res.data)}`);
        }
        catch (e) {
            console.error(`[LMStudioProvider] Generation failed on ${config.host}:`, e.message);
            throw e;
        }
    }
}
exports.LMStudioProvider = LMStudioProvider;
