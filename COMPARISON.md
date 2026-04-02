# AI Dev Suite vs Claude Code vs Cursor vs Copilot — Feature Comparison

## Overview

| Aspect | AI Dev Suite | Claude Code | Cursor | GitHub Copilot |
|--------|--------------|-------------|--------|----------------|
| **Type** | VS Code Extension + CLI | Multi-platform (Terminal, IDE, Web, Desktop) | Fork of VS Code | VS Code Extension |
| **Core Focus** | Enterprise SDLC + Business Viability | General-purpose AI coding | AI-first code editor | Autocomplete + Chat |
| **License** | Open Source (MIT) | Proprietary (Anthropic) | Proprietary | Proprietary (Microsoft) |
| **LLM Providers** | Multi-provider (OpenRouter, Ollama, Anthropic, OpenAI, Google, Mistral, Cohere, DeepSeek, Qwen) | Anthropic (native) + 3rd-party | OpenAI, Anthropic | OpenAI, Anthropic, Google |
| **Offline/Local** | ✅ Ollama, custom local | ❌ Cloud only | ⚠️ Limited | ❌ Cloud only |
| **Self-Hostable** | ✅ | ❌ | ❌ | ❌ |
| **GitHub** | https://github.com/Charteredprofessionals/vs-extension | N/A | cursor.com | copilot.microsoft.com |

---

## Enterprise SDLC Features

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **Business Viability Analysis** | ✅ Phase 0: Market, revenue, risk | ❌ | ❌ | ❌ |
| **Project Charter Generation** | ✅ PRD, architecture, design system | ⚠️ Via CLAUDE.md (manual) | ❌ | ❌ |
| **Phase Gates (GO/NO-GO/PIVOT)** | ✅ Built-in workflow | ❌ | ❌ | ❌ |
| **Post-Launch Operations** | ✅ Monitoring, incidents, scaling | ⚠️ Scheduled tasks | ❌ | ❌ |
| **Revenue Model Planning** | ✅ Unit economics, pricing tiers | ❌ | ❌ | ❌ |
| **Incident Playbooks** | ✅ Severity levels, runbooks | ⚠️ Basic | ❌ | ❌ |

---

## Agent / AI Architecture

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **Specialized Agents** | 3 distinct (Architect, Developer, Designer) | Sub-agents (general purpose) | ⚠️ Single AI agent | ⚠️ Single AI agent |
| **Agent Personas** | Built-in roles with expertise | Custom via instructions | ⚠️ Via .cursorrules | ⚠️ Via .github/copilot-instructions |
| **Context Awareness** | project-context.md (auto-generated) | CLAUDE.md + auto-memory | .cursorrules | .cursorrules |
| **Multi-Agent Coordination** | ✅ Workflow orchestrator | ✅ Agent teams | ❌ | ❌ |
| **Multi-Provider Routing** | ✅ Auto, cost-optimized, performance | ❌ (single provider) | ⚠️ Manual switch | ⚠️ Manual switch |
| **Fallback Logic** | ✅ Automatic provider failover | ⚠️ Manual | ❌ | ❌ |

---

## Git Integration

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **Commits** | ✅ CLI + agent-assisted | ✅ Full | ✅ Full | ⚠️ Basic |
| **Branch Management** | ✅ Create, delete, checkout | ✅ Full | ✅ Full | ❌ |
| **Pull Requests** | ✅ Create, list, merge via gh CLI | ✅ Full | ✅ Full | ⚠️ Via Copilot PR review |
| **PR Review** | ✅ Agent-assisted code review | ✅ Full | ✅ Full | ✅ PR review agent |
| **Merge/Rebase** | ✅ Full support | ✅ Full | ✅ Full | ⚠️ Via terminal |
| **Stash** | ✅ Push, pop, list | ✅ Full | ✅ Full | ❌ |
| **CI/CD Integration** | ✅ GitHub Actions, GitLab CI/CD | ✅ Full | ⚠️ Limited | ✅ GitHub Actions |

---

## MCP Support

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **MCP Support** | ✅ Open-source servers | ✅ Full MCP ecosystem | ⚠️ Custom extensions | ✅ MCP (limited) |
| **Open-Source MCP Servers** | ✅ 8 free servers | ⚠️ Community only | ❌ | ❌ |
| **Filesystem MCP** | ✅ Free | ✅ | ⚠️ | ⚠️ |
| **Git MCP** | ✅ Free | ✅ | ⚠️ Built-in | ⚠️ |
| **GitHub MCP** | ✅ Free (needs token) | ✅ | ⚠️ Built-in | ✅ Built-in |
| **Database MCP** | ✅ SQLite, PostgreSQL (free) | ⚠️ Community | ❌ | ❌ |

---

## Code Understanding & Generation

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **Code Autocomplete** | ❌ (terminal focus) | ⚠️ Via extensions | ✅ Full | ✅ Full |
| **Code Generation** | ✅ Agent-driven | ✅ Full | ✅ Full | ✅ Full |
| **Code Review** | ✅ Dedicated workflow | ✅ Full | ✅ Full | ✅ PR review |
| **Multi-file Editing** | ✅ Via agent orchestrator | ✅ Parallel | ✅ Agent edit | ✅ Multi-file |
| **Test Generation** | ✅ With testing strategy | ✅ Full | ✅ Full | ✅ Via chat |
| **Debug Assistance** | ✅ Agent-assisted RCA | ✅ Full | ✅ Full | ✅ Via chat |
| **Refactoring** | ✅ Goal-based refactoring | ✅ Full | ✅ Agent mode | ✅ Via chat |

---

