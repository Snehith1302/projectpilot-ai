import { z } from 'zod';
// ==========================================
// Zod Schemas for Request Validation
// ==========================================
export const CareerGoalSchema = z.enum([
    'sde_1',
    'aiml_engineer',
    'full_stack',
    'devops_cloud'
]);
export const TechnicalDomainSchema = z.enum([
    'ai_rag',
    'dev_tools',
    'distributed_systems',
    'saas',
    'automation'
]);
export const DifficultyLevelSchema = z.enum([
    'intermediate',
    'advanced',
    'production_enterprise'
]);
export const EstimatedDurationSchema = z.enum([
    '1_week',
    '2_4_weeks',
    '1_2_months'
]);
export const TeamConfigSchema = z.enum([
    'solo',
    'team'
]);
export const ProjectGenerationInputSchema = z.object({
    fullName: z.string().min(1, 'Name is required').max(100),
    skills: z.array(z.string()).min(1, 'At least one skill is required'),
    frameworks: z.array(z.string()).min(1, 'At least one framework is required'),
    careerGoal: CareerGoalSchema,
    domain: TechnicalDomainSchema,
    difficulty: DifficultyLevelSchema,
    duration: EstimatedDurationSchema,
    teamConfig: TeamConfigSchema,
    providerOverride: z.string().optional(),
    modelOverride: z.string().optional()
});
// ==========================================
// Zod Schema for Project Blueprint Output
// ==========================================
export const TableSpecSchema = z.object({
    name: z.string(),
    columns: z.array(z.string()),
    description: z.string()
});
export const EndpointSpecSchema = z.object({
    method: z.string(),
    path: z.string(),
    requestBody: z.string().optional(),
    responseBody: z.string(),
    description: z.string()
});
export const RoadmapPhaseSchema = z.object({
    phase: z.string(),
    title: z.string(),
    tasks: z.array(z.string())
});
export const InterviewQuestionSchema = z.object({
    question: z.string(),
    answerHint: z.string()
});
export const ProjectBlueprintSchema = z.object({
    id: z.string(),
    title: z.string(),
    tagline: z.string(),
    resumeScore: z.number().min(0).max(100),
    placementScore: z.number().min(0).max(100),
    innovationScore: z.number().min(0).max(100),
    difficulty: z.string(),
    duration: z.string(),
    domain: z.string(),
    techStack: z.array(z.string()),
    problemStatement: z.object({
        overview: z.string(),
        targetAudience: z.string(),
        userPersonas: z.array(z.string())
    }),
    systemArchitecture: z.object({
        narrative: z.string(),
        dataFlow: z.string(),
        diagram: z.string().optional()
    }),
    features: z.object({
        core: z.array(z.string()),
        advanced: z.array(z.string())
    }),
    databaseApiSpecification: z.object({
        tables: z.array(TableSpecSchema),
        endpoints: z.array(EndpointSpecSchema)
    }),
    directoryStructure: z.string(),
    roadmap: z.array(RoadmapPhaseSchema),
    deploymentCiCd: z.object({
        host: z.string(),
        containerization: z.string(),
        steps: z.array(z.string())
    }),
    placementArtifacts: z.object({
        resumeBullets: z.array(z.string()),
        interviewQuestions: z.array(InterviewQuestionSchema)
    })
});
// A collection of exactly 5 recommendations returned in the response
export const ProjectGenerationResponseSchema = z.object({
    projects: z.array(ProjectBlueprintSchema).length(5),
    activeProvider: z.string(),
    selectedModel: z.string()
});
