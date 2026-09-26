import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { OllamaProvider } from './ollama.provider';
import { TemplateProvider } from './template.provider';
import { ProjectGenerationResponseSchema } from 'shared';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('AI Provider Abstractions', () => {
  describe('OllamaProvider', () => {
    const provider = new OllamaProvider();

    it('should report offline availability when Ollama host is unreachable', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Connection refused'));

      const isAvailable = await provider.isAvailable();
      expect(isAvailable).toBe(false);
    });

    it('should return offline health object when endpoint fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Connection refused'));

      const health = await provider.getHealth();
      expect(health.available).toBe(false);
      expect(health.status).toBe('offline');
      expect(health.models).toEqual([]);
      expect(health.message).toContain('unreachable');
    });

    it('should return online health status when tags API succeeds', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        status: 200,
        data: {
          models: [{ name: 'qwen3:8b' }, { name: 'llama3:8b' }]
        }
      });

      const health = await provider.getHealth();
      expect(health.available).toBe(true);
      expect(health.status).toBe('online');
      expect(health.models).toEqual(['qwen3:8b', 'llama3:8b']);
    });
  });

  describe('TemplateProvider', () => {
    const provider = new TemplateProvider();

    it('should always be available and report online health', async () => {
      const isAvailable = await provider.isAvailable();
      expect(isAvailable).toBe(true);

      const health = await provider.getHealth();
      expect(health.available).toBe(true);
      expect(health.status).toBe('online');
      expect(health.models).toContain('local-templates-v1.0');
    });

    it('should deterministically rank projects and return valid JSON response schema', async () => {
      const prompt = `
Generate 5 software projects:
Domain: saas
Difficulty: intermediate
Career: full_stack
Skills: React, Node.js, TypeScript
Frameworks: Express, TailwindCSS
`;

      const rawResponse = await provider.generate(prompt);
      expect(typeof rawResponse).toBe('string');

      const parsed = JSON.parse(rawResponse);
      const validationResult = ProjectGenerationResponseSchema.safeParse(parsed);

      expect(validationResult.success).toBe(true);
      if (validationResult.success) {
        expect(validationResult.data.projects).toHaveLength(5);
        expect(validationResult.data.activeProvider).toBe('template');
      }
    });
  });
});
