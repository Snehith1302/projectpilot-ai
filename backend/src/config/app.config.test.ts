import { describe, it, expect } from 'vitest';
import { validateEnv } from './app.config';

describe('Environment Variable Validation (validateEnv)', () => {
  it('should validate and parse default development environment', () => {
    const env = validateEnv({
      NODE_ENV: 'development'
    });

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(5000);
    expect(env.allowedOrigins).toEqual(['http://localhost:3000', 'http://localhost:5173']);
    expect(env.GENERATE_RATE_LIMIT_WINDOW_MS).toBe(900000);
    expect(env.GENERATE_RATE_LIMIT_MAX).toBe(10);
    expect(env.OLLAMA_HOST).toBe('http://localhost:11434');
    expect(env.HUGGINGFACE_API_KEY).toBe('');
    expect(env.GROQ_API_KEY).toBe('');
  });

  it('should accept valid custom PORT and ALLOWED_ORIGINS', () => {
    const env = validateEnv({
      NODE_ENV: 'development',
      PORT: '8080',
      ALLOWED_ORIGINS: 'http://localhost:8080, https://myapp.com'
    });

    expect(env.PORT).toBe(8080);
    expect(env.allowedOrigins).toEqual(['http://localhost:8080', 'https://myapp.com']);
  });

  it('should throw error for invalid PORT (non-numeric, out of range)', () => {
    expect(() => validateEnv({ PORT: 'not-a-number' })).toThrow(/PORT/);
    expect(() => validateEnv({ PORT: '-1' })).toThrow(/PORT/);
    expect(() => validateEnv({ PORT: '99999' })).toThrow(/PORT/);
  });

  it('should throw error for invalid GENERATE_RATE_LIMIT_MAX', () => {
    expect(() => validateEnv({ GENERATE_RATE_LIMIT_MAX: '0' })).toThrow(/GENERATE_RATE_LIMIT_MAX/);
    expect(() => validateEnv({ GENERATE_RATE_LIMIT_MAX: '-5' })).toThrow(/GENERATE_RATE_LIMIT_MAX/);
    expect(() => validateEnv({ GENERATE_RATE_LIMIT_MAX: 'abc' })).toThrow(/GENERATE_RATE_LIMIT_MAX/);
  });

  it('should throw error in production mode if ALLOWED_ORIGINS is missing', () => {
    expect(() => validateEnv({
      NODE_ENV: 'production'
    })).toThrow(/ALLOWED_ORIGINS: Required in production mode/);
  });

  it('should pass in production mode when ALLOWED_ORIGINS is provided', () => {
    const env = validateEnv({
      NODE_ENV: 'production',
      ALLOWED_ORIGINS: 'https://projectpilot.ai, https://admin.projectpilot.ai'
    });

    expect(env.NODE_ENV).toBe('production');
    expect(env.allowedOrigins).toEqual(['https://projectpilot.ai', 'https://admin.projectpilot.ai']);
  });

  it('should handle optional API keys cleanly', () => {
    const env = validateEnv({
      GROQ_API_KEY: 'gsk_test_123',
      HUGGINGFACE_API_KEY: 'hf_test_456'
    });

    expect(env.GROQ_API_KEY).toBe('gsk_test_123');
    expect(env.HUGGINGFACE_API_KEY).toBe('hf_test_456');
  });
});
