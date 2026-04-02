/**
 * AI Terminal - Smart Command Suggestions
 * Terminal with AI-powered auto-suggest and command completion
 */

import * as vscode from 'vscode';
import { exec, spawn } from 'child_process';
import { SmartMemory } from './smart-memory';

interface CommandSuggestion {
  command: string;
  description: string;
  confidence: number;
  icon: string;
}

interface TerminalSession {
  id: string;
  terminal: vscode.Terminal;
  cwd: string;
  history: string[];
}

export class AITerminal {
  private terminals: Map<string, TerminalSession> = new Map();
  private memory: SmartMemory;
  private suggestionPanel: vscode.WebviewPanel | null = null;
  private currentSession: TerminalSession | null = null;

  constructor(memory: SmartMemory) {
    this.memory = memory;
    this.setupTerminalEvents();
  }

  // Setup terminal event handlers
  private setupTerminalEvents() {
    vscode.window.onDidOpenTerminal((terminal) => {
      this.registerTerminal(terminal);
    });

    vscode.window.onDidCloseTerminal((terminal) => {
      this.terminals.delete(terminal.name);
    });
  }

  // Register a new terminal
  private registerTerminal(terminal: vscode.Terminal) {
    const session: TerminalSession = {
      id: terminal.name,
      terminal,
      cwd: process.cwd(),
      history: []
    };
    
    this.terminals.set(terminal.name, session);
    this.currentSession = session;

    // Monitor terminal input for AI suggestions
    this.monitorInput(terminal);
  }

  // Create AI-powered terminal
  async createTerminal(): Promise<vscode.Terminal> {
    const terminal = vscode.window.createTerminal({
      name: 'Quantum AI Terminal',
      env: process.env
    });

    this.registerTerminal(terminal);
    terminal.show();

    // Show welcome message
    terminal.sendText('echo "🤖 Quantum AI Terminal - Type a command or ask for help!"');

    return terminal;
  }

  // Monitor terminal input for suggestions
  private monitorInput(terminal: vscode.Terminal) {
    // This is a simplified version - in practice, you'd use terminal API
    // to capture input and provide suggestions
  }

  // Get AI-powered suggestions based on context
  async getSuggestions(input: string): Promise<CommandSuggestion[]> {
    const suggestions: CommandSuggestion[] = [];
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    // Get project preferences
    const framework = this.memory.getPreference('framework');
    const packageManager = this.memory.getPreference('packageManager');

    // Common commands
    const commonCommands = [
      { cmd: 'ls -la', desc: 'List all files', icon: '📁' },
      { cmd: 'git status', desc: 'Check git status', icon: '🌿' },
      { cmd: 'npm run dev', desc: 'Start dev server', icon: '🚀' },
      { cmd: 'npm test', desc: 'Run tests', icon: '🧪' },
    ];

    // Filter based on input
    const lowerInput = input.toLowerCase();
    
    for (const c of commonCommands) {
      if (c.cmd.startsWith(lowerInput) || lowerInput.startsWith(c.cmd.split(' ')[0])) {
        suggestions.push({
          command: c.cmd,
          description: c.desc,
          confidence: 0.9,
          icon: c.icon
        });
      }
    }

    // Framework-specific suggestions
    if (framework === 'Next.js' || framework === 'React') {
      suggestions.push(
        { command: 'npm run build', desc: 'Build for production', confidence: 0.8, icon: '📦' },
        { command: 'npm run lint', desc: 'Lint code', confidence: 0.7, icon: '✨' }
      );
    }

    if (framework === 'Vue') {
      suggestions.push(
        { command: 'npm run build', desc: 'Build for production', confidence: 0.8, icon: '📦' },
        { command: 'npm run dev', desc: 'Start dev server', confidence: 0.9, icon: '🚀' }
      );
    }

    // AI suggestions based on natural language
    if (lowerInput.includes('run') || lowerInput.includes('start')) {
      const runCmd = packageManager === 'npm' ? 'npm run' : 'yarn';
      suggestions.push({
        command: `${runCmd} dev`,
        description: 'Start development server',
        confidence: 0.7,
        icon: '🚀'
      });
    }

    if (lowerInput.includes('install') || lowerInput.includes('add')) {
      suggestions.push({
        command: `${packageManager || 'npm'} install`,
        description: 'Install dependencies',
        confidence: 0.8,
        icon: '📥'
      });
    }

    // Sort by confidence
    suggestions.sort((a, b) => b.confidence - a.confidence);

    return suggestions.slice(0, 5);
  }

