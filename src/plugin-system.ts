/**
 * Plugin System - Extension Framework
 * Allow extending Quantum Workspace with plugins
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author?: string;
  commands?: string[];
  views?: string[];
  activationEvents?: string[];
}

interface Plugin {
  manifest: PluginManifest;
  path: string;
  enabled: boolean;
}

// Plugin hook interfaces
interface CommandHook {
  (context: vscode.ExtensionContext): void;
}

interface ViewHook {
  (context: vscode.ExtensionContext): vscode.WebviewViewProvider;
}

interface CompletionHook {
  (context: vscode.ExtensionContext): vscode.CompletionItemProvider;
}

export class PluginSystem {
  private plugins: Map<string, Plugin> = new Map();
  private pluginsDir: string;
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    this.pluginsDir = path.join(this.workspaceRoot, '.quantum', 'plugins');
    this.ensurePluginsDir();
  }

  // Ensure plugins directory exists
  private ensurePluginsDir() {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true });
    }
  }

  // Discover and load plugins
  async discoverPlugins(): Promise<Plugin[]> {
    const loaded: Plugin[] = [];
    
    // Scan plugins directory
    const entries = fs.readdirSync(this.pluginsDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const pluginPath = path.join(this.pluginsDir, entry.name);
      const manifestPath = path.join(pluginPath, 'quantum-plugin.json');
      
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest: PluginManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          const plugin: Plugin = {
            manifest,
            path: pluginPath,
            enabled: true
          };
          
          this.plugins.set(manifest.id, plugin);
          loaded.push(plugin);
        } catch (e) {
          console.error(`Failed to load plugin ${entry.name}:`, e);
        }
      }
    }

    vscode.window.showInformationMessage(`🔌 Loaded ${loaded.length} plugin(s)`);
    return loaded;
  }

  // Register a built-in plugin
  registerPlugin(id: string, name: string, hooks?: {
    commands?: CommandHook;
    views?: ViewHook;
  }): void {
    const plugin: Plugin = {
      manifest: {
        id,
        name,
        version: '1.0.0',
        description: 'Built-in plugin'
      },
      path: '',
      enabled: true
    };
    
    this.plugins.set(id, plugin);
  }

  // Get all plugins
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  // Get plugin by ID
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  // Enable/disable plugin
  setEnabled(id: string, enabled: boolean): void {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.enabled = enabled;
    }
  }

  // Create a new plugin from template
  async createPlugin(name: string): Promise<string | null> {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const pluginPath = path.join(this.pluginsDir, id);
    
    if (fs.existsSync(pluginPath)) {
      vscode.window.showErrorMessage('Plugin already exists!');
      return null;
    }

    // Create plugin structure
    fs.mkdirSync(pluginPath, { recursive: true });

    // Create manifest
    const manifest: PluginManifest = {
      id,
      name,
      version: '0.0.1',
      description: `My ${name} plugin`,
      commands: []
    };
    fs.writeFileSync(
      path.join(pluginPath, 'quantum-plugin.json'),
      JSON.stringify(manifest, null, 2)
    );

    // Create main file
    fs.writeFileSync(
      path.join(pluginPath, 'index.ts'),
      `/**
 * ${name} Plugin
 * 
 * Hooks available:
 * - activate(context): Called when plugin is activated
 * - deactivate(): Called when plugin is deactivated
 */

export function activate(context: vscode.ExtensionContext) {
  console.log('${name} plugin activated');
  
  // Register commands
  // context.subscriptions.push(
  //   vscode.commands.registerCommand('myPlugin.command', () => { ... })
  // );
}

export function deactivate() {
  console.log('${name} plugin deactivated');
}
`
    );

    // Create README
    fs.writeFileSync(
      path.join(pluginPath, 'README.md'),
      `# ${name} Plugin

## Commands

- \`myPlugin.command\` - Description

## Configuration

Add to settings:
\`\`\`json
{
  "${id}.enabled": true
}
\`\`\`
`
    );

    vscode.window.showInformationMessage(`✅ Created plugin: ${name}`);
    vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(pluginPath));

    return pluginPath;
  }

  // Show plugin manager UI
  async showManager(): Promise<void> {
    const panel = vscode.window.createWebviewPanel(
      'quantumPlugins',
      'Quantum Plugins',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    const plugins = this.getPlugins();
    
    panel.webview.html = this.getManagerHTML(plugins);

    panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'create':
          await this.createPlugin(message.name);
          break;
        case 'toggle':
          this.setEnabled(message.id, message.enabled);
          break;
        case 'reload':
          await this.discoverPlugins();
          break;
      }
    });
  }

  // Get manager HTML
  private getManagerHTML(plugins: Plugin[]): string {
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
    h2 { color: #fff; font-size: 16px; margin-bottom: 16px; }
    .plugin {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: #2d2d2d;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .plugin-info { flex: 1; }
    .plugin-name { color: #fff; font-weight: 600; }
    .plugin-desc { color: #888; font-size: 12px; margin-top: 4px; }
    .plugin-version { color: #6cb6ff; font-size: 11px; }
    .btn {
      background: #0e639c;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover { background: #1177bb; }
    .btn-secondary { background: #3d3d3d; }
    .input {
      background: #2d2d2d;
      border: 1px solid #3d3d3d;
      color: #fff;
      padding: 8px 12px;
      border-radius: 4px;
      width: 100%;
    }
    .section { margin-bottom: 20px; }
  </style>
</head>
<body>
  <h2>🔌 Quantum Plugins</h2>
  
  <div class="section">
    <input class="input" id="pluginName" placeholder="New plugin name..." />
    <button class="btn" onclick="createPlugin()">+ Create Plugin</button>
  </div>

  <div class="section">
    <button class="btn btn-secondary" onclick="reload()">🔄 Reload</button>
  </div>

  <h3>Installed Plugins (${plugins.length})</h3>
  ${plugins.length === 0 ? '<p style="color:#666">No plugins installed</p>' : ''}
  ${plugins.map(p => `
    <div class="plugin">
      <div class="plugin-info">
        <div class="plugin-name">${p.manifest.name}</div>
        <div class="plugin-desc">${p.manifest.description}</div>
        <div class="plugin-version">v${p.manifest.version}</div>
      </div>
    </div>
  `).join('')}

  <script>
    const vscode = acquireVsCodeApi();

    function createPlugin() {
      const name = document.getElementById('pluginName').value;
      if (name) {
        vscode.postMessage({ command: 'create', name });
      }
    }

    function toggle(id, enabled) {
      vscode.postMessage({ command: 'toggle', id, enabled });
    }

    function reload() {
      vscode.postMessage({ command: 'reload' });
    }
  </script>
</body>
</html>`;
  }

  // Execute plugin command
  async executePluginCommand(pluginId: string, command: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !plugin.enabled) {
      vscode.window.showErrorMessage('Plugin not found or disabled');
      return;
    }

    // In a full implementation, this would dynamically load and execute
    vscode.window.showInformationMessage(`Running ${plugin.manifest.name}: ${command}`);
  }

  // Quick actions
  async quickAction(action: string): Promise<void> {
    switch (action) {
      case 'manage':
        await this.showManager();
        break;
      case 'create':
        const name = await vscode.window.showInputBox({
          prompt: 'Plugin name'
        });
        if (name) {
          await this.createPlugin(name);
        }
        break;
      case 'list':
        const plugins = this.getPlugins();
        const names = plugins.map(p => p.manifest.name).join(', ');
        vscode.window.showInformationMessage(`📦 Plugins: ${names || 'none'}`);
        break;
    }
  }
}