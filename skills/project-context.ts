/**
 * Project Context Skill
 * Generates project-specific rules, workflows, and context documentation
 */

export const PROJECT_CONTEXT_PROMPT = `You are the Project Context Generator for AI Dev Suite.

## Your Role
Generate comprehensive project-specific documentation that becomes the authoritative context for all work on a project.

## What You Generate

### 1. project-context.md
The single source of truth for the project:
- Project name and description
- Business objectives and success criteria
- Tech stack and architecture decisions
- Coding standards and conventions
- File organization rules
- Testing requirements
- Documentation style

### 2. Project-Specific Skills
Custom skills tailored to the project:
- Domain-specific linting rules
- Specialized code generators
- Custom validation functions
- Project-specific prompts for agents

### 3. Workflow Configuration
Tailored workflows for the project:
- Development workflow (/create, /review)
- Deployment workflow
- Release process
- Incident response procedures

## Output Format
Generate a complete project-context.md file with all sections populated based on the project details provided.

Use clear markdown with:
- ## for major sections
- ### for subsections
- bullet points for lists
- code blocks for examples
- tables where appropriate

Make it comprehensive enough that any developer (or AI agent) can understand the project conventions and work effectively.`;

// Generate project-context.md from charter
export async function generateProjectContext(
  projectCharter: any,
  systemDesign: any,
  designSystem: any
): Promise<string> {
  return `# 📋 Project Context: ${projectCharter.name}

> **Generated:** ${new Date().toISOString().split('T')[0]}
> **Project ID:** ${projectCharter.projectId || 'TBD'}

---

## 🎯 Project Overview

### Vision
${projectCharter.vision}

### Mission
${projectCharter.mission}

### Objectives
${projectCharter.objectives.map((o: string) => `- ${o}`).join('\n')}

### Success Criteria
${projectCharter.successCriteria.map((s: string) => `- ${s}`).join('\n')}

---

## 🛠 Technology Stack

### Frontend
${systemDesign?.techStack?.frontend?.join(', ') || 'TBD'}

### Backend
${systemDesign?.techStack?.backend?.join(', ') || 'TBD'}

### Database
${systemDesign?.techStack?.database?.join(', ') || 'TBD'}

### Infrastructure
${systemDesign?.techStack?.infrastructure?.join(', ') || 'TBD'}

### Tools & Services
${systemDesign?.techStack?.tools?.join(', ') || 'TBD'}

---

## 📐 Architecture

### Pattern
${systemDesign?.architecturePattern || 'TBD'}

### Components
${systemDesign?.components?.map((c: any) => 
  `- **${c.name}**: ${c.responsibility} (${c.techStack})`
).join('\n') || 'TBD'}

### Data Model
${systemDesign?.dataModel?.entities?.map((e: any) => 
  `- ${e.name}: ${e.fields?.map((f: any) => f.name).join(', ')}`
).join('\n') || 'TBD'}

### API Design
- Base URL: ${systemDesign?.apiSpec?.baseUrl || '/api/v1'}
- Authentication: ${systemDesign?.apiSpec?.auth || 'TBD'}
- Rate Limiting: ${systemDesign?.apiSpec?.rateLimit || 'TBD'}

---

## 📝 Coding Standards

### Language Guidelines
\`\`\`typescript
// Use TypeScript with strict mode
// Prefer functional over OOP where possible
// Use async/await over promises
\`\`\`

### Naming Conventions
- **Files**: kebab-case (e.g., \`user-service.ts\`)
- **Classes**: PascalCase (e.g., \`UserService\`)
- **Functions**: camelCase (e.g., \`getUserById\`)
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase with 'I' prefix optional

### Code Style
- Use ESLint with Airbnb config
- Use Prettier for formatting
- Maximum line length: 100 characters
- Use explicit return types for public APIs

### Error Handling
\`\`\`typescript
// Use custom error classes
// Always log errors with context
// Never expose raw errors to users
\`\`\`

---

## 📁 File Organization

\`\`\`
src/
├── api/           # API routes and controllers
├── core/          # Business logic and services
├── models/        # Data models and interfaces
├── utils/         # Utility functions
├── config/        # Configuration files
├── middleware/    # Express middleware
└── tests/         # Test files

docs/
├── api/           # API documentation
├── architecture/ # Architecture decisions
└── guides/        # User guides
\`\`\`

---

## 🧪 Testing Strategy

### Test Types
1. **Unit Tests** — 80% coverage minimum
2. **Integration Tests** — Critical paths
3. **E2E Tests** — User journeys

### Test Frameworks
- Jest for unit tests
- Supertest for API integration
- Playwright for E2E

### Testing Conventions
\`\`\`typescript
// Test file naming: *.test.ts or *.spec.ts
// Describe blocks: "should [expected behavior]"
// AAA pattern: Arrange, Act, Assert
\`\`\`

---

## 📚 Documentation Standards

### Code Documentation
- JSDoc for public APIs
- README for each module
- Inline comments for complex logic

### Documentation Files
- \`README.md\` — Project overview and setup
- \`CONTRIBUTING.md\` — Contribution guidelines
- \`ARCHITECTURE.md\` — System architecture
- \`API.md\` — API reference

---

## 🔒 Security Requirements

### Authentication
${systemDesign?.securityDesign?.authentication || 'TBD'}

### Authorization
${systemDesign?.securityDesign?.authorization || 'TBD'}

### Data Protection
${systemDesign?.securityDesign?.dataProtection?.map((p: string) => `- ${p}`).join('\n') || 'TBD'}

### Compliance
${systemDesign?.securityDesign?.compliance?.map((c: string) => `- ${c}`).join('\n') || 'TBD'}

---

## 🚀 Workflow Rules

### Development Workflow
1. Create feature branch from \`develop\`
2. Implement feature with tests
3. Run lint + tests locally
4. Open PR for review
5. Pass CI/CD pipeline
6. Merge to \`develop\`

### Code Review Criteria
- Tests pass
- No linting errors
- Documentation updated
- At least 1 approval

### Deployment
- \`develop\` → staging (auto)
- \`main\` → production (manual approval)

---

## ⚡ Project-Specific Rules

### DO
- Write tests for new features
- Update documentation when APIs change
- Use environment variables for secrets
- Log structured JSON for observability

### DON'T
- Commit secrets to git
- Skip code review
- Leave TODO comments in production code
- Write complex functions (>50 lines)

---

## 📞 Support

- **Documentation:** \`/docs\`
- **Issues:** Create GitHub issue
- **Questions:** Use #dev-help channel

---

*This document is the source of truth. Update it when project context changes.*`;
}

// Generate project-specific skills
export async function generateProjectSkills(
  projectContext: string,
  prd: any
): Promise<ProjectSkills> {
  return {
    name: `${prd?.name || 'Project'} Custom Skills`,
    skills: [
      {
        name: 'domain-validator',
        description: 'Validate domain-specific entities and business rules',
        rules: prd?.functionalRequirements?.map((r: any) => r.description) || []
      },
      {
        name: 'feature-generator',
        description: 'Generate code following project conventions',
        conventions: projectContext
      },
      {
        name: 'test-generator',
        description: 'Generate tests following project testing standards',
        framework: 'jest'
      }
    ]
  };
}

export interface ProjectSkills {
  name: string;
  skills: {
    name: string;
    description: string;
    rules?: string[];
    conventions?: string;
    framework?: string;
  }[];
}