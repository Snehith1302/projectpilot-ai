import { AIProvider } from './provider.interface';
import { OllamaProvider } from './ollama.provider';
import { LMStudioProvider } from './lmstudio.provider';
import { HuggingFaceProvider } from './huggingface.provider';
import { GroqProvider } from './groq.provider';
import { TemplateProvider } from './template.provider';
import { SystemHealthResponse, ProviderHealthDetail } from 'shared';

interface CacheEntry {
  health: ProviderHealthDetail;
  latencyMs: number;
  lastFetched: number;
}

export class ProviderManager {
  private providers: AIProvider[] = [
    new OllamaProvider(),
    new LMStudioProvider(),
    new HuggingFaceProvider(),
    new GroqProvider(),
    new TemplateProvider()
  ];

  private healthCache: Map<string, CacheEntry> = new Map();
  private cacheTtlMs = 30000; // 30 seconds cache TTL

  async getProviders(): Promise<AIProvider[]> {
    return this.providers;
  }

  async getProvider(name: string): Promise<AIProvider | undefined> {
    return this.providers.find(p => p.name === name);
  }

  // Returns the first available provider based on the priority order
  async getActiveProvider(overrideName?: string): Promise<AIProvider> {
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
    return this.providers.find(p => p.name === 'template')!;
  }

  private async isProviderAvailableWithCache(p: AIProvider): Promise<boolean> {
    const cached = this.healthCache.get(p.name);
    if (cached && (Date.now() - cached.lastFetched < this.cacheTtlMs)) {
      return cached.health.available;
    }
    return p.isAvailable();
  }

  /**
   * Helper that executes getHealth() with caching and records latency in ms.
   */
  private async getProviderHealthWithCache(p: AIProvider): Promise<{ health: ProviderHealthDetail; latencyMs: number }> {
    const cached = this.healthCache.get(p.name);
    if (cached && (Date.now() - cached.lastFetched < this.cacheTtlMs)) {
      return { health: cached.health, latencyMs: cached.latencyMs };
    }

    const start = Date.now();
    let health: ProviderHealthDetail;
    try {
      health = await p.getHealth();
    } catch (e: any) {
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

  async getSystemHealth(overrideProvider?: string, overrideModel?: string): Promise<SystemHealthResponse & { latencies: Record<string, number> }> {
    const healthDetails = await Promise.all(
      this.providers.map(async (p) => {
        const { health, latencyMs } = await this.getProviderHealthWithCache(p);
        return { name: p.name, health, latencyMs };
      })
    );

    const providersMap: any = {};
    const latenciesMap: Record<string, number> = {};

    healthDetails.forEach((hd) => {
      providersMap[hd.name] = hd.health;
      latenciesMap[hd.name] = hd.latencyMs;
    });

    const active = await this.getActiveProvider(overrideProvider);
    const activeHealth = providersMap[active.name];
    const selectedModel = overrideModel || (activeHealth.models[0] || 'default');

    return {
      providers: providersMap,
      activeProvider: active.name as any,
      selectedModel,
      timestamp: new Date().toISOString(),
      latencies: latenciesMap
    };
  }
}

export const providerManager = new ProviderManager();
