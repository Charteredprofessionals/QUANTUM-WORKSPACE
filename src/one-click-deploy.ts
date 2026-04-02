/**
 * One-Click Deploy - Cloudflare & Vercel Integration
 * Deploy with a single click to Cloudflare Pages or Vercel
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface DeployConfig {
  provider: 'vercel' | 'cloudflare' | 'netlify';
  projectName: string;
  teamOrAccount?: string;
  framework?: string;
  outputDir: string;
}

interface DeployResult {
  success: boolean;
  url: string;
  deploymentId?: string;
  errors: string[];
}

export class OneClickDeploy {
  private workspaceRoot: string;
  private config: DeployConfig | null = null;
  private currentDeployment: DeployResult | null = null;

  constructor() {
    this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  }

  // Auto-detect framework and configure
  async detectConfig(): Promise<DeployConfig | null> {
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    const nextConfigPath = path.join(this.workspaceRoot, 'next.config.js');
    const astroConfigPath = path.join(this.workspaceRoot, 'astro.config.mjs');
    const nuxtConfigPath = path.join(this.workspaceRoot, 'nuxt.config.ts');
    const viteConfigPath = path.join(this.workspaceRoot, 'vite.config.ts');

    let outputDir = 'dist';
    let framework: string | undefined;

    if (fs.existsSync(packageJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      
      // Detect framework
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        framework = 'next';
        outputDir = '.next';
      } else if (pkg.dependencies?.astro || pkg.devDependencies?.astro) {
        framework = 'astro';
        outputDir = 'dist';
      } else if (pkg.dependencies?.nuxt || pkg.devDependencies?.nuxt) {
        framework = 'nuxt';
        outputDir = '.output';
      } else if (pkg.devDependencies?.vite) {
        framework = 'vite';
        outputDir = 'dist';
      } else if (pkg.dependencies?.gatsby) {
        framework = 'gatsby';
        outputDir = 'public';
      } else if (pkg.dependencies?.remix) {
        framework = 'remix';
        outputDir = 'build';
      }
    }

    const projectName = path.parse(this.workspaceRoot).name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    return {
      provider: 'vercel', // default
      projectName,
      framework,
      outputDir
    };
  }

  // Show deployment provider selection
  async selectProvider(): Promise<DeployConfig | null> {
    const choice = await vscode.window.showQuickPick([
      { label: '🚀 Vercel', description: 'Best for Next.js, React, Vite' },
      { label: '☁️ Cloudflare Pages', description: 'Best for static sites, Workers' },
      { label: '🌊 Netlify', description: 'All-in-one platform' }
    ], {
      placeHolder: 'Where do you want to deploy?'
    });

    if (!choice) return null;

    const config = await this.detectConfig();
    if (!config) return null;

    config.provider = choice.label.includes('Vercel') ? 'vercel' 
      : choice.label.includes('Cloudflare') ? 'cloudflare'
      : 'netlify';

    this.config = config;
    return config;
  }

  // Deploy to Vercel
  async deployToVercel(): Promise<DeployResult> {
    vscode.window.showInformationMessage('🚀 Deploying to Vercel...');

    // Check for Vercel CLI
    const hasCli = await this.checkCommand('vercel');

    if (!hasCli) {
      // Offer to install
      const install = await vscode.window.showInformationMessage(
        'Vercel CLI not found. Install it?',
        'Install',
        'Cancel'
      );

      if (install === 'Install') {
        await this.runCommand('npm install -g vercel');
      } else {
        return { success: false, url: '', errors: ['Vercel CLI not installed'] };
      }
    }

    // Deploy
    const output = await this.runCommand('vercel --yes --prod', true);
    
    // Parse deployment URL
    const urlMatch = output?.match(/https:\/\/[^\s]+\.vercel\.app/);
    const url = urlMatch ? urlMatch[0] : '';

    const success = output?.includes('Ready') || output?.includes('Deployment successful');

    if (success) {
      vscode.window.showInformationMessage(`✅ Deployed! ${url}`);
    } else {
      vscode.window.showErrorMessage('❌ Deploy failed');
    }

    return {
      success,
      url,
      errors: success ? [] : ['Deployment failed']
    };
  }

  // Deploy to Cloudflare Pages
  async deployToCloudflare(): Promise<DeployResult> {
    vscode.window.showInformationMessage('☁️ Deploying to Cloudflare Pages...');

    // Check for Wrangler CLI
    const hasCli = await this.checkCommand('wrangler');

    if (!hasCli) {
      const install = await vscode.window.showInformationMessage(
        'Wrangler CLI not found. Install it?',
        'Install',
        'Cancel'
      );

      if (install === 'Install') {
        await this.runCommand('npm install -g wrangler');
      } else {
        return { success: false, url: '', errors: ['Wrangler CLI not installed'] };
      }
    }

    // Check for cloudflare.json config
    const cfConfigPath = path.join(this.workspaceRoot, 'cloudflare.json');
    if (!fs.existsSync(cfConfigPath)) {
      // Create basic config
      const cfConfig = {
        name: this.config?.projectName || 'quantum-app',
       _compatibility_date: new Date().toISOString().split('T')[0]
      };
      fs.writeFileSync(cfConfigPath, JSON.stringify(cfConfig, null, 2));
    }

    // Deploy using Pages
    const output = await this.runCommand(
      `wrangler pages deploy ${this.config?.outputDir || 'dist'} --project-name=${this.config?.projectName}`,
      true
    );

    // Parse deployment URL
    const urlMatch = output?.match(/https:\/\/[^\s]+\.pages\.dev/);
    const url = urlMatch ? urlMatch[0] : '';

    const success = output?.includes('Published') || output?.includes('success');

    if (success) {
      vscode.window.showInformationMessage(`✅ Deployed! ${url}`);
    } else {
      vscode.window.showErrorMessage('❌ Deploy failed');
    }

    return {
      success,
      url,
      errors: success ? [] : ['Deployment failed']
    };
  }

  // Deploy to Netlify
  async deployToNetlify(): Promise<DeployResult> {
    vscode.window.showInformationMessage('🌊 Deploying to Netlify...');

    const hasCli = await this.checkCommand('netlify');

    if (!hasCli) {
      const install = await vscode.window.showInformationMessage(
        'Netlify CLI not found. Install it?',
        'Install',
        'Cancel'
      );

      if (install === 'Install') {
        await this.runCommand('npm install -g netlify-cli');
      } else {
        return { success: false, url: '', errors: ['Netlify CLI not installed'] };
      }
    }

    const output = await this.runCommand('netlify deploy --prod --dir=' + (this.config?.outputDir || 'dist'), true);
    
    const urlMatch = output?.match(/https:\/\/[^\s]+\.netlify\.app/);
    const url = urlMatch ? urlMatch[0] : '';

    const success = output?.includes('Deploy complete');

    if (success) {
      vscode.window.showInformationMessage(`✅ Deployed! ${url}`);
    }

    return { success, url, errors: success ? [] : ['Deploy failed'] };
  }

  // Main deploy function
  async deploy(provider?: 'vercel' | 'cloudflare' | 'netlify'): Promise<DeployResult> {
    // Get config
    if (!this.config) {
      this.config = await this.selectProvider();
      if (!this.config) {
        return { success: false, url: '', errors: ['No provider selected'] };
      }
    }

    // Build first
    vscode.window.showInformationMessage('🔨 Building project...');
    const buildResult = await this.buildProject();
    
    if (!buildResult) {
      return { success: false, url: '', errors: ['Build failed'] };
    }

    // Deploy
    let result: DeployResult;
    
    switch (provider || this.config.provider) {
      case 'vercel':
        result = await this.deployToVercel();
        break;
      case 'cloudflare':
        result = await this.deployToCloudflare();
        break;
      case 'netlify':
        result = await this.deployToNetlify();
        break;
      default:
        result = { success: false, url: '', errors: ['Unknown provider'] };
    }

    this.currentDeployment = result;
    return result;
  }

  // Build the project
  private async buildProject(): Promise<boolean> {
    const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const buildCmd = pkg.scripts?.build || 'npm run build';

    const output = await this.runCommand(buildCmd, true);
    return output?.includes('compiled') || output?.includes('built') || output?.includes('Generated') || fs.existsSync(path.join(this.workspaceRoot, this.config?.outputDir || 'dist'));
  }

  // Check if command exists
  private checkCommand(cmd: string): Promise<boolean> {
    return new Promise((resolve) => {
      exec(`which ${cmd}`, (err) => {
        resolve(!err);
      });
    });
  }

  // Run shell command
  private runCommand(cmd: string, showOutput: boolean = false): Promise<string | null> {
    return new Promise((resolve) => {
      exec(cmd, { cwd: this.workspaceRoot }, (err, stdout, stderr) => {
        if (showOutput) {
          console.log(stdout + stderr);
        }
        resolve(err ? null : stdout || stderr);
      });
    });
  }

  // Show deployment status
  showStatus(): void {
    if (!this.currentDeployment) {
      vscode.window.showInformationMessage('No recent deployments');
      return;
    }

    const { success, url, errors } = this.currentDeployment;
    
    if (success) {
      const item = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
      );
      item.text = '🚀 Deployed';
      item.command = 'quantumWorkspace.openDeployment';
      item.tooltip = url;
      item.show();
    }
  }

  // Open deployment URL
  async openDeployment(): Promise<void> {
    if (this.currentDeployment?.url) {
      vscode.env.openExternal(vscode.Uri.parse(this.currentDeployment.url));
    }
  }

  // Quick deploy (build + deploy)
  async quickDeploy(): Promise<void> {
    const config = await this.selectProvider();
    if (!config) return;

    await this.deploy();
  }
}