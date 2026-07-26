import fs from 'fs';
import path from 'path';
import { AIProvider } from './provider.interface';
import { ProviderHealthDetail, ProjectBlueprint } from 'shared';
import { getMockGenerationResponse } from '../mock.service';

export class TemplateProvider implements AIProvider {
  name = 'template';
  private templatesDir = path.resolve(__dirname, '../../../../templates');

  async isAvailable(): Promise<boolean> {
    return true; // Static engine always online
  }

  async getHealth(): Promise<ProviderHealthDetail> {
    return {
      available: true,
      status: 'online',
      models: ['local-templates-v1.0']
    };
  }

  /**
   * Load templates from the local JSON files.
   * Resilient fallback included.
   */
  private loadAllTemplates(): ProjectBlueprint[] {
    const categories = ['ai_rag', 'dev_tools', 'distributed_systems', 'saas', 'automation'];
    const allBlueprints: ProjectBlueprint[] = [];

    for (const cat of categories) {
      try {
        const filePath = path.join(this.templatesDir, `${cat}.json`);
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8');
          const list = JSON.parse(raw) as ProjectBlueprint[];
          allBlueprints.push(...list);
        }
      } catch (e) {
        console.warn(`[TemplateProvider] Failed to load templates for category ${cat}:`, e);
      }
    }

    return allBlueprints;
  }

  /**
   * Ranks templates matching input criteria and returns the top 5 recommendations.
   */
  async generate(prompt: string, model?: string): Promise<string> {
    // Note: Since prompt is a pre-assembled string, in a real template-engine request,
    // we parse the profile variables from the calling context.
    // For safety, we parse parameters out of the prompt or fallback to standard lists.
    let input: any = {
      skills: ['TypeScript', 'Python', 'Go'],
      frameworks: ['React', 'Express', 'FastAPI'],
      domain: 'ai_rag',
      difficulty: 'advanced',
      careerGoal: 'full_stack'
    };

    try {
      // Simple parser matching regex values from compiled prompt block
      const domainMatch = prompt.match(/Domain:\s*([a-z_]+)/i);
      const diffMatch = prompt.match(/Difficulty:\s*([a-z_]+)/i);
      const careerMatch = prompt.match(/Career:\s*([a-z0-9_]+)/i) || prompt.match(/Goal:\s*([a-z0-9_]+)/i);
      const skillsMatch = prompt.match(/Skills:\s*([^\n]+)/i);
      const fwMatch = prompt.match(/Frameworks:\s*([^\n]+)/i);

      if (domainMatch) input.domain = domainMatch[1].trim();
      if (diffMatch) input.difficulty = diffMatch[1].trim();
      if (careerMatch) input.careerGoal = careerMatch[1].trim();
      if (skillsMatch) input.skills = skillsMatch[1].split(',').map(s => s.trim());
      if (fwMatch) input.frameworks = fwMatch[1].split(',').map(s => s.trim());
    } catch (e) {
      console.warn('[TemplateProvider] Failed to parse input variables out of prompt text, using defaults.', e);
    }

    const allBlueprints = this.loadAllTemplates();

    if (allBlueprints.length === 0) {
      // In case template files are unreadable, fall back to mock service
      return JSON.stringify(getMockGenerationResponse(input));
    }

    // Advanced Ranking Algorithm
    const scored = allBlueprints.map(project => {
      let score = 0;

      // 1. Preferred Domain match (high priority weight)
      if (project.domain.toLowerCase() === input.domain.toLowerCase() || 
          (input.domain === 'ai_rag' && project.domain.includes('RAG')) ||
          (input.domain === 'dev_tools' && project.domain.includes('Tools')) ||
          (input.domain === 'distributed_systems' && project.domain.includes('Distributed')) ||
          (input.domain === 'saas' && project.domain.includes('SaaS')) ||
          (input.domain === 'automation' && project.domain.includes('Automation'))
      ) {
        score += 150;
      }

      // 2. Difficulty match
      if (project.difficulty.toLowerCase() === input.difficulty.toLowerCase() ||
          (input.difficulty === 'production_enterprise' && project.difficulty.toLowerCase().includes('production'))
      ) {
        score += 50;
      }

      // 3. Technical Skills matching
      const userTechStack = [...(input.skills || []), ...(input.frameworks || [])];
      project.techStack.forEach(tech => {
        const lowerTech = tech.toLowerCase();
        if (userTechStack.some(t => t.toLowerCase() === lowerTech)) {
          score += 15; // 15 points per matched tech stack element
        }
      });

      // 4. Career Goal affinity
      if (input.careerGoal === 'aiml_engineer' && project.domain.toLowerCase().includes('ai')) {
        score += 40;
      } else if (input.careerGoal === 'devops_cloud' && (project.domain.toLowerCase().includes('automation') || project.domain.toLowerCase().includes('devops'))) {
        score += 40;
      } else if (input.careerGoal === 'full_stack' && (project.domain.toLowerCase().includes('saas') || project.domain.toLowerCase().includes('tools'))) {
        score += 30;
      } else if (input.careerGoal === 'sde_1' && project.domain.toLowerCase().includes('distributed')) {
        score += 30;
      }

      return { project, score };
    });

    // Sort descending by score rating and pick top 5
    scored.sort((a, b) => b.score - a.score);
    const top5 = scored.slice(0, 5).map(x => x.project);

    // Return encapsulated response envelope
    return JSON.stringify({
      projects: top5,
      activeProvider: 'template',
      selectedModel: 'local-templates-v1.0'
    });
  }
}
