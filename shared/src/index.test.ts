import { describe, it, expect } from 'vitest';
import {
  ProjectGenerationInputSchema,
  ProjectGenerationResponseSchema,
  ProjectBlueprintSchema,
  CareerGoalSchema,
  TechnicalDomainSchema,
  DifficultyLevelSchema,
  EstimatedDurationSchema,
  TeamConfigSchema
} from './index.js';

describe('Shared Zod Schemas Validation', () => {
  describe('ProjectGenerationInputSchema', () => {
    it('should validate a valid input with all required enum fields', () => {
      const validPayload = {
        fullName: 'Jane Doe',
        skills: ['React', 'Node.js', 'TypeScript'],
        frameworks: ['Express', 'Vite'],
        careerGoal: 'full_stack',
        domain: 'saas',
        difficulty: 'intermediate',
        duration: '2_4_weeks',
        teamConfig: 'solo'
      };

      const result = ProjectGenerationInputSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe('Jane Doe');
        expect(result.data.careerGoal).toBe('full_stack');
      }
    });

    it('should validate input with optional provider and model overrides', () => {
      const validPayload = {
        fullName: 'John Smith',
        skills: ['Python', 'FastAPI'],
        frameworks: ['PyTorch'],
        careerGoal: 'aiml_engineer',
        domain: 'ai_rag',
        difficulty: 'advanced',
        duration: '1_2_months',
        teamConfig: 'team',
        providerOverride: 'groq',
        modelOverride: 'llama-3.1-70b-versatile'
      };

      const result = ProjectGenerationInputSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.providerOverride).toBe('groq');
        expect(result.data.modelOverride).toBe('llama-3.1-70b-versatile');
      }
    });

    it('should reject invalid enum values', () => {
      const invalidPayload = {
        fullName: 'Jane Doe',
        skills: ['React'],
        frameworks: ['Express'],
        careerGoal: 'superhero', // invalid enum
        domain: 'saas',
        difficulty: 'intermediate',
        duration: '2_4_weeks',
        teamConfig: 'solo'
      };

      const result = ProjectGenerationInputSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject empty fullName or empty skills array', () => {
      const invalidPayload = {
        fullName: '', // empty name
        skills: [], // empty skills array
        frameworks: ['Express'],
        careerGoal: 'full_stack',
        domain: 'saas',
        difficulty: 'intermediate',
        duration: '2_4_weeks',
        teamConfig: 'solo'
      };

      const result = ProjectGenerationInputSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('ProjectBlueprintSchema', () => {
    const createValidBlueprint = () => ({
      id: 'proj_test',
      title: 'Test Project',
      tagline: 'A sample project for schema validation',
      resumeScore: 90,
      placementScore: 88,
      innovationScore: 92,
      difficulty: 'Advanced',
      duration: '3 Weeks',
      domain: 'Full Stack',
      techStack: ['React', 'Express'],
      problemStatement: {
        overview: 'Sample problem statement',
        targetAudience: 'Developers',
        userPersonas: ['Persona A']
      },
      systemArchitecture: {
        narrative: 'Sample architecture',
        dataFlow: 'Client -> Server'
      },
      features: {
        core: ['Feature 1'],
        advanced: ['Feature 2']
      },
      databaseApiSpecification: {
        tables: [{ name: 'users', columns: ['id'], description: 'Users table' }],
        endpoints: [{ method: 'GET', path: '/api/users', responseBody: '{}', description: 'Get users' }]
      },
      directoryStructure: 'src/',
      roadmap: [{ phase: 'Phase 1', title: 'Setup', tasks: ['Task 1'] }],
      deploymentCiCd: {
        host: 'Vercel',
        containerization: 'Docker',
        steps: ['npm run build']
      },
      placementArtifacts: {
        resumeBullets: ['Built a test project'],
        interviewQuestions: [{ question: 'Why?', answerHint: 'Because.' }]
      }
    });

    it('should pass validation for a valid blueprint', () => {
      const result = ProjectBlueprintSchema.safeParse(createValidBlueprint());
      expect(result.success).toBe(true);
    });

    it('should reject resumeScore outside range 0-100', () => {
      const invalidBlueprint = {
        ...createValidBlueprint(),
        resumeScore: 150
      };

      const result = ProjectBlueprintSchema.safeParse(invalidBlueprint);
      expect(result.success).toBe(false);
    });

    it('should reject missing required nested fields', () => {
      const invalidBlueprint = {
        ...createValidBlueprint(),
        deploymentCiCd: {
          host: 'Vercel'
          // missing containerization and steps
        }
      };

      const result = ProjectBlueprintSchema.safeParse(invalidBlueprint);
      expect(result.success).toBe(false);
    });
  });

  describe('ProjectGenerationResponseSchema', () => {
    it('should reject response with fewer than 5 projects', () => {
      const invalidResponse = {
        projects: [], // expects exactly 5
        activeProvider: 'template',
        selectedModel: 'local-templates-v1.0'
      };

      const result = ProjectGenerationResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('Enum Schemas', () => {
    it('should validate CareerGoal values', () => {
      expect(CareerGoalSchema.safeParse('sde_1').success).toBe(true);
      expect(CareerGoalSchema.safeParse('invalid').success).toBe(false);
    });

    it('should validate TechnicalDomain values', () => {
      expect(TechnicalDomainSchema.safeParse('ai_rag').success).toBe(true);
      expect(TechnicalDomainSchema.safeParse('invalid').success).toBe(false);
    });

    it('should validate DifficultyLevel values', () => {
      expect(DifficultyLevelSchema.safeParse('production_enterprise').success).toBe(true);
      expect(DifficultyLevelSchema.safeParse('invalid').success).toBe(false);
    });

    it('should validate EstimatedDuration values', () => {
      expect(EstimatedDurationSchema.safeParse('2_4_weeks').success).toBe(true);
      expect(EstimatedDurationSchema.safeParse('invalid').success).toBe(false);
    });

    it('should validate TeamConfig values', () => {
      expect(TeamConfigSchema.safeParse('solo').success).toBe(true);
      expect(TeamConfigSchema.safeParse('team').success).toBe(true);
      expect(TeamConfigSchema.safeParse('group').success).toBe(false);
    });
  });
});
