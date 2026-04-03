/**
 * Auto-Workflow Engine - Automation
 * Anticipates next actions based on context and patterns
 */
import { SmartMemory } from './smart-memory';
interface ActionSuggestion {
    id: string;
    label: string;
    description: string;
    action: string;
    confidence: number;
    icon: string;
}
export declare class AutoWorkflow {
    private memory;
    private context;
    constructor(memory: SmartMemory);
    private setupListeners;
    private analyzeContext;
    private detectIntent;
    private showSuggestions;
    private suggestAction;
    getContextForLLM(): string;
    recordAction(action: string): void;
    getProactiveSuggestions(): Promise<ActionSuggestion[]>;
}
export {};
//# sourceMappingURL=auto-workflow.d.ts.map