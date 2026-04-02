/**
 * Chief Architect Agent
 * System design, tech stack selection, architecture patterns
 */

export interface ArchitectRole {
  name: string;
  description: string;
  expertise: string[];
}

export const ARCHITECT_PROMPT = `You are the **Chief Architect** of AI Dev Suite - an enterprise-grade AI development environment.

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
export const ARCHITECT_CONFIG = {
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
  systemPrompt: ARCHITECT_PROMPT
};

export interface ViabilityAssessment {
  recommendation: 'proceed' | 'revise' | 'reject';
  score: number; // 0-100
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
    technical: { risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }[];
    market: { risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }[];
    regulatory: { risk: string; severity: 'low' | 'medium' | 'high'; mitigation: string }[];
  };
  recommendedPlan: {
    phases: { name: string; duration: string; deliverables: string[] }[];
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
  diagram: string; // Mermaid syntax
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

// Helper functions for the Architect agent
export class ArchitectAgent {
  private llmRouter: any;
  private currentProject: any = null;

  constructor(llmRouter: any) {
    this.llmRouter = llmRouter;
  }

  async analyzeViability(idea: string): Promise<ViabilityAssessment> {
    const messages = [
      { role: 'system', content: ARCHITECT_PROMPT },
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

  async designArchitecture(requirements: string): Promise<ArchitectureDesign> {
    const messages = [
      { role: 'system', content: ARCHITECT_PROMPT },
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

  private parseViabilityResponse(content: string): ViabilityAssessment {
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

  private parseArchitectureResponse(content: string): ArchitectureDesign {
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

  setCurrentProject(project: any): void {
    this.currentProject = project;
  }

  getCurrentProject(): any {
    return this.currentProject;
  }
}