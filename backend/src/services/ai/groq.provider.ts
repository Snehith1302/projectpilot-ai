import axios from 'axios';
import { AIProvider } from './provider.interface';
import { ProviderHealthDetail } from 'shared';
import { AppConfig } from '../../config/app.config';

export class GroqProvider implements AIProvider {
  name = 'groq';
  private defaultModels = ['llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

  async isAvailable(): Promise<boolean> {
    return !!AppConfig.providers.groq.apiKey;
  }

  async getHealth(): Promise<ProviderHealthDetail> {
    const isApiKeyConfigured = !!AppConfig.providers.groq.apiKey;
    return {
      available: isApiKeyConfigured,
      status: isApiKeyConfigured ? 'online' : 'offline',
      models: isApiKeyConfigured ? this.defaultModels : [],
      message: isApiKeyConfigured ? undefined : 'Groq API key not configured in .env'
    };
  }

  async generate(prompt: string, model?: string): Promise<string> {
    const apiKey = AppConfig.providers.groq.apiKey;
    if (!apiKey) {
      throw new Error('Groq API key is missing');
    }

    const targetModel = model || this.defaultModels[0];
    const timeout = AppConfig.providers.groq.timeoutMs;

    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: targetModel,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout
        }
      );

      if (res.status === 200 && res.data?.choices?.[0]?.message?.content) {
        return res.data.choices[0].message.content;
      }
      throw new Error(`Unexpected Groq API response format: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      console.error(`[GroqProvider] Generation failed for model ${targetModel}:`, e.message);
      throw e;
    }
  }
}
