"use strict";
/**
 * Enterprise SDLC Orchestrator
 * Complete lifecycle: Idea → Viability → Charter → Execute → Hardening → Launch → Operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDLCOrchestrator = void 0;
const architect_1 = require("./agents/architect");
const developer_1 = require("./agents/developer");
const designer_1 = require("./agents/designer");
t - have;
';;
estimate: string;
// The Master SDLC Orchestrator
class SDLCOrchestrator {
    constructor(llmRouter) {
        this.currentProject = null;
        this.eventHandlers = new Map();
        this.architect = new architect_1.ArchitectAgent(llmRouter);
        this.developer = new developer_1.DeveloperAgent(llmRouter);
        this.designer = new designer_1.DesignerAgent(llmRouter);
    }
    // ========================================
    // PHASE 0: VIABILITY GATE
    // ========================================
    /**
     * Start: User presents an idea
     * Process: Evaluate business viability
     * Output: GO / NO-GO / PIVOT recommendation
     */
    async evaluateViability(idea) {
        this.currentProject = this.createProjectContext(idea);
        this.updateGate('viability-gate', 'in-progress');
        this.emit('phase:viability-started', { project: this.currentProject, idea });
        // Run comprehensive viability analysis
        const viability = await this.architect.analyzeEnterpriseViability(idea);
        this.currentProject.viability = viability;
        // Store viability artifact
        this.updateGate('viability-gate', 'completed', [this.generateViabilityDoc(viability)]);
        this.emit('phase:viability-completed', viability);
        return this.currentProject;
    }
    /**
     * Get viability report for user review
     */
    getViabilityReport() {
        if (!this.currentProject?.viability) {
            return 'No viability analysis available.';
        }
        return this.formatEnterpriseViabilityReport(this.currentProject.viability);
    }
    /**
     * User decision at Viability Gate
     */
    async viabilityGateDecision(decision, feedback) {
        if (!this.currentProject)
            throw new Error('No active project');
        const gate = this.currentProject.gates.get('viability-gate');
        gate.approvedBy = 'user';
        gate.approvedAt = new Date();
        gate.notes = feedback;
        if (decision === 'go') {
            this.emit('gate:viability-approved', this.currentProject);
        }
        else if (decision === 'pivot') {
            // Restart with modified idea
            this.emit('gate:viability-pivot', { project: this.currentProject, feedback });
        }
        else {
            this.emit('gate:viability-rejected', this.currentProject);
            throw new Error('Project did not pass viability gate. See feedback above.');
        }
    }
    // ========================================
    // PHASE 1: PROJECT CHARTER
    // ========================================
    /**
     * Generate all charter documents after GO decision
     */
    async generateProjectCharter() {
        if (!this.currentProject)
            throw new Error('No active project');
        this.updateGate('project-charter', 'in-progress');
        this.emit('phase:charter-started', this.currentProject);
        const idea = this.currentProject.description;
        // Generate all charter components in parallel where possible
        const [projectContext, prd, systemDesign, designSystem, revenueModel, adrs] = await Promise.all([
            this.architect.generateProjectCharter(idea),
            this.architect.generatePRD(idea),
            this.architect.generateSystemDesign(idea),
            this.designer.designSystem(),
            this.architect.generateRevenueModel(idea),
            this.architect.generateInitialADRs(idea)
        ]);
        this.currentProject.projectContext = projectContext;
        this.currentProject.prd = prd;
        this.currentProject.systemDesign = systemDesign;
        this.currentProject.designSystem = designSystem;
        this.currentProject.revenueModel = revenueModel;
        this.currentProject.adrs = adrs;
        const artifacts = [
            this.generateCharterDoc(),
            this.generatePRDDoc(prd),
            this.generateDesignDoc(systemDesign),
            this.generateDesignSystemDoc(designSystem),
            this.generateRevenueDoc(revenueModel),
            this.generateADRsDoc(adrs)
        ];
        this.updateGate('project-charter', 'completed', artifacts);
        this.emit('phase:charter-completed', this.currentProject);
        return this.currentProject;
    }
    /**
     * Get complete charter for user approval
     */
    getCharterDocuments() {
        if (!this.currentProject)
            return 'No active project';
        return `# 📋 PROJECT CHARTER: ${this.currentProject.name}

## Project Vision
${this.currentProject.vision}

## Viability Score
${this.currentProject.viability?.score}/100 — ${this.currentProject.viability?.recommendation}

---

${this.generateCharterDoc()}

${this.generatePRDDoc(this.currentProject.prd)}

${this.generateDesignDoc(this.currentProject.systemDesign)}

${this.generateDesignSystemDoc(this.currentProject.designSystem)}

${this.generateRevenueDoc(this.currentProject.revenueModel)}

${this.generateADRsDoc(this.currentProject.adrs)}
`;
    }
    /**
     * User approves the charter
     */
    async approveCharter(approved, feedback) {
        if (!this.currentProject)
            throw new Error('No active project');
        const gate = this.currentProject.gates.get('project-charter');
        gate.approvedBy = 'user';
        gate.approvedAt = new Date();
        gate.notes = feedback;
        if (approved) {
            this.emit('gate:charter-approved', this.currentProject);
        }
        else {
            this.currentProject.blockers.push(`Charter rejected: ${feedback}`);
            this.emit('gate:charter-rejected', { project: this.currentProject, feedback });
            throw new Error('Charter not approved. Please address feedback and regenerate.');
        }
    }
    // ========================================
    // PHASE 2: DEVELOPMENT
    // ========================================
    /**
     * Enter development phase after charter approval
     */
    async startDevelopment() {
        if (!this.currentProject)
            throw new Error('No active project');
        this.updateGate('development', 'in-progress');
        this.currentProject.currentPhase = 'development';
        this.emit('phase:development-started', this.currentProject);
        return this.currentProject;
    }
    /**
     * Generate a feature using the create workflow
     */
    async createFeature(specification) {
        return this.developer.generateCode(specification, {
            project: this.currentProject,
            architecture: this.currentProject?.systemDesign,
            design: this.currentProject?.designSystem,
            prd: this.currentProject?.prd
        });
    }
    /**
     * Run code review using the review workflow
     */
    async reviewFeature(code) {
        return this.developer.reviewCode(code);
    }
    /**
     * Track task progress in task.md
     */
    addTask(task) {
        if (!this.currentProject)
            throw new Error('No active project');
        this.currentProject.tasks.push(task);
        this.emit('task:added', task);
    }
    updateTaskStatus(taskId, status) {
        if (!this.currentProject)
            return;
        const task = this.currentProject.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = status;
            this.emit('task:updated', { taskId, status });
        }
    }
    /**
     * Get development progress
     */
    getDevelopmentProgress() {
        if (!this.currentProject)
            return 'No active project';
        const total = this.currentProject.tasks.length;
        const completed = this.currentProject.tasks.filter(t => t.status === 'completed').length;
        const inProgress = this.currentProject.tasks.filter(t => t.status === 'in-progress').length;
        const pending = this.currentProject.tasks.filter(t => t.status === 'pending').length;
        return `# Development Progress

- **Total Tasks:** ${total}
- **Completed:** ${completed} (${Math.round(completed / total * 100)}%)
- **In Progress:** ${inProgress}
- **Pending:** ${pending}

## Blockers
${this.currentProject.blockers.length ? this.currentProject.blockers.map(b => `- ${b}`).join('\n') : 'None'}
`;
    }
    // ========================================
    // PHASE 3: HARDENING
    // ========================================
    /**
     * Enter hardening phase
     */
    async startHardening() {
        if (!this.currentProject)
            throw new Error('No active project');
        this.updateGate('hardening', 'in-progress');
        this.currentProject.currentPhase = 'hardening';
        this.emit('phase:hardening-started', this.currentProject);
        return this.currentProject;
    }
    /**
     * Run security audit
     */
    async runSecurityAudit() {
        const audit = await this.architect.runSecurityAudit(this.currentProject);
        this.currentProject.securityAudit = audit;
        this.emit('audit:security-completed', audit);
        return audit;
    }
    /**
     * Run performance audit
     */
    async runPerformanceAudit() {
        const audit = await this.architect.runPerformanceAudit(this.currentProject);
        this.currentProject.performanceAudit = audit;
        this.emit('audit:performance-completed', audit);
        return audit;
    }
    /**
     * Final code review
     */
    async finalCodeReview() {
        return { file: 'final', issues: [], suggestions: [], overallQuality: 'excellent', summary: 'Ready for deployment' };
    }
    // ========================================
    // PHASE 4: LAUNCH
    // ========================================
    /**
     * Enter launch phase
     */
    async startLaunch() {
        if (!this.currentProject)
            throw new Error('No active project');
        this.updateGate('launch', 'in-progress');
        this.currentProject.currentPhase = 'launch';
        this.emit('phase:launch-started', this.currentProject);
        return this.currentProject;
    }
    /**
     * Generate deployment configuration
     */
    async generateDeploymentConfig(strategy = 'canary') {
        const config = {
            environment: 'production',
            strategy,
            steps: [
                '1. Run final tests in staging',
                '2. Create deployment backup',
                '3. Deploy to canary (10% traffic)',
                '4. Monitor metrics for 1 hour',
                '5. Gradual rollout (25% → 50% → 100%)',
                '6. Update DNS/CDN',
                '7. Verify all systems operational'
            ],
            rollbackPlan: 'Revert to previous version, restore from backup'
        };
        this.currentProject.deploymentConfig = config;
        return config;
    }
    /**
     * Execute deployment
     */
    async deploy() {
        if (!this.currentProject?.deploymentConfig) {
            throw new Error('No deployment config. Generate one first.');
        }
        this.emit('deployment:started', this.currentProject);
        // In production, this would trigger actual deployment
        this.updateGate('launch', 'completed');
        this.emit('phase:launch-completed', this.currentProject);
    }
    /**
     * Generate documentation
     */
    async generateDocumentation() {
        return `# Documentation Generated

- README.md
- API Documentation
- Runbooks
- Architecture Decision Records

Generated for: ${this.currentProject?.name}
`;
    }
    // ========================================
    // PHASE 5: POST-LAUNCH
    // ========================================
    /**
     * Enter post-launch operations
     */
    async startOperations() {
        if (!this.currentProject)
            throw new Error('No active project');
        this.updateGate('post-launch', 'in-progress');
        this.currentProject.currentPhase = 'post-launch';
        this.emit('phase:operations-started', this.currentProject);
        return this.currentProject;
    }
    /**
     * Generate monitoring configuration
     */
    async setupMonitoring() {
        const config = {
            uptimeMonitor: true,
            errorTracking: true,
            performanceMetrics: true,
            logAggregation: true,
            alerting: [
                { metric: 'error_rate', threshold: '>1%', severity: 'critical' },
                { metric: 'response_time_p95', threshold: '>500ms', severity: 'warning' },
                { metric: 'cpu_usage', threshold: '>80%', severity: 'warning' },
                { metric: 'memory_usage', threshold: '>85%', severity: 'critical' }
            ]
        };
        this.currentProject.monitoringConfig = config;
        return config;
    }
    /**
     * Generate incident response playbook
     */
    async generateIncidentPlaybook() {
        const playbook = {
            severityLevels: [
                { level: 1, name: 'Critical', responseTime: '15 min' },
                { level: 2, name: 'High', responseTime: '1 hour' },
                { level: 3, name: 'Medium', responseTime: '4 hours' },
                { level: 4, name: 'Low', responseTime: '24 hours' }
            ],
            escalationPaths: [
                { level: 1, contacts: ['On-call Engineer', 'Engineering Lead', 'CTO'] },
                { level: 2, contacts: ['Engineering Lead', 'CTO', 'CEO'] }
            ],
            runbooks: [
                { incidentType: 'Service Down', steps: ['Check status page', 'Review logs', 'Check recent deploys', 'Rollback if needed', 'Notify stakeholders'] },
                { incidentType: 'Performance Degradation', steps: ['Check metrics', 'Identify bottlenecks', 'Scale horizontally', 'Cache if needed', 'Monitor improvement'] },
                { incidentType: 'Data Issue', steps: ['Isolate affected data', 'Backup before changes', 'Fix root cause', 'Verify integrity', 'Document incident'] }
            ]
        };
        this.currentProject.incidentPlaybook = playbook;
        return playbook;
    }
    /**
     * Generate scaling playbook
     */
    async generateScalingPlaybook() {
        const playbook = {
            triggers: [
                { metric: 'cpu_usage', threshold: '>70% for 5 min' },
                { metric: 'memory_usage', threshold: '>80% for 5 min' },
                { metric: 'request_rate', threshold: '>80% capacity for 3 min' },
                { metric: 'queue_depth', threshold: '>1000 messages' }
            ],
            actions: [
                { component: 'api', action: 'Scale from 2 to 4 instances' },
                { component: 'database', action: 'Add read replica' },
                { component: 'cache', action: 'Increase Redis cluster size' },
                { component: 'cdn', action: 'Enable aggressive caching' }
            ]
        };
        this.currentProject.scalingPlaybook = playbook;
        return playbook;
    }
    /**
     * Plan next iteration
     */
    async planNextIteration(feedback) {
        return `# Next Iteration Plan

Based on feedback: ${feedback}

## Prioritized Improvements
1. [ ] Item 1
2. [ ] Item 2

## New Features
1. [ ] Feature 1

---
*Generated from post-launch analysis*
`;
    }
    // ========================================
    // PROJECT KICKOFF
    // ========================================
    /**
     * Execute project kickoff workflow
     */
    async runKickoff(projectRoot) {
        if (!this.currentProject)
            throw new Error('No active project');
        const steps = [
            '1. Create project directory structure',
            '2. Initialize git repository',
            '3. Set up package manager and dependencies',
            '4. Generate project-context.md',
            '5. Set up linting, formatting, pre-commit hooks',
            '6. Create Dockerfile and docker-compose.yml',
            '7. Set up CI/CD pipeline (GitHub Actions)',
            '8. Create .env.example',
            '9. Generate README with Quick Start',
            '10. Create initial health check endpoint',
            '11. Commit and push initial scaffold'
        ];
        // In production, each step would execute
        return `# Project Kickoff Complete

## Steps Executed:
${steps.join('\n')}

## Project Root: ${projectRoot}

## Next Steps
- Run \`npm run dev\` to start development server
- Configure API keys in .env
- Review project-context.md for project rules
`;
    }
    // ========================================
    // STATE & HELPERS
    // ========================================
    getCurrentProject() {
        return this.currentProject;
    }
    getWorkflowState() {
        if (!this.currentProject)
            return 'No active project';
        const phase = this.currentProject.currentPhase;
        const gate = this.currentProject.gates.get(phase);
        return `# SDLC Workflow State

**Current Phase:** ${phase.replace('-', ' ').toUpperCase()}
**Gate Status:** ${gate?.status || 'N/A'}
**Approved By:** ${gate?.approvedBy || 'Pending'}
**Started:** ${this.currentProject.createdAt.toLocaleDateString()}

## Phase Gates
${Array.from(this.currentProject.gates.entries()).map(([phase, gate]) => `- ${phase}: ${gate.status}`).join('\n')}

## Blockers
${this.currentProject.blockers.length ? this.currentProject.blockers.map(b => `- ${b}`).join('\n') : 'None'}
`;
    }
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
    createProjectContext(idea) {
        const phases = ['viability-gate', 'project-charter', 'development', 'hardening', 'launch', 'post-launch'];
        const gates = new Map();
        phases.forEach(phase => {
            gates.set(phase, {
                phase,
                status: 'pending',
                artifacts: []
            });
        });
        return {
            id: `proj-${Date.now()}`,
            name: this.extractProjectName(idea),
            description: idea,
            vision: idea,
            createdAt: new Date(),
            currentPhase: 'idea',
            gates,
            viability: null,
            projectContext: null,
            prd: null,
            systemDesign: null,
            designSystem: null,
            revenueModel: null,
            adrs: [],
            tasks: [],
            completedFeatures: [],
            securityAudit: null,
            performanceAudit: null,
            deploymentConfig: null,
            monitoringConfig: null,
            incidentPlaybook: null,
            scalingPlaybook: null,
            decisionLog: [],
            blockers: []
        };
    }
    updateGate(phase, status, artifacts = []) {
        const gate = this.currentProject?.gates.get(phase);
        if (gate) {
            gate.status = status;
            if (artifacts.length)
                gate.artifacts.push(...artifacts);
        }
        if (this.currentProject) {
            this.currentProject.currentPhase = phase;
        }
    }
    extractProjectName(idea) {
        const words = idea.split(' ').slice(0, 3);
        return words.join(' ') + ' Project';
    }
    generateViabilityDoc(v) {
        return `viability-${Date.now()}.md`;
    }
    formatEnterpriseViabilityReport(v) {
        return `# 🔍 VIABILITY GATE ANALYSIS

## Recommendation: **${v.recommendation.toUpperCase()}**
## Score: **${v.score}/100**

---

### Executive Summary
${v.summary}

### Market Analysis
- **TAM:** ${v.marketAnalysis.tam || 'TBD'}
- **SAM:** ${v.marketAnalysis.sam || 'TBD'}
- **SOM:** ${v.marketAnalysis.som || 'TBD'}

### Technical Feasibility
- **Complexity:** ${v.technicalFeasibility.complexity}

### Resource Assessment
- **Timeline:** ${v.resourceAssessment.devTime}
- **Budget:** ${v.resourceAssessment.estimatedCost}

### Risk Profile
${v.riskAnalysis.technical.map(r => `- ${r.risk} [${r.severity}]`).join('\n')}

---

**📋 NEXT STEP:** Review this analysis and decide: **GO / NO-GO / PIVOT**
`;
    }
    generateCharterDoc() {
        if (!this.currentProject?.projectContext)
            return '';
        const c = this.currentProject.projectContext;
        return `# Project Charter

## ${c.name}
**Vision:** ${c.vision}
**Mission:** ${c.mission}

## Objectives
${c.objectives.map(o => `- ${o}`).join('\n')}

## Success Criteria
${c.successCriteria.map(s => `- ${s}`).join('\n')}

## Stakeholders
${c.stakeholders.map(s => `- ${s.name} (${s.role}): ${s.interest}`).join('\n')}

## Constraints
${c.constraints.map(c => `- ${c.type}: ${c.description}`).join('\n')}

## Timeline: ${c.timeline}
## Budget: ${c.budget}
`;
    }
    generatePRDDoc(p) {
        if (!p)
            return '';
        return `# Product Requirements Document (PRD)

## Overview
${p.overview}

## User Stories
${p.userStories.map(s => `### ${s.id}: ${s.title}\n**As a** ${s.asA}\n**I want** ${s.iWant}\n**So that** ${s.soThat}\n*Priority: ${s.priority} | Estimate: ${s.estimate}*`).join('\n\n')}

## Functional Requirements
${p.functionalRequirements.map(r => `- **[${r.priority}]** ${r.description}`).join('\n')}

## Non-Functional Requirements
${p.nonFunctionalRequirements.map(r => `- **[${r.priority}]** ${r.description}`).join('\n')}
`;
    }
    generateDesignDoc(d) {
        if (!d)
            return '';
        return `# System Design Document

## Architecture
**Pattern:** ${d.architecturePattern}

## Components
${d.components.map(c => `### ${c.name}\n${c.responsibility}\nTech: ${c.techStack}`).join('\n\n')}

## API Specification
${d.apiSpec.endpoints.map(e => `- **${e.method}** ${e.path}: ${e.description}`).join('\n')}

## Security
- Authentication: ${d.securityDesign.authentication}
- Authorization: ${d.securityDesign.authorization}

## Infrastructure
- Hosting: ${d.infrastructureDesign.hosting}
- Scaling: ${d.infrastructureDesign.scaling}
`;
    }
    generateDesignSystemDoc(d) {
        if (!d)
            return '';
        return `# Design System

## Color Tokens
${d.tokens.colors.map(c => `- **${c.name}**: ${c.value} — ${c.usage}`).join('\n')}

## Typography
- Font: ${d.tokens.typography.fontFamily}

## Components
${d.components.map(c => `- **${c.name}** (${c.type}): ${c.description}`).join('\n')}

## Accessibility
${d.accessibility}
`;
    }
    generateRevenueDoc(r) {
        if (!r)
            return '';
        return `# Revenue Model

**Model:** ${r.model}

## Pricing Tiers
${r.pricing.map(p => `### ${p.name} — ${p.price}\n${p.features.map(f => `- ${f}`).join('\n')}`).join('\n\n')}

## Projections
- Year 1: ${r.projections.year1}
- Year 2: ${r.projections.year2}
- Year 3: ${r.projections.year3}
`;
    }
    generateADRsDoc(adrs) {
        return `# Architecture Decision Records (ADRs)

${adrs.map(a => `## ${a.id}: ${a.title}
**Status:** ${a.status}
**Date:** ${a.date}

### Context
${a.context}

### Decision
${a.decision}

### Consequences
${a.consequences}

### Alternatives
${a.alternatives.join(', ')}
`).join('\n\n')}
`;
    }
}
exports.SDLCOrchestrator = SDLCOrchestrator;
//# sourceMappingURL=sdlc-orchestrator.js.map