import axios from 'axios';
import { AIProvider } from './provider.interface';
import { ProviderHealthDetail } from 'shared';
import { AppConfig } from '../../config/app.config';

export class LMStudioProvider implements AIProvider {
  name = 'lmstudio';

  private getClientConfig() {
    return {
      host: AppConfig.providers.lmstudio.host,
      timeout: AppConfig.providers.lmstudio.timeoutMs
    };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const config = this.getClientConfig();
      const res = await axios.get(`${config.host}/v1/models`, { timeout: 3000 });
      return res.status === 200;
    } catch (e) {
      return false;
    }
  }

  async getHealth(): Promise<ProviderHealthDetail> {
    const config = this.getClientConfig();
    try {
      const res = await axios.get(`${config.host}/v1/models`, { timeout: 3000 });
      if (res.status === 200 && res.data && Array.isArray(res.data.data)) {
        const modelNames = res.data.data.map((m: any) => m.id);
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
    
    // Auto-discover model if not explicitly specified
    let targetModel = model;
    if (!targetModel) {
      const health = await this.getHealth();
      targetModel = health.models[0] || 'default';
    }

    try {
      const res = await axios.post(`${config.host}/v1/chat/completions`, {
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
    } catch (e: any) {
      console.error(`[LMStudioProvider] Generation failed on ${config.host}:`, e.message);
      throw e;
    }
  }
}
