import { ProjectGenerationResponse, ProjectGenerationResponseSchema } from 'shared';
import { ZodError } from 'zod';

export class ResponseValidatorService {
  /**
   * Sanitizes markdown wrappers (e.g. ```json ... ```) and parses the response.
   */
  private cleanAndParseJson(raw: string): any {
    let clean = raw.trim();
    
    // Strip markdown code block wrapper if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```[a-zA-Z]*\n/, '');
      clean = clean.replace(/\n```$/, '');
    }
    
    clean = clean.trim();
    return JSON.parse(clean);
  }

  /**
   * Validates a string response against the ProjectGenerationResponse schema.
   */
  validateResponse(rawResponse: string): ProjectGenerationResponse {
    try {
      const parsed = this.cleanAndParseJson(rawResponse);
      const validated = ProjectGenerationResponseSchema.parse(parsed);
      return validated;
    } catch (e: any) {
      if (e instanceof ZodError) {
        console.error('[ResponseValidator] Zod schema validation failed:', e.errors);
        throw new Error(`JSON does not match the blueprint schema: ${e.errors.map(x => x.path.join('.') + ': ' + x.message).join(', ')}`);
      }
      if (e instanceof SyntaxError) {
        console.error('[ResponseValidator] JSON parsing syntax error:', e.message);
        throw new Error(`Raw response was not valid JSON: ${e.message}`);
      }
      throw e;
    }
  }

  /**
   * A stub retry method that would repeat prompt requests in a real system.
   */
  async executeWithRetry(
    executionFn: () => Promise<string>,
    retriesRemaining = 2
  ): Promise<ProjectGenerationResponse> {
    try {
      const raw = await executionFn();
      return this.validateResponse(raw);
    } catch (error: any) {
      if (retriesRemaining > 0) {
        console.warn(`[ResponseValidator] Validation failed. Retrying... (${retriesRemaining} retries remaining). Error:`, error.message);
        return this.executeWithRetry(executionFn, retriesRemaining - 1);
      }
      throw error;
    }
  }
}

export const responseValidatorService = new ResponseValidatorService();
