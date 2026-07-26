# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-26
### Added
- **Visual Dashboard UI**: Added a responsive landing page, settings manager, bookmarks page, multi-step generation loaders, and dark mode transitions (Milestone 2).
- **Security Express Gateway**: Configured CORS, Helmet middleware headers, request ID correlation middleware, and structured JSON logging format (Milestone 3).
- **Live AI Provider Connectors**: Created Axios clients mapping Ollama `/api/tags` and `/api/generate` query hooks, LM Studio API paths, Hugging Face, and Groq cloud integrations (Milestone 4).
- **Cascading Fallbacks & Caching**: Added automatic fallback queue traversal and 30-second TTL status caching parameters to eliminate query latency blocks (Milestone 4).
- **Curated Templates Database**: Built a local database of 50 blueprints, ranking matching elements against profile specs using an affinity-score algorithm (Milestone 4).
- **Client Service Wiring**: Extracted API fetch routines into `api.ts`, added browser request abort execution handlers, and enabled generation logging history tabs.
