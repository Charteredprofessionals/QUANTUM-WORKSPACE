/**
 * Quantum Workspace - Enterprise IDE
 * AI-Powered Development Environment
 */

import * as vscode from 'vscode';
import { createLLMRouter, LLMRouter } from './llm/router';
import { SimpleModeHandler } from './simple-mode';
import { QuantumBrain } from './quantum-brain';
import { OneClickBuild } from './one-click-build';
import { OneClickDeploy } from './one-click-deploy';
import { VisualGit } from './visual-git';
import { AITerminal } from './ai-terminal';
import { SmartMemory } from './smart-memory';
import { ProjectTemplates } from './project-templates';
import { PluginSystem } from './plugin-system';
import { ARCHITECT_PROMPT, ARCHITECT_CONFIG } from './agents/architect';
import { DEVELOPER_PROMPT, DEVELOPER_CONFIG } from './agents/developer';
import { DESIGNER_PROMPT, DESIGNER_CONFIG } from './agents/designer';

// Global state
let llmRouter: LLMRouter | null = null;

let simpleMode: SimpleModeHandler | null = null;
let quantumBrain: QuantumBrain | null = null;
let oneClickBuild: OneClickBuild | null = null;
let oneClickDeploy: OneClickDeploy | null = null;
let visualGit: VisualGit | null = null;
let aiTerminal: AITerminal | null = null;
let smartMemory: SmartMemory | null = null;
let projectTemplates: ProjectTemplates | null = null;
let pluginSystem: PluginSystem | null = null;
let chatPanel: vscode.WebviewView | null = null;
let projectsView: vscode.TreeView<any> | null = null;

// Configuration
function getConfig() {
  const config = vscode.workspace.getConfiguration('aiDevSuite');
  return {
    openrouter: {
      enabled: config.get('providers.openrouter.enabled', true),
      apiKey: config.get('providers.openrouter.apiKey', ''),
      defaultModel: config.get('providers.openrouter.defaultModel', 'anthropic/claude-3.5-sonnet')
    },
    ollama: {
      enabled: config.get('providers.ollama.enabled', true),
      endpoint: config.get('providers.ollama.endpoint', 'http://localhost:11434'),
      defaultModel: config.get('providers.ollama.defaultModel', 'llama3.3')
    },
    'agent-router': {
      enabled: config.get('providers.agentRouter.enabled', false),
      apiKey: config.get('providers.agentRouter.apiKey', '')
    }
  };
}

// Initialize the extension
async function initialize() {
  const config = getConfig();
  llmRouter = createLLMRouter(config);
  simpleMode = new SimpleModeHandler(llmRouter);
  simpleMode.registerCommands();
  
  // Initialize Smart Memory
  smartMemory = new SmartMemory();
  
  // Initialize Quantum Brain for efficiency
  quantumBrain = new QuantumBrain();
  await quantumBrain.initialize();
  
  // Initialize One-Click Build
  oneClickBuild = new OneClickBuild();
  
  // Initialize One-Click Deploy
  oneClickDeploy = new OneClickDeploy();
  
  // Initialize Visual Git
  visualGit = new VisualGit();
  
  // Initialize AI Terminal
  aiTerminal = new AITerminal(smartMemory);
  
  // Initialize Project Templates
  projectTemplates = new ProjectTemplates();
  
  // Initialize Plugin System
  pluginSystem = new PluginSystem();
}

