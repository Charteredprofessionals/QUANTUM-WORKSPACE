/**
 * Plugin System - Extension Framework
 * Allow extending Quantum Workspace with plugins
 */
import * as vscode from 'vscode';
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
interface CommandHook {
    (context: vscode.ExtensionContext): void;
}
interface ViewHook {
    (context: vscode.ExtensionContext): vscode.WebviewViewProvider;
}
export declare class PluginSystem {
    private plugins;
    private pluginsDir;
    private workspaceRoot;
    constructor();
    private ensurePluginsDir;
    discoverPlugins(): Promise<Plugin[]>;
    registerPlugin(id: string, name: string, hooks?: {
        commands?: CommandHook;
        views?: ViewHook;
    }): void;
    getPlugins(): Plugin[];
    getPlugin(id: string): Plugin | undefined;
    setEnabled(id: string, enabled: boolean): void;
    createPlugin(name: string): Promise<string | null>;
    showManager(): Promise<void>;
    private getManagerHTML;
    executePluginCommand(pluginId: string, command: string): Promise<void>;
    quickAction(action: string): Promise<void>;
}
export {};
//# sourceMappingURL=plugin-system.d.ts.map