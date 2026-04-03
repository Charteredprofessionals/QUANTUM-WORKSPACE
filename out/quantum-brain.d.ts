/**
 * Quantum Brain - Unified AI Engine
 * Orchestrates: Context + Memory + Cache + Automation
 * The core efficiency engine for Quantum Workspace
 */
interface QuantumBrainConfig {
    enableIndexing: boolean;
    enableMemory: boolean;
    enableCaching: boolean;
    enableAutomation: boolean;
    localFirst: boolean;
}
interface EnhancedPrompt {
    prompt: string;
    context?: string;
    stream?: boolean;
    model?: string;
}
export declare class QuantumBrain {
    private indexer;
    private memory;
    private cache;
    private workflow;
    private config;
    private isInitialized;
    constructor();
    initialize(): Promise<void>;
    processPrompt(input: EnhancedPrompt): Promise<string>;
    private buildContext;
    private callLLM;
    private learnFromInteraction;
    quickAction(action: string): Promise<void>;
    getStatus(): object;
    updateConfig(partial: Partial<QuantumBrainConfig>): void;
}
export {};
//# sourceMappingURL=quantum-brain.d.ts.map