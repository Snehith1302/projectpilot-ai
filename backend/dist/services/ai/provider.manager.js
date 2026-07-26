"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerManager = exports.ProviderManager = void 0;
const ollama_provider_1 = require("./ollama.provider");
const lmstudio_provider_1 = require("./lmstudio.provider");
const huggingface_provider_1 = require("./huggingface.provider");
const groq_provider_1 = require("./groq.provider");
const template_provider_1 = require("./template.provider");
class ProviderManager {
    providers = [
        new ollama_provider_1.OllamaProvider(),
        new lmstudio_provider_1.LMStudioProvider(),
        new huggingface_provider_1.HuggingFaceProvider(),
        new groq_provider_1.GroqProvider(),
        new template_provider_1.TemplateProvider()
    ];
    healthCache = new Map();
    cacheTtlMs = 30000; // 30 seconds cache TTL
    async getProviders() {
        return this.providers;
    }
    async getProvider(name) {
        return this.providers.find(p => p.name === name);
    }
    // Returns the first available provider based on the priority order
    async getActiveProvider(overrideName) {
        if (overrideName) {
            const provider = await this.getProvider(overrideName);
            if (provider && await this.isProviderAvailableWithCache(provider)) {
                return provider;
            }
        }
        for (const provider of this.providers) {
            if (await this.isProviderAvailableWithCache(provider)) {
                return provider;
            }
        }
        // Default fallback is Template Provider
        return this.providers.find(p => p.name === 'template');
    }
    async isProviderAvailableWithCache(p) {
        const cached = this.healthCache.get(p.name);
        if (cached && (Date.now() - cached.lastFetched < this.cacheTtlMs)) {
            return cached.health.available;
        }
        return p.isAvailable();
    }
    /**
     * Helper that executes getHealth() with caching and records latency in ms.
     */
    async getProviderHealthWithCache(p) {
        const cached = this.healthCache.get(p.name);
        if (cached && (Date.now() - cached.lastFetched < this.cacheTtlMs)) {
            return { health: cached.health, latencyMs: cached.latencyMs };
        }
        const start = Date.now();
        let health;
        try {
            health = await p.getHealth();
        }
        catch (e) {
            health = {
                available: false,
                status: 'error',
                models: [],
                message: e.message
            };
        }
        const latencyMs = Date.now() - start;
        this.healthCache.set(p.name, {
            health,
            latencyMs,
            lastFetched: Date.now()
        });
        return { health, latencyMs };
    }
    async getSystemHealth(overrideProvider, overrideModel) {
        const healthDetails = await Promise.all(this.providers.map(async (p) => {
            const { health, latencyMs } = await this.getProviderHealthWithCache(p);
            return { name: p.name, health, latencyMs };
        }));
        const providersMap = {};
        const latenciesMap = {};
        healthDetails.forEach((hd) => {
            providersMap[hd.name] = hd.health;
            latenciesMap[hd.name] = hd.latencyMs;
        });
        const active = await this.getActiveProvider(overrideProvider);
        const activeHealth = providersMap[active.name];
        const selectedModel = overrideModel || (activeHealth.models[0] || 'default');
        return {
            providers: providersMap,
            activeProvider: active.name,
            selectedModel,
            timestamp: new Date().toISOString(),
            latencies: latenciesMap
        };
    }
}
exports.ProviderManager = ProviderManager;
exports.providerManager = new ProviderManager();
