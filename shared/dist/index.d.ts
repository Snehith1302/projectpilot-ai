import { z } from 'zod';
export declare const CareerGoalSchema: z.ZodEnum<["sde_1", "aiml_engineer", "full_stack", "devops_cloud"]>;
export declare const TechnicalDomainSchema: z.ZodEnum<["ai_rag", "dev_tools", "distributed_systems", "saas", "automation"]>;
export declare const DifficultyLevelSchema: z.ZodEnum<["intermediate", "advanced", "production_enterprise"]>;
export declare const EstimatedDurationSchema: z.ZodEnum<["1_week", "2_4_weeks", "1_2_months"]>;
export declare const TeamConfigSchema: z.ZodEnum<["solo", "team"]>;
export declare const ProjectGenerationInputSchema: z.ZodObject<{
    fullName: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    frameworks: z.ZodArray<z.ZodString, "many">;
    careerGoal: z.ZodEnum<["sde_1", "aiml_engineer", "full_stack", "devops_cloud"]>;
    domain: z.ZodEnum<["ai_rag", "dev_tools", "distributed_systems", "saas", "automation"]>;
    difficulty: z.ZodEnum<["intermediate", "advanced", "production_enterprise"]>;
    duration: z.ZodEnum<["1_week", "2_4_weeks", "1_2_months"]>;
    teamConfig: z.ZodEnum<["solo", "team"]>;
    providerOverride: z.ZodOptional<z.ZodString>;
    modelOverride: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    skills: string[];
    frameworks: string[];
    careerGoal: "sde_1" | "aiml_engineer" | "full_stack" | "devops_cloud";
    domain: "ai_rag" | "dev_tools" | "distributed_systems" | "saas" | "automation";
    difficulty: "intermediate" | "advanced" | "production_enterprise";
    duration: "1_week" | "2_4_weeks" | "1_2_months";
    teamConfig: "solo" | "team";
    providerOverride?: string | undefined;
    modelOverride?: string | undefined;
}, {
    fullName: string;
    skills: string[];
    frameworks: string[];
    careerGoal: "sde_1" | "aiml_engineer" | "full_stack" | "devops_cloud";
    domain: "ai_rag" | "dev_tools" | "distributed_systems" | "saas" | "automation";
    difficulty: "intermediate" | "advanced" | "production_enterprise";
    duration: "1_week" | "2_4_weeks" | "1_2_months";
    teamConfig: "solo" | "team";
    providerOverride?: string | undefined;
    modelOverride?: string | undefined;
}>;
export type CareerGoal = z.infer<typeof CareerGoalSchema>;
export type TechnicalDomain = z.infer<typeof TechnicalDomainSchema>;
export type DifficultyLevel = z.infer<typeof DifficultyLevelSchema>;
export type EstimatedDuration = z.infer<typeof EstimatedDurationSchema>;
export type TeamConfig = z.infer<typeof TeamConfigSchema>;
export type ProjectGenerationInput = z.infer<typeof ProjectGenerationInputSchema>;
export declare const TableSpecSchema: z.ZodObject<{
    name: z.ZodString;
    columns: z.ZodArray<z.ZodString, "many">;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    columns: string[];
    description: string;
}, {
    name: string;
    columns: string[];
    description: string;
}>;
export declare const EndpointSpecSchema: z.ZodObject<{
    method: z.ZodString;
    path: z.ZodString;
    requestBody: z.ZodOptional<z.ZodString>;
    responseBody: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    description: string;
    method: string;
    responseBody: string;
    requestBody?: string | undefined;
}, {
    path: string;
    description: string;
    method: string;
    responseBody: string;
    requestBody?: string | undefined;
}>;
export declare const RoadmapPhaseSchema: z.ZodObject<{
    phase: z.ZodString;
    title: z.ZodString;
    tasks: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    phase: string;
    title: string;
    tasks: string[];
}, {
    phase: string;
    title: string;
    tasks: string[];
}>;
export declare const InterviewQuestionSchema: z.ZodObject<{
    question: z.ZodString;
    answerHint: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: string;
    answerHint: string;
}, {
    question: string;
    answerHint: string;
}>;
export declare const ProjectBlueprintSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    tagline: z.ZodString;
    resumeScore: z.ZodNumber;
    placementScore: z.ZodNumber;
    innovationScore: z.ZodNumber;
    difficulty: z.ZodString;
    duration: z.ZodString;
    domain: z.ZodString;
    techStack: z.ZodArray<z.ZodString, "many">;
    problemStatement: z.ZodObject<{
        overview: z.ZodString;
        targetAudience: z.ZodString;
        userPersonas: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        overview: string;
        targetAudience: string;
        userPersonas: string[];
    }, {
        overview: string;
        targetAudience: string;
        userPersonas: string[];
    }>;
    systemArchitecture: z.ZodObject<{
        narrative: z.ZodString;
        dataFlow: z.ZodString;
        diagram: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        narrative: string;
        dataFlow: string;
        diagram?: string | undefined;
    }, {
        narrative: string;
        dataFlow: string;
        diagram?: string | undefined;
    }>;
    features: z.ZodObject<{
        core: z.ZodArray<z.ZodString, "many">;
        advanced: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        advanced: string[];
        core: string[];
    }, {
        advanced: string[];
        core: string[];
    }>;
    databaseApiSpecification: z.ZodObject<{
        tables: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            columns: z.ZodArray<z.ZodString, "many">;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            columns: string[];
            description: string;
        }, {
            name: string;
            columns: string[];
            description: string;
        }>, "many">;
        endpoints: z.ZodArray<z.ZodObject<{
            method: z.ZodString;
            path: z.ZodString;
            requestBody: z.ZodOptional<z.ZodString>;
            responseBody: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }, {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        tables: {
            name: string;
            columns: string[];
            description: string;
        }[];
        endpoints: {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }[];
    }, {
        tables: {
            name: string;
            columns: string[];
            description: string;
        }[];
        endpoints: {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }[];
    }>;
    directoryStructure: z.ZodString;
    roadmap: z.ZodArray<z.ZodObject<{
        phase: z.ZodString;
        title: z.ZodString;
        tasks: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        phase: string;
        title: string;
        tasks: string[];
    }, {
        phase: string;
        title: string;
        tasks: string[];
    }>, "many">;
    deploymentCiCd: z.ZodObject<{
        host: z.ZodString;
        containerization: z.ZodString;
        steps: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        host: string;
        containerization: string;
        steps: string[];
    }, {
        host: string;
        containerization: string;
        steps: string[];
    }>;
    placementArtifacts: z.ZodObject<{
        resumeBullets: z.ZodArray<z.ZodString, "many">;
        interviewQuestions: z.ZodArray<z.ZodObject<{
            question: z.ZodString;
            answerHint: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            question: string;
            answerHint: string;
        }, {
            question: string;
            answerHint: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        resumeBullets: string[];
        interviewQuestions: {
            question: string;
            answerHint: string;
        }[];
    }, {
        resumeBullets: string[];
        interviewQuestions: {
            question: string;
            answerHint: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    domain: string;
    difficulty: string;
    duration: string;
    title: string;
    id: string;
    tagline: string;
    resumeScore: number;
    placementScore: number;
    innovationScore: number;
    techStack: string[];
    problemStatement: {
        overview: string;
        targetAudience: string;
        userPersonas: string[];
    };
    systemArchitecture: {
        narrative: string;
        dataFlow: string;
        diagram?: string | undefined;
    };
    features: {
        advanced: string[];
        core: string[];
    };
    databaseApiSpecification: {
        tables: {
            name: string;
            columns: string[];
            description: string;
        }[];
        endpoints: {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }[];
    };
    directoryStructure: string;
    roadmap: {
        phase: string;
        title: string;
        tasks: string[];
    }[];
    deploymentCiCd: {
        host: string;
        containerization: string;
        steps: string[];
    };
    placementArtifacts: {
        resumeBullets: string[];
        interviewQuestions: {
            question: string;
            answerHint: string;
        }[];
    };
}, {
    domain: string;
    difficulty: string;
    duration: string;
    title: string;
    id: string;
    tagline: string;
    resumeScore: number;
    placementScore: number;
    innovationScore: number;
    techStack: string[];
    problemStatement: {
        overview: string;
        targetAudience: string;
        userPersonas: string[];
    };
    systemArchitecture: {
        narrative: string;
        dataFlow: string;
        diagram?: string | undefined;
    };
    features: {
        advanced: string[];
        core: string[];
    };
    databaseApiSpecification: {
        tables: {
            name: string;
            columns: string[];
            description: string;
        }[];
        endpoints: {
            path: string;
            description: string;
            method: string;
            responseBody: string;
            requestBody?: string | undefined;
        }[];
    };
    directoryStructure: string;
    roadmap: {
        phase: string;
        title: string;
        tasks: string[];
    }[];
    deploymentCiCd: {
        host: string;
        containerization: string;
        steps: string[];
    };
    placementArtifacts: {
        resumeBullets: string[];
        interviewQuestions: {
            question: string;
            answerHint: string;
        }[];
    };
}>;
export declare const ProjectGenerationResponseSchema: z.ZodObject<{
    projects: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        tagline: z.ZodString;
        resumeScore: z.ZodNumber;
        placementScore: z.ZodNumber;
        innovationScore: z.ZodNumber;
        difficulty: z.ZodString;
        duration: z.ZodString;
        domain: z.ZodString;
        techStack: z.ZodArray<z.ZodString, "many">;
        problemStatement: z.ZodObject<{
            overview: z.ZodString;
            targetAudience: z.ZodString;
            userPersonas: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        }, {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        }>;
        systemArchitecture: z.ZodObject<{
            narrative: z.ZodString;
            dataFlow: z.ZodString;
            diagram: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        }, {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        }>;
        features: z.ZodObject<{
            core: z.ZodArray<z.ZodString, "many">;
            advanced: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            advanced: string[];
            core: string[];
        }, {
            advanced: string[];
            core: string[];
        }>;
        databaseApiSpecification: z.ZodObject<{
            tables: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                columns: z.ZodArray<z.ZodString, "many">;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                columns: string[];
                description: string;
            }, {
                name: string;
                columns: string[];
                description: string;
            }>, "many">;
            endpoints: z.ZodArray<z.ZodObject<{
                method: z.ZodString;
                path: z.ZodString;
                requestBody: z.ZodOptional<z.ZodString>;
                responseBody: z.ZodString;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }, {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        }, {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        }>;
        directoryStructure: z.ZodString;
        roadmap: z.ZodArray<z.ZodObject<{
            phase: z.ZodString;
            title: z.ZodString;
            tasks: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            phase: string;
            title: string;
            tasks: string[];
        }, {
            phase: string;
            title: string;
            tasks: string[];
        }>, "many">;
        deploymentCiCd: z.ZodObject<{
            host: z.ZodString;
            containerization: z.ZodString;
            steps: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            host: string;
            containerization: string;
            steps: string[];
        }, {
            host: string;
            containerization: string;
            steps: string[];
        }>;
        placementArtifacts: z.ZodObject<{
            resumeBullets: z.ZodArray<z.ZodString, "many">;
            interviewQuestions: z.ZodArray<z.ZodObject<{
                question: z.ZodString;
                answerHint: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                question: string;
                answerHint: string;
            }, {
                question: string;
                answerHint: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        }, {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        domain: string;
        difficulty: string;
        duration: string;
        title: string;
        id: string;
        tagline: string;
        resumeScore: number;
        placementScore: number;
        innovationScore: number;
        techStack: string[];
        problemStatement: {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        };
        systemArchitecture: {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        };
        features: {
            advanced: string[];
            core: string[];
        };
        databaseApiSpecification: {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        };
        directoryStructure: string;
        roadmap: {
            phase: string;
            title: string;
            tasks: string[];
        }[];
        deploymentCiCd: {
            host: string;
            containerization: string;
            steps: string[];
        };
        placementArtifacts: {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        };
    }, {
        domain: string;
        difficulty: string;
        duration: string;
        title: string;
        id: string;
        tagline: string;
        resumeScore: number;
        placementScore: number;
        innovationScore: number;
        techStack: string[];
        problemStatement: {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        };
        systemArchitecture: {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        };
        features: {
            advanced: string[];
            core: string[];
        };
        databaseApiSpecification: {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        };
        directoryStructure: string;
        roadmap: {
            phase: string;
            title: string;
            tasks: string[];
        }[];
        deploymentCiCd: {
            host: string;
            containerization: string;
            steps: string[];
        };
        placementArtifacts: {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        };
    }>, "many">;
    activeProvider: z.ZodString;
    selectedModel: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projects: {
        domain: string;
        difficulty: string;
        duration: string;
        title: string;
        id: string;
        tagline: string;
        resumeScore: number;
        placementScore: number;
        innovationScore: number;
        techStack: string[];
        problemStatement: {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        };
        systemArchitecture: {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        };
        features: {
            advanced: string[];
            core: string[];
        };
        databaseApiSpecification: {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        };
        directoryStructure: string;
        roadmap: {
            phase: string;
            title: string;
            tasks: string[];
        }[];
        deploymentCiCd: {
            host: string;
            containerization: string;
            steps: string[];
        };
        placementArtifacts: {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        };
    }[];
    activeProvider: string;
    selectedModel: string;
}, {
    projects: {
        domain: string;
        difficulty: string;
        duration: string;
        title: string;
        id: string;
        tagline: string;
        resumeScore: number;
        placementScore: number;
        innovationScore: number;
        techStack: string[];
        problemStatement: {
            overview: string;
            targetAudience: string;
            userPersonas: string[];
        };
        systemArchitecture: {
            narrative: string;
            dataFlow: string;
            diagram?: string | undefined;
        };
        features: {
            advanced: string[];
            core: string[];
        };
        databaseApiSpecification: {
            tables: {
                name: string;
                columns: string[];
                description: string;
            }[];
            endpoints: {
                path: string;
                description: string;
                method: string;
                responseBody: string;
                requestBody?: string | undefined;
            }[];
        };
        directoryStructure: string;
        roadmap: {
            phase: string;
            title: string;
            tasks: string[];
        }[];
        deploymentCiCd: {
            host: string;
            containerization: string;
            steps: string[];
        };
        placementArtifacts: {
            resumeBullets: string[];
            interviewQuestions: {
                question: string;
                answerHint: string;
            }[];
        };
    }[];
    activeProvider: string;
    selectedModel: string;
}>;
export type TableSpec = z.infer<typeof TableSpecSchema>;
export type EndpointSpec = z.infer<typeof EndpointSpecSchema>;
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;
export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;
export type ProjectBlueprint = z.infer<typeof ProjectBlueprintSchema>;
export type ProjectGenerationResponse = z.infer<typeof ProjectGenerationResponseSchema>;
export interface ProviderHealthDetail {
    available: boolean;
    status: 'online' | 'offline' | 'error';
    models: string[];
    message?: string;
}
export interface SystemHealthResponse {
    providers: {
        ollama: ProviderHealthDetail;
        lmstudio: ProviderHealthDetail;
        huggingface: ProviderHealthDetail;
        groq: ProviderHealthDetail;
        template: ProviderHealthDetail;
    };
    activeProvider: 'ollama' | 'lmstudio' | 'huggingface' | 'groq' | 'template';
    selectedModel: string;
    timestamp: string;
}
