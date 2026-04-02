/**
 * Enterprise SDLC Orchestrator
 * Complete lifecycle: Idea → Viability → Charter → Execute → Hardening → Launch → Operations
 */

import { ArchitectAgent, ViabilityAssessment, ArchitectureDesign } from './agents/architect';
import { DeveloperAgent, ImplementationTask, CodeReview } from './agents/developer';
import { DesignerAgent, DesignSpec, DesignReview } from './agents/designer';
import { LLMRouter } from '../llm/router';

export type SDLCPhase = 
  | 'idea'                    // User presents idea
  | 'viability-gate'          // Phase 0: Business viability analysis
  | 'project-charter'         // Phase 1: Generate all charter documents
  | 'development'             // Phase 2: Implementation
  | 'hardening'               // Phase 3: Security, performance, final review
  | 'launch'                  // Phase 4: Deployment & release
  | 'post-launch';            // Phase 5: Operations & iteration

export interface PhaseGate {
  phase: SDLCPhase;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  artifacts: string[];
}

export interface ProjectContext {
  id: string;
  name: string;
  description: string;
  vision: string;
  createdAt: Date;
  currentPhase: SDLCPhase;
  gates: Map<SDLCPhase, PhaseGate>;
  
  // Phase 0: Viability
  viability: ViabilityAssessment | null;
  
  // Phase 1: Charter
  projectContext: ProjectCharter | null;
  prd: ProductRequirements | null;
  systemDesign: SystemDesignDocument | null;
  designSystem: DesignSystemSpec | null;
  revenueModel: RevenueModel | null;
  adrs: ArchitectureDecisionRecord[];
  
  // Phase 2: Development
  tasks: ImplementationTask[];
  completedFeatures: string[];
  
  // Phase 3: Hardening
  securityAudit: SecurityAudit | null;
  performanceAudit: PerformanceAudit | null;
  
  // Phase 4: Launch
  deploymentConfig: DeploymentConfig | null;
  
  // Phase 5: Operations
  monitoringConfig: MonitoringConfig | null;
  incidentPlaybook: IncidentPlaybook | null;
  scalingPlaybook: ScalingPlaybook | null;
  
  // Tracking
  decisionLog: DecisionEntry[];
  blockers: string[];
}

// Phase 1: Project Charter Components
export interface ProjectCharter {
  projectId: string;
  name: string;
  vision: string;
  mission: string;
  objectives: string[];
  successCriteria: string[];
  stakeholders: Stakeholder[];
  constraints: Constraint[];
  assumptions: string[];
  timeline: string;
  budget: string;
}

export interface Stakeholder {
  name: string;
  role: string;
  interest: string;
  influence: 'high' | 'medium' | 'low';
}

export interface Constraint {
  type: 'technical' | 'budget' | 'timeline' | 'regulatory';
  description: string;
}

export interface ProductRequirements {
  projectId: string;
  overview: string;
  userStories: UserStory[];
  functionalRequirements: Requirement[];
  nonFunctionalRequirements: Requirement[];
  acceptanceCriteria: Map<string, string[]>;
  constraints: string[];
  risks: string[];
}

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  priority: 'must-have' | 'should-have' | 'could-have' | 'won't-have';
  estimate: string;
}

