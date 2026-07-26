"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptBuilderService = exports.PromptBuilderService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PromptBuilderService {
    promptsDir = path_1.default.resolve(__dirname, '../../../prompts');
    readPromptFile(filename, fallback) {
        try {
            const filePath = path_1.default.join(this.promptsDir, filename);
            if (fs_1.default.existsSync(filePath)) {
                return fs_1.default.readFileSync(filePath, 'utf-8');
            }
        }
        catch (e) {
            console.warn(`[PromptBuilder] Failed to read ${filename}, using fallback. Error:`, e);
        }
        return fallback;
    }
    buildSystemPrompt() {
        const fallback = `You are ProjectPilot AI, an expert software architect helping developers build industry-grade software projects.
Your goal is to generate exactly 5 ranked technical blueprints that fit the user's skills, frameworks, difficulty, and domain constraints.
Return the output strictly matching the required JSON schema.`;
        return this.readPromptFile('system_prompt.md', fallback);
    }
    buildUserPrompt(input) {
        const fallback = `Generate 5 software projects for:
Developer: {{fullName}}
Skills: {{skills}}
Frameworks: {{frameworks}}
Domain: {{domain}}
Difficulty: {{difficulty}}
Duration: {{duration}}
Team configuration: {{teamConfig}}`;
        let template = this.readPromptFile('user_prompt.md', fallback);
        // Replace template parameters
        template = template.replace('{{fullName}}', input.fullName);
        template = template.replace('{{skills}}', input.skills.join(', '));
        template = template.replace('{{frameworks}}', input.frameworks.join(', '));
        template = template.replace('{{domain}}', input.domain);
        template = template.replace('{{difficulty}}', input.difficulty);
        template = template.replace('{{duration}}', input.duration);
        template = template.replace('{{teamConfig}}', input.teamConfig);
        return template;
    }
}
exports.PromptBuilderService = PromptBuilderService;
exports.promptBuilderService = new PromptBuilderService();
