# Technical Interview Guide

This guide compiles answers to key architectural questions regarding **ProjectPilot.AI** for technical interview preparation.

---

## 🙋 Q&A Handbook

### 1. Why did you build this project?
> *"Most developer portfolio sites feature simple templates like todo lists or basic calculators, which fail to showcase actual system design capabilities. I built ProjectPilot.AI to solve this. It serves as an autonomous software architect that helps developers build production-grade projects by generating complete structural blueprints. On the infrastructure side, it showcases complex engineering patterns: decoupling AI APIs behind a gateway, implementing cascading provider fallbacks, Zod validation, response repair, caching, and structured logging."*

### 2. Explain the system architecture.
> *"The project is structured as a TypeScript monorepo containing three packages: a React client, an Express backend, and a shared module. The frontend uses a client-side HashRouter and calls API endpoints using standard browser pings with cancellation support. The backend uses Helmet and CORS for security, and routes generation through the Provider Manager. The shared library houses the Zod schemas used to validate both client inputs and LLM outputs, ensuring strict schema safety."*

### 3. What does the Provider Manager do?
> *"The Provider Manager handles AI provider discovery, health checks, model list caching, and routing. It holds instances for Ollama, LM Studio, Hugging Face, Groq, and a local template engine. To prevent API latency bottlenecks, it caches health states and latencies in memory with a 30-second TTL."*

### 4. Explain the Prompt Builder service.
> *"The Prompt Builder isolates prompt engineering from the application code. It reads markdown system and user templates from external files. It compiles variables like skills and career goals, replacing template tokens at runtime, and falls back to hardcoded strings if file operations fail."*

### 5. Explain the Response Validator service.
> *"Raw LLM responses are unreliable and often contain markdown formatting like ` ```json ` tags. The Response Validator sanitizes the response, parses it, and validates the fields against our Zod schema. If validation fails, it automatically retries the request before throwing an error, ensuring that the client always receives compliant JSON."*

### 6. Explain the Template Engine.
> *"If all AI servers are offline, the Template Engine serves as our fallback. It accesses a local database of 50 blueprints across 5 category files. It uses an affinity-scoring algorithm to calculate matching weights based on domain, difficulty, tech stack overlap, and career goals, returning the top 5 projects."*

### 7. How does the fallback mechanism work?
> *"When a user requests a project generation, we check the prioritized providers list. If a provider is offline, times out, or returns invalid JSON that fails validation (even after retries), the backend catches the error, logs the diagnostic context with a `requestId`, and cascades to the next provider in the queue, falling back to the local templates if necessary."*

### 8. Why prioritize local LLMs over cloud APIs?
> *"Using local LLMs via Ollama or LM Studio offers three major benefits:
> 1. **Zero Cost**: Developers can run generations without accumulating API subscription fees.
> 2. **Data Privacy**: Input parameters never leave the local environment, protecting proprietary concepts.
> 3. **Offline Access**: The application remains fully functional without an internet connection."*

### 9. What challenges did you face?
> - **LLM Output Formatting**: Local models sometimes return non-JSON text alongside JSON blocks. I resolved this by adding custom regex cleaners and Zod parsing wrappers to repair formatting.
> - **Monorepo Type Checking**: Sharing Zod instances across CommonJS and ES modules caused compilation issues. I resolved this by configuring the shared package to output as ESNext modules.

### 10. How would you improve this in the future?
> - **Vector Database Integration**: Add semantic embeddings search to match user skills more precisely against templates.
> - **File Tree Scaffolder CLI**: Create a Node-based CLI that reads the generated blueprint's directory structure and scaffolds the files locally.
