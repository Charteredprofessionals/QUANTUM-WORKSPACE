"use strict";
/**
 * UI/UX Designer Agent
 * Interface design, user experience, visual systems
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignerAgent = exports.DESIGNER_CONFIG = exports.DESIGNER_PROMPT = void 0;
exports.DESIGNER_PROMPT = `You are the **UI/UX Designer** of AI Dev Suite - an enterprise-grade AI development environment.

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
exports.DESIGNER_CONFIG = {
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
    systemPrompt: exports.DESIGNER_PROMPT
};
// Helper functions for the Designer agent
class DesignerAgent {
    constructor(llmRouter) {
        this.currentProject = null;
        this.designSpecs = [];
        this.llmRouter = llmRouter;
    }
    async designUI(requirements, context) {
        const messages = [
            { role: 'system', content: exports.DESIGNER_PROMPT },
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
    async generateComponent(componentSpec) {
        // Generate actual UI component code (React, Vue, etc.)
        const messages = [
            { role: 'system', content: exports.DESIGNER_PROMPT },
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
    async designSystem(existingComponents) {
        const messages = [
            { role: 'system', content: exports.DESIGNER_PROMPT },
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
    async reviewDesign(designSpec) {
        const messages = [
            { role: 'system', content: exports.DESIGNER_PROMPT },
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
    parseDesignSpecResponse(content) {
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
    parseDesignReviewResponse(content) {
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
    setCurrentProject(project) {
        this.currentProject = project;
    }
    saveDesignSpec(spec) {
        this.designSpecs.push(spec);
    }
    getDesignSpecs() {
        return this.designSpecs;
    }
}
exports.DesignerAgent = DesignerAgent;
