"use strict";
/**
 * Chief Architect Agent
 * System design, tech stack selection, architecture patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectAgent = exports.ARCHITECT_CONFIG = exports.ARCHITECT_PROMPT = void 0;
exports.ARCHITECT_PROMPT = `You are the **Chief Architect** of AI Dev Suite - an enterprise-grade AI development environment.

## Your Identity
- **Name:** Chief Architect
- **Role:** Senior Solutions Architect with 20+ years experience
- **Vibe:** Thorough, strategic, considers all angles, excellent at system design
- **Emoji:** 🏛️

## Core Responsibilities

### 1. Business Viability Analysis
When presented with an idea, you MUST thoroughly examine:
- **Market Viability**: TAM, SAM, SOM, market trends, competition
- **Technical Feasibility**: Complexity assessment, technology risks, integration points
- **Resource Requirements**: Development time, team skills, infrastructure costs
- **Risk Assessment**: Technical risks, market risks, regulatory risks
- **ROI Projection**: Expected returns vs investment, break-even timeline

### 2. Architecture & Design
You produce:
- System architecture diagrams (described in text/mermaid)
- Technology stack recommendations
- Design patterns selection
- Scalability planning
- Security architecture
- Data flow design
- API specifications

### 3. Project Planning
You create:
- Technical specifications
- Architecture decision records (ADRs)
- Component breakdown
- Integration strategies
- Quality assurance plans

## Communication Style
- Use **structured formatting** with clear headings
- Provide **rationale** for every architectural decision
- Consider **trade-offs** and explicitly state them
- Think **horizontally** (integration points) and **vertically** (layers)
- Ask clarifying questions when requirements are ambiguous

## Output Format
When presenting a viability analysis, use:
1. Executive Summary (recommendation: proceed/revise/reject)
2. Market Analysis
3. Technical Feasibility
4. Resource Assessment
5. Risk Analysis
6. Recommended Plan (if proceeding)

When presenting architecture:
1. High-level overview
2. Component diagram (Mermaid)
3. Data flow
4. Technology choices with rationale
5. Decision records
6. Open questions

---

**Remember:** You are collaborating with Lead Developer and UI/UX Designer. Present your thinking, invite debate, and iterate on the design together.`;
// Agent configuration
exports.ARCHITECT_CONFIG = {
    name: 'Chief Architect',
    emoji: '🏛️',
    expertise: [
        'System Architecture',
        'Technology Selection',
        'Design Patterns',
        'Scalability Planning',
        'Security Architecture',
        'API Design',
        'Data Modeling',
        'Cloud Infrastructure',
        'DevOps Strategy',
        'Risk Assessment'
    ],
    defaultModel: 'anthropic/claude-3.5-sonnet',
    systemPrompt: exports.ARCHITECT_PROMPT
};
// Helper functions for the Architect agent
class ArchitectAgent {
    constructor(llmRouter) {
        this.currentProject = null;
        this.llmRouter = llmRouter;
    }
    async analyzeViability(idea) {
        const messages = [
            { role: 'system', content: exports.ARCHITECT_PROMPT },
            { role: 'user', content: `Analyze the business and technical viability of this project idea:\n\n${idea}\n\nProvide a comprehensive viability assessment with your recommendation (proceed/revise/reject), score (0-100), and detailed analysis across all dimensions.` }
        ];
        const response = await this.llmRouter.complete(messages, {
            provider: 'openrouter',
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.4,
            maxTokens: 8000
        });
        // Parse and return structured assessment
        // In production, this would parse the LLM response into the ViabilityAssessment schema
        return this.parseViabilityResponse(response.content);
    }
    async designArchitecture(requirements) {
        const messages = [
            { role: 'system', content: exports.ARCHITECT_PROMPT },
            { role: 'user', content: `Design the system architecture for this project based on the following requirements:\n\n${requirements}\n\nProvide a complete architecture design including components, data flow, tech stack recommendations, and key architecture decisions.` }
        ];
        const response = await this.llmRouter.complete(messages, {
            provider: 'openrouter',
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.3,
            maxTokens: 12000
        });
        return this.parseArchitectureResponse(response.content);
    }
    parseViabilityResponse(content) {
        // In implementation, this would parse LLM output into structured format
        // For now, returning a template that would be populated from LLM response
        return {
            recommendation: 'proceed',
            score: 75,
            summary: 'Assessment pending detailed analysis',
            marketAnalysis: {
                tam: 'To be determined',
                sam: 'To be determined',
                som: 'To be determined'
            },
            technicalFeasibility: {
                complexity: 'medium',
                techRisks: [],
                integrationPoints: [],
                dependencies: []
            },
            resourceAssessment: {
                devTime: 'TBD',
                teamRequirements: [],
                infrastructure: [],
                estimatedCost: 'TBD'
            },
            riskAnalysis: {
                technical: [],
                market: [],
                regulatory: []
            },
            recommendedPlan: {
                phases: [],
                milestones: [],
                totalTimeline: 'TBD'
            }
        };
    }
    parseArchitectureResponse(content) {
        return {
            overview: 'Architecture design pending',
            components: [],
            dataFlow: '',
            diagram: '',
            techStack: {
                frontend: [],
                backend: [],
                database: [],
                infrastructure: [],
                tools: []
            },
            decisions: [],
            openQuestions: []
        };
    }
    setCurrentProject(project) {
        this.currentProject = project;
    }
    getCurrentProject() {
        return this.currentProject;
    }
}
exports.ArchitectAgent = ArchitectAgent;
