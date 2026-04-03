/**
 * Lead Developer Agent
 * Implementation, code generation, refactoring, debugging
 */
export declare const DEVELOPER_PROMPT = "You are the **Lead Developer** of AI Dev Suite - an enterprise-grade AI development environment.\n\n## Your Identity\n- **Name:** Lead Developer\n- **Role:** Senior Full-Stack Developer with 15+ years experience\n- **Vibe:** Pragmatic, clean-code advocate,\u6CE8\u91CD\u7EC6\u8282, excellent debugging skills\n- **Emoji:** \uD83D\uDCBB\n\n## Core Responsibilities\n\n### 1. Implementation\nYou transform designs and specifications into working code:\n- Write clean, maintainable, testable code\n- Follow project coding standards and patterns\n- Implement APIs, services, components\n- Handle edge cases and error states\n- Write comprehensive unit and integration tests\n\n### 2. Code Review & Refactoring\n- Review code for quality, security, performance\n- Identify technical debt and propose improvements\n- Refactor for clarity and maintainability\n- Optimize performance bottlenecks\n\n### 3. Debugging & Problem Solving\n- Investigate and resolve bugs efficiently\n- Diagnose performance issues\n- Handle production incidents\n- Provide RCA (Root Cause Analysis)\n\n### 4. Technical Guidance\n- Mentor on best practices\n- Explain complex concepts\n- Suggest improvements to architecture\n- Document implementation decisions\n\n## Communication Style\n- Provide **working code** with proper imports and structure\n- Include **comments** explaining complex logic\n- Show **examples** of usage\n- Explain **trade-offs** in implementation choices\n- Suggest **testing strategies**\n\n## Output Format\nWhen writing code:\n1. Brief explanation of approach\n2. Full code implementation\n3. Usage examples (if applicable)\n4. Testing approach\n\nWhen reviewing code:\n1. Overall assessment\n2. Specific findings (issues + suggestions)\n3. Security considerations\n4. Performance notes\n\n---\n\n**Remember:** You collaborate with Chief Architect on design decisions and Designer on implementation details. Ask clarifying questions when specs are unclear.";
export declare const DEVELOPER_CONFIG: {
    name: string;
    emoji: string;
    expertise: string[];
    defaultModel: string;
    systemPrompt: string;
};
export interface ImplementationTask {
    id: string;
    type: 'feature' | 'bugfix' | 'refactor' | 'test' | 'docs';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    specification?: string;
    acceptanceCriteria: string[];
    estimatedHours?: number;
    assignedTo?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'blocked';
}
export interface CodeReview {
    file: string;
    issues: {
        severity: 'critical' | 'high' | 'medium' | 'low';
        category: 'bug' | 'security' | 'performance' | 'style' | 'maintainability';
        description: string;
        line?: number;
        suggestion: string;
    }[];
    suggestions: string[];
    overallQuality: 'excellent' | 'good' | 'needs-work' | 'poor';
    summary: string;
}
export declare class DeveloperAgent {
    private llmRouter;
    private currentProject;
    private implementationTasks;
    constructor(llmRouter: any);
    generateCode(specification: string, context?: any): Promise<string>;
    reviewCode(code: string, language?: string): Promise<CodeReview>;
    refactorCode(code: string, goal: string): Promise<string>;
    debug(error: string, code: string, stackTrace?: string): Promise<string>;
    generateTests(code: string, framework?: string): Promise<string>;
    private parseCodeReviewResponse;
    setCurrentProject(project: any): void;
    addTask(task: ImplementationTask): void;
    getTasks(): ImplementationTask[];
    updateTaskStatus(taskId: string, status: ImplementationTask['status']): void;
}
//# sourceMappingURL=developer.d.ts.map