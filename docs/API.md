# API Documentation

All API endpoints return JSON payloads wrapped in a standard response envelope.

## Response Envelope
```json
{
  "success": true,
  "message": "Status description message",
  "data": {},
  "meta": {
    "requestId": "req_1785084309924_akhuk34do",
    "timestamp": "2026-07-26T16:45:09.926Z"
  }
}
```

---

## 1. GET /api/health
Returns detailed provider availability logs, server uptime statistics, latency indicators, and app versions.

### Query Parameters
- `provider` (optional): Overrides the default provider check.
- `model` (optional): Overrides the default model check.

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "System health status retrieved successfully",
  "data": {
    "providers": {
      "ollama": {
        "available": true,
        "status": "online",
        "models": ["qwen3:8b", "llama3.1:8b"]
      },
      "lmstudio": {
        "available": false,
        "status": "offline",
        "models": [],
        "message": "Endpoint http://localhost:1234 unreachable"
      },
      "template": {
        "available": true,
        "status": "online",
        "models": ["local-templates-v1.0"]
      }
    },
    "activeProvider": "ollama",
    "selectedModel": "qwen3:8b",
    "timestamp": "2026-07-26T16:45:09.926Z",
    "uptimeSeconds": 142,
    "version": {
      "app": "1.0.0",
      "api": "1.0.0",
      "prompt": "1.0.0",
      "schema": "1.0.0"
    },
    "latencies": {
      "ollama": 42,
      "lmstudio": 12,
      "template": 0
    }
  },
  "meta": {
    "requestId": "req_1785084309924_akhuk34do",
    "timestamp": "2026-07-26T16:45:09.926Z"
  }
}
```

---

## 2. GET /api/providers
Retrieves a simplified list of configured AI gateways and availability indicators.

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Providers retrieved successfully",
  "data": {
    "providers": [
      {
        "name": "ollama",
        "available": true,
        "status": "online",
        "models": ["qwen3:8b", "llama3.1:8b"]
      },
      {
        "name": "template",
        "available": true,
        "status": "online",
        "models": ["local-templates-v1.0"]
      }
    ]
  },
  "meta": {
    "requestId": "req_1785084336352_lxu9vmdux",
    "timestamp": "2026-07-26T16:45:36.352Z"
  }
}
```

---

## 3. GET /api/models
Retrieves the neural models supported by a specific provider.

### Query Parameters
- `provider` (optional, default: `ollama`): The target provider name.

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Models retrieved for provider 'ollama'",
  "data": {
    "provider": "ollama",
    "models": ["qwen3:8b", "llama3.1:8b"]
  },
  "meta": {
    "requestId": "req_1785084329613_fc0vpa3qr",
    "timestamp": "2026-07-26T16:45:29.613Z"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Provider 'unknown' not found",
  "data": null,
  "meta": {
    "requestId": "req_1785084329613_fc0vpa3qr",
    "timestamp": "2026-07-26T16:45:29.613Z"
  }
}
```

---

## 4. GET /api/version
Returns structural versions of the API, application, prompt files, and configuration schemas.

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Version information retrieved successfully",
  "data": {
    "version": {
      "app": "1.0.0",
      "api": "1.0.0",
      "prompt": "1.0.0",
      "schema": "1.0.0"
    }
  },
  "meta": {
    "requestId": "req_1785084329613_fc0vpa3qr",
    "timestamp": "2026-07-26T16:45:29.613Z"
  }
}
```

---

## 5. POST /api/generate
Generates 5 ranked project blueprints conforming to profile parameters.

### Request Body (JSON)
All fields are parsed and validated via the Zod schema:
```json
{
  "fullName": "Jane Doe",
  "skills": ["TypeScript", "Go"],
  "frameworks": ["React", "Express"],
  "careerGoal": "full_stack",
  "domain": "ai_rag",
  "difficulty": "advanced",
  "duration": "2_4_weeks",
  "teamConfig": "solo",
  "providerOverride": "ollama",
  "modelOverride": "qwen3:8b"
}
```

