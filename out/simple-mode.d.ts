/**
 * Quantum Workspace - Simple Mode Handler
 * Non-technical user interface with goal-based commands
 */
import { LLMRouter } from './llm/router';
export type WorkspaceMode = 'simple' | 'developer';
export declare class SimpleModeHandler {
    private mode;
    private llmRouter;
    private panel;
    constructor(llmRouter: LLMRouter);
    setMode(mode: WorkspaceMode): void;
    getMode(): WorkspaceMode;
    private updateStatusBar;
    showSimpleMode(): Promise<void>;
    private handleGoalSelection;
    private getSimpleModeHTML;
    registerCommands(): void;
}
//# sourceMappingURL=simple-mode.d.ts.map