/**
 * Post-Launch Operations Skill
 * Monitoring, Incident Response, Scaling, and Growth
 */

export const OPERATIONS_PROMPT = `You are a Site Reliability Engineer and DevOps lead for AI Dev Suite.

## Your Role
Create comprehensive post-launch operational capabilities including monitoring, incident response, and scaling playbooks.

## What You Generate

### 1. Monitoring Configuration
- Uptime monitoring
- Error tracking
- Performance metrics
- Log aggregation
- Alert definitions

### 2. Incident Response Playbook
- Severity levels and response times
- Escalation paths
- Runbooks for common incidents
- Post-mortem templates

### 3. Scaling Playbook
- Scaling triggers and thresholds
- Auto-scaling actions
- Cost optimization strategies

### 4. Backup & Recovery
- RTO/RPO targets
- Disaster recovery plan
- Backup procedures

### 5. Compliance & Audit
- SOC2, GDPR, HIPAA compliance
- Audit trails
- Data retention policies`;

// Post-Launch Operations implementation
export interface PostLaunchOperations {
  monitoring: MonitoringSetup;
  incidentResponse: IncidentPlaybook;
  scaling: ScalingPlaybook;
  backup: BackupRecovery;
  compliance: ComplianceSetup;
}

export interface MonitoringSetup {
  uptime: { enabled: boolean; checks: string[]; interval: number };
  errorTracking: { enabled: boolean; provider: string; retention: string };
  metrics: { enabled: boolean; metrics: string[]; dashboard: string };
  logging: { enabled: boolean; aggregation: string; retention: string };
  alerts: AlertDefinition[];
}

export interface AlertDefinition {
  name: string;
  metric: string;
  condition: string;
  severity: 'critical' | 'warning' | 'info';
  channels: string[];
}

export interface IncidentPlaybook {
  severityLevels: SeverityLevel[];
  escalationMatrix: EscalationPath[];
  runbooks: Runbook[];
  postMortem: string;
}

export interface SeverityLevel {
  level: number;
  name: string;
  responseTime: string;
  examples: string[];
}

export interface EscalationPath {
  level: number;
  primary: string;
  secondary: string;
  notification: string[];
}

export interface Runbook {
  title: string;
  severity: number;
  symptoms: string[];
  diagnosis: string[];
  resolution: string[];
}

export interface ScalingPlaybook {
  triggers: ScalingTrigger[];
  actions: ScalingAction[];
  costOptimization: string[];
}

export interface ScalingTrigger {
  metric: string;
  threshold: string;
  duration: string;
}

export interface ScalingAction {
  component: string;
  action: string;
  expectedImpact: string;
}

export interface BackupRecovery {
  rto: string; // Recovery Time Objective
  rpo: string; // Recovery Point Objective
  strategy: string;
  schedule: string[];
  testing: string;
}

export interface ComplianceSetup {
  framework: 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'None';
  controls: string[];
  auditSchedule: string;
  dataRetention: string;
}

// Format as markdown
export function formatOperations(ops: PostLaunchOperations): string {
  return `# 🏭 Post-Launch Operations

## Monitoring

### Uptime
- Enabled: ${ops.monitoring.uptime.enabled}
- Checks: ${ops.monitoring.uptime.checks.join(', ')}

### Alerts
${ops.monitoring.alerts.map(a => 
  `- **[${a.severity}]** ${a.name}: ${a.condition}`
).join('\n')}

---

## 🚨 Incident Response

### Severity Levels
| Level | Name | Response Time |
|-------|------|---------------|
${ops.incidentResponse.severityLevels.map(s => 
  `| ${s.level} | ${s.name} | ${s.responseTime} |`
).join('\n')}

### Escalation
${ops.incidentResponse.escalationMatrix.map(e => 
  `- Level ${e.level}: ${e.primary} → ${e.secondary}`
).join('\n')}

### Runbooks
${ops.incidentResponse.runbooks.map(r => 
  `#### ${r.title}\n${r.symptoms.map(s => `- ${s}`).join('\n')}`
).join('\n\n')}

---

## 📈 Scaling

### Triggers
${ops.scaling.triggers.map(t => `- ${t.metric}: ${t.threshold} for ${t.duration}`).join('\n')}

### Actions
${ops.scaling.actions.map(a => `- **${a.component}**: ${a.action}`).join('\n')}

---

## 💾 Backup & Recovery

- **RTO:** ${ops.backup.rto}
- **RPO:** ${ops.backup.rpo}
- **Strategy:** ${ops.backup.strategy}

---

## 📋 Compliance

- **Framework:** ${ops.compliance.framework}
- **Controls:** ${ops.compliance.controls.join(', ')}
`;
}