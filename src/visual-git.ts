/**
 * Visual Git - Git Operations UI
 * Visual interface for git: status, diff, stage, commit, branch
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface GitFile {
  path: string;
  status: 'M' | 'A' | 'D' | 'R' | '?' | 'U';
  staged: boolean;
}

interface GitBranch {
  name: string;
  current: boolean;
  remote?: string;
}

interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
}

export class VisualGit {
  private panel: vscode.WebviewPanel | null = null;
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  }

  // Get git status
  async getStatus(): Promise<GitFile[]> {
    const files: GitFile[] = [];
    
    const result = await this.runCommand('git status --porcelain');
    if (!result) return files;

    const lines = result.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const status = line.substring(0, 2).trim();
      const filePath = line.substring(3).trim();
      
      files.push({
        path: filePath,
        status: (status.charAt(0) || '?') as any,
        staged: status.length > 1 && status.charAt(1) !== ' '
      });
    }

    return files;
  }

  // Get branches
  async getBranches(): Promise<GitBranch[]> {
    const branches: GitBranch[] = [];
    
    const result = await this.runCommand('git branch -a');
    if (!result) return branches;

    const lines = result.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const name = line.replace(/^\*|\s+/g, '').replace(/^remotes\//, '');
      const isCurrent = line.includes('*');
      
      branches.push({
        name,
        current: isCurrent,
        remote: line.includes('remotes/') ? name.split('/')[0] : undefined
      });
    }

    return branches;
  }

  // Get recent commits
  async getCommits(limit: number = 10): Promise<GitCommit[]> {
    const commits: GitCommit[] = [];
    
    const result = await this.runCommand(`git log --oneline -n ${limit}`);
    if (!result) return commits;

    const lines = result.split('\n').filter(l => l.trim());
    for (const line of lines) {
      const match = line.match(/^([a-f0-9]+)\s+(.+)$/);
      if (match) {
        commits.push({
          hash: match[1].substring(0, 7),
          message: match[2],
          author: '',
          date: ''
        });
      }
    }

    return commits;
  }

  // Stage files
  async stage(files: string[]): Promise<void> {
    for (const file of files) {
      await this.runCommand(`git add "${file}"`);
    }
    this.refresh();
  }

  // Unstage files
  async unstage(files: string[]): Promise<void> {
    await this.runCommand(`git reset HEAD "${files.join('" "')}"`);
    this.refresh();
  }

  // Commit changes
  async commit(message: string): Promise<boolean> {
    if (!message.trim()) {
      vscode.window.showErrorMessage('Commit message cannot be empty');
      return false;
    }

    const result = await this.runCommand(`git commit -m "${message}"`);
    if (result?.includes('nothing to commit')) {
      vscode.window.showInformationMessage('Nothing to commit');
      return false;
    }

    vscode.window.showInformationMessage('✅ Commited successfully');
    this.refresh();
    return true;
  }

  // Create branch
  async createBranch(name: string): Promise<boolean> {
    await this.runCommand(`git checkout -b "${name}"`);
    vscode.window.showInformationMessage(`📦 Branch "${name}" created`);
    this.refresh();
    return true;
  }

  // Switch branch
  async checkout(branch: string): Promise<void> {
    await this.runCommand(`git checkout "${branch}"`);
    vscode.window.showInformationMessage(`🔀 Switched to "${branch}"`);
    this.refresh();
  }

  // Pull changes
  async pull(): Promise<void> {
    vscode.window.showInformationMessage('⬇️ Pulling changes...');
    await this.runCommand('git pull');
    vscode.window.showInformationMessage('✅ Pull complete');
    this.refresh();
  }

  // Push changes
  async push(): Promise<void> {
    vscode.window.showInformationMessage('⬆️ Pushing changes...');
    await this.runCommand('git push');
    vscode.window.showInformationMessage('✅ Push complete');
    this.refresh();
  }

  // Get diff for a file
  async getDiff(file: string): Promise<string> {
    return await this.runCommand(`git diff "${file}"`) || '';
  }

  // Run git command
  private runCommand(cmd: string): Promise<string | null> {
    return new Promise((resolve) => {
      exec(cmd, { cwd: this.workspaceRoot }, (err, stdout, stderr) => {
        resolve(err ? null : stdout || stderr);
      });
    });
  }

  // Show visual git panel
  async showPanel() {
    const panel = vscode.window.createWebviewPanel(
      'quantumGit',
      'Quantum Git',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    this.panel = panel;
    await this.refresh();

    panel.webview.onDidReceiveMessage(async (message) => {
      await this.handleMessage(message);
    });
  }

  // Handle messages from webview
  private async handleMessage(message: any) {
    switch (message.command) {
      case 'stage':
        await this.stage(message.files);
        break;
      case 'unstage':
        await this.unstage(message.files);
        break;
      case 'commit':
        await this.commit(message.message);
        break;
      case 'createBranch':
        await this.createBranch(message.name);
        break;
      case 'checkout':
        await this.checkout(message.branch);
        break;
      case 'pull':
        await this.pull();
        break;
      case 'push':
        await this.push();
        break;
      case 'refresh':
        await this.refresh();
        break;
    }
  }

  // Refresh the panel
  private async refresh() {
    if (!this.panel) return;

    const status = await this.getStatus();
    const branches = await this.getBranches();
    const commits = await this.getCommits();

    const stagedFiles = status.filter(f => f.staged);
    const unstagedFiles = status.filter(f => !f.staged);

    this.panel.webview.html = this.getHTML(status, stagedFiles, unstagedFiles, branches, commits);
  }

  // Generate HTML
  private getHTML(status: GitFile[], staged: GitFile[], unstaged: GitFile[], branches: GitBranch[], commits: GitCommit[]): string {
    const statusColors: Record<string, string> = {
      'M': '🟡', 'A': '🟢', 'D': '🔴', 'R': '🔵', '?': '⚪', 'U': '🟣'
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 16px;
      background: #0d1117; /* Quantum Dark */
      color: #c9d1d9;
    }
    h2 { color: #58a6ff; font-size: 16px; margin-bottom: 12px; } /* Quantum Blue */
    .section { margin-bottom: 20px; }
    .file-list { 
      display: flex; 
      flex-direction: column; 
      gap: 4px;
    }
    .file { 
      display: flex; 
      align-items: center; 
      gap: 8px;
      padding: 6px 8px;
      background: #161b22;
      border-radius: 4px;
      cursor: pointer;
    }
    .file:hover { background: #21262d; }
    .status-icon { font-size: 14px; }
    .file-name { flex: 1; font-size: 13px; color: #c9d1d9; }
    .btn {
      background: #238636;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin: 4px;
    }
    .btn:hover { background: #2ea043; }
    .btn-secondary { background: #21262d; color: #c9d1d9; }
    .btn-secondary:hover { background: #30363d; }
    .input {
      background: #0d1117;
      border: 1px solid #30363d;
      color: #c9d1d9;
      padding: 8px;
      border-radius: 4px;
      width: 100%;
      margin-bottom: 8px;
    }
    .branch { 
      padding: 4px 8px; 
      background: #161b22; 
      border-radius: 4px;
      margin: 2px;
      display: inline-block;
      color: #c9d1d9;
    }
    .branch.current { background: #238636; color: #fff; }
    .commit {
      padding: 8px;
      background: #161b22;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .commit-hash { color: #58a6ff; font-size: 11px; }
    .commit-msg { font-size: 12px; color: #c9d1d9; }
    .toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn" onclick="refresh()">🔄 Refresh</button>
    <button class="btn" onclick="pull()">⬇️ Pull</button>
    <button class="btn" onclick="push()">⬆️ Push</button>
  </div>

  <div class="section">
    <h2>📦 Staged (${staged.length})</h2>
    <div class="file-list">
      ${staged.length === 0 ? '<div style="color:#666">No staged files</div>' : ''}
      ${staged.map(f => `
        <div class="file" onclick="unstage(['${f.path}'])">
          <span class="status-icon">${statusColors[f.status]}</span>
          <span class="file-name">${f.path}</span>
          <span style="color:#666;font-size:11px">click to unstage</span>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>📝 Unstaged (${unstaged.length})</h2>
    <div class="file-list">
      ${unstaged.length === 0 ? '<div style="color:#666">No changes</div>' : ''}
      ${unstaged.map(f => `
        <div class="file" onclick="stage(['${f.path}'])">
          <span class="status-icon">${statusColors[f.status]}</span>
          <span class="file-name">${f.path}</span>
          <span style="color:#666;font-size:11px">click to stage</span>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>🌿 Branches</h2>
    <div>
      ${branches.slice(0, 8).map(b => `
        <span class="branch ${b.current ? 'current' : ''}" onclick="checkout('${b.name}')">
          ${b.current ? '●' : '○'} ${b.name}
        </span>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>📜 Recent Commits</h2>
    ${commits.map(c => `
      <div class="commit">
        <span class="commit-hash">${c.hash}</span>
        <span class="commit-msg">${c.message}</span>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>💾 Commit</h2>
    <input class="input" id="commitMsg" placeholder="Commit message..." />
    <button class="btn" onclick="commit()">Commit</button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    function stage(files) {
      vscode.postMessage({ command: 'stage', files });
    }

    function unstage(files) {
      vscode.postMessage({ command: 'unstage', files });
    }

    function commit() {
      const msg = document.getElementById('commitMsg').value;
      vscode.postMessage({ command: 'commit', message: msg });
    }

    function checkout(branch) {
      vscode.postMessage({ command: 'checkout', branch });
    }

    function pull() {
      vscode.postMessage({ command: 'pull' });
    }

    function push() {
      vscode.postMessage({ command: 'push' });
    }

    function refresh() {
      vscode.postMessage({ command: 'refresh' });
    }
  </script>
</body>
</html>`;
  }
}