## Platform Availability

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **VS Code** | ✅ Extension | ✅ Extension | N/A (is its own) | ✅ Extension |
| **Terminal CLI** | ✅ Full-featured | ✅ Full-featured | ❌ | ❌ |
| **Desktop App** | ❌ | ✅ | N/A | ❌ |
| **Web** | ❌ | ✅ | ❌ | ✅ (github.com) |
| **JetBrains** | ❌ | ✅ Plugin | ❌ | ✅ Plugin |
| **iOS** | ❌ | ✅ | ❌ | ❌ |
| **Remote Sessions** | ❌ | ✅ Remote Control | ❌ | ❌ |

---

## Scheduling & Automation

| Feature | AI Dev Suite | Claude Code | Cursor | Copilot |
|---------|--------------|-------------|--------|---------|
| **Scheduled Tasks** | ❌ Planned | ✅ Cloud + Desktop | ❌ | ✅ Via GitHub Actions |
| **CI/CD Automation** | ✅ Built-in config | ✅ GitHub Actions | ⚠️ Limited | ✅ Native |
| **Hooks** | ❌ Planned | ✅ Pre/post-action hooks | ⚠️ Custom scripts | ❌ |
| **Recurring Tasks** | ❌ | ✅ /loop, /schedule | ❌ | ❌ |

---

## Pricing

| Aspect | AI Dev Suite | Claude Code | Cursor | Copilot |
|--------|--------------|-------------|--------|---------|
| **Core** | Free (open source) | Pro: $20/mo | Pro: $20/mo | $10/mo (individual) |
| **Business** | Free (self-host) | Business: $25/user | Business: $40/user | Business: $39/user |
| **API Costs** | Pay per provider | Included in sub | Included in sub | Included in sub |
| **Local/Offline** | Free (Ollama) | ❌ | ❌ | ❌ |
| **Custom Models** | ✅ | ⚠ Limited | ⚠️ Limited | ⚠️ Limited |

---

## When to Choose Which

### Choose AI Dev Suite When:

- ✅ You need **business viability analysis** before coding
- ✅ You want **enterprise SDLC** with phase gates and governance
- ✅ You prefer **local/offline** LLMs (Ollama)
- ✅ You need **multi-provider** flexibility with automatic fallback
- ✅ You want **open source** and full self-hosting control
- ✅ You need **project charter** automation (PRD, architecture, design)
- ✅ You need **post-launch operations** (monitoring, incidents, scaling)
- ✅ You want **terminal-first** development with full Git integration
- ✅ Zero vendor lock-in

### Choose Claude Code When:

- ✅ You want a **mature, production-tested** AI coding tool
- ✅ You need **multi-platform** support (Terminal, Web, Desktop, JetBrains)
- ✅ You want **MCP ecosystem** access to external tools
- ✅ You need **remote control** (work from phone/iOS)
- ✅ You have **Anthropic subscription** and want Claude access
- ✅ You need **scheduled recurring tasks** (cloud-based)
- ✅ You want **agent teams** with sub-task delegation

### Choose Cursor When:

- ✅ You want AI **deeply integrated into editor UX**
- ✅ You need the best **inline edit/autocomplete experience**
- ✅ You work primarily in **one codebase at a time**
- ✅ You want **visual diff review** inline
- ✅ You don't mind a **forked editor**

### Choose GitHub Copilot When:

- ✅ You're already in the **GitHub ecosystem**
- ✅ You want the **best autocomplete experience**
- ✅ You need **PR review automation** at scale
- ✅ You want **enterprise SSO** and compliance
- ✅ You're a team that wants **seamless VS Code integration**

---

## Summary Matrix

| Dimension | AI Dev Suite | Claude Code | Cursor | Copilot |
|-----------|--------------|-------------|--------|---------|
| SDLC Governance | 🟢 Excellent | 🔴 None | 🔴 None | 🔴 Basic |
| Business Analysis | 🟢 Built-in | 🔴 None | 🔴 None | 🔴 None |
| Multi-Agent | 🟢 3 specialized | 🟢 Sub-agents | 🟡 Single | 🟡 Single |
| Local/Offline | 🟢 Full support | 🔴 None | 🔴 None | 🔴 None |
| Multi-Provider | 🟢 10+ providers | 🟡 Claude only | 🟡 2 providers | 🟡 3 providers |
| Open Source | 🟢 MIT | 🔴 Proprietary | 🔴 Proprietary | 🔴 Proprietary |
| Git Integration | 🟢 Full CLI | 🟢 Full | 🟢 Full | 🟡 Basic |
| MCP Support | 🟢 8 free servers | 🟢 Full ecosystem | 🟡 Custom | 🟡 Limited |
| Autocomplete | 🔴 Not yet | ⚠️ Extensions | 🟢 Excellent | 🟢 Excellent |
| Editor UX | ⚠️ VS Code ext | 🟢 All platforms | 🟢 Best | 🟢 Standard |
| Enterprise Ready | 🟢 Phase gates | ⚠️ Subscription | ⚠️ Pro only | 🟢 Enterprise plan |
| Scheduling | 🔴 Planned | 🟢 Cloud + Desktop | 🔴 None | 🟡 Actions only |

---

## Bottom Line

- **AI Dev Suite** = Best for enterprise teams needing governance, viability analysis, full SDLC, and zero vendor lock-in
- **Claude Code** = Best general-purpose AI coding tool with multi-platform reach
- **Cursor** = Best UI/UX for AI-assisted coding in a single workflow
- **Copilot** = Best for teams already in the GitHub ecosystem

---

*Generated: April 2026 | Source: https://github.com/Charteredprofessionals/vs-extension*