/**
 * LLM Router Engine
 * Handles multiple LLM providers: OpenRouter, Ollama, Agent Router, and more
 */
export type LLMProvider = 'openrouter' | 'ollama' | 'agent-router' | 'anthropic' | 'openai' | 'google' | 'mistral' | 'cohere' | 'deepseek' | 'qwen' | 'local-custom';
export interface LLMConfig {
    provider: LLMProvider;
    apiKey?: string;
    endpoint?: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    stream?: boolean;
}
export interface LLMResponse {
    id: string;
    model: string;
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: string;
}
export interface StreamChunk {
    id: string;
    delta: string;
    finishReason?: string;
}
export interface ProviderCapabilities {
    supportsStreaming: boolean;
    supportsVision: boolean;
    maxContext: number;
    supportsFunctionCalling: boolean;
    costPer1kInput?: number;
    costPer1kOutput?: number;
}
export declare class LLMRouter {
    private providers;
    private config;
    private fallbackChain;
    private maxRetries;
    constructor(config: Record<string, any>);
    private initializeProviders;
    complete(messages: {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }[], llmConfig: LLMConfig): Promise<LLMResponse>;
    streamComplete(messages: {
        role: 'system' | 'user' | 'assistant';
        content: string;
    }[], llmConfig: LLMConfig): AsyncGenerator<StreamChunk>;
    private getProviderChain;
    private callProvider;
    private normalizeResponse;
    private normalizeStreamResponse;
    getModelCapabilities(model: string): ProviderCapabilities | undefined;
    listAvailableModels(): {
        provider: LLMProvider;
        models: string[];
    }[];
}
export declare function createLLMRouter(config: Record<string, any>): LLMRouter;
//# sourceMappingURL=router.d.ts.map