import dotenv from 'dotenv';
dotenv.config();

const parseAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS;
  if (envOrigins) {
    return envOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0);
  }

  // Development defaults when ALLOWED_ORIGINS is missing
  if (process.env.NODE_ENV === 'production') {
    return [];
  }

  return ['http://localhost:3000', 'http://localhost:5173'];
};

export const AppConfig = {
  version: {
    app: '1.0.0',
    api: '1.0.0',
    prompt: '1.0.0',
    schema: '1.0.0'
  },
  providers: {
    ollama: {
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
      timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || '30000', 10)
    },
    lmstudio: {
      host: process.env.LMSTUDIO_HOST || 'http://localhost:1234',
      timeoutMs: parseInt(process.env.LMSTUDIO_TIMEOUT_MS || '30000', 10)
    },
    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY || '',
      timeoutMs: parseInt(process.env.HUGGINGFACE_TIMEOUT_MS || '20000', 10)
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      timeoutMs: parseInt(process.env.GROQ_TIMEOUT_MS || '15000', 10)
    }
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    allowedOrigins: parseAllowedOrigins()
  }
};

