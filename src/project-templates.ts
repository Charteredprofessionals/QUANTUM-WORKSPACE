/**
 * Project Templates - One-Click Starters
 * Pre-built project templates for quick starts
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'tool';
  icon: string;
  stack: string[];
  files: Record<string, string>;
}

interface TemplateCategory {
  name: string;
  icon: string;
  templates: Template[];
}

// Built-in templates
const TEMPLATES: Template[] = [
  // Frontend
  {
    id: 'react-vite',
    name: 'React + Vite',
    description: 'Modern React with Vite build tool',
    category: 'frontend',
    icon: '⚛️',
    stack: ['React', 'Vite', 'JavaScript'],
    files: {
      'package.json': `{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  }
}`,
      'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
      'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/App.jsx': `import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>Hello, World!</h1>
      <p>You've clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default App`
    }
  },
  {
    id: 'nextjs',
    name: 'Next.js App',
    description: 'Full-featured React framework with SSR',
    category: 'frontend',
    icon: '▲',
    stack: ['Next.js', 'React', 'TypeScript'],
    files: {
      'package.json': `{
  "name": "my-next-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.1.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  }
}`,
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
      'app/page.tsx': `export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js</h1>
      <p>Get started by editing app/page.tsx</p>
    </main>
  )
}`,
      'app/layout.tsx': `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      'tsconfig.json': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
    }
  },
  {
    id: 'vue-vite',
    name: 'Vue 3 + Vite',
    description: 'Progressive JavaScript framework',
    category: 'frontend',
    icon: '💚',
    stack: ['Vue', 'Vite', 'JavaScript'],
    files: {
      'package.json': `{
  "name": "vue-app",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0"
  }
}`,
      'vite.config.js': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`,
      'index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
      'src/main.js': `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`,
      'src/App.vue': `<template>
  <h1>Hello Vue!</h1>
  <button @click="count++">Count: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>`
    }
  },
  {
    id: 'astro',
    name: 'Astro',
    description: 'Content-focused static site builder',
    category: 'frontend',
    icon: '🚀',
    stack: ['Astro', 'Markdown', 'JavaScript'],
    files: {
      'package.json': `{
  "name": "astro-site",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0"
  }
}`,
      'astro.config.mjs': `import { defineConfig } from 'astro/config'

export default defineConfig({})`,
      'src/pages/index.astro': `---
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Site</title>
  </head>
  <body>
    <h1>Hello Astro!</h1>
  </body>
</html>`
    }
  },
  // Backend
  {
    id: 'express-api',
    name: 'Express API',
    description: 'Fast Node.js REST API server',
    category: 'backend',
    icon: '🛤️',
    stack: ['Express', 'Node.js', 'JavaScript'],
    files: {
      'package.json': `{
  "name": "express-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}`,
      'index.js': `const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ])
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`))`
    }
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    description: 'Modern Python web framework',
    category: 'backend',
    icon: '🐍',
    stack: ['FastAPI', 'Python', 'Pydantic'],
    files: {
      'requirements.txt': `fastapi==0.109.0
uvicorn==0.27.0
pydantic==2.5.0`,
      'main.py': `from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id, "name": "Item"}

@app.post("/items/")
def create_item(item: Item):
    return item`,
      'README.md': `# FastAPI App

## Run
\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`
- API: http://localhost:8000
- Docs: http://localhost:8000/docs`
    }
  },
  {
    id: 'go-api',
    name: 'Go API',
    description: 'Simple Go REST API',
    category: 'backend',
    icon: '🔷',
    stack: ['Go', 'Gin', 'REST'],
    files: {
      'go.mod': `module github.com/user/myapp

go 1.21`,
      'main.go': `package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()

    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"message": "Hello, World!"})
    })

    r.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"status": "ok"})
    })

    r.Run()
}`,
      'README.md': `# Go API

## Run
\`\`\`bash
go run main.go
\`\`\`
Server: http://localhost:8080`
    }
  },
  // Fullstack
  {
    id: 't3-stack',
    name: 'T3 Stack',
    description: 'TypeScript fullstack (Next.js + tRPC + Prisma)',
    category: 'fullstack',
    icon: '⚡',
    stack: ['Next.js', 'TypeScript', 'tRPC', 'Prisma'],
    files: {
      'package.json': `{
  "name": "t3-app",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "@trpc/client": "^10.0.0",
    "@trpc/next": "^10.0.0",
    "@trpc/react-query": "^10.0.0",
    "@trpc/server": "^10.0.0",
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "superjson": "^2.0.0",
    "zod": "^3.0.0"
  }
}`,
      'src/server/api/trpc.ts': `import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;`,
      'src/server/api/root.ts': `import { router, publicProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query((opts) => {
      return { greeting: \`Hello, \${opts.input.text}!\` };
    }),
});

export type AppRouter = typeof appRouter;`
    }
  },
  // Mobile
  {
    id: 'react-native',
    name: 'React Native',
    description: 'Cross-platform mobile app',
    category: 'mobile',
    icon: '📱',
    stack: ['React Native', 'TypeScript'],
    files: {
      'package.json': `{
  "name": "myapp",
  "version": "1.0.0",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.0"
  }
}`,
      'App.tsx': `import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, Mobile!</Text>
      <Text style={styles.count}>Count: {count}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Increment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, marginBottom: 20 },
  count: { fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16 }
});

export default App;`
    }
  },
  {
    id: 'flutter',
    name: 'Flutter',
    description: 'Cross-platform mobile with Dart',
    category: 'mobile',
    icon: '🩵',
    stack: ['Flutter', 'Dart'],
    files: {
      'pubspec.yaml': `name: my_app
version: 1.0.0

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter`,
      'lib/main.dart': `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My App')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Count: \$_counter', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => setState(() => _counter++),
              child: const Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}`
    }
  },
  // Tools
  {
    id: 'cli-tool',
    name: 'CLI Tool',
    description: 'Build command-line tools',
    category: 'tool',
    icon: '⌨️',
    stack: ['Node.js', 'Commander', 'TypeScript'],
    files: {
      'package.json': `{
  "name": "my-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-cli": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "commander": "^11.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}`,
      'src/index.ts': `import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('My awesome CLI tool')
  .version('1.0.0');

program
  .command('greet <name>')
  .description('Greet someone')
  .action((name) => {
    console.log(\`Hello, \${name}!\`);
  });

program.parse();`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}`
    }
  },
  {
    id: 'library',
    name: 'JS Library',
    description: 'Publishable npm package',
    category: 'tool',
    icon: '📚',
    stack: ['TypeScript', 'ESM', 'JSDoc'],
    files: {
      'package.json': `{
  "name": "my-lib",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "echo \"Tests passed\""
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}`,
      'src/index.ts': `/**
 * My awesome library
 * @param value - The input value
 * @returns The processed value
 */
