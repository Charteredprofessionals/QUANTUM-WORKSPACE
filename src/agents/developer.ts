/**
 * Lead Developer Agent
 * Implementation, code generation, refactoring, debugging
 */

export const DEVELOPER_PROMPT = `You are the **Lead Developer** of AI Dev Suite - an enterprise-grade AI development environment.

## Your Identity
- **Name:** Lead Developer
- **Role:** Senior Full-Stack Developer with 15+ years experience
- **Vibe:** Pragmatic, clean-code advocate,注重细节, excellent debugging skills
- **Emoji:** 💻

## Core Responsibilities

### 1. Implementation
You transform designs and specifications into working code:
- Write clean, maintainable, testable code
- Follow project coding standards and patterns
- Implement APIs, services, components
- Handle edge cases and error states
- Write comprehensive unit and integration tests

### 2. Code Review & Refactoring
- Review code for quality, security, performance
- Identify technical debt and propose improvements
- Refactor for clarity and maintainability
- Optimize performance bottlenecks

### 3. Debugging & Problem Solving
- Investigate and resolve bugs efficiently
- Diagnose performance issues
- Handle production incidents
- Provide RCA (Root Cause Analysis)

### 4. Technical Guidance
- Mentor on best practices
- Explain complex concepts
- Suggest improvements to architecture
- Document implementation decisions

## Communication Style
- Provide **working code** with proper imports and structure
- Include **comments** explaining complex logic
- Show **examples** of usage
- Explain **trade-offs** in implementation choices
- Suggest **testing strategies**

## Output Format
When writing code:
1. Brief explanation of approach
2. Full code implementation
3. Usage examples (if applicable)
4. Testing approach

When reviewing code:
1. Overall assessment
2. Specific findings (issues + suggestions)
3. Security considerations
4. Performance notes

---

**Remember:** You collaborate with Chief Architect on design decisions and Designer on implementation details. Ask clarifying questions when specs are unclear.`;

// Agent configuration
export const DEVELOPER_CONFIG = {
  name: 'Lead Developer',
  emoji: '💻',
  expertise: [
    'Full-Stack Development',
    'TypeScript/JavaScript',
    'Python/Go/Rust',
    'React/Vue/Angular',
    'Node.js/Python/Go',
    'PostgreSQL/MongoDB/Redis',
    'REST/GraphQL APIs',
    'Testing/TDD',
    'DevOps/CI/CD',
    'Security Best Practices'
  ],
  defaultModel: 'deepseek/deepseek-coder-v2',
  systemPrompt: DEVELOPER_PROMPT
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

// Helper functions for the Developer agent
export class DeveloperAgent {
  private llmRouter: any;
  private currentProject: any = null;
  private implementationTasks: ImplementationTask[] = [];

  constructor(llmRouter: any) {
    this.llmRouter = llmRouter;
  }

  async generateCode(specification: string, context?: any): Promise<string> {
    const messages = [
      { role: 'system', content: DEVELOPER_PROMPT },
      { role: 'user', content: `Generate implementation code based on this specification:\n\n${specification}\n\nContext: ${JSON.stringify(context || {})}\n\nProvide clean, production-ready code with proper structure, error handling, and comments.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'deepseek/deepseek-coder-v2',
      temperature: 0.3,
      maxTokens: 8000
    });

    return response.content;
  }

  async reviewCode(code: string, language?: string): Promise<CodeReview> {
    const messages = [
      { role: 'system', content: DEVELOPER_PROMPT },
      { role: 'user', content: `Review this code for quality, security, and best practices:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\nProvide a detailed code review with specific issues, suggestions, and overall assessment.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'deepseek/deepseek-coder-v2',
      temperature: 0.2,
      maxTokens: 6000
    });

    return this.parseCodeReviewResponse(response.content);
  }

  async refactorCode(code: string, goal: string): Promise<string> {
    const messages = [
      { role: 'system', content: DEVELOPER_PROMPT },
      { role: 'user', content: `Refactor this code to achieve: ${goal}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nProvide the refactored code with explanation of changes made.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'deepseek/deepseek-coder-v2',
      temperature: 0.3,
      maxTokens: 8000
    });

    return response.content;
  }

  async debug(error: string, code: string, stackTrace?: string): Promise<string> {
    const messages = [
      { role: 'system', content: DEVELOPER_PROMPT },
      { role: 'user', content: `Debug this issue:\n\nError: ${error}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\n${stackTrace ? `Stack Trace:\n\`\`\`\n${stackTrace}\n\`\`\`` : ''}\n\nProvide root cause analysis and solution.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'deepseek/deepseek-coder-v2',
      temperature: 0.2,
      maxTokens: 4000
    });

    return response.content;
  }

  async generateTests(code: string, framework?: string): Promise<string> {
    const messages = [
      { role: 'system', content: DEVELOPER_PROMPT },
      { role: 'user', content: `Generate unit tests for this code:\n\n\`\`\`\n${code}\n\`\`\`\n\nUse ${framework || 'appropriate'} testing framework. Include unit tests, edge cases, and mocking where appropriate.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'deepseek/deepseek-coder-v2',
      temperature: 0.3,
      maxTokens: 6000
    });

    return response.content;
  }

  private parseCodeReviewResponse(content: string): CodeReview {
    return {
      file: 'review',
      issues: [],
      suggestions: [],
      overallQuality: 'good',
      summary: content
    };
  }

  setCurrentProject(project: any): void {
    this.currentProject = project;
  }

  addTask(task: ImplementationTask): void {
    this.implementationTasks.push(task);
  }

  getTasks(): ImplementationTask[] {
    return this.implementationTasks;
  }

  updateTaskStatus(taskId: string, status: ImplementationTask['status']): void {
    const task = this.implementationTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
    }
  }
}