### Successful Response (200 OK)
```json
{
  "success": true,
  "message": "Project recommendations generated successfully",
  "data": {
    "projects": [
      {
        "id": "proj_01",
        "title": "RepoPilot AI: Intelligent Multi-Agent Codebase RAG Engine",
        "tagline": "Deep semantic search, automatic architectural diagramming, and test suite generation for local repositories using localized embeddings.",
        "resumeScore": 94,
        "placementScore": 92,
        "innovationScore": 96,
        "difficulty": "advanced",
        "duration": "2_4_weeks",
        "domain": "ai_rag",
        "techStack": ["TypeScript", "Python", "React", "LangChain", "ChromaDB", "FastAPI"],
        "problemStatement": {
          "overview": "Developers onboarding onto large, legacy repositories spend up to 40% of their time reading documentation and tracing function paths...",
          "targetAudience": "Software Engineers, Technical Architects, Dev Teams onboarding remote engineers",
          "userPersonas": [
            "Junior Engineer seeking clarification on internal utility usage without disturbing senior peers.",
            "Lead Architect validating structural dependencies and design patterns."
          ]
        },
        "systemArchitecture": {
          "narrative": "A client-server application where a background worker indexes files, extracts syntax trees...",
          "dataFlow": "Codebase Upload -> AST Parser -> Embedding Pipeline -> Vector Database -> Prompt context -> Output."
        },
        "features": {
          "core": [
            "Automatic Codebase Parsing: AST traversal for Python, TypeScript, and Go.",
            "Semantic Vector Search: Multi-threaded directory scanner."
          ],
          "advanced": [
            "Agentic Code Correction: Multi-agent execution utilizing self-refinement loops."
          ]
        },
        "databaseApiSpecification": {
          "tables": [
            {
              "name": "repositories",
              "columns": ["id (UUID)", "name (VARCHAR)", "local_path (TEXT)"],
              "description": "Stores metadata of indexed repository folders."
            }
          ],
          "endpoints": [
            {
              "method": "POST",
              "path": "/api/v1/repos/index",
              "requestBody": "{\"path\": \"C:/Projects/App\"}",
              "responseBody": "{\"repoId\": \"repo-9821-abc\"}",
              "description": "Scans directory, fires AST parsing thread, and uploads vectors."
            }
          ]
        },
        "directoryStructure": "repo-pilot-ai/\n├── backend/\n└── README.md",
        "roadmap": [
          {
            "phase": "Phase 1: Foundation",
            "title": "Parser and Database Indexer",
            "tasks": ["Create AST parser to traverse file paths."]
          }
        ],
        "deploymentCiCd": {
          "host": "Self-hosted (Docker Desktop) / Render (API Service)",
          "containerization": "Multi-stage Dockerfile bundling Python backend and frontend Node assets.",
          "steps": ["Build frontend files using Vite.", "Run Docker compose command."]
        },
        "placementArtifacts": {
          "resumeBullets": [
            "Engineered an autonomous codebase documentation agent system utilizing React, FastAPI, and ChromaDB, saving developers up to 40% on onboarding durations."
          ],
          "interviewQuestions": [
            {
              "question": "How do you handle rate-limiting or context window caps in your RAG pipeline?",
              "answerHint": "Explain how text is chunked into logical functional blocks..."
            }
          ]
        }
      }
    ],
    "activeProvider": "ollama",
    "selectedModel": "qwen3:8b"
  },
  "meta": {
    "requestId": "req_1785084375776_6o3tormlu",
    "timestamp": "2026-07-26T16:46:15.783Z"
  }
}
```

### Error Response (400 Bad Request)
Returned when input parameters fail validation:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "details": [
      {
        "field": "fullName",
        "message": "Name is required"
      },
      {
        "field": "skills",
        "message": "Required"
      }
    ]
  },
  "meta": {
    "requestId": "req_1785084344046_y11e9w26q",
    "timestamp": "2026-07-26T16:45:44.058Z"
  }
}
```
---

## HTTP Status Codes
* **200 OK**: Request completed successfully.
* **400 Bad Request**: Input parameters failed structural Zod validations.
* **404 Not Found**: Endpoint route or specified resource mapping not found.
* **500 Internal Server Error**: Fatal backend failures during execution pings.
