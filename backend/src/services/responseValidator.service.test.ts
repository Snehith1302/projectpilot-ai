import { describe, it, expect, vi } from 'vitest';
import { ResponseValidatorService } from './responseValidator.service';
import { getMockGenerationResponse } from './mock.service';

describe('ResponseValidatorService', () => {
  const validator = new ResponseValidatorService();

  const validInput = {
    fullName: 'Test User',
    skills: ['React', 'Node.js'],
    frameworks: ['Express'],
    careerGoal: 'full_stack',
    domain: 'saas',
    difficulty: 'intermediate',
    duration: '2_4_weeks',
    teamConfig: 'solo'
  };

  const validMockResponse = getMockGenerationResponse(validInput);

  describe('validateResponse', () => {
    it('should validate a raw JSON string matching ProjectGenerationResponseSchema', () => {
      const rawJson = JSON.stringify(validMockResponse);
      const result = validator.validateResponse(rawJson);

      expect(result.projects).toHaveLength(5);
      expect(result.activeProvider).toBe('template');
      expect(result.selectedModel).toBe('local-templates-v1.0');
    });

    it('should sanitize markdown code block wrappers (```json ... ```) before parsing', () => {
      const markdownJson = `\`\`\`json\n${JSON.stringify(validMockResponse)}\n\`\`\``;
      const result = validator.validateResponse(markdownJson);

      expect(result.projects).toHaveLength(5);
    });

    it('should throw Error for invalid non-JSON raw strings', () => {
      expect(() => validator.validateResponse('Not JSON content')).toThrow(/not valid JSON/);
    });

    it('should throw Error for valid JSON that fails Zod schema validation', () => {
      const invalidSchemaJson = JSON.stringify({
        projects: [], // fails schema because exact length of 5 is required
        activeProvider: 'template'
      });

      expect(() => validator.validateResponse(invalidSchemaJson)).toThrow(/JSON does not match the blueprint schema/);
    });
  });

  describe('executeWithRetry', () => {
    it('should return validated response on first successful attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue(JSON.stringify(validMockResponse));
      const result = await validator.executeWithRetry(mockFn, 2);

      expect(result.projects).toHaveLength(5);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry when validation fails and succeed on subsequent attempt', async () => {
      const mockFn = vi.fn()
        .mockResolvedValueOnce('invalid json') // attempt 1 fails
        .mockResolvedValueOnce(JSON.stringify(validMockResponse)); // attempt 2 succeeds

      const result = await validator.executeWithRetry(mockFn, 2);

      expect(result.projects).toHaveLength(5);
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should exhaust retries and throw error when all attempts fail', async () => {
      const mockFn = vi.fn().mockResolvedValue('invalid json');

      await expect(validator.executeWithRetry(mockFn, 2)).rejects.toThrow(/not valid JSON/);
      // 1 initial attempt + 2 retries = 3 calls total
      expect(mockFn).toHaveBeenCalledTimes(3);
    });
  });
});
