"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroqProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const app_config_1 = require("../../config/app.config");
class GroqProvider {
    name = 'groq';
    defaultModels = ['llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
    async isAvailable() {
        return !!app_config_1.AppConfig.providers.groq.apiKey;
    }
    async getHealth() {
        const isApiKeyConfigured = !!app_config_1.AppConfig.providers.groq.apiKey;
        return {
            available: isApiKeyConfigured,
            status: isApiKeyConfigured ? 'online' : 'offline',
            models: isApiKeyConfigured ? this.defaultModels : [],
            message: isApiKeyConfigured ? undefined : 'Groq API key not configured in .env'
        };
    }
    async generate(prompt, model) {
        const apiKey = app_config_1.AppConfig.providers.groq.apiKey;
        if (!apiKey) {
            throw new Error('Groq API key is missing');
        }
        const targetModel = model || this.defaultModels[0];
        const timeout = app_config_1.AppConfig.providers.groq.timeoutMs;
        try {
            const res = await axios_1.default.post('https://api.groq.com/openai/v1/chat/completions', {
                model: targetModel,
                messages: [
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
                response_format: { type: 'json_object' }
            }, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout
            });
            if (res.status === 200 && res.data?.choices?.[0]?.message?.content) {
                return res.data.choices[0].message.content;
            }
            throw new Error(`Unexpected Groq API response format: ${JSON.stringify(res.data)}`);
        }
        catch (e) {
            console.error(`[GroqProvider] Generation failed for model ${targetModel}:`, e.message);
            throw e;
        }
    }
}
exports.GroqProvider = GroqProvider;
