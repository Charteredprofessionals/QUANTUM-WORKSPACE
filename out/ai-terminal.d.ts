/**
 * AI Terminal - Smart Command Suggestions
 * Terminal with AI-powered auto-suggest and command completion
 */
import * as vscode from 'vscode';
import { SmartMemory } from './smart-memory';
interface CommandSuggestion {
    command: string;
    description: string;
    confidence: number;
    icon: string;
}
export declare class AITerminal {
    private terminals;
    private memory;
    private suggestionPanel;
    private currentSession;
    constructor(memory: SmartMemory);
    private setupTerminalEvents;
    private registerTerminal;
    createTerminal(): Promise<vscode.Terminal>;
    private monitorInput;
    getSuggestions(input: string): Promise<CommandSuggestion[]>;
    showSuggestions(input?: string): Promise<void>;
    private getSuggestionsHTML;
    private executeCommand;
    naturalLanguageToCommand(input: string): Promise<string>;
    executeWithAI(input: string): Promise<void>;
    addToHistory(cmd: string): void;
    getHistory(): string[];
    quickCommand(action: string): Promise<void>;
}
export {};
//# sourceMappingURL=ai-terminal.d.ts.map