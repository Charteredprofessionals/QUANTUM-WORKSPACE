# Quantum Workspace - Web IDE

This directory contains the web-based version of Quantum Workspace that runs in a browser.

## Quick Start

### Development
```bash
cd web
npm install
npm run dev
```

### Production Build
```bash
cd web
npm run build
```

### Deploy

#### Vercel
```bash
cd web
vercel deploy
```

#### Cloudflare Pages
```bash
cd web
wrangler pages deploy dist
```

---

## Features (Web Version)

| Feature | Status |
|---------|--------|
| Code Editor | ✅ Monaco Editor |
| AI Chat | ✅ Built-in |
| Simple Mode | ✅ |
| Terminal | ✅ Web Terminal |
| File Explorer | ✅ |
| Git UI | ✅ |
| Templates | ✅ |
| Deploy | ✅ (one-click) |

---

## Tech Stack

- **Frontend**: React + TypeScript
- **Editor**: Monaco Editor (VS Code's editor)
- **Terminal**: Xterm.js
- **Build**: Vite
- **Deployment**: Vercel / Cloudflare / Netlify

---

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   ├── Editor/
│   │   ├── Terminal/
│   │   ├── FileExplorer/
│   │   ├── SimpleMode/
│   │   └── Chat/
│   ├── hooks/
│   ├── services/
│   │   ├── ai/
│   │   ├── files/
│   │   └── deploy/
│   └── App.tsx
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

---

## API Configuration

Set environment variables for LLM providers:

```env
VITE_OPENROUTER_API_KEY=your-key
VITE_OLLAMA_ENDPOINT=http://localhost:11434
```

---

## License

**PROPRIETARY** - Copyright © 2026 Quantum Technologies