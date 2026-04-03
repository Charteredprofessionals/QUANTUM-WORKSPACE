"use strict";
/**
 * Quantum Brain - Unified AI Engine
 * Orchestrates: Context + Memory + Cache + Automation
 * The core efficiency engine for Quantum Workspace
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
exports.QuantumBrain = void 0;
const vscode = __importStar(require("vscode"));
const context_indexer_1 = require("./context-indexer");
const smart_memory_1 = require("./smart-memory");
const response_cache_1 = require("./response-cache");
const auto_workflow_1 = require("./auto-workflow");
class QuantumBrain {
    constructor() {
        this.isInitialized = false;
        // Initialize components
        this.indexer = new context_indexer_1.CodebaseIndexer();
        this.memory = new smart_memory_1.SmartMemory();
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.cache = new response_cache_1.ResponseCache(workspacePath);
        this.workflow = new auto_workflow_1.AutoWorkflow(this.memory);
        this.config = {
            enableIndexing: true,
            enableMemory: true,
            enableCaching: true,
            enableAutomation: true,
            localFirst: true // Prefer local models (Ollama) when available
        };
    }
    // Initialize the brain
    async initialize() {
        if (this.isInitialized)
            return;
        // Auto-learn about the project
        await this.memory.learnFromCode();
        // Index the codebase if needed
        if (this.config.enableIndexing && this.indexer.needsReindex()) {
            await this.indexer.indexWorkspace();
        }
        // Clean expired cache entries
        this.cache.cleanExpired();
        this.isInitialized = true;
        vscode.window.showInformationMessage('🧠 Quantum Brain initialized');
    }
    // Process a prompt through the brain
    async processPrompt(input) {
        // 1. Check cache first
        if (this.config.enableCaching) {
            const cached = this.cache.get(input.prompt, input.model || 'default');
            if (cached) {
                return cached;
            }
        }
        // 2. Build enhanced context
        const context = this.buildContext(input.prompt);
        // 3. Process through workflow
        const response = await this.callLLM(input.prompt, context, input.model);
        // 4. Cache the response
        if (this.config.enableCaching) {
            this.cache.set(input.prompt, response, input.model || 'default');
        }
        // 5. Learn from this interaction
        this.learnFromInteraction(input.prompt, response);
        return response;
    }
    // Build comprehensive context from all sources
    buildContext(prompt) {
        const parts = [];
        // 1. Project memory
        if (this.config.enableMemory) {
            const memContext = this.memory.getContextForPrompt();
            if (memContext) {
                parts.push('## Project Memory\n' + memContext);
            }
        }
        // 2. Codebase index (search for relevant code)
        if (this.config.enableIndexing) {
            // Extract key terms from prompt
            const terms = prompt.split(/\s+/).filter(w => w.length > 3);
            const relevantSymbols = terms.flatMap(term => this.indexer.search(term)).slice(0, 10);
            if (relevantSymbols.length > 0) {
                parts.push('## Relevant Code\n');
                for (const sym of relevantSymbols) {
                    parts.push(`- ${sym.type} ${sym.name} at ${sym.file}:${sym.line}`);
                }
            }
        }
        // 3. Current workflow context
        if (this.config.enableAutomation) {
            const workflowContext = this.workflow.getContextForLLM();
            if (workflowContext) {
                parts.push('## Current Context\n' + workflowContext);
            }
        }
        // 4. File-specific context
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            const fileName = activeEditor.document.fileName.split('/').pop();
            const symbols = this.indexer.getFileContext(activeEditor.document.fileName);
            parts.push(`## Current File (${fileName})\n`);
            for (const sym of symbols.slice(0, 5)) {
                parts.push(`- ${sym.type} ${sym.name}`);
            }
        }
        return parts.join('\n\n');
    }
    // Call LLM with smart routing
    async callLLM(prompt, context, model) {
        // TODO: Integrate with LLM router
        // For now, return a placeholder that integrates with existing router
        const enhancedPrompt = `${context}\n\n---\n\nUser: ${prompt}`;
        return enhancedPrompt;
    }
    // Learn from user interactions
    learnFromInteraction(prompt, response) {
        // Detect patterns in user prompts
        if (prompt.toLowerCase().includes('test')) {
            this.memory.rememberPattern('writes tests', 'User often writes tests');
        }
        if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('endpoint')) {
            this.memory.rememberPattern('builds APIs', 'User builds REST APIs');
        }
    }
    // Quick actions via brain
    async quickAction(action) {
        switch (action) {
            case 'index':
                await this.indexer.indexWorkspace();
                break;
            case 'learn':
                await this.memory.learnFromCode();
                break;
            case 'clear_cache':
                this.cache.invalidate();
                vscode.window.showInformationMessage('🗑️ Cache cleared');
                break;
            case 'show_context':
                const context = this.buildContext('');
                vscode.window.showInformationMessage('🧠 Context loaded - check console');
                console.log(context);
                break;
            case 'suggest':
                const suggestions = await this.workflow.getProactiveSuggestions();
                for (const s of suggestions) {
                    vscode.window.showInformationMessage(`${s.icon} ${s.label}`);
                }
                break;
        }
    }
    // Get brain status
    getStatus() {
        return {
            initialized: this.isInitialized,
            indexStats: this.indexer.getSummary(),
            config: this.config,
            recentDecisions: this.memory.getRecentDecisions(5)
        };
    }
    // Update configuration
    updateConfig(partial) {
        this.config = { ...this.config, ...partial };
    }
}
exports.QuantumBrain = QuantumBrain;
