"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProjects = void 0;
const promptBuilder_service_1 = require("../services/promptBuilder.service");
const responseValidator_service_1 = require("../services/responseValidator.service");
const provider_manager_1 = require("../services/ai/provider.manager");
const generateProjects = async (req, res, next) => {
    try {
        const input = req.body;
        // 1. Assemble Prompts
        const systemPrompt = promptBuilder_service_1.promptBuilderService.buildSystemPrompt();
        const userPrompt = promptBuilder_service_1.promptBuilderService.buildUserPrompt(input);
        const promptCombined = `System:\n${systemPrompt}\n\nUser:\n${userPrompt}`;
        // 2. Formulate Candidate Providers Queue based on priority
        // Priority order: Ollama -> LM Studio -> Hugging Face -> Groq -> Template Engine
        const priorityNames = ['ollama', 'lmstudio', 'huggingface', 'groq', 'template'];
        // If providerOverride is provided, prioritize it
        const candidateNames = [...priorityNames];
        if (input.providerOverride) {
            const idx = candidateNames.indexOf(input.providerOverride);
            if (idx > -1) {
                candidateNames.splice(idx, 1);
            }
            candidateNames.unshift(input.providerOverride);
        }
        let validatedResponse = null;
        let selectedProviderUsed = null;
        const failures = {};
        // 3. Traversal loop with fallback policies
        for (const providerName of candidateNames) {
            const provider = await provider_manager_1.providerManager.getProvider(providerName);
            if (!provider)
                continue;
            try {
                const isAvail = await provider.isAvailable();
                if (!isAvail && providerName !== 'template') {
                    failures[providerName] = 'Provider offline during check';
                    continue;
                }
                console.log(JSON.stringify({
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId || 'unknown',
                    message: `Attempting generation via provider '${provider.name}'`
                }));
                // Execute generation with retry threshold (Retry once on validation/parsing failures)
                const executionFn = async () => {
                    return provider.generate(promptCombined, input.modelOverride);
                };
                const responseObj = await responseValidator_service_1.responseValidatorService.executeWithRetry(executionFn, 1 // Retry once on failure
                );
                // Success - capture response
                validatedResponse = responseObj;
                selectedProviderUsed = provider;
                break;
            }
            catch (err) {
                console.warn(JSON.stringify({
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId || 'unknown',
                    message: `Failed generation via provider '${providerName}'. Error: ${err.message}. Cascading fallback...`
                }));
                failures[providerName] = err.message;
            }
        }
        // 4. Guaranteed fallback check
        if (!validatedResponse || !selectedProviderUsed) {
            console.warn(JSON.stringify({
                timestamp: new Date().toISOString(),
                requestId: req.requestId || 'unknown',
                message: 'All priority providers failed. Reverting to static template fallback.'
            }));
            const fallbackProvider = (await provider_manager_1.providerManager.getProvider('template'));
            const raw = await fallbackProvider.generate(promptCombined, input.modelOverride);
            validatedResponse = responseValidator_service_1.responseValidatorService.validateResponse(raw);
            selectedProviderUsed = fallbackProvider;
        }
        // Embed current provider tracing context
        validatedResponse.activeProvider = selectedProviderUsed.name;
        const health = await selectedProviderUsed.getHealth();
        validatedResponse.selectedModel = input.modelOverride || health.models[0] || 'default';
        // 5. Respond using standard envelope
        res.status(200).json({
            success: true,
            message: 'Project recommendations generated successfully',
            data: validatedResponse,
            meta: {
                requestId: req.requestId || 'unknown',
                timestamp: new Date().toISOString(),
                failures: Object.keys(failures).length > 0 ? failures : undefined
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.generateProjects = generateProjects;
