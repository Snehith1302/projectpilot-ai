import { ProjectBlueprint, ProjectGenerationResponse, SystemHealthResponse } from 'shared';

export const getMockHealth = (): SystemHealthResponse => {
  return {
    providers: {
      ollama: {
        available: true,
        status: 'online',
        models: ['qwen3:8b', 'llama3.1:8b', 'mistral:7b'],
      },
      lmstudio: {
        available: false,
        status: 'offline',
        models: [],
        message: 'Endpoint http://localhost:1234 unreachable'
      },
      huggingface: {
        available: false,
        status: 'offline',
        models: []
      },
      groq: {
        available: false,
        status: 'offline',
        models: []
      },
      template: {
        available: true,
        status: 'online',
        models: ['local-templates-v1.0']
      }
    },
    activeProvider: 'ollama',
    selectedModel: 'qwen3:8b',
    timestamp: new Date().toISOString()
  };
};

export const getMockGenerationResponse = (input: any): ProjectGenerationResponse => {
  const { fullName, skills, frameworks, domain, difficulty } = input;

  const projects: ProjectBlueprint[] = [
    {
      id: 'proj_01',
      title: 'RepoPilot AI: Intelligent Multi-Agent codebase RAG Engine',
      tagline: 'Deep semantic search, automatic architectural diagramming, and test suite generation for local repositories using localized embeddings.',
      resumeScore: 94,
      placementScore: 92,
      innovationScore: 96,
      difficulty: difficulty === 'intermediate' ? 'Intermediate' : 'Production Grade',
      duration: '4 Weeks',
      domain: 'AI Agents / RAG',
      techStack: [...skills.slice(0, 3), ...frameworks.slice(0, 2), 'LangChain', 'ChromaDB', 'FastAPI'],
      problemStatement: {
        overview: 'Developers onboarding onto large, legacy repositories spend up to 40% of their time reading documentation and tracing function paths rather than writing code. RepoPilot AI indexes codebase repositories locally and coordinates a team of specialized AI agents to answer complex architectural questions, construct Mermaid UML diagrams, and auto-write integration test specs.',
        targetAudience: 'Software Engineers, Technical Architects, Dev Teams onboarding remote engineers',
        userPersonas: [
          'Junior Engineer seeking clarification on internal utility usage without disturbing senior peers.',
          'Lead Architect validating structural dependencies and design patterns.'
        ]
      },
      systemArchitecture: {
        narrative: 'A client-server application where a background worker indexes files, extracts syntax trees, creates semantic embeddings, and stores them in ChromaDB. When a query arrives, a Master Router Agent splits the task between an Explainer Agent (handles codebase logic) and a Diagrammer Agent (constructs Mermaid flows).',
        dataFlow: 'Codebase Upload -> AST Parser (Babel/Esprima) -> Embedding Pipeline (SentenceTransformers) -> Vector Database (ChromaDB) -> Prompt context -> LLM Agent Router -> Agent Execution -> Output.'
      },
      features: {
        core: [
          'Automatic Codebase Parsing: AST traversal for Python, TypeScript, and Go.',
          'Semantic Vector Search: Multi-threaded directory scanner with incremental change detection.',
          'Interactive Visual Diagrams: Render interactive visual UML flows using Mermaid.js.'
        ],
        advanced: [
          'Agentic Code Correction: Multi-agent execution utilizing self-refinement loops to rewrite buggy modules.',
          'Local Sandboxed Execution: Safely runs suggested unit tests in an isolated Docker container.'
        ]
      },
      databaseApiSpecification: {
        tables: [
          {
            name: 'repositories',
            columns: ['id (UUID) - Primary Key', 'name (VARCHAR)', 'local_path (TEXT)', 'last_indexed_at (TIMESTAMP)'],
            description: 'Stores metadata of indexed repository folders.'
          },
          {
            name: 'code_embeddings',
            columns: ['id (UUID) - Primary Key', 'repo_id (UUID) - FK', 'file_path (TEXT)', 'chunk_content (TEXT)', 'vector_id (VARCHAR)'],
            description: 'Maps structural code chunks to entries in the vector store database.'
          }
        ],
        endpoints: [
          {
            method: 'POST',
            path: '/api/v1/repos/index',
            requestBody: '{"path": "C:/Projects/App"}',
            responseBody: '{"repoId": "repo-9821-abc", "filesCount": 142, "status": "indexing"}',
            description: 'Scans directory, fires AST parsing thread, and uploads vectors.'
          },
          {
            method: 'POST',
            path: '/api/v1/repos/query',
            requestBody: '{"repoId": "repo-9821-abc", "query": "How is authentication handled?"}',
            responseBody: '{"answer": "Auth is configured in jwt.ts...", "sources": ["src/auth/jwt.ts:L10-40"], "diagram": "graph TD;..."}',
            description: 'Triggers agent execution framework to assemble an answer.'
          }
        ]
      },
      directoryStructure: `repo-pilot-ai/
├── backend/
│   ├── src/
│   │   ├── index.py          # FastAPI Gateway
│   │   ├── parser.py         # AST structural parser
│   │   ├── agent_team.py     # LangGraph agent definitions
│   │   └── database.py       # SQL & Chroma connectivity
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Visual chat panels & canvas renderer
│   │   └── App.tsx
│   └── package.json
└── README.md`,
      roadmap: [
        {
          phase: 'Phase 1: Foundation',
          title: 'Parser and Database Indexer',
          tasks: [
            'Create AST parser to traverse file paths and skip ignored files.',
            'Connect local embeddings engine (Ollama/Hugging Face sentence-transformers).'
          ]
        },
        {
          phase: 'Phase 2: Core Agent Framework',
          title: 'LangGraph Routing Setup',
          tasks: [
            'Build Master Router Agent to classify user questions.',
            'Integrate Mermaid diagram renderer.'
          ]
        }
      ],
      deploymentCiCd: {
        host: 'Self-hosted (Docker Desktop) / Render (API Service)',
        containerization: 'Multi-stage Dockerfile bundling Python backend and frontend Node assets.',
        steps: [
          'Build frontend files using Vite.',
          'Inject assets into static folder of python runtime.',
          'Run Docker compose command: docker-compose up --build.'
        ]
      },
      placementArtifacts: {
        resumeBullets: [
          `Engineered an autonomous codebase documentation agent system utilizing React, FastAPI, and ChromaDB, saving developers up to 40% on onboarding durations.`,
          `Designed a local multi-agent retrieval pipeline using AST code parsing and LangGraph routing to dynamically render structural application flow diagrams.`
        ],
        interviewQuestions: [
          {
            question: 'How do you handle rate-limiting or context window caps in your RAG pipeline?',
            answerHint: 'Explain how text is chunked into logical functional blocks, and highlight how the AST parser is used to include only relevant code context.'
          }
        ]
      }
    },
    {
      id: 'proj_02',
      title: 'DistriQueue: High-Performance Distributed Serverless Task Broker',
      tagline: 'An event-driven distributed task execution broker with custom consensus mechanisms, sliding-window rate limiting, and failure retry backoffs.',
      resumeScore: 95,
      placementScore: 94,
      innovationScore: 93,
      difficulty: 'Production Grade',
      duration: '4-6 Weeks',
      domain: 'Distributed Systems',
      techStack: [...skills.slice(0, 3), 'Go/Rust', 'Redis', 'gRPC', 'Docker'],
      problemStatement: {
        overview: 'Traditional task queues rely heavily on databases that form operational bottlenecks. DistriQueue scales horizontally by deploying worker nodes that coordinate tasks over gRPC, balancing loads dynamically without centralized failure points.',
        targetAudience: 'Infrastructure engineering teams, high-traffic SaaS operators',
        userPersonas: [
          'SaaS system administrator looking for lightweight queue setups.',
          'DevOps lead seeking to limit container overhead.'
        ]
      },
      systemArchitecture: {
        narrative: 'Nodes form a peer cluster using a lightweight custom gossip protocol. Tasks are partitioned using consistent hashing across available node instances.',
        dataFlow: 'Client Task Submission -> Hash Ring Router -> Assign Node -> Write to Local Redis Cache -> Background Worker Execution.'
      },
      features: {
        core: [
          'Consistent Hash Ring routing algorithm.',
          'gRPC Node Communication.',
          'Dead Letter Queue (DLQ) automatic routing.'
        ],
        advanced: [
          'Custom Gossip Protocol for cluster discovery.',
          'Dynamic Backpressure Throttle controls.'
        ]
      },
      databaseApiSpecification: {
        tables: [
          {
            name: 'workers',
            columns: ['worker_id (UUID) - PK', 'host_address (VARCHAR)', 'status (VARCHAR)', 'active_tasks (INT)'],
            description: 'Stores live heartbeats of node clusters.'
          }
        ],
        endpoints: [
          {
            method: 'POST',
            path: '/tasks/enqueue',
            requestBody: '{"taskName": "compress_image", "payload": "s3://bucket/img.png"}',
            responseBody: '{"taskId": "task-8291", "nodeAddress": "10.0.1.20"}',
            description: 'Pushes tasks to node coordinates.'
          }
        ]
      },
      directoryStructure: `distrique/
├── broker/
│   ├── main.go
│   ├── ring/             # Hash ring implementation
│   └── worker/           # Background execution loops
└── Cargo.toml`,
      roadmap: [
        {
          phase: 'Phase 1',
          title: 'Consistent Hashing Ring',
          tasks: [
            'Create hash ring utility.',
            'Establish node heartbeat channels.'
          ]
        }
      ],
      deploymentCiCd: {
        host: 'AWS EKS (Kubernetes)',
        containerization: 'Distroless light container build files.',
        steps: [
          'Compile statically linked binary.',
          'Deploy local Kubernetes manifest.'
        ]
      },
      placementArtifacts: {
        resumeBullets: [
          `Architected a zero-dependency distributed task scheduler in Go using consistent hashing, lowering message dispatch latencies by 35%.`
        ],
        interviewQuestions: [
          {
            question: 'What happens if a node drops offline mid-execution?',
            answerHint: 'Explain how heartbeat thresholds trigger ring rebalancing, routing unacknowledged tasks to backup worker instances.'
          }
        ]
      }
    },
    {
      id: 'proj_03',
      title: 'SaaSify: Multi-Tenant Billing, Analytics & Provisioning Gateway',
      tagline: 'An enterprise-grade multi-tenant foundation providing database isolation, stripe billing integration, feature flags, and sub-domain routing.',
      resumeScore: 91,
      placementScore: 95,
      innovationScore: 89,
      difficulty: 'Advanced',
      duration: '3 Weeks',
      domain: 'SaaS Systems',
      techStack: [...skills.slice(0, 3), 'TypeScript', 'Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
      problemStatement: {
        overview: 'Bootstrapping new SaaS platforms requires duplicating complex boilerplate logic like subscription checks, tenant isolation, and invoice handling. SaaSify provides a pre-architected gateway to accelerate SaaS product delivery.',
        targetAudience: 'Startup Founders, Indie Hackers, Enterprise Web Teams',
        userPersonas: [
          'Full-stack developer building a new SaaS product.',
          'Product manager needing flexible subscription tiers.'
        ]
      },
      systemArchitecture: {
        narrative: 'A Next.js application that uses PostgreSQL schemas or row-level security (RLS) to enforce tenant isolation. Stripe webhooks keep billing and access states synchronized.',
        dataFlow: 'Client Request -> Tenant Identifier Middleware -> PostgreSQL RLS Context -> Stripe Webhook Updates -> Tenant Dashboard UI.'
      },
      features: {
        core: [
          'Tenant Schema Isolation using PostgreSQL RLS.',
          'Stripe Subscription Sync (webhooks and checkout portal).',
          'Dynamic Domain Routing (tenant.domain.com).'
        ],
        advanced: [
          'Real-time usage meter dashboard powered by Redis Timeseries.',
          'Admin feature flag control center.'
        ]
      },
      databaseApiSpecification: {
        tables: [
          {
            name: 'tenants',
            columns: ['id (UUID) - PK', 'name (VARCHAR)', 'subdomain (VARCHAR)', 'created_at (TIMESTAMP)'],
            description: 'Tenant meta mappings.'
          },
          {
            name: 'subscriptions',
            columns: ['id (UUID) - PK', 'tenant_id (UUID) - FK', 'stripe_sub_id (VARCHAR)', 'status (VARCHAR)'],
            description: 'Tracks payment statuses per tenant.'
          }
        ],
        endpoints: [
          {
            method: 'GET',
            path: '/api/tenant/billing',
            responseBody: '{"plan": "enterprise", "nextInvoice": "2026-08-01"}',
            description: 'Fetches active tenant subscription profiles.'
          }
        ]
      },
      directoryStructure: `saasify/
├── apps/
│   ├── web/              # Next.js web application
│   └── api/              # Express backend handler
├── packages/
│   └── database/         # Shared Prisma definitions
└── package.json`,
      roadmap: [
        {
          phase: 'Phase 1',
          title: 'Tenant Separation',
          tasks: [
            'Configure PostgreSQL Prisma Client with RLS policies.',
            'Build wildcard subdomain router.'
          ]
        }
      ],
      deploymentCiCd: {
        host: 'Vercel + Neon Serverless PostgreSQL',
        containerization: 'Node.js standalone build targets.',
        steps: [
          'Configure database environment variables.',
          'Trigger Vercel main branch deploy command.'
        ]
      },
      placementArtifacts: {
        resumeBullets: [
          `Designed a multi-tenant SaaS starter kit supporting dynamic database row-level security (RLS) and custom subdomains, slashing bootstrapping timelines by 60%.`
        ],
        interviewQuestions: [
          {
            question: 'How do you guarantee a tenant cannot view or alter another tenant\'s data?',
            answerHint: 'Explain how PostgreSQL row-level security (RLS) automatically injects current tenant context checks into database queries.'
          }
        ]
      }
    },
    {
      id: 'proj_04',
      title: 'TerraView: Interactive IaC Blueprint Visualizer & Policy Linter',
      tagline: 'Parses Terraform configurations, renders active dependency tree diagrams, and runs OPA compliance scans against custom policies.',
      resumeScore: 92,
      placementScore: 93,
      innovationScore: 94,
      difficulty: 'Advanced',
      duration: '3 Weeks',
      domain: 'Developer Tools',
      techStack: [...skills.slice(0, 3), 'Rust', 'WebAssembly', 'React', 'Open Policy Agent (OPA)'],
      problemStatement: {
        overview: 'Reviewing raw Terraform files is error-prone. TerraView compiles code to structured JSON, checks policies against Open Policy Agent guidelines, and presents visual layouts of cloud resource maps.',
        targetAudience: 'Cloud Architects, DevOps Engineers, Security compliance officers',
        userPersonas: [
          'Cloud Engineer validating architecture changes before merge requests.',
          'Compliance officer enforcing encrypted disk standard protocols.'
        ]
      },
      systemArchitecture: {
        narrative: 'A web client tool. Files are parsed using a WebAssembly-compiled version of the HCL (HashiCorp Configuration Language) parser. Diagrams are drawn dynamically, and OPA rules are applied locally.',
        dataFlow: 'Upload HCL files -> HCL Parser (Wasm) -> AST JSON Node tree -> D3.js visual renderer -> Open Policy Agent validator -> Violations list.'
      },
      features: {
        core: [
          'Wasm HCL parser.',
          'Interactive SVG dependency layout tree canvas.',
          'OPA policy violation badge list.'
        ],
        advanced: [
          'Cost estimations calculator (integration with Infracost API).',
          'Automatic pull request markdown comment builder.'
        ]
      },
      databaseApiSpecification: {
        tables: [],
        endpoints: []
      },
      directoryStructure: `terraview/
├── cli/                 # Rust CLI client
├── wasm-parser/         # HCL parser module compiled to web assembly
├── web/                 # React UI visual graph portal
└── package.json`,
      roadmap: [
        {
          phase: 'Phase 1',
          title: 'HCL parsing to JSON',
          tasks: [
            'Create Rust crate that parses terraform files.',
            'Compile binary dependencies into WebAssembly modules.'
          ]
        }
      ],
      deploymentCiCd: {
        host: 'Cloudflare Pages',
        containerization: 'No server needed (purely client-side static files).',
        steps: [
          'Build JS app bundle assets.',
          'Publish builds to Cloudflare edge CDN.'
        ]
      },
      placementArtifacts: {
        resumeBullets: [
          `Developed an interactive Infrastructure-as-Code linter and visualizer utilizing React, Rust, and WebAssembly, rendering SVG node maps of resource trees.`
        ],
        interviewQuestions: [
          {
            question: 'Why did you compile the parser to WebAssembly rather than running it on a backend?',
            answerHint: 'Highlight the benefits of client-side computation (zero hosting cost, immediate feedback, and absolute privacy for sensitive infrastructure files).'
          }
        ]
      }
    },
    {
      id: 'proj_05',
      title: 'AutoOps: Automated Deployment and Canary Testing Operator',
      tagline: 'A Kubernetes controller automating canary releases using real-time Prometheus error rates to trigger rolling updates or rollbacks.',
      resumeScore: 96,
      placementScore: 93,
      innovationScore: 95,
      difficulty: 'Production Grade',
      duration: '5 Weeks',
      domain: 'Automation / DevOps',
      techStack: [...skills.slice(0, 3), 'TypeScript', 'Kubernetes API', 'Prometheus', 'Grafana'],
      problemStatement: {
        overview: 'Manual deployments run severe crash risks. AutoOps monitors live telemetry data during release steps, incrementally driving traffic between old and new pod instances and halting progress if exceptions spike.',
        targetAudience: 'DevOps Teams, Release Managers, Cloud Architects',
        userPersonas: [
          'Site Reliability Engineer enforcing automated rollover standards.',
          'Developer wanting stress-free deployment pushes.'
        ]
      },
      systemArchitecture: {
        narrative: 'A custom controller loops in Kubernetes. It manages Canary resource manifests and modifies proxy weights to direct traffic increments.',
        dataFlow: 'New Canary version -> Traffic weighted 10% -> Fetch Prometheus query -> Error rates healthy -> Increase weight -> Complete rollout.'
      },
      features: {
        core: [
          'Canary Custom Resource Definition (CRD) schema.',
          'Traffic weights coordinator controller.',
          'Prometheus API scraping helper.'
        ],
        advanced: [
          'Automatic slack event alert dispatcher.',
          'Instant emergency rollback system.'
        ]
      },
      databaseApiSpecification: {
        tables: [
          {
            name: 'deployments',
            columns: ['id (UUID) - PK', 'name (VARCHAR)', 'status (VARCHAR)', 'canary_weight (INT)'],
            description: 'Tracks progress of active canary releases.'
          }
        ],
        endpoints: []
      },
      directoryStructure: `autoops/
├── operator/            # Go/Node operator loop
├── crd/                 # Custom Resource Definitions
└── package.json`,
      roadmap: [
        {
          phase: 'Phase 1',
          title: 'CRD and Controller Setup',
          tasks: [
            'Define custom API specs for Kubernetes custom resources.',
            'Connect controller loops to watch resource changes.'
          ]
        }
      ],
      deploymentCiCd: {
        host: 'Self-hosted Kubernetes Cluster',
        containerization: 'Multi-architecture Docker build script.',
        steps: [
          'Compile container image.',
          'Apply manifests to Kubernetes target using kubectl.'
        ]
      },
      placementArtifacts: {
        resumeBullets: [
          `Engineered a Kubernetes Operator in TypeScript to automate canary rollouts, dropping incident recovery times by 80% through automated rollback logic.`
        ],
        interviewQuestions: [
          {
            question: 'What metric-evaluation window did you use for canary validations?',
            answerHint: 'Explain using a sliding-window duration (e.g. 5 minutes) to calculate average error ratios to guard against telemetry noise.'
          }
        ]
      }
    }
  ];

  return {
    projects,
    activeProvider: 'template',
    selectedModel: 'local-templates-v1.0'
  };
};