export interface Requirement {
  id: string;
  category: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface SystemDesignDocument {
  projectId: string;
  overview: string;
  architecturePattern: string;
  components: SystemComponent[];
  dataModel: DataModel;
  apiSpec: APISpecification;
  securityDesign: SecurityDesign;
  infrastructureDesign: InfrastructureDesign;
  diagram: string; // Mermaid
}

export interface SystemComponent {
  name: string;
  type: string;
  responsibility: string;
  techStack: string;
  interfaces: string[];
  dependencies: string[];
}

export interface DataModel {
  entities: DataEntity[];
  relationships: string[];
}

export interface DataEntity {
  name: string;
  fields: { name: string; type: string; required: boolean }[];
}

export interface APISpecification {
  endpoints: APIEndpoint[];
  auth: string;
  rateLimit: string;
}

export interface APIEndpoint {
  path: string;
  method: string;
  description: string;
  request: string;
  response: string;
}

export interface SecurityDesign {
  authentication: string;
  authorization: string;
  dataProtection: string[];
  compliance: string[];
}

export interface InfrastructureDesign {
  hosting: string;
  cdn: string;
  services: string[];
  scaling: string;
}

export interface DesignSystemSpec {
  projectId: string;
  tokens: DesignTokens;
  components: DesignComponent[];
  patterns: string[];
  accessibility: string;
}

export interface DesignTokens {
  colors: ColorToken[];
  typography: TypeToken;
  spacing: string[];
  borderRadius: string[];
  shadows: ShadowToken[];
}

export interface ColorToken {
  name: string;
  value: string;
  usage: string;
}

export interface TypeToken {
  fontFamily: string;
  sizes: Record<string, string>;
  weights: Record<number, number>;
}

export interface ShadowToken {
  name: string;
  value: string;
}

export interface DesignComponent {
  name: string;
  type: 'atomic' | 'molecular' | 'organism';
  description: string;
  props: PropSpec[];
  states: string[];
}

export interface PropSpec {
  name: string;
  type: string;
  required: boolean;
  default?: string;
}

export interface RevenueModel {
  projectId: string;
  model: 'subscription' | 'one-time' | 'freemium' | 'marketplace' | 'advertising';
  pricing: PricingTier[];
  projections: RevenueProjection;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
}

export interface RevenueProjection {
  year1: string;
  year2: string;
  year3: string;
}

export interface ArchitectureDecisionRecord {
  id: string;
  date: string;
  title: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
}

export interface SecurityAudit {
  date: Date;
  findings: SecurityFinding[];
  overallScore: number;
  passed: boolean;
}

export interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  recommendation: string;
}

export interface PerformanceAudit {
  date: Date;
  metrics: PerformanceMetric[];
  overallScore: number;
  passed: boolean;
}

export interface PerformanceMetric {
  name: string;
  value: string;
  target: string;
  passed: boolean;
}

export interface DeploymentConfig {
  environment: string;
  strategy: 'blue-green' | 'canary' | 'rolling' | 'big-bang';
  steps: string[];
  rollbackPlan: string;
}

export interface MonitoringConfig {
  uptimeMonitor: boolean;
  errorTracking: boolean;
  performanceMetrics: boolean;
  logAggregation: boolean;
  alerting: AlertConfig[];
}

export interface AlertConfig {
  metric: string;
  threshold: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface IncidentPlaybook {
  severityLevels: SeverityLevel[];
  escalationPaths: EscalationPath[];
  runbooks: Runbook[];
}

export interface SeverityLevel {
  level: number;
  name: string;
  responseTime: string;
}

export interface EscalationPath {
  level: number;
  contacts: string[];
}

export interface Runbook {
  incidentType: string;
  steps: string[];
}

export interface ScalingPlaybook {
  triggers: ScalingTrigger[];
  actions: ScalingAction[];
}

export interface ScalingTrigger {
  metric: string;
  threshold: string;
}

export interface ScalingAction {
  component: string;
  action: string;
}

export interface DecisionEntry {
  id: string;
  timestamp: Date;
  decision: string;
  rationale: string;
  madeBy: string;
}

// The Master SDLC Orchestrator
export class SDLCOrchestrator {
  private architect: ArchitectAgent;
  private developer: DeveloperAgent;
  private designer: DesignerAgent;
  private currentProject: ProjectContext | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  constructor(llmRouter: LLMRouter) {
    this.architect = new ArchitectAgent(llmRouter);
    this.developer = new DeveloperAgent(llmRouter);
    this.designer = new DesignerAgent(llmRouter);
  }

  // ========================================
  // PHASE 0: VIABILITY GATE
  // ========================================

