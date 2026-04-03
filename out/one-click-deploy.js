"use strict";
/**
 * One-Click Deploy - Cloudflare & Vercel Integration
 * Deploy with a single click to Cloudflare Pages or Vercel
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneClickDeploy = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
class OneClickDeploy {
    constructor() {
        this.config = null;
        this.currentDeployment = null;
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    }
    // Auto-detect framework and configure
    async detectConfig() {
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        const nextConfigPath = path.join(this.workspaceRoot, 'next.config.js');
        const astroConfigPath = path.join(this.workspaceRoot, 'astro.config.mjs');
        const nuxtConfigPath = path.join(this.workspaceRoot, 'nuxt.config.ts');
        const viteConfigPath = path.join(this.workspaceRoot, 'vite.config.ts');
        let outputDir = 'dist';
        let framework;
        if (fs.existsSync(packageJsonPath)) {
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            // Detect framework
            if (pkg.dependencies?.next || pkg.devDependencies?.next) {
                framework = 'next';
                outputDir = '.next';
            }
            else if (pkg.dependencies?.astro || pkg.devDependencies?.astro) {
                framework = 'astro';
                outputDir = 'dist';
            }
            else if (pkg.dependencies?.nuxt || pkg.devDependencies?.nuxt) {
                framework = 'nuxt';
                outputDir = '.output';
            }
            else if (pkg.devDependencies?.vite) {
                framework = 'vite';
                outputDir = 'dist';
            }
            else if (pkg.dependencies?.gatsby) {
                framework = 'gatsby';
                outputDir = 'public';
            }
            else if (pkg.dependencies?.remix) {
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
    async selectProvider() {
        const choice = await vscode.window.showQuickPick([
            { label: '🚀 Vercel', description: 'Best for Next.js, React, Vite' },
            { label: '☁️ Cloudflare Pages', description: 'Best for static sites, Workers' },
            { label: '🌊 Netlify', description: 'All-in-one platform' }
        ], {
            placeHolder: 'Where do you want to deploy?'
        });
        if (!choice)
            return null;
        const config = await this.detectConfig();
        if (!config)
            return null;
        config.provider = choice.label.includes('Vercel') ? 'vercel'
            : choice.label.includes('Cloudflare') ? 'cloudflare'
                : 'netlify';
        this.config = config;
        return config;
    }
    // Deploy to Vercel
    async deployToVercel() {
        vscode.window.showInformationMessage('🚀 Deploying to Vercel...');
        // Check for Vercel CLI
        const hasCli = await this.checkCommand('vercel');
        if (!hasCli) {
            // Offer to install
            const install = await vscode.window.showInformationMessage('Vercel CLI not found. Install it?', 'Install', 'Cancel');
            if (install === 'Install') {
                await this.runCommand('npm install -g vercel');
            }
            else {
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
        }
        else {
            vscode.window.showErrorMessage('❌ Deploy failed');
        }
        return {
            success,
            url,
            errors: success ? [] : ['Deployment failed']
        };
    }
    // Deploy to Cloudflare Pages
    async deployToCloudflare() {
        vscode.window.showInformationMessage('☁️ Deploying to Cloudflare Pages...');
        // Check for Wrangler CLI
        const hasCli = await this.checkCommand('wrangler');
        if (!hasCli) {
            const install = await vscode.window.showInformationMessage('Wrangler CLI not found. Install it?', 'Install', 'Cancel');
            if (install === 'Install') {
                await this.runCommand('npm install -g wrangler');
            }
            else {
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
        const output = await this.runCommand(`wrangler pages deploy ${this.config?.outputDir || 'dist'} --project-name=${this.config?.projectName}`, true);
        // Parse deployment URL
        const urlMatch = output?.match(/https:\/\/[^\s]+\.pages\.dev/);
        const url = urlMatch ? urlMatch[0] : '';
        const success = output?.includes('Published') || output?.includes('success');
        if (success) {
            vscode.window.showInformationMessage(`✅ Deployed! ${url}`);
        }
        else {
            vscode.window.showErrorMessage('❌ Deploy failed');
        }
        return {
            success,
            url,
            errors: success ? [] : ['Deployment failed']
        };
    }
    // Deploy to Netlify
    async deployToNetlify() {
        vscode.window.showInformationMessage('🌊 Deploying to Netlify...');
        const hasCli = await this.checkCommand('netlify');
        if (!hasCli) {
            const install = await vscode.window.showInformationMessage('Netlify CLI not found. Install it?', 'Install', 'Cancel');
            if (install === 'Install') {
                await this.runCommand('npm install -g netlify-cli');
            }
            else {
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
    async deploy(provider) {
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
        let result;
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
    async buildProject() {
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
    checkCommand(cmd) {
        return new Promise((resolve) => {
            (0, child_process_1.exec)(`which ${cmd}`, (err) => {
                resolve(!err);
            });
        });
    }
    // Run shell command
    runCommand(cmd, showOutput = false) {
        return new Promise((resolve) => {
            (0, child_process_1.exec)(cmd, { cwd: this.workspaceRoot }, (err, stdout, stderr) => {
                if (showOutput) {
                    console.log(stdout + stderr);
                }
                resolve(err ? null : stdout || stderr);
            });
        });
    }
    // Show deployment status
    showStatus() {
        if (!this.currentDeployment) {
            vscode.window.showInformationMessage('No recent deployments');
            return;
        }
        const { success, url, errors } = this.currentDeployment;
        if (success) {
            const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            item.text = '🚀 Deployed';
            item.command = 'quantumWorkspace.openDeployment';
            item.tooltip = url;
            item.show();
        }
    }
    // Open deployment URL
    async openDeployment() {
        if (this.currentDeployment?.url) {
            vscode.env.openExternal(vscode.Uri.parse(this.currentDeployment.url));
        }
    }
    // Quick deploy (build + deploy)
    async quickDeploy() {
        const config = await this.selectProvider();
        if (!config)
            return;
        await this.deploy();
    }
}
exports.OneClickDeploy = OneClickDeploy;
