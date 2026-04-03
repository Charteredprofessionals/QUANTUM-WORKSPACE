/**
 * Codebase Indexer - Context Engine
 * Uses Tree-sitter for fast code understanding
 */
interface CodeSymbol {
    name: string;
    type: 'function' | 'class' | 'method' | 'variable' | 'interface';
    file: string;
    line: number;
    context: string;
}
export declare class CodebaseIndexer {
    private index;
    private indexPath;
    private isIndexing;
    constructor();
    private loadIndex;
    private saveIndex;
    indexWorkspace(): Promise<void>;
    private findAllFiles;
    private parseFile;
    search(query: string): CodeSymbol[];
    getFileContext(filePath: string): CodeSymbol[];
    getSummary(): {
        files: number;
        symbols: number;
        lastUpdated: number;
    };
    needsReindex(): boolean;
}
export {};
//# sourceMappingURL=context-indexer.d.ts.map