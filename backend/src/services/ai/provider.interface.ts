import { ProviderHealthDetail } from 'shared';

export interface AIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  getHealth(): Promise<ProviderHealthDetail>;
  generate(prompt: string, model?: string): Promise<string>;
}
