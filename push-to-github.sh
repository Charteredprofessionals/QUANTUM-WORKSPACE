#!/bin/bash
# Quantum Workspace - Push to GitHub

echo "🔄 Pushing Quantum Workspace to GitHub..."

# First, authenticate with GitHub (run this once):
# gh auth login

# Or set up a new repo:
# gh repo create QuantumTechnologies/quantum-workspace --public

# Push to GitHub
cd /root/.openclaw/workspace/quantum-workspace

# Update remote if needed
git remote set-url origin https://github.com/QuantumTechnologies/quantum-workspace.git

# Push
git push -u origin master

echo "✅ Done! Check: https://github.com/QuantumTechnologies/quantum-workspace"