"use strict";
/**
 * Smart Memory - Session & Project Memory
 * Remembers decisions, patterns, preferences across sessions
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
exports.SmartMemory = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class SmartMemory {
    constructor() {
        this.memory = null;
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.memoryPath = path.join(workspacePath || '', '.quantum', 'memory.json');
        this.loadMemory();
    }
    // Load memory from disk
    loadMemory() {
        try {
            if (fs.existsSync(this.memoryPath)) {
                const data = fs.readFileSync(this.memoryPath, 'utf-8');
                const parsed = JSON.parse(data);
                this.memory = {
                    projectPath: parsed.projectPath || '',
                    entries: parsed.entries || [],
                    preferences: new Map(parsed.preferences || {})
                };
            }
            else {
                this.initMemory(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
            }
        }
        catch (e) {
            this.initMemory(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
        }
    }
    initMemory(projectPath) {
        this.memory = {
            projectPath,
            entries: [],
            preferences: new Map()
        };
    }
    // Save memory to disk
    saveMemory() {
        if (!this.memory)
            return;
        const dir = path.dirname(this.memoryPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.memoryPath, JSON.stringify({
            projectPath: this.memory.projectPath,
            entries: this.memory.entries,
            preferences: Array.from(this.memory.preferences.entries())
        }, null, 2));
    }
    // Store a preference (e.g., "uses tailwind", "prefers dark mode")
    setPreference(key, value) {
        if (!this.memory)
            return;
        this.memory.preferences.set(key, value);
        this.addEntry({
            id: `pref_${Date.now()}`,
            type: 'preference',
            key,
            value,
            timestamp: Date.now()
        });
        this.saveMemory();
    }
    // Get a preference
    getPreference(key) {
        return this.memory?.preferences.get(key);
    }
    // Remember a decision
    rememberDecision(decision, context) {
        this.addEntry({
            id: `dec_${Date.now()}`,
            type: 'decision',
            key: decision,
            value: true,
            timestamp: Date.now(),
            context
        });
        this.saveMemory();
    }
    // Remember a pattern (e.g., "API uses REST", "uses this lib")
    rememberPattern(pattern, details) {
        this.addEntry({
            id: `pat_${Date.now()}`,
            type: 'pattern',
            key: pattern,
            value: details,
            timestamp: Date.now()
        });
        this.saveMemory();
    }
    // Add context for current project state
    addContext(context, data) {
        this.addEntry({
            id: `ctx_${Date.now()}`,
            type: 'context',
            key: context,
            value: data,
            timestamp: Date.now()
        });
        this.saveMemory();
    }
    // Helper to add entry
    addEntry(entry) {
        if (!this.memory)
            return;
        // Keep last 100 entries only
        this.memory.entries.push(entry);
        if (this.memory.entries.length > 100) {
            this.memory.entries = this.memory.entries.slice(-100);
        }
    }
    // Get all recent decisions
    getRecentDecisions(limit = 10) {
        if (!this.memory)
            return [];
        return this.memory.entries
            .filter(e => e.type === 'decision')
            .slice(-limit)
            .reverse();
    }
    // Get all patterns
    getPatterns() {
        if (!this.memory)
            return [];
        return this.memory.entries.filter(e => e.type === 'pattern');
    }
    // Generate context string for LLM prompts
    getContextForPrompt() {
        if (!this.memory)
            return '';
        const parts = [];
        // Add preferences
        if (this.memory.preferences.size > 0) {
            parts.push('## Known Preferences');
            for (const [key, value] of this.memory.preferences.entries()) {
                parts.push(`- ${key}: ${value}`);
            }
        }
        // Add recent decisions
        const recentDecisions = this.getRecentDecisions(3);
        if (recentDecisions.length > 0) {
            parts.push('\n## Recent Decisions');
            for (const d of recentDecisions) {
                parts.push(`- ${d.key}: ${d.context || ''}`);
            }
        }
        // Add patterns
        const patterns = this.getPatterns();
        if (patterns.length > 0) {
            parts.push('\n## Known Patterns');
            for (const p of patterns) {
                parts.push(`- ${p.key}: ${p.value}`);
            }
        }
        return parts.join('\n');
    }
    // Auto-learn from code
    async learnFromCode() {
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath)
            return;
        // Check for package.json to detect package manager
        const packageJsonPath = path.join(workspacePath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                this.setPreference('packageManager', 'npm');
                // Detect frameworks
                const deps = { ...pkg.dependencies, ...pkg.devDependencies };
                if (deps.tailwindcss)
                    this.setPreference('usesTailwind', true);
                if (deps.react)
                    this.setPreference('framework', 'React');
                if (deps.vue)
                    this.setPreference('framework', 'Vue');
                if (deps.next)
                    this.setPreference('framework', 'Next.js');
            }
            catch (e) { }
        }
        // Check for requirements.txt (Python)
        const reqPath = path.join(workspacePath, 'requirements.txt');
        if (fs.existsSync(reqPath)) {
            this.setPreference('packageManager', 'pip');
        }
        // Check for Cargo.toml (Rust)
        const cargoPath = path.join(workspacePath, 'Cargo.toml');
        if (fs.existsSync(cargoPath)) {
            this.setPreference('language', 'Rust');
        }
        vscode.window.showInformationMessage('🧠 Learned about your project');
    }
    // Clear memory
    clear() {
        this.memory = null;
        if (fs.existsSync(this.memoryPath)) {
            fs.unlinkSync(this.memoryPath);
        }
        this.initMemory(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
    }
}
exports.SmartMemory = SmartMemory;
