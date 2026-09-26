import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const positiveIntString = (defaultValue: number) =>
  z.string()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.trim() !== '') {
        const parsed = Number(val);
        if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a positive integer'
          });
        }
      }
    })
    .transform((val) => {
      if (!val || val.trim() === '') return defaultValue;
      return Number(val);
    });

const validUrlString = (defaultValue: string) =>
  z.string()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.trim() !== '') {
        try {
          new URL(val.trim());
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid URL'
          });
        }
      }
    })
    .transform((val) => (val && val.trim() !== '' ? val.trim() : defaultValue));

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.trim() !== '') {
        const parsed = Number(val);
        if (isNaN(parsed) || !Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid integer between 1 and 65535'
          });
        }
      }
    })
    .transform((val) => {
      if (!val || val.trim() === '') return 5000;
      return Number(val);
    }),
  ALLOWED_ORIGINS: z.string().optional(),
  GENERATE_RATE_LIMIT_WINDOW_MS: positiveIntString(900000),
  GENERATE_RATE_LIMIT_MAX: positiveIntString(10),
  OLLAMA_HOST: validUrlString('http://localhost:11434'),
  OLLAMA_TIMEOUT_MS: positiveIntString(30000),
  LMSTUDIO_HOST: validUrlString('http://localhost:1234'),
  LMSTUDIO_TIMEOUT_MS: positiveIntString(30000),
  HUGGINGFACE_API_KEY: z.string().optional().default(''),
  HUGGINGFACE_TIMEOUT_MS: positiveIntString(20000),
  GROQ_API_KEY: z.string().optional().default(''),
  GROQ_TIMEOUT_MS: positiveIntString(15000)
});

export const validateEnv = (env: Record<string, string | undefined> = process.env) => {
  const result = EnvSchema.safeParse(env);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Environment variable validation failed:\n${errorDetails}`);
  }

  const validated = result.data;

  // Parse and validate ALLOWED_ORIGINS
  let allowedOrigins: string[] = [];
  if (validated.ALLOWED_ORIGINS && validated.ALLOWED_ORIGINS.trim() !== '') {
    allowedOrigins = validated.ALLOWED_ORIGINS
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  } else if (validated.NODE_ENV === 'production') {
    throw new Error('Environment variable validation failed:\n  - ALLOWED_ORIGINS: Required in production mode');
  } else {
    allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
  }

  return {
    ...validated,
    allowedOrigins
  };
};

const envConfig = validateEnv();

export const AppConfig = {
  version: {
    app: '1.0.0',
    api: '1.0.0',
    prompt: '1.0.0',
    schema: '1.0.0'
  },
  providers: {
    ollama: {
      host: envConfig.OLLAMA_HOST,
      timeoutMs: envConfig.OLLAMA_TIMEOUT_MS
    },
    lmstudio: {
      host: envConfig.LMSTUDIO_HOST,
      timeoutMs: envConfig.LMSTUDIO_TIMEOUT_MS
    },
    huggingface: {
      apiKey: envConfig.HUGGINGFACE_API_KEY,
      timeoutMs: envConfig.HUGGINGFACE_TIMEOUT_MS
    },
    groq: {
      apiKey: envConfig.GROQ_API_KEY,
      timeoutMs: envConfig.GROQ_TIMEOUT_MS
    }
  },
  server: {
    port: envConfig.PORT,
    allowedOrigins: envConfig.allowedOrigins
  },
  rateLimit: {
    generate: {
      windowMs: envConfig.GENERATE_RATE_LIMIT_WINDOW_MS,
      max: envConfig.GENERATE_RATE_LIMIT_MAX
    }
  }
};

