"use strict";
/**
 * Workflow Orchestrator
 * Manages the complete software development lifecycle
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowOrchestrator = void 0;
const architect_1 = require("./architect");
const developer_1 = require("./developer");
const designer_1 = require("./designer");
// The main workflow orchestrator
class WorkflowOrchestrator {
    constructor(llmRouter) {
        this.currentProject = null;
        this.eventHandlers = new Map();
        this.architect = new architect_1.ArchitectAgent(llmRouter);
        this.developer = new developer_1.DeveloperAgent(llmRouter);
        this.designer = new designer_1.DesignerAgent(llmRouter);
    }
    // ========================================
    // Phase 1: Idea & Viability Analysis
    // ========================================
    /**
     * Start a new project from an idea
     * This is the entry point for the entire workflow
     */
    async startProject(idea) {
        this.currentProject = {
            id: `proj-${Date.now()}`,
            name: this.extractProjectName(idea),
            description: idea,
            createdAt: new Date(),
            currentPhase: 'idea',
            viability: null,
            architecture: null,
            design: null,
            tasks: [],
            documents: new Map(),
            teamNotes: []
        };
        this.emit('project:started', this.currentProject);
        // Auto-progress to viability analysis
        return this.runViabilityAnalysis(idea);
    }
    /**
     * Run business and technical viability analysis
     */
    async runViabilityAnalysis(idea) {
        if (!this.currentProject) {
            throw new Error('No active project. Call startProject first.');
        }
        this.updatePhase('viability');
        this.emit('viability:started', idea);
        // Get Architect to analyze viability
        const viability = await this.architect.analyzeViability(idea);
        this.currentProject.viability = viability;
        // Store the viability document
        this.currentProject.documents.set('viability-report', this.formatViabilityReport(viability));
        this.emit('viability:completed', viability);
        return this.currentProject;
    }
    /**
     * Present the viability analysis to user for approval
     */
    getViabilityReport() {
        if (!this.currentProject?.viability) {
            return 'No viability analysis available.';
        }
        return this.currentProject.documents.get('viability-report') || '';
    }
    /**
     * User approves or rejects the viability
     */
    async approveViability(approved, feedback) {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        if (feedback) {
            this.currentProject.teamNotes.push(`Viability feedback: ${feedback}`);
        }
        if (approved) {
            this.currentProject.teamNotes.push('Viability approved by user.');
            this.emit('viability:approved', this.currentProject);
            return this.currentProject;
        }
        else {
            this.currentProject.teamNotes.push('Viability rejected by user. Awaiting revision.');
            this.emit('viability:rejected', { project: this.currentProject, feedback });
            throw new Error('Project viability rejected. Please revise the idea.');
        }
    }
    // ========================================
    // Phase 2: Planning & Architecture
    // ========================================
    /**
     * Generate comprehensive project plan and documentation
     */
    async generatePlan() {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('planning');
        this.emit('planning:started', this.currentProject);
        // Get Architect to create architecture
        const architecture = await this.architect.designArchitecture(this.currentProject.description);
        this.currentProject.architecture = architecture;
        // Store documentation
        this.currentProject.documents.set('architecture', this.formatArchitectureDoc(architecture));
        this.currentProject.documents.set('tech-stack', this.formatTechStack(architecture.techStack));
        // Generate project roadmap
        if (this.currentProject.viability?.recommendedPlan) {
            this.currentProject.documents.set('roadmap', this.formatRoadmap(this.currentProject.viability.recommendedPlan));
        }
        this.emit('planning:completed', architecture);
        return this.currentProject;
    }
    /**
     * Get the project plan for user review
     */
    getProjectPlan() {
        if (!this.currentProject) {
            return 'No active project.';
        }
        const docs = this.currentProject.documents;
        return `
# Project Plan: ${this.currentProject.name}

## Overview
${this.currentProject.description}

## Viability Score
${this.currentProject.viability?.score}/100 - ${this.currentProject.viability?.recommendation}

${docs.get('architecture') || ''}

${docs.get('tech-stack') || ''}

${docs.get('roadmap') || ''}
`.trim();
    }
    // ========================================
    // Phase 3: Design
    // ========================================
    /**
     * Generate UI/UX design specifications
     */
    async runDesign(requirements) {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('design');
        this.emit('design:started', this.currentProject);
        const designRequirements = requirements || this.currentProject.description;
        const design = await this.designer.designUI(designRequirements, {
            architecture: this.currentProject.architecture,
            techStack: this.currentProject.architecture?.techStack
        });
        design.projectId = this.currentProject.id;
        this.currentProject.design = design;
        this.currentProject.documents.set('design-spec', this.formatDesignSpec(design));
        this.emit('design:completed', design);
        return this.currentProject;
    }
    /**
     * Get design specification for review
     */
    getDesignSpec() {
        return this.currentProject?.documents.get('design-spec') || 'No design available.';
    }
    // ========================================
    // Phase 4: Development
    // ========================================
    /**
     * Start development phase
     */
    async startDevelopment() {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('development');
        this.emit('development:started', this.currentProject);
        return this.currentProject;
    }
    /**
     * Generate code for a feature
     */
    async generateFeature(specification) {
        return this.developer.generateCode(specification, {
            project: this.currentProject,
            architecture: this.currentProject?.architecture,
            design: this.currentProject?.design
        });
    }
    /**
     * Review code
     */
    async reviewCode(code) {
        return this.developer.reviewCode(code);
    }
    /**
     * Debug an issue
     */
    async debug(error, code) {
        return this.developer.debug(error, code);
    }
    /**
     * Generate tests
     */
    async generateTests(code, framework) {
        return this.developer.generateTests(code, framework);
    }
    // ========================================
    // Phase 5-8: Testing, Deployment, Maintenance
    // ========================================
    /**
     * Run tests with agent analysis
     */
    async runTests() {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('testing');
        this.emit('testing:started', this.currentProject);
        // Here we'd integrate with actual test runners
        this.emit('testing:completed', this.currentProject);
        return this.currentProject;
    }
    /**
     * Deploy the project
     */
    async deploy() {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('deployment');
        this.emit('deployment:started', this.currentProject);
        // Deployment logic would go here
        this.emit('deployment:completed', this.currentProject);
        return this.currentProject;
    }
    /**
     * Enter maintenance mode
     */
    async enterMaintenance() {
        if (!this.currentProject) {
            throw new Error('No active project.');
        }
        this.updatePhase('maintenance');
        this.emit('maintenance:started', this.currentProject);
        return this.currentProject;
    }
    // ========================================
    // Project Management
    // ========================================
    getCurrentProject() {
        return this.currentProject;
    }
    getWorkflowState() {
        if (!this.currentProject)
            return null;
        return {
            currentPhase: this.currentProject.currentPhase,
            phaseHistory: [], // Would track phase transitions
            pendingActions: this.getPendingActions(),
            completedMilestones: this.getCompletedMilestones(),
            blockers: []
        };
    }
    getAgent(agent) {
        switch (agent) {
            case 'architect': return this.architect;
            case 'developer': return this.developer;
            case 'designer': return this.designer;
        }
    }
    // ========================================
    // Event System
    // ========================================
    on(event, handler) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);
    }
    emit(event, data) {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.forEach(h => h(data));
    }
    // ========================================
    // Private Helpers
    // ========================================
    updatePhase(phase) {
        if (this.currentProject) {
            this.currentProject.currentPhase = phase;
        }
    }
    extractProjectName(idea) {
        // Simple extraction - in production would use LLM to name
        const words = idea.split(' ').slice(0, 3);
        return words.join(' ') + ' Project';
    }
    getPendingActions() {
        const phase = this.currentProject?.currentPhase;
        switch (phase) {
            case 'idea': return ['Run viability analysis'];
            case 'viability': return ['Review and approve viability'];
            case 'planning': return ['Review and approve plan'];
            case 'design': return ['Review and approve design'];
            case 'development': return ['Implement features'];
            case 'testing': return ['Run tests'];
            case 'deployment': return ['Deploy to production'];
            case 'maintenance': return ['Monitor and maintain'];
            default: return [];
        }
    }
    getCompletedMilestones() {
        const milestones = [];
        const phase = this.currentProject?.currentPhase;
        if (phase && ['viability', 'planning', 'design', 'development', 'testing', 'deployment', 'maintenance'].includes(phase)) {
            milestones.push('Project initiated');
        }
        if (phase && ['planning', 'design', 'development', 'testing', 'deployment', 'maintenance'].includes(phase)) {
            milestones.push('Viability analysis completed');
        }
        if (phase && ['design', 'development', 'testing', 'deployment', 'maintenance'].includes(phase)) {
            milestones.push('Architecture designed');
        }
        if (phase && ['development', 'testing', 'deployment', 'maintenance'].includes(phase)) {
            milestones.push('Design completed');
        }
        return milestones;
    }
    // ========================================
    // Document Formatters
    // ========================================
    formatViabilityReport(v) {
        return `# Viability Assessment

## Summary
**Recommendation:** ${v.recommendation.toUpperCase()}
**Score:** ${v.score}/100

${v.summary}

## Market Analysis
${v.marketAnalysis.tam ? `TAM: ${v.marketAnalysis.tam}` : ''}
${v.marketAnalysis.sam ? `SAM: ${v.marketAnalysis.sam}` : ''}
${v.marketAnalysis.som ? `SOM: ${v.marketAnalysis.som}` : ''}

## Technical Feasibility
- **Complexity:** ${v.technicalFeasibility.complexity}

## Resource Assessment
- **Development Time:** ${v.resourceAssessment.devTime}
- **Estimated Cost:** ${v.resourceAssessment.estimatedCost}

## Risks
${v.riskAnalysis.technical.map(r => `- ${r.risk} (${r.severity})`).join('\n')}

## Recommended Plan
${v.recommendedPlan.phases.map(p => `- ${p.name}: ${p.duration}`).join('\n')}
`;
    }
    formatArchitectureDoc(a) {
        return `# Architecture Design

## Overview
${a.overview}

## Components
${a.components.map(c => `### ${c.name}\n${c.responsibility}\nTech: ${c.tech}`).join('\n\n')}

## Architecture Diagram
\`\`\`mermaid
${a.diagram}
\`\`\`

## Key Decisions
${a.decisions.map(d => `### ${d.title}\n${d.decision}\nRationale: ${d.rationale}`).join('\n\n')}
`;
    }
    formatTechStack(ts) {
        return `# Technology Stack

## Frontend
${ts.frontend.join(', ')}

## Backend
${ts.backend.join(', ')}

## Database
${ts.database.join(', ')}

## Infrastructure
${ts.infrastructure.join(', ')}

## Tools
${ts.tools.join(', ')}
`;
    }
    formatRoadmap(plan) {
        return `# Project Roadmap

## Timeline: ${plan.totalTimeline}

## Phases
${plan.phases.map(p => `### ${p.name} (${p.duration})\n${p.deliverables.join(', ')}`).join('\n\n')}

## Milestones
${plan.milestones.join('\n')}
`;
    }
    formatDesignSpec(d) {
        return `# Design Specification

## Overview
${d.overview}

## User Flows
${d.userFlows.map(f => `### ${f.name}\n${f.steps.map(s => `${s.step}. ${s.action}`).join(' → ')}`).join('\n\n')}

## Design Tokens
### Colors
${d.designTokens.colors.map(c => `- ${c.name}: ${c.value}`).join('\n')}

### Typography
- Font: ${d.designTokens.typography.fontFamily}

## Accessibility
- Standard: ${d.accessibility.standard}
- Considerations: ${d.accessibility.considerations.join(', ')}
`;
    }
}
exports.WorkflowOrchestrator = WorkflowOrchestrator;
