/**
 * Smart Memory - Session & Project Memory
 * Remembers decisions, patterns, preferences across sessions
 */
interface MemoryEntry {
    id: string;
    type: 'preference' | 'pattern' | 'decision' | 'context';
    key: string;
    value: any;
    timestamp: number;
    context?: string;
}
export declare class SmartMemory {
    private memory;
    private memoryPath;
    constructor();
    private loadMemory;
    private initMemory;
    private saveMemory;
    setPreference(key: string, value: any): void;
    getPreference(key: string): any | undefined;
    rememberDecision(decision: string, context: string): void;
    rememberPattern(pattern: string, details: string): void;
    addContext(context: string, data: any): void;
    private addEntry;
    getRecentDecisions(limit?: number): MemoryEntry[];
    getPatterns(): MemoryEntry[];
    getContextForPrompt(): string;
    learnFromCode(): Promise<void>;
    clear(): void;
}
export {};
//# sourceMappingURL=smart-memory.d.ts.map