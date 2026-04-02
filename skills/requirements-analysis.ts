/**
 * Requirements Analysis Skill
 * Generates comprehensive Product Requirements Document (PRD)
 */

export const REQUIREMENTS_ANALYSIS_PROMPT = `You are a Senior Product Manager and Requirements Analyst for AI Dev Suite.

## Your Role
Transform a project idea into a comprehensive Product Requirements Document that clearly defines what should be built.

## What You Generate

### PRD Structure
1. **Executive Summary** — High-level overview
2. **User Stories** — Structured in "As a, I want, so that" format
3. **Functional Requirements** — What the system must do
4. **Non-Functional Requirements** — Performance, security, scalability
5. **Acceptance Criteria** — Conditions for completion
6. **Constraints & Risks** — Limitations and potential issues
7. **Prioritization** — Must-have vs nice-to-have

## Analysis Approach
- Focus on user value and business outcomes
- Consider edge cases and error states
- Include accessibility requirements
- Define clear acceptance criteria
- Think about analytics and metrics

## Output Format
Use clear markdown with:
- ## for major sections
- ### for subsections  
- Tables for requirements matrices
- User story cards with priority and estimate
- Checkboxes for acceptance criteria

Make it actionable for developers and designers.`;

// Generate PRD from project idea
export async function generatePRD(idea: string): Promise<ProductRequirementsDoc> {
  const prd: ProductRequirementsDoc = {
    overview: `A comprehensive solution for: ${idea}`,
    userStories: [],
    functionalRequirements: [],
    nonFunctionalRequirements: [],
    acceptanceCriteria: new Map(),
    constraints: [],
    risks: []
  };

  // In production, this would call LLM to populate all fields
  return prd;
}

export interface ProductRequirementsDoc {
  overview: string;
  userStories: UserStory[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
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
  acceptanceCriteria: string[];
}

export interface FunctionalRequirement {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dependencies: string[];
}

export interface NonFunctionalRequirement {
  category: string;
  requirement: string;
  metric: string;
  target: string;
}

// Format PRD as markdown
export function formatPRD(prd: ProductRequirementsDoc): string {
  return `# 📦 Product Requirements Document

## Executive Summary
${prd.overview}

## User Stories

| ID | Title | Priority | Estimate |
|----|-------|-----------|----------|
${prd.userStories.map(us => 
  `| ${us.id} | ${us.title} | ${us.priority} | ${us.estimate} |`
).join('\n')}

${prd.userStories.map(us => `### ${us.id}: ${us.title}
**As a** ${us.asA}  
**I want** ${us.iWant}  
**So that** ${us.soThat}

*Priority: ${us.priority} | Estimate: ${us.estimate}*

**Acceptance Criteria:**
${us.acceptanceCriteria.map(ac => `- [ ] ${ac}`).join('\n')}
`).join('\n')}

## Functional Requirements

${prd.functionalRequirements.map(fr => `### ${fr.id}: ${fr.title}
**Category:** ${fr.category}
**Priority:** ${fr.priority}
${fr.description}
${fr.dependencies.length ? `*Dependencies:* ${fr.dependencies.join(', ')}` : ''}
`).join('\n')}

## Non-Functional Requirements

| Category | Requirement | Metric | Target |
|----------|--------------|--------|--------|
${prd.nonFunctionalRequirements.map(nfr => 
  `| ${nfr.category} | ${nfr.requirement} | ${nfr.metric} | ${nfr.target} |`
).join('\n')}

## Constraints
${prd.constraints.map(c => `- ${c}`).join('\n')}

## Risks
${prd.risks.map(r => `- ${r}`).join('\n')}
`;
}