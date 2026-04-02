/**
 * Business Viability Skill
 * Phase 0: Comprehensive viability analysis before any code is written
 */

export const BUSINESS_VIABILITY_PROMPT = `You are a Senior Business Analyst and Strategy Consultant for AI Dev Suite.

## Your Role
Evaluate business viability before any development begins. Your analysis determines whether a project should proceed, pivot, or be rejected.

## What You Analyze

### 1. Market Analysis
- **TAM (Total Addressable Market):** Total market opportunity
- **SAM (Serviceable Addressable Market):** Target segment
- **SOM (Serviceable Obtainable Market):** Realistic capture
- **Market Trends:** Growth, seasonality, cycles
- **Competition:** Direct and indirect competitors

### 2. Competitive Landscape
- Competitor analysis
- Market gaps
- Differentiation opportunities
- Barriers to entry

### 3. Revenue Model Validation
- Business model feasibility
- Pricing strategy viability
- Customer willingness to pay
- Unit economics

### 4. Technical Feasibility
- Complexity assessment
- Technology risks
- Integration challenges
- Build vs buy decisions

### 5. Risk Assessment
- Technical risks
- Market risks
- Regulatory risks
- Operational risks

### 6. Resource Requirements
- Development timeline
- Team composition
- Infrastructure needs
- Budget estimates

## Output
Generate a comprehensive Viability Assessment with:
- GO / NO-GO / PIVOT recommendation
- Score (0-100)
- Detailed analysis for each dimension
- Key risks and mitigations
- Resource estimates

Use clear formatting with executive summary first, then detailed analysis.`;

// Enterprise-grade viability analysis with all dimensions
export interface EnterpriseViability {
  recommendation: 'go' | 'no-go' | 'pivot';
  score: number;
  summary: string;
  
  marketAnalysis: {
    tam: string;
    sam: string;
    som: string;
    trends: string[];
    competition: CompetitorInfo[];
  };
  
  competitiveLandscape: {
    directCompetitors: string[];
    indirectCompetitors: string[];
    marketGaps: string[];
    differentiation: string[];
  };
  
  revenueValidation: {
    model: string;
    viability: string;
    pricing: string;
    unitEconomics: UnitEconomics;
  };
  
  technicalFeasibility: {
    complexity: 'low' | 'medium' | 'high';
    techRisks: Risk[];
    integrationChallenges: string[];
    buildOrBuy: string[];
  };
  
  riskAssessment: {
    technical: Risk[];
    market: Risk[];
    regulatory: Risk[];
    operational: Risk[];
  };
  
  resourceRequirements: {
    timeline: Timeline;
    teamSize: TeamComposition;
    infrastructure: string[];
    budget: string;
  };
}

export interface CompetitorInfo {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
}

export interface UnitEconomics {
  cac: string;
  ltv: string;
  ltvCacRatio: string;
  paybackPeriod: string;
}

export interface Risk {
  risk: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: string;
  mitigation: string;
}

export interface Timeline {
 MVP: string;
  launch: string;
  scale: string;
}

export interface TeamComposition {
  roles: { role: string; count: number }[];
  total: number;
}

// Format viability report
export function formatViabilityReport(v: EnterpriseViability): string {
  return `# 🔍 ENTERPRISE VIABILITY ANALYSIS

## 📊 RECOMMENDATION: **${v.recommendation.toUpperCase()}**
## Score: **${v.score}/100**

### Executive Summary
${v.summary}

---

## 🌍 Market Analysis

| Metric | Value |
|--------|-------|
| TAM | ${v.marketAnalysis.tam} |
| SAM | ${v.marketAnalysis.sam} |
| SOM | ${v.marketAnalysis.som} |

**Market Trends:**
${v.marketAnalysis.trends.map(t => `- ${t}`).join('\n')}

### Competition
${v.marketAnalysis.competition.map(c => 
  `#### ${c.name} (${c.marketShare})
  - Strengths: ${c.strengths.join(', ')}
  - Weaknesses: ${c.weaknesses.join(', ')}`
).join('\n\n')}

---

## 💰 Revenue Validation

- **Model:** ${v.revenueValidation.model}
- **Viability:** ${v.revenueValidation.viability}
- **Pricing:** ${v.revenueValidation.pricing}

### Unit Economics
| Metric | Value |
|--------|-------|
| CAC | ${v.revenueValidation.unitEconomics.cac} |
| LTV | ${v.revenueValidation.unitEconomics.ltv} |
| LTV:CAC | ${v.revenueValidation.unitEconomics.ltvCacRatio} |
| Payback | ${v.revenueValidation.unitEconomics.paybackPeriod} |

---

## ⚙️ Technical Feasibility

- **Complexity:** ${v.technicalFeasibility.complexity}

### Tech Risks
${v.technicalFeasibility.techRisks.map(r => 
  `- **[${r.severity}]** ${r.risk} — Mitigation: ${r.mitigation}`
).join('\n')}

### Integration Challenges
${v.technicalFeasibility.integrationChallenges.map(i => `- ${i}`).join('\n')}

---

## ⚠️ Risk Assessment

### Technical Risks
${v.riskAssessment.technical.map(r => 
  `- **[${r.severity}]** ${r.risk} (${r.probability}) — ${r.mitigation}`
).join('\n')}

### Market Risks
${v.riskAssessment.market.map(r => 
  `- **[${r.severity}]** ${r.risk} (${r.probability}) — ${r.mitigation}`
).join('\n')}

---

## 📅 Resource Requirements

### Timeline
- MVP: ${v.resourceRequirements.timeline.MVP}
- Launch: ${v.resourceRequirements.timeline.launch}
- Scale: ${v.resourceRequirements.timeline.scale}

### Team
${v.resourceRequirements.teamSize.roles.map(r => `- ${r.role}: ${r.count}`).join('\n')}
- **Total:** ${v.resourceRequirements.teamSize.total} people

### Budget
${v.resourceRequirements.budget}

---

## 🚦 GATE DECISION

**Your decision at this gate:**

- ✅ **GO** — Proceed to Project Charter
- 🔄 **PIVOT** — Modify the idea based on analysis
- ❌ **NO-GO** — Do not proceed (not viable)

---
*This analysis was generated at Phase 0: Viability Gate*`;
}