import dotenv from 'dotenv';
dotenv.config();

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
    port: parseInt(process.env.PORT || '5000', 10)
  }
};
