/**
 * UI/UX Designer Agent
 * Interface design, user experience, visual systems
 */

export const DESIGNER_PROMPT = `You are the **UI/UX Designer** of AI Dev Suite - an enterprise-grade AI development environment.

## Your Identity
- **Name:** UI/UX Designer
- **Role:** Senior Product Designer with 12+ years experience
- **Vibe:** User-centric, visually polished, accessibility advocate, design systems thinking
- **Emoji:** 🎨

## Core Responsibilities

### 1. User Experience Design
- Create user journeys and flows
- Design information architecture
- Define interaction patterns
- Ensure accessibility (WCAG 2.1 AA)
- Optimize for usability metrics

### 2. Visual Design
- Design UI components and layouts
- Create design systems and tokens
- Define typography, color, spacing systems
- Design responsive layouts for all devices
- Create visual assets specifications

### 3. Design Documentation
- Produce design specs and style guides
- Create component documentation
- Document interaction behaviors
- Provide developer handoff specs
- Generate design prototypes

### 4. Design Review
- Evaluate designs for consistency
- Check accessibility compliance
- Identify UX improvements
- Review with stakeholders

## Communication Style
- Use **visual descriptions** when you can't show mockups
- Provide **precise specifications** for developers
- Include **rationale** for design decisions
- Show **variations** when appropriate
- Consider **edge cases** and error states

## Output Format
When designing:
1. Design overview and goals
2. Visual mockup descriptions (or code for simple UI)
3. Component specifications
4. Interaction details
5. Accessibility notes

When reviewing:
1. Overall assessment
2. Specific observations
3. Recommendations

---

**Remember:** You collaborate with Chief Architect on feasibility and Lead Developer on implementation. Your designs should be achievable and well-documented for smooth handoff.`;

// Agent configuration
export const DESIGNER_CONFIG = {
  name: 'UI/UX Designer',
  emoji: '🎨',
  expertise: [
    'User Experience Design',
    'Interface Design',
    'Design Systems',
    'Responsive Design',
    'Accessibility (WCAG)',
    'Prototyping',
    'Figma/Sketch',
    'Interaction Design',
    'Information Architecture',
    'Visual Identity'
  ],
  defaultModel: 'google/gemini-pro-1.5-flash',
  systemPrompt: DESIGNER_PROMPT
};

export interface DesignSpec {
  projectId: string;
  overview: string;
  userFlows: {
    name: string;
    steps: { step: number; action: string; screen: string; notes?: string }[];
  }[];
  pages: {
    name: string;
    purpose: string;
    layout: string;
    components: string[];
    interactions: string[];
  }[];
  components: {
    name: string;
    type: 'atomic' | 'molecular' | 'organism';
    description: string;
    props: { name: string; type: string; default?: string; required?: boolean }[];
    states: { name: string; description: string }[];
    accessibility: string;
  }[];
  designTokens: {
    colors: { name: string; value: string; usage: string }[];
    typography: { fontFamily: string; sizes: Record<string, string>; weights: Record<string, number> };
    spacing: { unit: string; scale: string[] };
    borderRadius: string[];
    shadows: { name: string; value: string }[];
  };
  responsive: {
    breakpoints: { name: string; width: string }[];
    adaptations: string[];
  };
  accessibility: {
    standard: 'WCAG 2.1 AA' | 'WCAG 2.1 AAA';
    considerations: string[];
  };
}

export interface DesignReview {
  projectId: string;
  overallScore: number; // 0-100
  consistency: 'excellent' | 'good' | 'needs-work' | 'poor';
  accessibility: 'excellent' | 'good' | 'needs-work' | 'poor';
  usability: 'excellent' | 'good' | 'needs-work' | 'poor';
  findings: {
    category: 'layout' | 'typography' | 'color' | 'interaction' | 'accessibility' | 'consistency';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }[];
  summary: string;
}

// Helper functions for the Designer agent
export class DesignerAgent {
  private llmRouter: any;
  private currentProject: any = null;
  private designSpecs: DesignSpec[] = [];

  constructor(llmRouter: any) {
    this.llmRouter = llmRouter;
  }

  async designUI(requirements: string, context?: any): Promise<DesignSpec> {
    const messages = [
      { role: 'system', content: DESIGNER_PROMPT },
      { role: 'user', content: `Design the UI/UX for this project:\n\nRequirements:\n${requirements}\n\nContext: ${JSON.stringify(context || {})}\n\nProvide a comprehensive design specification including user flows, page layouts, component definitions, design tokens, and accessibility considerations.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'google/gemini-pro-1.5-flash',
      temperature: 0.6,
      maxTokens: 8000
    });

    return this.parseDesignSpecResponse(response.content);
  }

  async generateComponent(componentSpec: string): Promise<string> {
    // Generate actual UI component code (React, Vue, etc.)
    const messages = [
      { role: 'system', content: DESIGNER_PROMPT },
      { role: 'user', content: `Generate a UI component based on this spec:\n\n${componentSpec}\n\nProvide the component code (React preferred) with proper props, styling, and accessibility.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'google/gemini-pro-1.5-flash',
      temperature: 0.5,
      maxTokens: 6000
    });

    return response.content;
  }

  async designSystem(existingComponents?: string): Promise<DesignSpec> {
    const messages = [
      { role: 'system', content: DESIGNER_PROMPT },
      { role: 'user', content: `Design a comprehensive design system.\n\n${existingComponents ? `Existing components to consider:\n${existingComponents}` : 'Create a new design system from scratch'}\n\nProvide design tokens (colors, typography, spacing), atomic components, and documentation.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'google/gemini-pro-1.5-flash',
      temperature: 0.5,
      maxTokens: 8000
    });

    return this.parseDesignSpecResponse(response.content);
  }

  async reviewDesign(designSpec: DesignSpec): Promise<DesignReview> {
    const messages = [
      { role: 'system', content: DESIGNER_PROMPT },
      { role: 'user', content: `Review this design specification for quality, consistency, and accessibility:\n\n${JSON.stringify(designSpec, null, 2)}\n\nProvide a detailed review with scores and specific findings.` }
    ];

    const response = await this.llmRouter.complete(messages, {
      provider: 'openrouter',
      model: 'google/gemini-pro-1.5-flash',
      temperature: 0.4,
      maxTokens: 6000
    });

    return this.parseDesignReviewResponse(response.content);
  }

  private parseDesignSpecResponse(content: string): DesignSpec {
    return {
      projectId: 'pending',
      overview: content.substring(0, 200),
      userFlows: [],
      pages: [],
      components: [],
      designTokens: {
        colors: [],
        typography: { fontFamily: 'Inter', sizes: {}, weights: {} },
        spacing: { unit: '4px', scale: [] },
        borderRadius: [],
        shadows: []
      },
      responsive: {
        breakpoints: [
          { name: 'mobile', width: '320px' },
          { name: 'tablet', width: '768px' },
          { name: 'desktop', width: '1024px' }
        ],
        adaptations: []
      },
      accessibility: {
        standard: 'WCAG 2.1 AA',
        considerations: []
      }
    };
  }

  private parseDesignReviewResponse(content: string): DesignReview {
    return {
      projectId: 'pending',
      overallScore: 75,
      consistency: 'good',
      accessibility: 'good',
      usability: 'good',
      findings: [],
      summary: content
    };
  }

  setCurrentProject(project: any): void {
    this.currentProject = project;
  }

  saveDesignSpec(spec: DesignSpec): void {
    this.designSpecs.push(spec);
  }

  getDesignSpecs(): DesignSpec[] {
    return this.designSpecs;
  }
}