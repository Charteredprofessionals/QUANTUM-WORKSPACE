/**
 * UI/UX Designer Agent
 * Interface design, user experience, visual systems
 */
export declare const DESIGNER_PROMPT = "You are the **UI/UX Designer** of AI Dev Suite - an enterprise-grade AI development environment.\n\n## Your Identity\n- **Name:** UI/UX Designer\n- **Role:** Senior Product Designer with 12+ years experience\n- **Vibe:** User-centric, visually polished, accessibility advocate, design systems thinking\n- **Emoji:** \uD83C\uDFA8\n\n## Core Responsibilities\n\n### 1. User Experience Design\n- Create user journeys and flows\n- Design information architecture\n- Define interaction patterns\n- Ensure accessibility (WCAG 2.1 AA)\n- Optimize for usability metrics\n\n### 2. Visual Design\n- Design UI components and layouts\n- Create design systems and tokens\n- Define typography, color, spacing systems\n- Design responsive layouts for all devices\n- Create visual assets specifications\n\n### 3. Design Documentation\n- Produce design specs and style guides\n- Create component documentation\n- Document interaction behaviors\n- Provide developer handoff specs\n- Generate design prototypes\n\n### 4. Design Review\n- Evaluate designs for consistency\n- Check accessibility compliance\n- Identify UX improvements\n- Review with stakeholders\n\n## Communication Style\n- Use **visual descriptions** when you can't show mockups\n- Provide **precise specifications** for developers\n- Include **rationale** for design decisions\n- Show **variations** when appropriate\n- Consider **edge cases** and error states\n\n## Output Format\nWhen designing:\n1. Design overview and goals\n2. Visual mockup descriptions (or code for simple UI)\n3. Component specifications\n4. Interaction details\n5. Accessibility notes\n\nWhen reviewing:\n1. Overall assessment\n2. Specific observations\n3. Recommendations\n\n---\n\n**Remember:** You collaborate with Chief Architect on feasibility and Lead Developer on implementation. Your designs should be achievable and well-documented for smooth handoff.";
export declare const DESIGNER_CONFIG: {
    name: string;
    emoji: string;
    expertise: string[];
    defaultModel: string;
    systemPrompt: string;
};
export interface DesignSpec {
    projectId: string;
    overview: string;
    userFlows: {
        name: string;
        steps: {
            step: number;
            action: string;
            screen: string;
            notes?: string;
        }[];
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
        props: {
            name: string;
            type: string;
            default?: string;
            required?: boolean;
        }[];
        states: {
            name: string;
            description: string;
        }[];
        accessibility: string;
    }[];
    designTokens: {
        colors: {
            name: string;
            value: string;
            usage: string;
        }[];
        typography: {
            fontFamily: string;
            sizes: Record<string, string>;
            weights: Record<string, number>;
        };
        spacing: {
            unit: string;
            scale: string[];
        };
        borderRadius: string[];
        shadows: {
            name: string;
            value: string;
        }[];
    };
    responsive: {
        breakpoints: {
            name: string;
            width: string;
        }[];
        adaptations: string[];
    };
    accessibility: {
        standard: 'WCAG 2.1 AA' | 'WCAG 2.1 AAA';
        considerations: string[];
    };
}
export interface DesignReview {
    projectId: string;
    overallScore: number;
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
export declare class DesignerAgent {
    private llmRouter;
    private currentProject;
    private designSpecs;
    constructor(llmRouter: any);
    designUI(requirements: string, context?: any): Promise<DesignSpec>;
    generateComponent(componentSpec: string): Promise<string>;
    designSystem(existingComponents?: string): Promise<DesignSpec>;
    reviewDesign(designSpec: DesignSpec): Promise<DesignReview>;
    private parseDesignSpecResponse;
    private parseDesignReviewResponse;
    setCurrentProject(project: any): void;
    saveDesignSpec(spec: DesignSpec): void;
    getDesignSpecs(): DesignSpec[];
}
//# sourceMappingURL=designer.d.ts.map