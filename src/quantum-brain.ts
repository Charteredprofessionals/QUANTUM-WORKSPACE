/**
 * Quantum Brain - Unified AI Engine
 * Orchestrates: Context + Memory + Cache + Automation
 * The core efficiency engine for Quantum Workspace
 */

import * as vscode from 'vscode';
import { CodebaseIndexer } from './context-indexer';
import { SmartMemory } from './smart-memory';
import { ResponseCache } from './response-cache';
import { AutoWorkflow } from './auto-workflow';

interface QuantumBrainConfig {
  enableIndexing: boolean;
  enableMemory: boolean;
  enableCaching: boolean;
  enableAutomation: boolean;
  localFirst: boolean;
}

interface EnhancedPrompt {
  prompt: string;
  context?: string;
  stream?: boolean;
  model?: string;
}

export class QuantumBrain {
  private indexer: CodebaseIndexer;
  private memory: SmartMemory;
  private cache: ResponseCache;
  private workflow: AutoWorkflow;
  private config: QuantumBrainConfig;
  private isInitialized: boolean = false;

  constructor() {
    // Initialize components
    this.indexer = new CodebaseIndexer();
    this.memory = new SmartMemory();
    
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    this.cache = new ResponseCache(workspacePath);
    this.workflow = new AutoWorkflow(this.memory);

    this.config = {
      enableIndexing: true,
      enableMemory: true,
      enableCaching: true,
      enableAutomation: true,
      localFirst: true // Prefer local models (Ollama) when available
    };
  }

  // Initialize the brain
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Auto-learn about the project
    await this.memory.learnFromCode();

    // Index the codebase if needed
    if (this.config.enableIndexing && this.indexer.needsReindex()) {
      await this.indexer.indexWorkspace();
    }

    // Clean expired cache entries
    this.cache.cleanExpired();

    this.isInitialized = true;
    
    vscode.window.showInformationMessage('🧠 Quantum Brain initialized');
  }

  // Process a prompt through the brain
  async processPrompt(input: EnhancedPrompt): Promise<string> {
    // 1. Check cache first
    if (this.config.enableCaching) {
      const cached = this.cache.get(input.prompt, input.model || 'default');
      if (cached) {
        return cached;
      }
    }

    // 2. Build enhanced context
    const context = this.buildContext(input.prompt);

    // 3. Process through workflow
    const response = await this.callLLM(input.prompt, context, input.model);

    // 4. Cache the response
    if (this.config.enableCaching) {
      this.cache.set(input.prompt, response, input.model || 'default');
    }

    // 5. Learn from this interaction
    this.learnFromInteraction(input.prompt, response);

    return response;
  }

  // Build comprehensive context from all sources
  private buildContext(prompt: string): string {
    const parts: string[] = [];

    // 1. Project memory
    if (this.config.enableMemory) {
      const memContext = this.memory.getContextForPrompt();
      if (memContext) {
        parts.push('## Project Memory\n' + memContext);
      }
    }

    // 2. Codebase index (search for relevant code)
    if (this.config.enableIndexing) {
      // Extract key terms from prompt
      const terms = prompt.split(/\s+/).filter(w => w.length > 3);
      const relevantSymbols = terms.flatMap(term => this.indexer.search(term)).slice(0, 10);
      
      if (relevantSymbols.length > 0) {
        parts.push('## Relevant Code\n');
        for (const sym of relevantSymbols) {
          parts.push(`- ${sym.type} ${sym.name} at ${sym.file}:${sym.line}`);
        }
      }
    }

    // 3. Current workflow context
    if (this.config.enableAutomation) {
      const workflowContext = this.workflow.getContextForLLM();
      if (workflowContext) {
        parts.push('## Current Context\n' + workflowContext);
      }
    }

    // 4. File-specific context
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const fileName = activeEditor.document.fileName.split('/').pop();
      const symbols = this.indexer.getFileContext(activeEditor.document.fileName);
      
      parts.push(`## Current File (${fileName})\n`);
      for (const sym of symbols.slice(0, 5)) {
        parts.push(`- ${sym.type} ${sym.name}`);
      }
    }

    return parts.join('\n\n');
  }

  // Call LLM with smart routing
  private async callLLM(prompt: string, context: string, model?: string): Promise<string> {
    // TODO: Integrate with LLM router
    // For now, return a placeholder that integrates with existing router
    
    const enhancedPrompt = `${context}\n\n---\n\nUser: ${prompt}`;
    return enhancedPrompt;
  }

  // Learn from user interactions
  private learnFromInteraction(prompt: string, response: string) {
    // Detect patterns in user prompts
    if (prompt.toLowerCase().includes('test')) {
      this.memory.rememberPattern('writes tests', 'User often writes tests');
    }

    if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('endpoint')) {
      this.memory.rememberPattern('builds APIs', 'User builds REST APIs');
    }
  }

  // Quick actions via brain
  async quickAction(action: string): Promise<void> {
    switch (action) {
      case 'index':
        await this.indexer.indexWorkspace();
        break;
      
      case 'learn':
        await this.memory.learnFromCode();
        break;
      
      case 'clear_cache':
        this.cache.invalidate();
        vscode.window.showInformationMessage('🗑️ Cache cleared');
        break;
      
      case 'show_context':
        const context = this.buildContext('');
        vscode.window.showInformationMessage('🧠 Context loaded - check console');
        console.log(context);
        break;
      
      case 'suggest':
        const suggestions = await this.workflow.getProactiveSuggestions();
        for (const s of suggestions) {
          vscode.window.showInformationMessage(`${s.icon} ${s.label}`);
        }
        break;
    }
  }

  // Get brain status
  getStatus(): object {
    return {
      initialized: this.isInitialized,
      indexStats: this.indexer.getSummary(),
      config: this.config,
      recentDecisions: this.memory.getRecentDecisions(5)
    };
  }

  // Update configuration
  updateConfig(partial: Partial<QuantumBrainConfig>) {
    this.config = { ...this.config, ...partial };
  }
}