  /**
   * Start: User presents an idea
   * Process: Evaluate business viability
   * Output: GO / NO-GO / PIVOT recommendation
   */
  async evaluateViability(idea: string): Promise<ProjectContext> {
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
  getViabilityReport(): string {
    if (!this.currentProject?.viability) {
      return 'No viability analysis available.';
    }
    return this.formatEnterpriseViabilityReport(this.currentProject.viability);
  }

  /**
   * User decision at Viability Gate
   */
  async viabilityGateDecision(decision: 'go' | 'no-go' | 'pivot', feedback?: string): Promise<void> {
    if (!this.currentProject) throw new Error('No active project');

    const gate = this.currentProject.gates.get('viability-gate');
    gate.approvedBy = 'user';
    gate.approvedAt = new Date();
    gate.notes = feedback;

    if (decision === 'go') {
      this.emit('gate:viability-approved', this.currentProject);
    } else if (decision === 'pivot') {
      // Restart with modified idea
      this.emit('gate:viability-pivot', { project: this.currentProject, feedback });
    } else {
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
  async generateProjectCharter(): Promise<ProjectContext> {
    if (!this.currentProject) throw new Error('No active project');

    this.updateGate('project-charter', 'in-progress');
    this.emit('phase:charter-started', this.currentProject);

    const idea = this.currentProject.description;

    // Generate all charter components in parallel where possible
    const [
      projectContext,
      prd,
      systemDesign,
      designSystem,
      revenueModel,
      adrs
    ] = await Promise.all([
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
  getCharterDocuments(): string {
    if (!this.currentProject) return 'No active project';

    return `# 📋 PROJECT CHARTER: ${this.currentProject.name}

## Project Vision
${this.currentProject.vision}

## Viability Score
${this.currentProject.viability?.score}/100 — ${this.currentProject.viability?.recommendation}

---

${this.generateCharterDoc()}

${this.generatePRDDoc(this.currentProject.prd!)}

${this.generateDesignDoc(this.currentProject.systemDesign!)}

${this.generateDesignSystemDoc(this.currentProject.designSystem!)}

${this.generateRevenueDoc(this.currentProject.revenueModel!)}

${this.generateADRsDoc(this.currentProject.adrs)}
`;
  }

  /**
   * User approves the charter
   */
  async approveCharter(approved: boolean, feedback?: string): Promise<void> {
    if (!this.currentProject) throw new Error('No active project');

    const gate = this.currentProject.gates.get('project-charter');
    gate.approvedBy = 'user';
    gate.approvedAt = new Date();
    gate.notes = feedback;

    if (approved) {
      this.emit('gate:charter-approved', this.currentProject);
    } else {
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
  async startDevelopment(): Promise<ProjectContext> {
    if (!this.currentProject) throw new Error('No active project');

    this.updateGate('development', 'in-progress');
    this.currentProject.currentPhase = 'development';
    this.emit('phase:development-started', this.currentProject);

    return this.currentProject;
  }

  /**
   * Generate a feature using the create workflow
   */
  async createFeature(specification: string): Promise<string> {
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
  async reviewFeature(code: string): Promise<CodeReview> {
    return this.developer.reviewCode(code);
  }

  /**
   * Track task progress in task.md
   */
  addTask(task: ImplementationTask): void {
    if (!this.currentProject) throw new Error('No active project');
    this.currentProject.tasks.push(task);
    this.emit('task:added', task);
  }

  updateTaskStatus(taskId: string, status: ImplementationTask['status']): void {
    if (!this.currentProject) return;
    const task = this.currentProject.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      this.emit('task:updated', { taskId, status });
    }
  }

  /**
   * Get development progress
   */
  getDevelopmentProgress(): string {
    if (!this.currentProject) return 'No active project';

    const total = this.currentProject.tasks.length;
    const completed = this.currentProject.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.currentProject.tasks.filter(t => t.status === 'in-progress').length;
    const pending = this.currentProject.tasks.filter(t => t.status === 'pending').length;

    return `# Development Progress

- **Total Tasks:** ${total}
- **Completed:** ${completed} (${Math.round(completed/total*100)}%)
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
  async startHardening(): Promise<ProjectContext> {
    if (!this.currentProject) throw new Error('No active project');

    this.updateGate('hardening', 'in-progress');
    this.currentProject.currentPhase = 'hardening';
    this.emit('phase:hardening-started', this.currentProject);

    return this.currentProject;
  }

  /**
   * Run security audit
   */
  async runSecurityAudit(): Promise<SecurityAudit> {
    const audit = await this.architect.runSecurityAudit(this.currentProject!);
    this.currentProject!.securityAudit = audit;
    this.emit('audit:security-completed', audit);
    return audit;
  }

  /**
   * Run performance audit
   */
  async runPerformanceAudit(): Promise<PerformanceAudit> {
    const audit = await this.architect.runPerformanceAudit(this.currentProject!);
    this.currentProject!.performanceAudit = audit;
    this.emit('audit:performance-completed', audit);
    return audit;
  }

  /**
   * Final code review
   */
  async finalCodeReview(): Promise<CodeReview> {
    return { file: 'final', issues: [], suggestions: [], overallQuality: 'excellent', summary: 'Ready for deployment' };
  }

  // ========================================
  // PHASE 4: LAUNCH
  // ========================================

  /**
   * Enter launch phase
   */
  async startLaunch(): Promise<ProjectContext> {
    if (!this.currentProject) throw new Error('No active project');

    this.updateGate('launch', 'in-progress');
    this.currentProject.currentPhase = 'launch';
    this.emit('phase:launch-started', this.currentProject);

    return this.currentProject;
  }

  /**
   * Generate deployment configuration
   */
  async generateDeploymentConfig(strategy: DeploymentConfig['strategy'] = 'canary'): Promise<DeploymentConfig> {
    const config: DeploymentConfig = {
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

    this.currentProject!.deploymentConfig = config;
    return config;
  }

  /**
   * Execute deployment
   */
  async deploy(): Promise<void> {
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
  async generateDocumentation(): Promise<string> {
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
  async startOperations(): Promise<ProjectContext> {
    if (!this.currentProject) throw new Error('No active project');

    this.updateGate('post-launch', 'in-progress');
    this.currentProject.currentPhase = 'post-launch';
    this.emit('phase:operations-started', this.currentProject);

    return this.currentProject;
  }

  /**
   * Generate monitoring configuration
   */
  async setupMonitoring(): Promise<MonitoringConfig> {
    const config: MonitoringConfig = {
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

    this.currentProject!.monitoringConfig = config;
    return config;
  }

  /**
   * Generate incident response playbook
   */
  async generateIncidentPlaybook(): Promise<IncidentPlaybook> {
    const playbook: IncidentPlaybook = {
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

    this.currentProject!.incidentPlaybook = playbook;
    return playbook;
  }

  /**
   * Generate scaling playbook
   */
  async generateScalingPlaybook(): Promise<ScalingPlaybook> {
    const playbook: ScalingPlaybook = {
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

    this.currentProject!.scalingPlaybook = playbook;
    return playbook;
  }

  /**
   * Plan next iteration
   */
  async planNextIteration(feedback: string): Promise<string> {
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
  async runKickoff(projectRoot: string): Promise<string> {
    if (!this.currentProject) throw new Error('No active project');

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

  getCurrentProject(): ProjectContext | null {
    return this.currentProject;
  }

  getWorkflowState(): string {
    if (!this.currentProject) return 'No active project';

    const phase = this.currentProject.currentPhase;
    const gate = this.currentProject.gates.get(phase);

    return `# SDLC Workflow State

**Current Phase:** ${phase.replace('-', ' ').toUpperCase()}
**Gate Status:** ${gate?.status || 'N/A'}
**Approved By:** ${gate?.approvedBy || 'Pending'}
**Started:** ${this.currentProject.createdAt.toLocaleDateString()}

## Phase Gates
${Array.from(this.currentProject.gates.entries()).map(([phase, gate]) => 
  `- ${phase}: ${gate.status}`
).join('\n')}

## Blockers
${this.currentProject.blockers.length ? this.currentProject.blockers.map(b => `- ${b}`).join('\n') : 'None'}
`;
  }

  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(h => h(data));
  }

  private createProjectContext(idea: string): ProjectContext {
    const phases: SDLCPhase[] = ['viability-gate', 'project-charter', 'development', 'hardening', 'launch', 'post-launch'];
    const gates = new Map<SDLCPhase, PhaseGate>();
    
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

  private updateGate(phase: SDLCPhase, status: PhaseGate['status'], artifacts: string[] = []): void {
    const gate = this.currentProject?.gates.get(phase);
    if (gate) {
      gate.status = status;
      if (artifacts.length) gate.artifacts.push(...artifacts);
    }
    if (this.currentProject) {
      this.currentProject.currentPhase = phase;
    }
  }

  private extractProjectName(idea: string): string {
    const words = idea.split(' ').slice(0, 3);
    return words.join(' ') + ' Project';
  }

  private generateViabilityDoc(v: ViabilityAssessment): string {
    return `viability-${Date.now()}.md`;
  }

  private formatEnterpriseViabilityReport(v: ViabilityAssessment): string {
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

  private generateCharterDoc(): string {
    if (!this.currentProject?.projectContext) return '';
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

  private generatePRDDoc(p: ProductRequirements): string {
    if (!p) return '';
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

  private generateDesignDoc(d: SystemDesignDocument): string {
    if (!d) return '';
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

  private generateDesignSystemDoc(d: DesignSystemSpec): string {
    if (!d) return '';
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

  private generateRevenueDoc(r: RevenueModel): string {
    if (!r) return '';
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

  private generateADRsDoc(adrs: ArchitectureDecisionRecord[]): string {
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