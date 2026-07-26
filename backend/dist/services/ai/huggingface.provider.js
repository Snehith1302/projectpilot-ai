"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuggingFaceProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const app_config_1 = require("../../config/app.config");
class HuggingFaceProvider {
    name = 'huggingface';
    defaultModels = ['Qwen/Qwen2.5-72B-Instruct', 'meta-llama/Llama-3.1-8B-Instruct'];
    async isAvailable() {
        // Available if API key is configured
        return !!app_config_1.AppConfig.providers.huggingface.apiKey;
    }
    async getHealth() {
        const isApiKeyConfigured = !!app_config_1.AppConfig.providers.huggingface.apiKey;
        return {
            available: isApiKeyConfigured,
            status: isApiKeyConfigured ? 'online' : 'offline',
            models: isApiKeyConfigured ? this.defaultModels : [],
            message: isApiKeyConfigured ? undefined : 'Hugging Face API key not configured in .env'
        };
    }
    async generate(prompt, model) {
        const apiKey = app_config_1.AppConfig.providers.huggingface.apiKey;
        if (!apiKey) {
            throw new Error('Hugging Face API key is missing');
        }
        const targetModel = model || this.defaultModels[0];
        const timeout = app_config_1.AppConfig.providers.huggingface.timeoutMs;
        try {
            const res = await axios_1.default.post(`https://api-inference.huggingface.co/models/${targetModel}`, {
                inputs: prompt,
                parameters: {
                    temperature: 0.2,
                    max_new_tokens: 2048,
                    return_full_text: false
                }
            }, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout
            });
            // Handle typical HuggingFace inference response arrays
            if (Array.isArray(res.data) && res.data[0]?.generated_text) {
                return res.data[0].generated_text;
            }
            if (res.data?.generated_text) {
                return res.data.generated_text;
            }
            throw new Error(`Unexpected HuggingFace API response format: ${JSON.stringify(res.data)}`);
        }
        catch (e) {
            console.error(`[HuggingFaceProvider] Generation failed for model ${targetModel}:`, e.message);
            throw e;
        }
    }
}
exports.HuggingFaceProvider = HuggingFaceProvider;
