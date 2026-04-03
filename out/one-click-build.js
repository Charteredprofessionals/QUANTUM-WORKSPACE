"use strict";
/**
 * One-Click Build - Automated Build System
 * Single command to build, package, and prepare for deployment
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
exports.OneClickBuild = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
class OneClickBuild {
    constructor() {
        this.terminal = null;
        this.buildConfig = null;
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    }
    // Auto-detect project type and configure build
    async detectAndConfigure() {
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        const requirementsPath = path.join(this.workspaceRoot, 'requirements.txt');
        const cargoPath = path.join(this.workspaceRoot, 'Cargo.toml');
        const goPath = path.join(this.workspaceRoot, 'go.mod');
        if (fs.existsSync(packageJsonPath)) {
            // Node.js project
            const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            // Determine build command
            let buildCmd = 'npm run build';
            let outputDir = 'dist';
            // Check scripts in package.json
            if (pkg.scripts?.build)
                buildCmd = 'npm run build';
            else if (pkg.scripts?.build)
                buildCmd = 'npm run build';
            // Next.js detection
            if (pkg.dependencies?.next || pkg.devDependencies?.next) {
                outputDir = '.next';
            }
            // Vite detection
            if (pkg.devDependencies?.vite || pkg.dependencies?.vite) {
                outputDir = 'dist';
            }
            // React detection
            if (pkg.dependencies?.react) {
                outputDir = 'build';
            }
            return {
                buildCommand: buildCmd,
                outputDir,
                artifacts: [outputDir],
                preBuild: ['npm install'],
                postBuild: []
            };
        }
        if (fs.existsSync(requirementsPath)) {
            // Python project
            return {
                buildCommand: 'python -m compileall .',
                outputDir: '__pycache__',
                artifacts: ['__pycache__'],
                preBuild: ['pip install -r requirements.txt'],
                postBuild: []
            };
        }
        if (fs.existsSync(cargoPath)) {
            // Rust project
            return {
                buildCommand: 'cargo build --release',
                outputDir: 'target/release',
                artifacts: ['target/release'],
                preBuild: [],
                postBuild: []
            };
        }
        if (fs.existsSync(goPath)) {
            // Go project
            return {
                buildCommand: 'go build -o app',
                outputDir: '.',
                artifacts: ['app'],
                preBuild: [],
                postBuild: []
            };
        }
        // No known project type
        return null;
    }
    // Execute build with full pipeline
    async build() {
        const startTime = Date.now();
        const errors = [];
        const output = [];
        vscode.window.showInformationMessage('🚀 Starting One-Click Build...');
        // Create terminal for output
        if (!this.terminal) {
            this.terminal = vscode.window.createTerminal('Quantum Build');
        }
        this.terminal.show();
        // Detect config if not set
        if (!this.buildConfig) {
            this.buildConfig = await this.detectAndConfigure();
            if (!this.buildConfig) {
                vscode.window.showErrorMessage('❌ Could not detect project type');
                return {
                    success: false,
                    duration: 0,
                    output: 'Unknown project type',
                    errors: ['No known build configuration found'],
                    artifacts: []
                };
            }
        }
        try {
            // Pre-build steps
            for (const cmd of this.buildConfig.preBuild) {
                output.push(`Running: ${cmd}`);
                await this.runCommand(cmd, output, errors);
            }
            // Main build
            output.push(`\nBuilding: ${this.buildConfig.buildCommand}`);
            await this.runCommand(this.buildConfig.buildCommand, output, errors);
            // Post-build steps
            for (const cmd of this.buildConfig.postBuild) {
                output.push(`Running: ${cmd}`);
                await this.runCommand(cmd, output, errors);
            }
            // Verify output
            const artifacts = this.verifyArtifacts();
            const duration = Date.now() - startTime;
            if (errors.length === 0) {
                vscode.window.showInformationMessage(`✅ Build complete in ${duration}ms`);
            }
            else {
                vscode.window.showWarningMessage(`⚠️ Build completed with ${errors.length} warning(s)`);
            }
            return {
                success: errors.length === 0,
                duration,
                output: output.join('\n'),
                errors,
                artifacts
            };
        }
        catch (e) {
            vscode.window.showErrorMessage(`❌ Build failed: ${e.message}`);
            return {
                success: false,
                duration: Date.now() - startTime,
                output: output.join('\n'),
                errors: [e.message],
                artifacts: []
            };
        }
    }
    // Run a shell command
    runCommand(cmd, output, errors) {
        return new Promise((resolve, reject) => {
            const shell = (0, child_process_1.exec)(cmd, { cwd: this.workspaceRoot }, (err, stdout, stderr) => {
                if (stdout)
                    output.push(stdout);
                if (stderr) {
                    // Check if it's an error or just warning
                    if (stderr.toLowerCase().includes('error')) {
                        errors.push(stderr);
                    }
                    output.push(stderr);
                }
                if (err) {
                    errors.push(err.message);
                    output.push(`❌ Error: ${err.message}`);
                }
                resolve();
            });
            // Stream output to terminal in real-time
            shell.stdout?.on('data', (data) => {
                this.terminal?.sendText(data.toString());
            });
            shell.stderr?.on('data', (data) => {
                this.terminal?.sendText(data.toString());
            });
        });
    }
    // Verify build artifacts exist
    verifyArtifacts() {
        if (!this.buildConfig)
            return [];
        const found = [];
        for (const artifact of this.buildConfig.artifacts) {
            const fullPath = path.join(this.workspaceRoot, artifact);
            if (fs.existsSync(fullPath)) {
                found.push(artifact);
                // Count files
                if (fs.statSync(fullPath).isDirectory()) {
                    const files = fs.readdirSync(fullPath).length;
                    vscode.window.showInformationMessage(`📦 ${artifact}: ${files} files`);
                }
            }
        }
        return found;
    }
    // Clean build artifacts
    async clean() {
        if (!this.buildConfig)
            return;
        for (const artifact of this.buildConfig.artifacts) {
            const fullPath = path.join(this.workspaceRoot, artifact);
            if (fs.existsSync(fullPath)) {
                try {
                    fs.rmSync(fullPath, { recursive: true, force: true });
                }
                catch (e) { }
            }
        }
        vscode.window.showInformationMessage('🧹 Build artifacts cleaned');
    }
    // Package for distribution
    async package() {
        if (!this.buildConfig)
            return null;
        const { name } = path.parse(this.workspaceRoot);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveName = `${name}-${timestamp}`;
        // Show packaging options
        const choice = await vscode.window.showQuickPick(['ZIP', 'TAR.GZ', 'Done'], {
            placeHolder: 'Choose archive format'
        });
        if (!choice || choice === 'Done')
            return null;
        const archive = choice === 'ZIP' ? 'zip -r' : 'tar -czf';
        const ext = choice === 'ZIP' ? 'zip' : 'tar.gz';
        const cmd = `${archive} ${archiveName}.${ext} ${this.buildConfig.artifacts.join(' ')}`;
        return new Promise((resolve) => {
            (0, child_process_1.exec)(cmd, { cwd: this.workspaceRoot }, (err) => {
                if (err) {
                    vscode.window.showErrorMessage('❌ Packaging failed');
                    resolve(null);
                }
                else {
                    const archivePath = path.join(this.workspaceRoot, `${archiveName}.${ext}`);
                    vscode.window.showInformationMessage(`📦 Packaged: ${archiveName}.${ext}`);
                    resolve(archivePath);
                }
            });
        });
    }
    // Show build status
    showStatus() {
        if (!this.buildConfig) {
            vscode.window.showInformationMessage('📋 Run a build to see status');
            return;
        }
        vscode.window.showInformationMessage(`Build: ${this.buildConfig.buildCommand} → ${this.buildConfig.outputDir}`);
    }
    // Quick build with progress
    async quickBuild() {
        const progress = await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Building...',
            cancellable: true
        }, async (p) => {
            p.report({ message: 'Detecting project...' });
            const config = await this.detectAndConfigure();
            if (!config) {
                throw new Error('Unknown project type');
            }
            this.buildConfig = config;
            p.report({ message: 'Installing dependencies...' });
            for (const cmd of config.preBuild) {
                await this.runCommand(cmd, [], []);
            }
            p.report({ message: 'Building...' });
            await this.runCommand(config.buildCommand, [], []);
            p.report({ message: 'Verifying...' });
            const artifacts = this.verifyArtifacts();
            return artifacts;
        });
        vscode.window.showInformationMessage(`✅ Built! ${progress?.length || 0} artifact(s)`);
    }
}
exports.OneClickBuild = OneClickBuild;
