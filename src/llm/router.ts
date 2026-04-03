// Stub LLM Router - to be implemented
export interface LLMRouterConfig {
  openrouter?: { enabled: boolean; apiKey: string; defaultModel: string };
  ollama?: { enabled: boolean; endpoint: string; defaultModel: string };
}

export interface LLMResponse {
  content: string;
  model: string;
}

export class LLMRouter {
  private config: LLMRouterConfig;
  
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
}

export function createLLMRouter(config: LLMRouterConfig): LLMRouter {
  return new LLMRouter(config);
}