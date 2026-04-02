# Quantum Workspace Documentation

## Table of Contents

1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Commands](#commands)
4. [Configuration](#configuration)
5. [Templates](#templates)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Charteredprofessionals/QUANTUM-WORKSPACE.git
cd QUANTUM-WORKSPACE

# Install dependencies
npm install

# Build the extension
npm run build
```

### Quick Start

1. Open VS Code in the `quantum-workspace` folder
2. Press `F5` to launch the extension
3. Use `Ctrl+Shift+P` to open command palette
4. Type `Quantum` to see available commands

---

## Features

### 🧠 AI-Powered Core
- **Quantum Brain** - Unified AI engine
- **Context Indexer** - Indexes entire codebase
- **Smart Memory** - Remembers project preferences
- **Response Cache** - Caches LLM responses for speed

### 👤 Simple Mode (Non-Technical Users)
- Goal-based project creation
- Visual UI with plain English
- Pre-built templates (Website, Blog, Store, Portfolio, App)
- Click-to-create workflow

### 👨‍💻 Developer Mode
- Full CLI access
- AI agents: Architect, Developer, Designer
- Visual Git UI
- AI Terminal with smart suggestions

### 🔨 One-Click Build
Auto-detects project type:
- Node.js (npm/yarn/pnpm)
- Python (pip/poetry)
- Go (Go modules)
- Rust (Cargo)

### 🚀 One-Click Deploy
- Vercel
- Cloudflare Pages
- Netlify

### 📋 Project Templates
- React + Vite
- Next.js
- Vue 3 + Vite
- Astro
- Express API
- FastAPI
- Go API
- T3 Stack
- React Native
- Flutter
- CLI Tool
- JS Library

### 🔌 Plugin System
Create custom plugins in `.quantum/plugins/`

---

## Commands

| Command | Description |
|---------|-------------|
| `quantumWorkspace.start` | Start Quantum Workspace |
| `quantumWorkspace.simpleMode` | Switch to Simple Mode |
| `quantumWorkspace.developerMode` | Switch to Developer Mode |
| `quantumWorkspace.switchMode` | Toggle between modes |
| `quantumWorkspace.build` | Build project |
| `quantumWorkspace.quickBuild` | Quick build |
| `quantumWorkspace.clean` | Clean build artifacts |
| `quantumWorkspace.package` | Package for distribution |
| `quantumWorkspace.git` | Open Visual Git |
| `quantumWorkspace.terminal` | Open AI Terminal |
| `quantumWorkspace.deploy` | Deploy to cloud |
| `quantumWorkspace.deployVercel` | Deploy to Vercel |
| `quantumWorkspace.deployCloudflare` | Deploy to Cloudflare |
| `quantumWorkspace.templates` | Browse templates |
| `quantumWorkspace.createProject` | Create project |
| `quantumWorkspace.plugins` | Manage plugins |

---

## Configuration

### Settings

```json
{
  "quantumWorkspace.mode": "simple",
  "quantumWorkspace.providers.openrouter.enabled": true,
  "quantumWorkspace.providers.openrouter.apiKey": "your-key",
  "quantumWorkspace.providers.ollama.enabled": true,
  "quantumWorkspace.providers.ollama.endpoint": "http://localhost:11434"
}
```

### LLM Providers

#### OpenRouter
```json
{
  "providers.openrouter.enabled": true,
  "providers.openrouter.apiKey": "your-key",
  "providers.openrouter.defaultModel": "anthropic/claude-3.5-sonnet"
}
```

#### Ollama (Local)
```json
{
  "providers.ollama.enabled": true,
  "providers.ollama.endpoint": "http://localhost:11434",
  "providers.ollama.defaultModel": "llama3.3"
}
```

---

## Deployment

### Vercel
```bash
quantumWorkspace.deployVercel
```

### Cloudflare Pages
```bash
quantumWorkspace.deployCloudflare
```

### Netlify
```bash
# Use deploy command and select Netlify
quantumWorkspace.deploy
```

---

## Troubleshooting

### Common Issues

**Q: Extension not loading**
- Ensure Node.js 18+ is installed
- Run `npm install` again
- Check VS Code developer console

**Q: LLM not working**
- Check API key in settings
- Ensure Ollama is running (if using local)
- Check network connection

**Q: Build failing**
- Check Node.js version
- Clear node_modules and reinstall
- Check build script in package.json

---

## License

**PROPRIETARY** - All rights reserved
Copyright © 2026 Quantum Technologies