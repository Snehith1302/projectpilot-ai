import axios from 'axios';
import { AIProvider } from './provider.interface';
import { ProviderHealthDetail } from 'shared';
import { AppConfig } from '../../config/app.config';
import { getMockGenerationResponse } from '../mock.service';

export class OllamaProvider implements AIProvider {
  name = 'ollama';

  private getClientConfig() {
    return {
      host: AppConfig.providers.ollama.host,
      timeout: AppConfig.providers.ollama.timeoutMs
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const config = this.getClientConfig();
      const res = await axios.get(`${config.host}/api/tags`, { timeout: 3000 });
      return res.status === 200;
    } catch (e) {
      return false;
    }
  }

  async getHealth(): Promise<ProviderHealthDetail> {
    const config = this.getClientConfig();
    try {
      const res = await axios.get(`${config.host}/api/tags`, { timeout: 3000 });
      if (res.status === 200 && res.data && Array.isArray(res.data.models)) {
        const modelNames = res.data.models.map((m: any) => m.name);
        return {
          available: true,
          status: 'online',
          models: modelNames
        };
      }
    } catch (e: any) {
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

  async generate(prompt: string, model?: string): Promise<string> {
    const config = this.getClientConfig();
    const targetModel = model || 'qwen3:8b'; // Default target model

    try {
      const res = await axios.post(`${config.host}/api/generate`, {
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
    } catch (e: any) {
      console.error(`[OllamaProvider] Generation failed on ${config.host}:`, e.message);
      throw e;
    }
  }
}
