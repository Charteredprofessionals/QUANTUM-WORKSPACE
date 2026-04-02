/**
 * Auto-Workflow Engine - Automation
 * Anticipates next actions based on context and patterns
 */

import * as vscode from 'vscode';
import { SmartMemory } from './smart-memory';

interface ActionSuggestion {
  id: string;
  label: string;
  description: string;
  action: string;
  confidence: number;
  icon: string;
}

interface WorkflowContext {
  currentFile: string | null;
  currentTask: string | null;
  recentActions: string[];
  detectedIntent: string | null;
}

export class AutoWorkflow {
  private memory: SmartMemory;
  private context: WorkflowContext = {
    currentFile: null,
    currentTask: null,
    recentActions: [],
    detectedIntent: null
  };

  constructor(memory: SmartMemory) {
    this.memory = memory;
    this.setupListeners();
  }

  // Setup editor listeners for context awareness
  private setupListeners() {
    // Track active editor changes
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        this.context.currentFile = editor.document.fileName;
        this.analyzeContext();
      }
    });

    // Track document changes
    vscode.workspace.onDidChangeTextDocument((event) => {
      this.detectIntent(event);
    });
  }

  // Analyze current context and suggest actions
  private async analyzeContext() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const ext = doc.fileName.split('.').pop()?.toLowerCase();
    const content = doc.getText();

    // Context-based suggestions
    const suggestions: ActionSuggestion[] = [];

    // If writing a function, suggest adding tests
    if (content.includes('function ') || content.includes('const ') || content.includes('def ')) {
      suggestions.push({
        id: 'add_tests',
        label: 'Add Tests',
        description: 'Generate unit tests for this code',
        action: 'quantumWorkspace.addTests',
        confidence: 0.8,
        icon: '🧪'
      });
    }

    // If in a component, suggest adding props/types
    if (ext === 'tsx' || ext === 'jsx' || ext === 'vue') {
      suggestions.push({
        id: 'add_types',
        label: 'Add TypeScript Types',
        description: 'Infer and add type definitions',
        action: 'quantumWorkspace.addTypes',
        confidence: 0.7,
        icon: '📝'
      });
    }

    // If writing API code, suggest adding error handling
    if (content.includes('fetch') || content.includes('axios') || content.includes('async')) {
      suggestions.push({
        id: 'error_handling',
        label: 'Add Error Handling',
        description: 'Add try-catch and error states',
        action: 'quantumWorkspace.addErrorHandling',
        confidence: 0.75,
        icon: '🛡️'
      });
    }

    // If in a config file, validate it
    if (['json', 'yaml', 'yml', 'toml'].includes(ext || '')) {
      suggestions.push({
        id: 'validate_config',
        label: 'Validate Config',
        description: 'Check for syntax errors',
        action: 'quantumWorkspace.validateConfig',
        confidence: 0.9,
        icon: '✅'
      });
    }

    // Show suggestions in status bar or as quick fix
    if (suggestions.length > 0) {
      this.showSuggestions(suggestions);
    }
  }

  // Detect user intent from recent actions
  private detectIntent(event: vscode.TextDocumentChangeEvent) {
    const content = event.document.getText();
    
    // Pattern matching for common intents
    if (content.includes('import ') && content.includes('from ')) {
      this.context.detectedIntent = 'importing';
      this.suggestAction({
        id: 'organize_imports',
        label: 'Organize Imports',
        description: 'Sort and clean up imports',
        action: 'quantumWorkspace.organizeImports',
        confidence: 0.6,
        icon: '📋'
      });
    }

    if (content.includes('class ') || content.includes('interface ')) {
      this.context.detectedIntent = 'defining_types';
      this.suggestAction({
        id: 'generate_docs',
        label: 'Generate Documentation',
        description: 'Add JSDoc comments',
        action: 'quantumWorkspace.generateDocs',
        confidence: 0.5,
        icon: '📖'
      });
    }
  }

  // Show suggestions via status bar
  private showSuggestions(suggestions: ActionSuggestion[]) {
    const topSuggestion = suggestions.reduce((a, b) => a.confidence > b.confidence ? a : b);
    
    // Show in status bar
    const statusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    statusItem.text = `${topSuggestion.icon} ${topSuggestion.label}`;
    statusItem.command = topSuggestion.action;
    statusItem.tooltip = topSuggestion.description;
    statusItem.show();

    // Auto-hide after 10 seconds
    setTimeout(() => {
      statusItem.hide();
    }, 10000);
  }

  // Suggest a single action
  private suggestAction(suggestion: ActionSuggestion) {
    vscode.window.showInformationMessage(
      `${suggestion.icon} ${suggestion.label}: ${suggestion.description}`,
      'Do it',
      'Later'
    ).then(choice => {
      if (choice === 'Do it') {
        vscode.commands.executeCommand(suggestion.action);
      }
    });
  }

  // Get current context for LLM
  getContextForLLM(): string {
    const parts: string[] = [];

    if (this.context.currentFile) {
      const fileName = this.context.currentFile.split('/').pop();
      parts.push(`Current file: ${fileName}`);
    }

    if (this.context.detectedIntent) {
      parts.push(`User intent: ${this.context.detectedIntent}`);
    }

    if (this.context.recentActions.length > 0) {
      parts.push(`Recent actions: ${this.context.recentActions.slice(-3).join(', ')}`);
    }

    // Add memory context
    const memContext = this.memory.getContextForPrompt();
    if (memContext) {
      parts.push(memContext);
    }

    return parts.join('\n');
  }

  // Record an action for learning
  recordAction(action: string) {
    this.context.recentActions.push(action);
    
    // Keep only last 10 actions
    if (this.context.recentActions.length > 10) {
      this.context.recentActions = this.context.recentActions.slice(-10);
    }

    // Learn from patterns
    if (action === 'add_tests') {
      this.memory.rememberPattern('writes tests', 'User frequently adds unit tests');
    }
  }

  // Proactive suggestions based on project type
  async getProactiveSuggestions(): Promise<ActionSuggestion[]> {
    const suggestions: ActionSuggestion[] = [];
    const framework = this.memory.getPreference('framework');
    const packageManager = this.memory.getPreference('packageManager');

    // Framework-specific suggestions
    if (framework === 'React' || framework === 'Next.js') {
      suggestions.push({
        id: 'add_tailwind',
        label: 'Setup Tailwind CSS',
        description: 'Add Tailwind for styling',
        action: 'quantumWorkspace.addTailwind',
        confidence: 0.6,
        icon: '🎨'
      });
    }

    if (packageManager === 'npm') {
      suggestions.push({
        id: 'audit_deps',
        label: 'Audit Dependencies',
        description: 'Check for vulnerabilities',
        action: 'quantumWorkspace.auditDeps',
        confidence: 0.7,
        icon: '🔒'
      });
    }

    return suggestions;
  }
}