/**
 * Workflow Orchestrator
 * Manages the complete software development lifecycle
 */
import { ViabilityAssessment, ArchitectureDesign } from './architect';
import { ImplementationTask, CodeReview } from './developer';
import { DesignSpec } from './designer';
import { LLMRouter } from '../llm/router';
export type ProjectPhase = 'idea' | 'viability' | 'planning' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
export interface ProjectContext {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    currentPhase: ProjectPhase;
    viability: ViabilityAssessment | null;
    architecture: ArchitectureDesign | null;
    design: DesignSpec | null;
    tasks: ImplementationTask[];
    documents: Map<string, string>;
    teamNotes: string[];
}
export interface WorkflowState {
    currentPhase: ProjectPhase;
    phaseHistory: {
        phase: ProjectPhase;
        timestamp: Date;
        notes: string;
    }[];
    pendingActions: string[];
    completedMilestones: string[];
    blockers: string[];
}
export declare class WorkflowOrchestrator {
    private architect;
    private developer;
    private designer;
    private currentProject;
    private eventHandlers;
    constructor(llmRouter: LLMRouter);
    /**
     * Start a new project from an idea
     * This is the entry point for the entire workflow
     */
    startProject(idea: string): Promise<ProjectContext>;
    /**
     * Run business and technical viability analysis
     */
    runViabilityAnalysis(idea: string): Promise<ProjectContext>;
    /**
     * Present the viability analysis to user for approval
     */
    getViabilityReport(): string;
    /**
     * User approves or rejects the viability
     */
    approveViability(approved: boolean, feedback?: string): Promise<ProjectContext>;
    /**
     * Generate comprehensive project plan and documentation
     */
    generatePlan(): Promise<ProjectContext>;
    /**
     * Get the project plan for user review
     */
    getProjectPlan(): string;
    /**
     * Generate UI/UX design specifications
     */
    runDesign(requirements?: string): Promise<ProjectContext>;
    /**
     * Get design specification for review
     */
    getDesignSpec(): string;
    /**
     * Start development phase
     */
    startDevelopment(): Promise<ProjectContext>;
    /**
     * Generate code for a feature
     */
    generateFeature(specification: string): Promise<string>;
    /**
     * Review code
     */
    reviewCode(code: string): Promise<CodeReview>;
    /**
     * Debug an issue
     */
    debug(error: string, code: string): Promise<string>;
    /**
     * Generate tests
     */
    generateTests(code: string, framework?: string): Promise<string>;
    /**
     * Run tests with agent analysis
     */
    runTests(): Promise<ProjectContext>;
    /**
     * Deploy the project
     */
    deploy(): Promise<ProjectContext>;
    /**
     * Enter maintenance mode
     */
    enterMaintenance(): Promise<ProjectContext>;
    getCurrentProject(): ProjectContext | null;
    getWorkflowState(): WorkflowState | null;
    getAgent(agent: 'architect' | 'developer' | 'designer'): any;
    on(event: string, handler: Function): void;
    private emit;
    private updatePhase;
    private extractProjectName;
    private getPendingActions;
    private getCompletedMilestones;
    private formatViabilityReport;
    private formatArchitectureDoc;
    private formatTechStack;
    private formatRoadmap;
    private formatDesignSpec;
}
//# sourceMappingURL=orchestrator.d.ts.map