export function process(value: string): string {
  return value.toUpperCase();
}

export class MyClass {
  constructor(private value: string) {}
  getValue(): string { return this.value; }
}`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}`
    }
  }
];

export class ProjectTemplates {
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  }

  // Get all templates
  getAll(): Template[] {
    return TEMPLATES;
  }

  // Get templates by category
  getByCategory(category: string): Template[] {
    return TEMPLATES.filter(t => t.category === category);
  }

  // Show template selector
  async showSelector(): Promise<Template | null> {
    const categories = ['frontend', 'backend', 'fullstack', 'mobile', 'tool'];
    
    const items = TEMPLATES.map(t => ({
      label: `${t.icon} ${t.name}`,
      description: t.description,
      detail: t.stack.join(' • '),
      template: t
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select a project template...'
    });

    return selected?.template || null;
  }

  // Create project from template
  async createFromTemplate(template: Template, projectName: string): Promise<boolean> {
    const projectPath = path.join(this.workspaceRoot, projectName);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      vscode.window.showErrorMessage('Directory already exists!');
      return false;
    }

    // Create directory
    fs.mkdirSync(projectPath, { recursive: true });

    // Write files
    for (const [filePath, content] of Object.entries(template.files)) {
      const fullPath = path.join(projectPath, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content);
    }

    // Show success
    vscode.window.showInformationMessage(`✅ Created ${template.name} project!`);
    
    // Open in explorer
    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(projectPath));

    return true;
  }

  // Quick create (show selector + create)
  async quickCreate(): Promise<void> {
    const template = await this.showSelector();
    if (!template) return;

    const name = await vscode.window.showInputBox({
      prompt: 'Project name',
      value: template.id,
      validateInput: (v) => v ? '' : 'Name is required'
    });

    if (name) {
      await this.createFromTemplate(template, name);
    }
  }
}