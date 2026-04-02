/**
 * System Design Skill
 * Generates comprehensive architecture and system design documents
 */

export const SYSTEM_DESIGN_PROMPT = `You are a Chief Architect for AI Dev Suite.

## Your Role
Design robust, scalable system architectures that meet functional requirements while considering trade-offs.

## What You Generate

### System Design Document
1. **Architecture Overview** — High-level design and patterns
2. **Component Architecture** — Detailed component breakdown
3. **Data Model** — Entity relationships and schemas
4. **API Specification** — REST/GraphQL endpoints
5. **Security Design** — Auth, authorization, data protection
6. **Infrastructure Design** — Hosting, scaling, CDN
7. **Architecture Diagram** — Mermaid syntax visualization
8. **ADRs** — Architecture Decision Records

## Design Principles
- Prefer simplicity over cleverness
- Design for failure
- Make implicit decisions explicit
- Consider costs (development + operations)
- Think about developer experience

## Output Format
Use clear markdown with architecture diagrams in Mermaid syntax. Explain decisions with context, decision, and consequences.`;

// Generate System Design Document
export async function generateSystemDesign(requirements: string): Promise<SystemDesignDocument> {
  return {
    overview: `System design for: ${requirements}`,
    architecturePattern: 'Microservices',
    components: [],
    dataModel: { entities: [], relationships: [] },
    apiSpec: { endpoints: [], auth: 'JWT', rateLimit: '100/min' },
    securityDesign: { authentication: 'OAuth 2.0', authorization: 'RBAC', dataProtection: [], compliance: [] },
    infrastructureDesign: { hosting: 'AWS', cdn: 'CloudFront', services: [], scaling: 'Auto-scaling' },
    diagram: ''
  };
}

export interface SystemDesignDocument {
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

// Format as markdown with Mermaid diagram
export function formatSystemDesign(doc: SystemDesignDocument): string {
  return `# 🏗️ System Design Document

## Overview
${doc.overview}

## Architecture Pattern
${doc.architecturePattern}

## Component Diagram
\`\`\`mermaid
graph TB
${doc.components.map(c => `  ${c.name}["${c.name}"]`).join('\n')}
${doc.components.flatMap(c => 
  c.dependencies.map(d => `  ${d} --> ${c.name}`)
).join('\n')}
\`\`\`

## Components

${doc.components.map(c => `### ${c.name}
- **Type:** ${c.type}
- **Responsibility:** ${c.responsibility}
- **Tech Stack:** ${c.techStack}
- **Interfaces:** ${c.interfaces.join(', ')}
`).join('\n')}

## API Specification

${doc.apiSpec.endpoints.map(e => `- **${e.method}** \`${e.path}\`: ${e.description}`).join('\n')}

**Authentication:** ${doc.apiSpec.auth}
**Rate Limiting:** ${doc.apiSpec.rateLimit}

## Security Design

- **Authentication:** ${doc.securityDesign.authentication}
- **Authorization:** ${doc.securityDesign.authorization}

### Data Protection
${doc.securityDesign.dataProtection.map(p => `- ${p}`).join('\n')}

### Compliance
${doc.securityDesign.compliance.map(c => `- ${c}`).join('\n')}

## Infrastructure

- **Hosting:** ${doc.infrastructureDesign.hosting}
- **CDN:** ${doc.infrastructureDesign.cdn}
- **Scaling:** ${doc.infrastructureDesign.scaling}
`;
}