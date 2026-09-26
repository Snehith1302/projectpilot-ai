import { describe, it, expect } from 'vitest';
import { PromptBuilderService } from './promptBuilder.service';
import { ProjectGenerationInput } from 'shared';

describe('PromptBuilderService', () => {
  const promptBuilder = new PromptBuilderService();

  describe('buildSystemPrompt', () => {
    it('should return system prompt string containing key role and schema instructions', () => {
      const systemPrompt = promptBuilder.buildSystemPrompt();
      expect(typeof systemPrompt).toBe('string');
      expect(systemPrompt.length).toBeGreaterThan(0);
      expect(systemPrompt.toLowerCase()).toMatch(/projectpilot|blueprint|json|software/);
    });
  });

  describe('buildUserPrompt', () => {
    it('should replace template placeholders with user input values', () => {
      const input: ProjectGenerationInput = {
        fullName: 'Alex Developer',
        skills: ['React', 'TypeScript', 'Node.js'],
        frameworks: ['Express', 'TailwindCSS'],
        careerGoal: 'full_stack',
        domain: 'saas',
        difficulty: 'intermediate',
        duration: '2_4_weeks',
        teamConfig: 'solo'
      };

      const userPrompt = promptBuilder.buildUserPrompt(input);

      expect(userPrompt).toContain('Alex Developer');
      expect(userPrompt).toContain('React, TypeScript, Node.js');
      expect(userPrompt).toContain('Express, TailwindCSS');
      expect(userPrompt).toContain('saas');
      expect(userPrompt).toContain('intermediate');
      expect(userPrompt).toContain('2_4_weeks');
      expect(userPrompt).toContain('solo');
    });

    it('should correctly format multiple skills and frameworks as comma-separated lists', () => {
      const input: ProjectGenerationInput = {
        fullName: 'Sam Architect',
        skills: ['Go', 'Rust'],
        frameworks: ['Gin', 'Actix'],
        careerGoal: 'sde_1',
        domain: 'distributed_systems',
        difficulty: 'advanced',
        duration: '1_2_months',
        teamConfig: 'team'
      };

      const userPrompt = promptBuilder.buildUserPrompt(input);

      expect(userPrompt).toContain('Go, Rust');
      expect(userPrompt).toContain('Gin, Actix');
      expect(userPrompt).toContain('distributed_systems');
    });
  });
});
