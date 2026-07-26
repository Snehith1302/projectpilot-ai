"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const app_config_1 = require("../../config/app.config");
class OllamaProvider {
    name = 'ollama';
    getClientConfig() {
        return {
            host: app_config_1.AppConfig.providers.ollama.host,
            timeout: app_config_1.AppConfig.providers.ollama.timeoutMs
        };
    }
    async isAvailable() {
        try {
            const config = this.getClientConfig();
            const res = await axios_1.default.get(`${config.host}/api/tags`, { timeout: 3000 });
            return res.status === 200;
        }
        catch (e) {
            return false;
        }
    }
    async getHealth() {
        const config = this.getClientConfig();
        try {
            const res = await axios_1.default.get(`${config.host}/api/tags`, { timeout: 3000 });
            if (res.status === 200 && res.data && Array.isArray(res.data.models)) {
                const modelNames = res.data.models.map((m) => m.name);
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
        const targetModel = model || 'qwen3:8b'; // Default target model
        try {
            const res = await axios_1.default.post(`${config.host}/api/generate`, {
                model: targetModel,
                prompt,
                stream: false,
                format: 'json',
                options: {
                    temperature: 0.2
                }
            }, { timeout: config.timeout });
            if (res.status === 200 && res.data && res.data.response) {
                return res.data.response;
            }
            throw new Error(`Invalid response status from Ollama: ${res.status}`);
        }
        catch (e) {
            console.error(`[OllamaProvider] Generation failed on ${config.host}:`, e.message);
            throw e;
        }
    }
}
exports.OllamaProvider = OllamaProvider;
