/**
 * Quantum Workspace - Simple Mode Handler
 * Non-technical user interface with goal-based commands
 */

import * as vscode from 'vscode';
import { createLLMRouter, LLMRouter } from './llm/router';

// Mode types
export type WorkspaceMode = 'simple' | 'developer';

interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: string[];
  stack?: string;
}

// Pre-built templates for non-technical users
const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'website',
    name: 'Website',
    description: 'A personal or business website',
    icon: '🌐',
    questions: ['What is the website about?', 'Do you need a contact form?'],
    stack: 'nextjs'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'A blog or content site',
    icon: '📝',
    questions: ['What topics will you write about?', 'Do you want comments?'],
    stack: 'astro'
  },
  {
    id: 'store',
    name: 'Online Store',
    description: 'Sell products online',
    icon: '🛒',
    questions: ['What are you selling?', 'Do you need payment integration?'],
    stack: 'shopify'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work',
    icon: '🎨',
    questions: ['What type of work?', 'Any specific color preferences?'],
    stack: 'nextjs'
  },
  {
    id: 'app',
    name: 'Mobile App',
    description: 'A mobile application',
    icon: '📱',
    questions: ['What should the app do?', 'iOS, Android, or both?'],
    stack: 'react-native'
  }
];

export class SimpleModeHandler {
  private mode: WorkspaceMode = 'simple';
  private llmRouter: LLMRouter | null = null;
  private panel: vscode.WebviewPanel | null = null;

  constructor(llmRouter: LLMRouter) {
    this.llmRouter = llmRouter;
  }

  // Switch between Simple and Developer mode
  setMode(mode: WorkspaceMode) {
    this.mode = mode;
    vscode.workspace.getConfiguration('quantumWorkspace').update('mode', mode);
    this.updateStatusBar();
  }

  getMode(): WorkspaceMode {
    return this.mode;
  }

  // Update status bar indicator
  private updateStatusBar() {
    const statusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    statusItem.text = this.mode === 'simple' ? '👤 Simple' : '👨‍💻 Developer';
    statusItem.command = 'quantumWorkspace.switchMode';
    statusItem.show();
  }

