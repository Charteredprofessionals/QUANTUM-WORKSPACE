/**
 * Enterprise SDLC Orchestrator
 * Complete lifecycle: Idea → Viability → Charter → Execute → Hardening → Launch → Operations
 */
import { ViabilityAssessment } from './agents/architect';
import { ImplementationTask, CodeReview } from './agents/developer';
import { LLMRouter } from '../llm/router';
export type SDLCPhase = 'idea' | 'viability-gate' | 'project-charter' | 'development' | 'hardening' | 'launch' | 'post-launch';
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
    viability: ViabilityAssessment | null;
    projectContext: ProjectCharter | null;
    prd: ProductRequirements | null;
    systemDesign: SystemDesignDocument | null;
    designSystem: DesignSystemSpec | null;
    revenueModel: RevenueModel | null;
    adrs: ArchitectureDecisionRecord[];
    tasks: ImplementationTask[];
    completedFeatures: string[];
    securityAudit: SecurityAudit | null;
    performanceAudit: PerformanceAudit | null;
    deploymentConfig: DeploymentConfig | null;
    monitoringConfig: MonitoringConfig | null;
    incidentPlaybook: IncidentPlaybook | null;
    scalingPlaybook: ScalingPlaybook | null;
    decisionLog: DecisionEntry[];
    blockers: string[];
}
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
    priority: 'must-have' | 'should-have' | 'could-have' | 'won';
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
    diagram: string;
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
    fields: {
        name: string;
        type: string;
        required: boolean;
    }[];
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
export declare class SDLCOrchestrator {
    private architect;
    private developer;
    private designer;
    private currentProject;
    private eventHandlers;
    constructor(llmRouter: LLMRouter);
    /**
     * Start: User presents an idea
     * Process: Evaluate business viability
     * Output: GO / NO-GO / PIVOT recommendation
     */
    evaluateViability(idea: string): Promise<ProjectContext>;
    /**
     * Get viability report for user review
     */
    getViabilityReport(): string;
    /**
     * User decision at Viability Gate
     */
    viabilityGateDecision(decision: 'go' | 'no-go' | 'pivot', feedback?: string): Promise<void>;
    /**
     * Generate all charter documents after GO decision
     */
    generateProjectCharter(): Promise<ProjectContext>;
    /**
     * Get complete charter for user approval
     */
    getCharterDocuments(): string;
    /**
     * User approves the charter
     */
    approveCharter(approved: boolean, feedback?: string): Promise<void>;
    /**
     * Enter development phase after charter approval
     */
    startDevelopment(): Promise<ProjectContext>;
    /**
     * Generate a feature using the create workflow
     */
    createFeature(specification: string): Promise<string>;
    /**
     * Run code review using the review workflow
     */
    reviewFeature(code: string): Promise<CodeReview>;
    /**
     * Track task progress in task.md
     */
    addTask(task: ImplementationTask): void;
    updateTaskStatus(taskId: string, status: ImplementationTask['status']): void;
    /**
     * Get development progress
     */
    getDevelopmentProgress(): string;
    /**
     * Enter hardening phase
     */
    startHardening(): Promise<ProjectContext>;
    /**
     * Run security audit
     */
    runSecurityAudit(): Promise<SecurityAudit>;
    /**
     * Run performance audit
     */
    runPerformanceAudit(): Promise<PerformanceAudit>;
    /**
     * Final code review
     */
    finalCodeReview(): Promise<CodeReview>;
    /**
     * Enter launch phase
     */
    startLaunch(): Promise<ProjectContext>;
    /**
     * Generate deployment configuration
     */
    generateDeploymentConfig(strategy?: DeploymentConfig['strategy']): Promise<DeploymentConfig>;
    /**
     * Execute deployment
     */
    deploy(): Promise<void>;
    /**
     * Generate documentation
     */
    generateDocumentation(): Promise<string>;
    /**
     * Enter post-launch operations
     */
    startOperations(): Promise<ProjectContext>;
    /**
     * Generate monitoring configuration
     */
    setupMonitoring(): Promise<MonitoringConfig>;
    /**
     * Generate incident response playbook
     */
    generateIncidentPlaybook(): Promise<IncidentPlaybook>;
    /**
     * Generate scaling playbook
     */
    generateScalingPlaybook(): Promise<ScalingPlaybook>;
    /**
     * Plan next iteration
     */
    planNextIteration(feedback: string): Promise<string>;
    /**
     * Execute project kickoff workflow
     */
    runKickoff(projectRoot: string): Promise<string>;
    getCurrentProject(): ProjectContext | null;
    getWorkflowState(): string;
    on(event: string, handler: Function): void;
    private emit;
    private createProjectContext;
    private updateGate;
    private extractProjectName;
    private generateViabilityDoc;
    private formatEnterpriseViabilityReport;
    private generateCharterDoc;
    private generatePRDDoc;
    private generateDesignDoc;
    private generateDesignSystemDoc;
    private generateRevenueDoc;
    private generateADRsDoc;
}
//# sourceMappingURL=sdlc-orchestrator.d.ts.map