#!/bin/bash
# Push to GitHub script for AI Dev Suite

set -e

cd "$(dirname "$0")"

echo "📦 Adding files..."
git add -A

echo "💬 Committing..."
git commit -m "Initial commit: AI Dev Suite - Enterprise SDLC Operating System

Features:
- Complete SDLC workflow (Viability → Charter → Dev → Hardening → Launch → Operations)
- Multi-agent system (Architect, Developer, Designer)
- Multi-provider LLM support (OpenRouter, Ollama, Agent Router)
- Project-specific skills and workflows
- Kickoff automation"

echo "🚀 Creating GitHub repository..."
gh repo create ai-dev-suite --public --source=. --push

echo "✅ Done! Your project is now on GitHub."