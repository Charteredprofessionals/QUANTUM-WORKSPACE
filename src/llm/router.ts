// Stub LLM Router - to be implemented
export interface LLMRouterConfig {
  openrouter?: { enabled: boolean; apiKey: string; defaultModel: string };
  ollama?: { enabled: boolean; endpoint: string; defaultModel: string };
}

export interface LLMResponse {
  content: string;
  model: string;
}

export interface Project {
  id: string;
  description: string;
  name?: string;
  viability?: { score: number; recommendation?: string };
  currentPhase?: string;
}

export interface ViabilityReport {
  score: number;
  recommendation: string;
  details: string;
}

export class LLMRouter {
  private config: LLMRouterConfig;
  private currentProject: Project | null = null;
  private viabilityReport: ViabilityReport | null = null;
  private projectPlan: string = '';
  
  constructor(config: LLMRouterConfig) {
    this.config = config;
  }

  // Stub method - actual implementation pending
  async route(params: { prompt: string; systemPrompt?: string; type?: string }): Promise<LLMResponse> {
    return { content: 'LLM response placeholder', model: 'default' };
  }

  async complete(prompt: string): Promise<string> {
    return 'Completion placeholder';
  }

  getCurrentProject(): Project | null {
    return this.currentProject;
  }

  async runDesign(description: string): Promise<void> {
    // Stub - to be implemented
  }

  getDesignSpec(): string {
    return '# Design Specification\n\n(placeholder)';
  }

  async runTests(): Promise<void> {
    // Stub - to be implemented
  }

  async deploy(): Promise<void> {
    // Stub - to be implemented
  }

  // Orchestrator stubs
  async startProject(idea: string): Promise<Project> {
    this.currentProject = {
      id: Date.now().toString(),
      description: idea,
      viability: { score: 75, recommendation: 'Proceed with planning' },
      currentPhase: 'viability'
    };
    this.viabilityReport = {
      score: 75,
      recommendation: 'Proceed with planning',
      details: `Analysis of: ${idea}`
    };
    return this.currentProject;
  }

  getViabilityReport(): string {
    return this.viabilityReport 
      ? `# Viability Report\n\nScore: ${this.viabilityReport.score}/100\n\n${this.viabilityReport.recommendation}\n\n${this.viabilityReport.details}`
      : '# No viability report';
  }

  async approveViability(approved: boolean): Promise<void> {
    if (approved && this.currentProject) {
      this.currentProject.currentPhase = 'planning';
    }
  }

  async generatePlan(): Promise<void> {
    this.projectPlan = '# Project Plan\n\n(placeholder)';
  }

  getProjectPlan(): string {
    return this.projectPlan;
  }
}

export function createLLMRouter(config: LLMRouterConfig): LLMRouter {
  return new LLMRouter(config);
}