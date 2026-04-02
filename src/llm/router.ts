/**
 * LLM Router Engine
 * Handles multiple LLM providers: OpenRouter, Ollama, Agent Router, and more
 */

import axios, { AxiosInstance } from 'axios';

export type LLMProvider = 
  | 'openrouter' 
  | 'ollama' 
  | 'agent-router' 
  | 'anthropic'
  | 'openai' 
  | 'google' 
  | 'mistral'
  | 'cohere'
  | 'deepseek'
  | 'qwen'
  | 'local-custom';

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

// Model registry with capabilities
const MODEL_REGISTRY: Record<string, ProviderCapabilities> = {
  // Anthropic models
  'claude-3-5-sonnet': {
    supportsStreaming: true,
    supportsVision: true,
    maxContext: 200000,
    supportsFunctionCalling: true,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015
  },
  'claude-3-opus': {
    supportsStreaming: true,
    supportsVision: true,
    maxContext: 200000,
    supportsFunctionCalling: true,
    costPer1kInput: 0.015,
    costPer1kOutput: 0.075
  },
  // DeepSeek models
  'deepseek-coder-v2': {
    supportsStreaming: true,
    supportsVision: false,
    maxContext: 128000,
    supportsFunctionCalling: false,
    costPer1kInput: 0.00014,
    costPer1kOutput: 0.00028
  },
  // Google models
  'gemini-pro-1.5': {
    supportsStreaming: true,
    supportsVision: true,
    maxContext: 2000000,
    supportsFunctionCalling: true,
    costPer1kInput: 0.00125,
    costPer1kOutput: 0.005
  },
  'gemini-pro-1.5-flash': {
    supportsStreaming: true,
    supportsVision: true,
    maxContext: 1000000,
    supportsFunctionCalling: true,
    costPer1kInput: 0.000075,
    costPer1kOutput: 0.0003
  },
  // Ollama models
  'llama3.3': {
    supportsStreaming: true,
    supportsVision: false,
    maxContext: 128000,
    supportsFunctionCalling: false,
    costPer1kInput: 0,
    costPer1kOutput: 0
  },
  'llama3': {
    supportsStreaming: true,
    supportsVision: false,
    maxContext: 8192,
    supportsFunctionCalling: false,
    costPer1kInput: 0,
    costPer1kOutput: 0
  },
  'codellama': {
    supportsStreaming: true,
    supportsVision: false,
    maxContext: 16384,
    supportsFunctionCalling: false,
    costPer1kInput: 0,
    costPer1kOutput: 0
  },
  'qwen2.5-coder': {
    supportsStreaming: true,
    supportsVision: false,
    maxContext: 32768,
    supportsFunctionCalling: false,
    costPer1kInput: 0,
    costPer1kOutput: 0
  }
};

export class LLMRouter {
  private providers: Map<LLMProvider, AxiosInstance> = new Map();
  private config: Record<string, any> = {};
  private fallbackChain: LLMProvider[] = [];
  private maxRetries: number = 3;

