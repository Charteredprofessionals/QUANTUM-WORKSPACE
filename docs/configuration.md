# Quantum Workspace - Configuration Guide

## Extension Settings

### General Settings

```json
{
  "quantumWorkspace.mode": "simple",
  "quantumWorkspace.theme": "dark"
}
```

### LLM Provider Configuration

#### OpenRouter (Cloud)

```json
{
  "quantumWorkspace.providers.openrouter.enabled": true,
  "quantumWorkspace.providers.openrouter.apiKey": "sk-...",
  "quantumWorkspace.providers.openrouter.defaultModel": "anthropic/claude-3.5-sonnet"
}
```

**Available Models:**
- `anthropic/claude-3.5-sonnet` - Best overall
- `openai/gpt-4-turbo` - Fast & capable
- `google/gemini-pro` - Google's model
- `meta-llama/llama-3-70b` - Open source

#### Ollama (Local)

```json
{
  "quantumWorkspace.providers.ollama.enabled": true,
  "quantumWorkspace.providers.ollama.endpoint": "http://localhost:11434",
  "quantumWorkspace.providers.ollama.defaultModel": "llama3.3"
}
```

**Installation:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.3
ollama pull codellama
```

### Quantum Brain Settings

```json
{
  "quantumWorkspace.brain.enableIndexing": true,
  "quantumWorkspace.brain.enableMemory": true,
  "quantumWorkspace.brain.enableCaching": true,
  "quantumWorkspace.brain.localFirst": true
}
```

### Build Settings

```json
{
  "quantumWorkspace.build.autoDetect": true,
  "quantumWorkspace.build.outputDir": "dist"
}
```

### Deploy Settings

```json
{
  "quantumWorkspace.deploy.defaultProvider": "vercel",
  "quantumWorkspace.deploy.autoBuild": true
}
```

---

## Environment Variables

```bash
# For CI/CD
export OPENROUTER_API_KEY="sk-..."
export GITHUB_TOKEN="ghp_..."
```

---

## Troubleshooting Settings

If issues arise:

1. **Clear cache:**
   ```
   quantumWorkspace.clearCache
   ```

2. **Re-index codebase:**
   ```
   quantumWorkspace.indexCodebase
   ```

3. **Reset all settings:**
   ```json
   {
     "quantumWorkspace": {}
   }
   ```