// Commands
function registerCommands() {
  // Main commands
  vscode.commands.registerCommand('aiDevSuite.start', () => {
    showWelcome();
  });

  vscode.commands.registerCommand('aiDevSuite.newProject', () => {
    startNewProject();
  });

  vscode.commands.registerCommand('aiDevSuite.analyzeIdea', () => {
    analyzeIdea();
  });

  // Agent chat commands
  vscode.commands.registerCommand('aiDevSuite.chatArchitect', () => {
    openChat('architect');
  });

  vscode.commands.registerCommand('aiDevSuite.chatDeveloper', () => {
    openChat('developer');
  });

  vscode.commands.registerCommand('aiDevSuite.chatDesigner', () => {
    openChat('designer');
  });

  // Project commands
  vscode.commands.registerCommand('aiDevSuite.generateDoc', () => {
    generateDocumentation();
  });

  vscode.commands.registerCommand('aiDevSuite.runTests', () => {
    runTests();
  });

  vscode.commands.registerCommand('aiDevSuite.deploy', () => {
    deploy();
  });

  vscode.commands.registerCommand('aiDevSuite.settings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'aiDevSuite');
  });

  // Context menu commands
  vscode.commands.registerCommand('aiDevSuite.explainCode', () => {
    explainSelection();
  });

  vscode.commands.registerCommand('aiDevSuite.refactorCode', () => {
    refactorSelection();
  });

  vscode.commands.registerCommand('aiDevSuite.addTests', () => {
    addTests();
  });

  // One-Click Build commands
  vscode.commands.registerCommand('quantumWorkspace.build', () => {
    if (oneClickBuild) {
      oneClickBuild.build();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.quickBuild', () => {
    if (oneClickBuild) {
      oneClickBuild.quickBuild();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.clean', () => {
    if (oneClickBuild) {
      oneClickBuild.clean();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.package', () => {
    if (oneClickBuild) {
      oneClickBuild.package();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.buildStatus', () => {
    if (oneClickBuild) {
      oneClickBuild.showStatus();
    }
  });

  // Quantum Brain commands
  vscode.commands.registerCommand('quantumWorkspace.indexCodebase', () => {
    if (quantumBrain) {
      quantumBrain.quickAction('index');
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.learnProject', () => {
    if (quantumBrain) {
      quantumBrain.quickAction('learn');
    }
  });

  // Visual Git commands
  vscode.commands.registerCommand('quantumWorkspace.git', () => {
    if (visualGit) {
      visualGit.showPanel();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.gitStatus', () => {
    if (visualGit) {
      visualGit.showPanel();
    }
  });

  // AI Terminal commands
  vscode.commands.registerCommand('quantumWorkspace.terminal', () => {
    if (aiTerminal) {
      aiTerminal.createTerminal();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.terminalSuggest', () => {
    if (aiTerminal) {
      aiTerminal.showSuggestions();
    }
  });

  // Deploy commands
  vscode.commands.registerCommand('quantumWorkspace.deploy', () => {
    if (oneClickDeploy) {
      oneClickDeploy.quickDeploy();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.deployVercel', () => {
    if (oneClickDeploy) {
      oneClickDeploy.deploy('vercel');
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.deployCloudflare', () => {
    if (oneClickDeploy) {
      oneClickDeploy.deploy('cloudflare');
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.openDeployment', () => {
    if (oneClickDeploy) {
      oneClickDeploy.openDeployment();
    }
  });

  // Project Templates commands
  vscode.commands.registerCommand('quantumWorkspace.templates', () => {
    if (projectTemplates) {
      projectTemplates.showSelector();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.createProject', () => {
    if (projectTemplates) {
      projectTemplates.quickCreate();
    }
  });

  // Plugin System commands
  vscode.commands.registerCommand('quantumWorkspace.plugins', () => {
    if (pluginSystem) {
      pluginSystem.showManager();
    }
  });

  vscode.commands.registerCommand('quantumWorkspace.createPlugin', () => {
    if (pluginSystem) {
      pluginSystem.quickAction('create');
    }
  });
}

// UI Functions
async function showWelcome() {
  const welcomeMsg = `# 🏗️ Welcome to AI Dev Suite

Your enterprise AI development team is ready!

**What would you like to do?**

1. 🎯 **Start New Project** - Begin with viability analysis
2. 💬 **Chat with Agents** - Talk to Architect, Developer, or Designer
3. 📄 **Generate Docs** - Create project documentation
4. ⚙️ **Configure** - Set up LLM providers and API keys

_Type your idea or request to get started!_
`;

  const choice = await vscode.window.showQuickPick([
    { label: '🎯 Start New Project', description: 'Begin with viability analysis' },
    { label: '💬 Chat with Architect', description: 'System design and architecture' },
    { label: '💬 Chat with Developer', description: 'Implementation and code' },
    { label: '💬 Chat with Designer', description: 'UI/UX and design' },
    { label: '⚙️ Configure Settings', description: 'Set up LLM providers' }
  ], {
    placeHolder: 'What would you like to do?'
  });

  if (choice) {
    switch (choice.label) {
      case '🎯 Start New Project':
        startNewProject();
        break;
      case '💬 Chat with Architect':
        openChat('architect');
        break;
      case '💬 Chat with Developer':
        openChat('developer');
        break;
      case '💬 Chat with Designer':
        openChat('designer');
        break;
      case '⚙️ Configure Settings':
        vscode.commands.executeCommand('workbench.action.openSettings', 'aiDevSuite');
        break;
    }
  }
}

async function startNewProject() {
  const idea = await vscode.window.showInputBox({
    prompt: 'Describe your project idea',
    placeHolder: 'e.g., A task management app for remote teams with real-time collaboration...'
  });

  if (!idea) return;

  vscode.window.showInformationMessage('🔍 Analyzing viability...');

  if (!llmRouter) initialize();

  try {
    const project = await orchestrator!.startProject(idea);
    
    // Show viability report
    const report = orchestrator!.getViabilityReport();
    
    const doc = await vscode.window.showTextDocument(
      vscode.Uri.parse(`untitled:viability-${project.id}.md`),
      { viewColumn: vscode.ViewColumn.One }
    );
    
    await doc.edit(edit => edit.insert(new vscode.Position(0, 0), report));
    
    // Ask for approval
    const approve = await vscode.window.showInformationMessage(
      `✅ Viability Score: ${project.viability?.score}/100\n\nDo you approve this analysis and want to proceed with planning?`,
      { modal: true },
      'Approve & Continue',
      'Revise Idea',
      'Cancel'
    );

    if (approve === 'Approve & Continue') {
      await orchestrator!.approveViability(true);
      vscode.window.showInformationMessage('📋 Generating project plan...');
      
      await orchestrator!.generatePlan();
      const plan = orchestrator!.getProjectPlan();
      
      const planDoc = await vscode.window.showTextDocument(
        vscode.Uri.parse(`untitled:plan-${project.id}.md`),
        { viewColumn: vscode.ViewColumn.One }
      );
      await planDoc.edit(edit => edit.insert(new vscode.Position(0, 0), plan));
      
      vscode.window.showInformationMessage('✅ Project ready! Review the plan and confirm to proceed to design.');
    }
  } catch (error: any) {
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

async function analyzeIdea() {
  const editor = vscode.window.activeTextEditor;
  const idea = editor?.document.getText(editor.selection) || 
    await vscode.window.showInputBox({ prompt: 'Enter project idea to analyze' });
  
  if (!idea) return;
  
  if (!llmRouter) initialize();
  
  vscode.window.showInformationMessage('🔍 Running viability analysis...');
  
  const project = await orchestrator!.startProject(idea);
  const report = orchestrator!.getViabilityReport();
  
  // Create and show report
  const doc = await vscode.window.showTextDocument(
    vscode.Uri.parse(`untitled:viability-report.md`),
    { viewColumn: vscode.ViewColumn.Beside }
  );
  await doc.edit(edit => edit.insert(new vscode.Position(0, 0), report));
  
  vscode.window.showInformationMessage(`📊 Viability: ${project.viability?.score}/100 - ${project.viability?.recommendation}`);
}

async function openChat(agent: 'architect' | 'developer' | 'designer') {
  if (!llmRouter) initialize();
  
  const agentInfo = {
    architect: { name: 'Chief Architect', emoji: '🏛️', prompt: ARCHITECT_PROMPT },
    developer: { name: 'Lead Developer', emoji: '💻', prompt: DEVELOPER_PROMPT },
    designer: { name: 'UI/UX Designer', emoji: '🎨', prompt: DESIGNER_PROMPT }
  }[agent];
  
  const message = await vscode.window.showInputBox({
    prompt: `Chat with ${agentInfo.name} ${agentInfo.emoji}`,
    placeHolder: 'Ask a question or request help...'
  });
  
  if (!message) return;
  
  // In a full implementation, this would send to the LLM and get response
  // For now, show the prompt that would be sent
  const response = `
## Message to ${agentInfo.name} ${agentInfo.emoji}

**Your message:**
${message}

---

*In production, this would send to the LLM and stream back a response.*

**System prompt that would be used:**
${agentInfo.prompt.substring(0, 500)}...
`;
  
  const doc = await vscode.window.showTextDocument(
    vscode.Uri.parse(`untitled:chat-${agent}.md`),
    { viewColumn: vscode.ViewColumn.Beside }
  );
  await doc.edit(edit => edit.insert(new vscode.Position(0, 0), response));
}

async function generateDocumentation() {
  if (!llmRouter) {
    vscode.window.showWarningMessage('No active project. Start a new project first.');
    return;
  }

  const project = llmRouter.getCurrentProject();
  if (!project) {
    vscode.window.showWarningMessage('No active project.');
    return;
  }

  // Generate all docs
  await llmRouter.runDesign(project.description);
  const docs = llmRouter.getDesignSpec();

  const doc = await vscode.window.showTextDocument(
    vscode.Uri.parse(`untitled:docs-${project.id}.md`),
    { viewColumn: vscode.ViewColumn.One }
  );
  await doc.edit(edit => edit.insert(new vscode.Position(0, 0), docs));

  vscode.window.showInformationMessage('📄 Documentation generated!');
}

async function runTests() {
  if (!llmRouter) {
    vscode.window.showWarningMessage('No active project.');
    return;
  }

  vscode.window.showInformationMessage('🧪 Running tests...');
  
  await llmRouter.runTests();
  
  vscode.window.showInformationMessage('✅ Tests completed!');
}

async function deploy() {
  if (!llmRouter) {
    vscode.window.showWarningMessage('No active project.');
    return;
  }

  vscode.window.showInformationMessage('🚀 Deploying...');
  
  await llmRouter.deploy();
  
  vscode.window.showInformationMessage('✅ Deployed successfully!');
}

// Context menu handlers
async function explainSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  
  const code = editor.document.getText(editor.selection);
  if (!code) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  if (!llmRouter) initialize();

  // Quick explanation via Developer agent
  const doc = await vscode.window.showTextDocument(
    vscode.Uri.parse(`untitled:explanation.md`),
    { viewColumn: vscode.ViewColumn.Beside }
  );
  
  await doc.edit(edit => edit.insert(new vscode.Position(0, 0), 
    `# Code Explanation\n\n**Selected code:**\n\`\`\`\n${code}\n\`\`\`\n\n*Would be sent to Developer agent for explanation in production.*`
  ));
}

async function refactorSelection() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  
  const code = editor.document.getText(editor.selection);
  if (!code) {
    vscode.window.showWarningMessage('No code selected');
    return;
  }

  vscode.window.showInformationMessage('🔄 Refactoring... (demo mode)');
  // Would call developer.refactorCode in production
}

async function addTests() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  
  const code = editor.document.getText(editor.document.uri);
  
  vscode.window.showInformationMessage('🧪 Generating tests... (demo mode)');
  // Would call developer.generateTests in production
}

// Tree View for Projects
class ProjectsProvider implements vscode.TreeDataProvider<any> {
  getTreeItem(element: any): vscode.TreeItem {
    return {
      label: element.label || 'Project',
      iconPath: element.icon,
      collapsibleState: element.children ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
    };
  }

  getChildren(element?: any): any[] {
    if (!llmRouter) return [];
    
    const project = llmRouter.getCurrentProject();
    if (!project) return [{ label: 'No active project', iconPath: undefined }];
    
    return [
      { label: `📋 ${project.name}`, iconPath: undefined },
      { label: `📊 Phase: ${project.currentPhase}`, iconPath: undefined },
      { label: `✅ Score: ${project.viability?.score || 'N/A'}/100`, iconPath: undefined }
    ];
  }
}

// Extension activation
export function activate(context: vscode.ExtensionContext) {
  console.log('AI Dev Suite activating...');

  initialize();
  registerCommands();

  // Create tree view
  vscode.window.registerTreeDataProvider('ai-dev-suite-projects', new ProjectsProvider());

  // Show welcome message
  vscode.window.showInformationMessage('🏗️ AI Dev Suite ready! Run "AI Dev Suite: Start" to begin.');

  console.log('AI Dev Suite activated successfully');
}

export function deactivate() {
  console.log('AI Dev Suite deactivated');
}