  constructor(config: Record<string, any>) {
    this.config = config;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // OpenRouter
    if (config.openrouter?.enabled && config.openrouter.apiKey) {
      this.providers.set('openrouter', axios.create({
        baseURL: 'https://openrouter.ai/api/v1',
        headers: {
          'Authorization': `Bearer ${config.openrouter.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://marketplace.visualstudio.com/ai-dev-suite',
          'X-Title': 'AI Dev Suite'
        }
      }));
    }

    // Ollama
    if (config.ollama?.enabled) {
      this.providers.set('ollama', axios.create({
        baseURL: config.ollama.endpoint || 'http://localhost:11434',
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    // Agent Router
    if (config['agent-router']?.enabled && config['agent-router'].apiKey) {
      this.providers.set('agent-router', axios.create({
        baseURL: config['agent-router'].endpoint || 'https://api.agent-router.com/v1',
        headers: {
          'Authorization': `Bearer ${config['agent-router'].apiKey}`,
          'Content-Type': 'application/json'
        }
      }));
    }

    // OpenAI
    if (config.openai?.enabled && config.openai.apiKey) {
      this.providers.set('openai', axios.create({
        baseURL: 'https://api.openai.com/v1',
        headers: {
          'Authorization': `Bearer ${config.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      }));
    }

    // Anthropic
    if (config.anthropic?.enabled && config.anthropic.apiKey) {
      this.providers.set('anthropic', axios.create({
        baseURL: 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': config.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }));
    }

    // Google
    if (config.google?.enabled && config.google.apiKey) {
      this.providers.set('google', axios.create({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    // Build fallback chain
    this.fallbackChain = this.providers.keys().next().value 
      ? Array.from(this.providers.keys()) 
      : ['ollama', 'openrouter'];
  }

  async complete(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    llmConfig: LLMConfig
  ): Promise<LLMResponse> {
    const { provider, model, temperature = 0.7, maxTokens = 4096, stream = false } = llmConfig;
    
    let lastError: Error | null = null;

    for (const providerName of this.getProviderChain(provider)) {
      const axiosInstance = this.providers.get(providerName);
      if (!axiosInstance) continue;

      try {
        const response = await this.callProvider(
          axiosInstance, 
          providerName, 
          messages, 
          { model, temperature, maxTokens, stream }
        );
        
        if (response) {
          return this.normalizeResponse(response, providerName, model);
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`Provider ${providerName} failed:`, error);
        continue;
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message}`);
  }

  async *streamComplete(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    llmConfig: LLMConfig
  ): AsyncGenerator<StreamChunk> {
    const { provider, model, temperature = 0.7, maxTokens = 4096 } = llmConfig;
    
    const axiosInstance = this.providers.get(provider);
    if (!axiosInstance) {
      throw new Error(`Provider ${provider} not configured`);
    }

    const response = await this.callProvider(
      axiosInstance,
      provider,
      messages,
      { model, temperature, maxTokens, stream: true }
    );

    for await (const chunk of this.normalizeStreamResponse(response, provider)) {
      yield chunk;
    }
  }

  private getProviderChain(preferred: LLMProvider): LLMProvider[] {
    const chain = [preferred];
    for (const p of this.fallbackChain) {
      if (p !== preferred) chain.push(p);
    }
    return chain;
  }

  private async callProvider(
    client: AxiosInstance,
    provider: LLMProvider,
    messages: any[],
    options: any
  ): Promise<any> {
    switch (provider) {
      case 'openrouter':
        return client.post('/chat/completions', {
          model: options.model,
          messages,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: options.stream
        });

      case 'ollama':
        return client.post('/api/chat', {
          model: options.model,
          messages,
          temperature: options.temperature,
          stream: options.stream,
          options: {
            num_predict: options.maxTokens
          }
        });

      case 'anthropic':
        const anthropicMessages = messages.filter(m => m.role !== 'system');
        const systemMsg = messages.find(m => m.role === 'system');
        return client.post('/messages', {
          model: options.model,
          messages: anthropicMessages,
          system: systemMsg?.content,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: options.stream
        });

      case 'openai':
        return client.post('/chat/completions', {
          model: options.model,
          messages,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: options.stream
        });

      case 'google':
        // Google uses different format
        const contents = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
        return client.post(`/models/${options.model}:streamGenerateContent?key=${this.config.google?.apiKey}`, {
          contents,
          generationConfig: {
            temperature: options.temperature,
            maxOutputTokens: options.maxTokens
          },
          stream: options.stream
        });

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private normalizeResponse(response: any, provider: LLMProvider, model: string): LLMResponse {
    switch (provider) {
      case 'openrouter':
      case 'openai':
        return {
          id: response.data.id,
          model: response.data.model,
          content: response.data.choices[0]?.message?.content || '',
          usage: response.data.usage,
          finishReason: response.data.choices[0]?.finish_reason || 'stop'
        };

      case 'ollama':
        return {
          id: `ollama-${Date.now()}`,
          model: model,
          content: response.data.message?.content || '',
          finishReason: response.data.done ? 'stop' : 'length'
        };

      case 'anthropic':
        return {
          id: response.data.id,
          model: response.data.model,
          content: response.data.content[0]?.text || '',
          usage: response.data.usage,
          finishReason: response.data.stop_reason || 'stop'
        };

      default:
        return {
          id: `unknown-${Date.now()}`,
          model: model,
          content: JSON.stringify(response),
          finishReason: 'stop'
        };
    }
  }

  private async *normalizeStreamResponse(response: any, provider: LLMProvider): AsyncGenerator<StreamChunk> {
    // Implementation for streaming response normalization
    // Would need to handle different provider's streaming formats
  }

  getModelCapabilities(model: string): ProviderCapabilities | undefined {
    // Extract base model name from full model ID
    const baseModel = model.split('/').pop() || model;
    return MODEL_REGISTRY[baseModel] || MODEL_REGISTRY[model];
  }

  listAvailableModels(): { provider: LLMProvider; models: string[] }[] {
    const models: { provider: LLMProvider; models: string[] }[] = [];
    
    if (this.providers.has('openrouter')) {
      models.push({
        provider: 'openrouter',
        models: [
          'anthropic/claude-3.5-sonnet',
          'anthropic/claude-3-opus',
          'deepseek/deepseek-coder-v2',
          'google/gemini-pro-1.5',
          'google/gemini-pro-1.5-flash',
          'meta-llama/llama-3.1-70b-instruct',
          'mistralai/mistral-7b-instruct'
        ]
      });
    }

    if (this.providers.has('ollama')) {
      models.push({
        provider: 'ollama',
        models: ['llama3.3', 'llama3', 'codellama', 'qwen2.5-coder', 'phi3', 'mistral']
      });
    }

    return models;
  }
}

export function createLLMRouter(config: Record<string, any>): LLMRouter {
  return new LLMRouter(config);
}