  // Show the Simple Mode welcome panel
  async showSimpleMode() {
    const panel = vscode.window.createWebviewPanel(
      'quantumSimpleMode',
      'Quantum Workspace',
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );

    panel.webview.html = this.getSimpleModeHTML();
    this.panel = panel;

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'selectGoal') {
        await this.handleGoalSelection(message.goal);
      } else if (message.command === 'switchMode') {
        this.setMode('developer');
      }
    });
  }

  // Handle goal selection from simple mode
  private async handleGoalSelection(goal: GoalTemplate) {
    if (!this.llmRouter) return;

    vscode.window.showInformationMessage(
      `🎯 Building your ${goal.name}... This may take a moment.`
    );

    try {
      // Use LLM to generate project based on goal
      const response = await this.llmRouter.route({
        prompt: `Create a complete ${goal.name.toLowerCase()} project. 

Context: ${goal.description}
Stack: ${goal.stack || 'appropriate'}

Generate:
1. Project structure
2. Key files with working code
3. A brief README explaining how to run it

Use modern best practices.`,
        systemPrompt: 'You are a helpful code generator. Output project files and code only.',
        type: 'completion'
      });

      // Show success message
      vscode.window.showInformationMessage(
        `✅ Your ${goal.name} is ready! Check the files in the explorer.`
      );

      // Open the project folder
      vscode.commands.executeCommand('workbench.action.filesExplorer');
    } catch (error) {
      vscode.window.showErrorMessage('Something went wrong. Please try again.');
    }
  }

  // Get Simple Mode HTML
  private getSimpleModeHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #0d1117 0%, #161b22 100%); /* Quantum Dark */
      color: #c9d1d9;
      min-height: 100vh;
    }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 28px; margin-bottom: 8px; color: #58a6ff; } /* Quantum Blue */
    .header p { color: #8b949e; }
    .mode-switch {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 30px;
    }
    .mode-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    .mode-btn.active { background: #238636; color: #ffffff; } /* Quantum Green */
    .mode-btn.inactive { background: #21262d; color: #8b949e; }
    .question {
      background: rgba(33, 38, 45, 0.8);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid #30363d;
    }
    .question h2 { font-size: 18px; margin-bottom: 16px; color: #c9d1d9; }
    .question input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #30363d;
      background: #0d1117;
      color: #c9d1d9;
      font-size: 16px;
    }
    .question input:focus {
      outline: none;
      border-color: #58a6ff;
    }
    .goals {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
    }
    .goal-card {
      background: rgba(33, 38, 45, 0.8);
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    }
    .goal-card:hover {
      border-color: #58a6ff;
      transform: translateY(-2px);
    }
    .goal-icon { font-size: 40px; margin-bottom: 10px; }
    .goal-name { font-size: 16px; font-weight: 600; color: #c9d1d9; }
    .goal-desc { font-size: 12px; color: #8b949e; margin-top: 5px; }
    .action-btn {
      background: #238636;
      color: #ffffff;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
    }
    .action-btn:hover { background: #2ea043; }
  </style>
</head>
<body>
  <div class="header">
    <h1>👋 Welcome to Quantum Workspace</h1>
    <p>Tell me what you want to build</p>
  </div>

  <div class="mode-switch">
    <button class="mode-btn active" onclick="switchMode('simple')">👤 Simple Mode</button>
    <button class="mode-btn inactive" onclick="switchMode('developer')">👨‍💻 Developer Mode</button>
  </div>

  <div class="question">
    <h2>🎯 What would you like to create?</h2>
    <div class="goals">
      <div class="goal-card" onclick="selectGoal('website')">
        <div class="goal-icon">🌐</div>
        <div class="goal-name">Website</div>
        <div class="goal-desc">Personal or business site</div>
      </div>
      <div class="goal-card" onclick="selectGoal('blog')">
        <div class="goal-icon">📝</div>
        <div class="goal-name">Blog</div>
        <div class="goal-desc">Write and share content</div>
      </div>
      <div class="goal-card" onclick="selectGoal('store')">
        <div class="goal-icon">🛒</div>
        <div class="goal-name">Online Store</div>
        <div class="goal-desc">Sell products online</div>
      </div>
      <div class="goal-card" onclick="selectGoal('portfolio')">
        <div class="goal-icon">🎨</div>
        <div class="goal-name">Portfolio</div>
        <div class="goal-desc">Showcase your work</div>
      </div>
      <div class="goal-card" onclick="selectGoal('app')">
        <div class="goal-icon">📱</div>
        <div class="goal-name">Mobile App</div>
        <div class="goal-desc">iOS or Android app</div>
      </div>
    </div>
  </div>

  <div class="question">
    <h2>💬 Describe your idea in plain words</h2>
    <input type="text" placeholder="e.g., A website to showcase my photography work">
  </div>

  <button class="action-btn" onclick="buildProject()">🚀 Build My Project</button>

  <script>
    const vscode = acquireVsCodeApi();

    function selectGoal(goal) {
      vscode.postMessage({ command: 'selectGoal', goal: goal });
    }

    function switchMode(mode) {
      if (mode === 'developer') {
        vscode.postMessage({ command: 'switchMode' });
      }
    }

    function buildProject() {
      vscode.postMessage({ command: 'buildProject' });
    }
  </script>
</body>
</html>`;
  }

  // Register commands
  registerCommands() {
    // Switch mode command
    vscode.commands.registerCommand('quantumWorkspace.switchMode', () => {
      const newMode = this.mode === 'simple' ? 'developer' : 'simple';
      this.setMode(newMode);
      
      if (newMode === 'simple') {
        this.showSimpleMode();
      } else {
        vscode.window.showInformationMessage('🔧 Developer Mode activated');
      }
    });

    // Open Simple Mode
    vscode.commands.registerCommand('quantumWorkspace.simpleMode', () => {
      this.setMode('simple');
      this.showSimpleMode();
    });

    // Open Developer Mode
    vscode.commands.registerCommand('quantumWorkspace.developerMode', () => {
      this.setMode('developer');
    });
  }
}