# Quantum Workspace - Project Templates

## Available Templates

### Frontend Templates

#### ⚛️ React + Vite
- **Use for:** Modern React apps with fast build
- **Stack:** React 18, Vite, JavaScript
- **Files:** `src/main.jsx`, `src/App.jsx`, `vite.config.js`

#### ▲ Next.js
- **Use for:** Full-featured React with SSR
- **Stack:** Next.js 14, React 18, TypeScript
- **Files:** `app/page.tsx`, `app/layout.tsx`, `next.config.js`

#### 💚 Vue 3 + Vite
- **Use for:** Progressive JS framework
- **Stack:** Vue 3, Vite, JavaScript
- **Files:** `src/main.js`, `src/App.vue`, `vite.config.js`

#### 🚀 Astro
- **Use for:** Content-focused static sites
- **Stack:** Astro, Markdown, JavaScript
- **Files:** `src/pages/index.astro`, `astro.config.mjs`

### Backend Templates

#### 🛤️ Express API
- **Use for:** REST API servers
- **Stack:** Express, Node.js, JavaScript
- **Files:** `index.js`, routes, middleware

#### 🐍 FastAPI
- **Use for:** Modern Python APIs
- **Stack:** FastAPI, Pydantic, Uvicorn
- **Files:** `main.py`, `requirements.txt`

#### 🔷 Go API
- **Use for:** Fast, simple APIs
- **Stack:** Go, Gin, REST
- **Files:** `main.go`, `go.mod`

### Fullstack Templates

#### ⚡ T3 Stack
- **Use for:** TypeScript fullstack apps
- **Stack:** Next.js, tRPC, Prisma, TypeScript
- **Files:** Server API, type-safe calls

### Mobile Templates

#### 📱 React Native
- **Use for:** Cross-platform mobile apps
- **Stack:** React Native, TypeScript
- **Files:** `App.tsx`

#### 🩵 Flutter
- **Use for:** Beautiful mobile apps
- **Stack:** Flutter, Dart
- **Files:** `lib/main.dart`

### Tool Templates

#### ⌨️ CLI Tool
- **Use for:** Command-line utilities
- **Stack:** Node.js, Commander, TypeScript
- **Files:** `src/index.ts`

#### 📚 JS Library
- **Use for:** Publishable npm packages
- **Stack:** TypeScript, ESM
- **Files:** `src/index.ts`, `package.json`

---

## How to Use Templates

### Via Command Palette
1. Press `Ctrl+Shift+P`
2. Type `Quantum Workspace: Create Project`
3. Select a template
4. Enter project name

### Via Simple Mode
1. Switch to Simple Mode
2. Click "Website", "Blog", "App", etc.
3. Describe your idea
4. AI generates the project

### Via Terminal
```bash
quantumWorkspace.templates
```

---

## Customizing Templates

Templates can be modified in:
```
src/project-templates.ts
```

Each template has:
- `id` - Unique identifier
- `name` - Display name
- `files` - File contents to generate

---

## Adding New Templates

```typescript
{
  id: 'my-template',
  name: 'My Custom Template',
  description: 'What it does',
  category: 'frontend',
  icon: '🎨',
  stack: ['MyStack'],
  files: {
    'package.json': '{...}',
    'src/index.js': '...'
  }
}
```