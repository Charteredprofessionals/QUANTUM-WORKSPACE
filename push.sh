#!/bin/bash
# Run this script to push to GitHub
# Usage: ./push.sh

set -e

# Configure git (replace with your details)
git config user.email "your-email@example.com"
git config user.email "Your Name"

# Add all files
git add -A

# Commit
git commit -m "Initial commit: AI Dev Suite - Enterprise SDLC Operating System"

# Create and push repo (run 'gh auth login' first if needed)
gh repo create ai-dev-suite --public --source=. --push