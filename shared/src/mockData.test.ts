import { describe, it, expect } from 'vitest';
import { getMockHealth, getMockGenerationResponse } from './mockData.js';
import { ProjectGenerationResponseSchema } from './index.js';

describe('Shared Mock Data Generators', () => {
  describe('getMockHealth', () => {
    it('should return a valid SystemHealthResponse structure', () => {
      const health = getMockHealth();

      expect(health.activeProvider).toBe('ollama');
      expect(health.selectedModel).toBe('qwen3:8b');
      expect(health.providers.ollama.available).toBe(true);
      expect(health.providers.template.available).toBe(true);
      expect(new Date(health.timestamp).toString()).not.toBe('Invalid Date');
    });
  });

  describe('getMockGenerationResponse', () => {
    it('should return a valid ProjectGenerationResponse schema structure', () => {
      const input = {
        fullName: 'Test User',
        skills: ['React', 'Node.js', 'TypeScript'],
        frameworks: ['Express'],
        careerGoal: 'full_stack',
        domain: 'saas',
        difficulty: 'intermediate',
        duration: '2_4_weeks',
        teamConfig: 'solo'
      };

      const response = getMockGenerationResponse(input);

      const parseResult = ProjectGenerationResponseSchema.safeParse(response);
      expect(parseResult.success).toBe(true);

      expect(response.projects).toHaveLength(5);
      expect(response.activeProvider).toBe('template');
      expect(response.selectedModel).toBe('local-templates-v1.0');
    });

    it('should customize techStack when user input provides frameworks', () => {
      const input = {
        skills: ['Python', 'FastAPI'],
        frameworks: ['PostgreSQL']
      };

      const response = getMockGenerationResponse(input);

      expect(response.projects.length).toBe(5);
      const firstProject = response.projects[0];
      expect(firstProject.techStack).toContain('Python');
      expect(firstProject.techStack).toContain('FastAPI');
      expect(firstProject.techStack).toContain('PostgreSQL');
    });
  });
});
