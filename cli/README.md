# AI Dev Suite CLI

> Enterprise SDLC Operating System - Terminal Interface

Full-featured CLI with Git integration, MCP support, and complete SDLC workflow.

## Installation

```bash
git clone https://github.com/Charteredprofessionals/vs-extension.git
cd vs-extension/cli
npm install
npm run build
npm link  # Enable 'ai-dev-suite' globally
```

## Quick Start

```bash
ai-dev-suite new "Build a task management app"
ai-dev-suite develop
ai-dev-suite create "Add user authentication"
```

## Git Commands

Full Git integration with commits, branches, PRs:

```bash
# Status
ai-dev-suite git status
ai-dev-suite git st

# Commits
ai-dev-suite git commit -m "feat: add auth"
ai-dev-suite git commit -a -m "chore: update deps"

# Branches
ai-dev-suite git branch create feature/auth
ai-dev-suite git branch delete feature/old-branch
ai-dev-suite git checkout feature/auth

# Pull Requests
ai-dev-suite git pr create -t "Add authentication"
ai-dev-suite git pr list
ai-dev-suite git pr merge 42

# Other
ai-dev-suite git log -n 20
ai-dev-suite git diff
ai-dev-suite git push
ai-dev-suite git pull
ai-dev-suite git fetch
ai-dev-suite git stash push -m "WIP"
ai-dev-suite git stash pop
ai-dev-suite git merge feature/auth
```

## MCP Support (Open-Source)

Built-in support for free, open-source MCP servers:

| Server | Description | Command |
|--------|-------------|---------|
| filesystem | File operations | `npx @modelcontextprotocol/server-filesystem` |
| git | Git operations | `npx @modelcontextprotocol/server-git` |
| github | GitHub API | `npx @modelcontextprotocol/server-github` |
| fetch | Web content | `uvx mcp-server-fetch` |
| sqlite | Database | `npx @modelcontextprotocol/server-sqlite` |
| postgres | Database | `npx @modelcontextprotocol/server-postgres` |
| sequential-thinking | Advanced reasoning | `npx @mcp/sequential-thinking` |
| puppeteer | Browser automation | `npx @modelcontextprotocol/server-puppeteer` |

Enable MCP servers in `ai-dev-suite.config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

## SDLC Commands

```bash
ai-dev-suite init [name]        # Initialize project
ai-dev-suite new <idea>          # Viability analysis
ai-dev-suite develop             # Development mode
ai-dev-suite create <spec>       # Create feature
ai-dev-suite review <file>       # Code review
ai-dev-suite test                # Run tests
ai-dev-suite harden              # Security + performance
ai-dev-suite deploy              # Deploy
ai-dev-suite ops                 # Post-launch
ai-dev-suite chat [agent]        # Chat with agents
ai-dev-suite config              # Configuration
ai-dev-suite mcp                 # MCP management
```

## Workflow Example

```bash
# Start new project
ai-dev-suite new "Build a healthcare app for patients"

# Work with Git
ai-dev-suite git branch create feature/patient-portal
ai-dev-suite develop
ai-dev-suite create "Add patient registration form"

# Review and commit
ai-dev-suite review src/patient-form.tsx
ai-dev-suite git commit -m "feat: add patient registration"
ai-dev-suite git push

# Create PR
ai-dev-suite git pr create -t "Patient Portal" -d

# Deploy when ready
ai-dev-suite harden
ai-dev-suite deploy
ai-dev-suite ops
```