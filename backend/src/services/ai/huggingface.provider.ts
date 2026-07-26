import axios from 'axios';
import { AIProvider } from './provider.interface';
import { ProviderHealthDetail } from 'shared';
import { AppConfig } from '../../config/app.config';

export class HuggingFaceProvider implements AIProvider {
  name = 'huggingface';
  private defaultModels = ['Qwen/Qwen2.5-72B-Instruct', 'meta-llama/Llama-3.1-8B-Instruct'];

  async isAvailable(): Promise<boolean> {
    // Available if API key is configured
    return !!AppConfig.providers.huggingface.apiKey;
  }

  async getHealth(): Promise<ProviderHealthDetail> {
    const isApiKeyConfigured = !!AppConfig.providers.huggingface.apiKey;
    return {
      available: isApiKeyConfigured,
      status: isApiKeyConfigured ? 'online' : 'offline',
      models: isApiKeyConfigured ? this.defaultModels : [],
      message: isApiKeyConfigured ? undefined : 'Hugging Face API key not configured in .env'
    };
  }

  async generate(prompt: string, model?: string): Promise<string> {
    const apiKey = AppConfig.providers.huggingface.apiKey;
    if (!apiKey) {
      throw new Error('Hugging Face API key is missing');
    }

    const targetModel = model || this.defaultModels[0];
    const timeout = AppConfig.providers.huggingface.timeoutMs;

    try {
      const res = await axios.post(
        `https://api-inference.huggingface.co/models/${targetModel}`,
        {
          inputs: prompt,
          parameters: {
            temperature: 0.2,
            max_new_tokens: 2048,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout
        }
      );

      // Handle typical HuggingFace inference response arrays
      if (Array.isArray(res.data) && res.data[0]?.generated_text) {
        return res.data[0].generated_text;
      }
      if (res.data?.generated_text) {
        return res.data.generated_text;
      }
      
      throw new Error(`Unexpected HuggingFace API response format: ${JSON.stringify(res.data)}`);
    } catch (e: any) {
      console.error(`[HuggingFaceProvider] Generation failed for model ${targetModel}:`, e.message);
      throw e;
    }
  }
}
