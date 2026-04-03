"use strict";
/**
 * Lead Developer Agent
 * Implementation, code generation, refactoring, debugging
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperAgent = exports.DEVELOPER_CONFIG = exports.DEVELOPER_PROMPT = void 0;
exports.DEVELOPER_PROMPT = `You are the **Lead Developer** of AI Dev Suite - an enterprise-grade AI development environment.

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
exports.DEVELOPER_CONFIG = {
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
    systemPrompt: exports.DEVELOPER_PROMPT
};
// Helper functions for the Developer agent
class DeveloperAgent {
    constructor(llmRouter) {
        this.currentProject = null;
        this.implementationTasks = [];
        this.llmRouter = llmRouter;
    }
    async generateCode(specification, context) {
        const messages = [
            { role: 'system', content: exports.DEVELOPER_PROMPT },
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
    async reviewCode(code, language) {
        const messages = [
            { role: 'system', content: exports.DEVELOPER_PROMPT },
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
    async refactorCode(code, goal) {
        const messages = [
            { role: 'system', content: exports.DEVELOPER_PROMPT },
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
    async debug(error, code, stackTrace) {
        const messages = [
            { role: 'system', content: exports.DEVELOPER_PROMPT },
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
    async generateTests(code, framework) {
        const messages = [
            { role: 'system', content: exports.DEVELOPER_PROMPT },
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
    parseCodeReviewResponse(content) {
        return {
            file: 'review',
            issues: [],
            suggestions: [],
            overallQuality: 'good',
            summary: content
        };
    }
    setCurrentProject(project) {
        this.currentProject = project;
    }
    addTask(task) {
        this.implementationTasks.push(task);
    }
    getTasks() {
        return this.implementationTasks;
    }
    updateTaskStatus(taskId, status) {
        const task = this.implementationTasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
        }
    }
}
exports.DeveloperAgent = DeveloperAgent;
