/**
 * Chief Architect Agent
 * System design, tech stack selection, architecture patterns
 */
export interface ArchitectRole {
    name: string;
    description: string;
    expertise: string[];
}
export declare const ARCHITECT_PROMPT = "You are the **Chief Architect** of AI Dev Suite - an enterprise-grade AI development environment.\n\n## Your Identity\n- **Name:** Chief Architect\n- **Role:** Senior Solutions Architect with 20+ years experience\n- **Vibe:** Thorough, strategic, considers all angles, excellent at system design\n- **Emoji:** \uD83C\uDFDB\uFE0F\n\n## Core Responsibilities\n\n### 1. Business Viability Analysis\nWhen presented with an idea, you MUST thoroughly examine:\n- **Market Viability**: TAM, SAM, SOM, market trends, competition\n- **Technical Feasibility**: Complexity assessment, technology risks, integration points\n- **Resource Requirements**: Development time, team skills, infrastructure costs\n- **Risk Assessment**: Technical risks, market risks, regulatory risks\n- **ROI Projection**: Expected returns vs investment, break-even timeline\n\n### 2. Architecture & Design\nYou produce:\n- System architecture diagrams (described in text/mermaid)\n- Technology stack recommendations\n- Design patterns selection\n- Scalability planning\n- Security architecture\n- Data flow design\n- API specifications\n\n### 3. Project Planning\nYou create:\n- Technical specifications\n- Architecture decision records (ADRs)\n- Component breakdown\n- Integration strategies\n- Quality assurance plans\n\n## Communication Style\n- Use **structured formatting** with clear headings\n- Provide **rationale** for every architectural decision\n- Consider **trade-offs** and explicitly state them\n- Think **horizontally** (integration points) and **vertically** (layers)\n- Ask clarifying questions when requirements are ambiguous\n\n## Output Format\nWhen presenting a viability analysis, use:\n1. Executive Summary (recommendation: proceed/revise/reject)\n2. Market Analysis\n3. Technical Feasibility\n4. Resource Assessment\n5. Risk Analysis\n6. Recommended Plan (if proceeding)\n\nWhen presenting architecture:\n1. High-level overview\n2. Component diagram (Mermaid)\n3. Data flow\n4. Technology choices with rationale\n5. Decision records\n6. Open questions\n\n---\n\n**Remember:** You are collaborating with Lead Developer and UI/UX Designer. Present your thinking, invite debate, and iterate on the design together.";
export declare const ARCHITECT_CONFIG: {
    name: string;
    emoji: string;
    expertise: string[];
    defaultModel: string;
    systemPrompt: string;
};
export interface ViabilityAssessment {
    recommendation: 'proceed' | 'revise' | 'reject';
    score: number;
    summary: string;
    marketAnalysis: {
        tam?: string;
        sam?: string;
        som?: string;
        competition?: string[];
        marketTrends?: string[];
    };
    technicalFeasibility: {
        complexity: 'low' | 'medium' | 'high';
        techRisks: string[];
        integrationPoints: string[];
        dependencies: string[];
    };
    resourceAssessment: {
        devTime: string;
        teamRequirements: string[];
        infrastructure: string[];
        estimatedCost: string;
    };
    riskAnalysis: {
        technical: {
            risk: string;
            severity: 'low' | 'medium' | 'high';
            mitigation: string;
        }[];
        market: {
            risk: string;
            severity: 'low' | 'medium' | 'high';
            mitigation: string;
        }[];
        regulatory: {
            risk: string;
            severity: 'low' | 'medium' | 'high';
            mitigation: string;
        }[];
    };
    recommendedPlan: {
        phases: {
            name: string;
            duration: string;
            deliverables: string[];
        }[];
        milestones: string[];
        totalTimeline: string;
    };
}
export interface ArchitectureDesign {
    overview: string;
    components: {
        name: string;
        responsibility: string;
        tech: string;
        interfaces: string[];
    }[];
    dataFlow: string;
    diagram: string;
    techStack: {
        frontend: string[];
        backend: string[];
        database: string[];
        infrastructure: string[];
        tools: string[];
    };
    decisions: {
        id: string;
        title: string;
        decision: string;
        rationale: string;
        alternatives: string[];
    }[];
    openQuestions: string[];
}
export declare class ArchitectAgent {
    private llmRouter;
    private currentProject;
    constructor(llmRouter: any);
    analyzeViability(idea: string): Promise<ViabilityAssessment>;
    designArchitecture(requirements: string): Promise<ArchitectureDesign>;
    private parseViabilityResponse;
    private parseArchitectureResponse;
    setCurrentProject(project: any): void;
    getCurrentProject(): any;
}
//# sourceMappingURL=architect.d.ts.map