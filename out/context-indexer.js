"use strict";
/**
 * Codebase Indexer - Context Engine
 * Uses Tree-sitter for fast code understanding
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
exports.CodebaseIndexer = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// File types to index
const INDEXED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cpp'];
class CodebaseIndexer {
    constructor() {
        this.index = { symbols: [], files: [], lastUpdated: 0 };
        this.isIndexing = false;
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        this.indexPath = path.join(workspacePath, '.quantum', 'index.json');
        this.loadIndex();
    }
    // Load existing index
    loadIndex() {
        try {
            if (fs.existsSync(this.indexPath)) {
                const data = fs.readFileSync(this.indexPath, 'utf-8');
                this.index = JSON.parse(data);
            }
        }
        catch (e) {
            console.log('No existing index found');
        }
    }
    // Save index to disk
    saveIndex() {
        const dir = path.dirname(this.indexPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
    }
    // Index entire workspace
    async indexWorkspace() {
        if (this.isIndexing)
            return;
        this.isIndexing = true;
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) {
            this.isIndexing = false;
            return;
        }
        const files = await this.findAllFiles(workspacePath);
        const symbols = [];
        for (const file of files) {
            const fileSymbols = await this.parseFile(file);
            symbols.push(...fileSymbols);
        }
        this.index = {
            symbols,
            files,
            lastUpdated: Date.now()
        };
        this.saveIndex();
        this.isIndexing = false;
        vscode.window.showInformationMessage(`🔍 Indexed ${symbols.length} symbols across ${files.length} files`);
    }
    // Find all code files in workspace
    async findAllFiles(dir) {
        const files = [];
        const walkDir = (currentDir) => {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                // Skip common ignore patterns
                if (['node_modules', '.git', 'dist', 'build', '.quantum'].includes(entry.name)) {
                    continue;
                }
                if (entry.isDirectory()) {
                    walkDir(fullPath);
                }
                else if (entry.isFile()) {
                    const ext = path.extname(entry.name);
                    if (INDEXED_EXTENSIONS.includes(ext)) {
                        files.push(fullPath);
                    }
                }
            }
        };
        walkDir(dir);
        return files;
    }
    // Parse a single file for symbols
    async parseFile(filePath) {
        const symbols = [];
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            const relPath = path.relative(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '', filePath);
            // Simple regex-based symbol extraction (faster than full parser)
            // Functions: function name(...) or const name = ...
            const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(?|(\w+)\s*\([^)]*\)\s*{)/g;
            // Classes: class Name
            const classRegex = /class\s+(\w+)/g;
            // Interfaces: interface Name
            const interfaceRegex = /interface\s+(\w+)/g;
            let match;
            while ((match = functionRegex.exec(content)) !== null) {
                const name = match[1] || match[2] || match[3];
                if (name && !['if', 'for', 'while', 'switch', 'catch'].includes(name)) {
                    const lineNum = content.substring(0, match.index).split('\n').length;
                    symbols.push({
                        name,
                        type: 'function',
                        file: relPath,
                        line: lineNum,
                        context: lines[lineNum - 1]?.trim() || ''
                    });
                }
            }
            while ((match = classRegex.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                symbols.push({
                    name: match[1],
                    type: 'class',
                    file: relPath,
                    line: lineNum,
                    context: lines[lineNum - 1]?.trim() || ''
                });
            }
            while ((match = interfaceRegex.exec(content)) !== null) {
                const lineNum = content.substring(0, match.index).split('\n').length;
                symbols.push({
                    name: match[1],
                    type: 'interface',
                    file: relPath,
                    line: lineNum,
                    context: lines[lineNum - 1]?.trim() || ''
                });
            }
        }
        catch (e) {
            // Skip unreadable files
        }
        return symbols;
    }
    // Search symbols by query
    search(query) {
        const q = query.toLowerCase();
        return this.index.symbols.filter(s => s.name.toLowerCase().includes(q) ||
            s.context.toLowerCase().includes(q));
    }
    // Get context for a specific file
    getFileContext(filePath) {
        return this.index.symbols.filter(s => s.file === filePath);
    }
    // Get summary of entire codebase
    getSummary() {
        return {
            files: this.index.files.length,
            symbols: this.index.symbols.length,
            lastUpdated: this.index.lastUpdated
        };
    }
    // Check if re-indexing is needed
    needsReindex() {
        if (this.index.lastUpdated === 0)
            return true;
        const hoursSinceUpdate = (Date.now() - this.index.lastUpdated) / (1000 * 60 * 60);
        return hoursSinceUpdate > 24;
    }
}
exports.CodebaseIndexer = CodebaseIndexer;