  // Show suggestions panel
  async showSuggestions(input: string = '') {
    const suggestions = await this.getSuggestions(input);

    const panel = vscode.window.createWebviewPanel(
      'quantumTerminalSuggestions',
      'AI Suggestions',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = this.getSuggestionsHTML(suggestions);
    this.suggestionPanel = panel;

    // Handle selection
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === 'execute') {
        this.executeCommand(message.cmd);
      }
    });
  }

  // Get suggestions HTML
  private getSuggestionsHTML(suggestions: CommandSuggestion[]): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 16px;
      background: #1e1e1e;
      color: #ccc;
    }
    h3 { color: #fff; margin-bottom: 12px; font-size: 14px; }
    .suggestion {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: #2d2d2d;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .suggestion:hover { background: #3d3d3d; }
    .icon { font-size: 18px; }
    .cmd { color: #7ee787; font-family: monospace; font-size: 13px; }
    .desc { color: #888; font-size: 11px; }
    .confidence { 
      font-size: 10px; 
      color: ${s => s > 0.8 ? '#4ade80' : '#fbbf24'};
    }
  </style>
</head>
<body>
  <h3>🤖 AI Command Suggestions</h3>
  ${suggestions.map(s => `
    <div class="suggestion" onclick="execute('${s.command.replace(/'/g, "\\'")}')">
      <span class="icon">${s.icon}</span>
      <div>
        <div class="cmd">${s.command}</div>
        <div class="desc">${s.description}</div>
      </div>
    </div>
  `).join('')}
  <script>
    const vscode = acquireVsCodeApi();
    function execute(cmd) {
      vscode.postMessage({ command: 'execute', cmd });
    }
  </script>
</body>
</html>`;
  }

  // Execute a command
  private executeCommand(cmd: string) {
    const terminal = vscode.window.activeTerminal;
    if (terminal) {
      terminal.sendText(cmd);
    }
    this.suggestionPanel?.dispose();
  }

  // Natural language to command
  async naturalLanguageToCommand(input: string): Promise<string> {
    // Simple rule-based conversion
    const lower = input.toLowerCase();

    // Common patterns
    if (lower.includes('run') || lower.includes('start') || lower.includes('dev')) {
      return 'npm run dev';
    }
    if (lower.includes('build') || lower.includes('production')) {
      return 'npm run build';
    }
    if (lower.includes('test')) {
      return 'npm test';
    }
    if (lower.includes('install') || lower.includes('add')) {
      return 'npm install';
    }
    if (lower.includes('commit')) {
      return 'git commit';
    }
    if (lower.includes('push')) {
      return 'git push';
    }
    if (lower.includes('pull')) {
      return 'git pull';
    }
    if (lower.includes('status')) {
      return 'git status';
    }
    if (lower.includes('list') || lower.includes('files')) {
      return 'ls -la';
    }
    if (lower.includes('log') || lower.includes('history')) {
      return 'git log --oneline -n 10';
    }

    // Default: echo the input
    return `# ${input}\necho "Processing: ${input}"`;
  }

  // Execute with AI assistance
  async executeWithAI(input: string): Promise<void> {
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
      await this.createTerminal();
    }

    // Check if it's natural language
    if (!input.startsWith(' ') && !input.startsWith('/') && !input.includes('&&')) {
      // Natural language - convert to command
      const cmd = await this.naturalLanguageToCommand(input);
      vscode.window.showInformationMessage(`🤖 Suggestion: ${cmd}`);
      
      // Ask user to confirm
      const choice = await vscode.window.showQuickPick(['Execute', 'Edit', 'Cancel'], {
        placeHolder: `Run: ${cmd}?`
      });

      if (choice === 'Execute' && terminal) {
        terminal.sendText(cmd);
      } else if (choice === 'Edit' && terminal) {
        terminal.sendText(cmd);
        terminal.sendText('\x15'); // Ctrl+U to clear line
      }
      return;
    }

    // Regular command - execute directly
    if (terminal) {
      terminal.sendText(input);
    }
  }

  // Add command to history
  addToHistory(cmd: string) {
    if (this.currentSession) {
      this.currentSession.history.push(cmd);
    }
  }

  // Get command history
  getHistory(): string[] {
    return this.currentSession?.history || [];
  }

  // Quick terminal commands
  async quickCommand(action: string): Promise<void> {
    const terminal = vscode.window.activeTerminal || await this.createTerminal();

    switch (action) {
      case 'clear':
        terminal.sendText('clear');
        break;
      case 'home':
        terminal.sendText('cd ~');
        break;
      case 'workspace':
        terminal.sendText(`cd ${vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ''}`);
        break;
      case 'git':
        terminal.sendText('git status');
        break;
      case 'install':
        terminal.sendText('npm install');
        break;
    }
  }
}