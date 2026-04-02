#!/bin/bash
# Push Quantum Workspace to GitHub

REPO="Charteredprofessionals/QUANTUM-WORKSPACE"

echo "🚀 Pushing to https://github.com/$REPO"

cd /root/.openclaw/workspace/quantum-workspace

# Check if gh is authenticated
if ! gh auth status &>/dev/null; then
    echo "⚠️ GitHub CLI not authenticated"
    echo "Please run: gh auth login"
    echo ""
    echo "Or use a personal access token:"
    echo "  gh auth login --with-token <<< 'YOUR_TOKEN'"
    exit 1
fi

# Create repo if doesn't exist (will prompt)
gh repo create $REPO --source=. --public --push 2>/dev/null || {
    echo "Repo may exist, trying push..."
    git push -u origin master
}

echo "✅ Done!"
echo "🔗 https://github.com/$REPO"