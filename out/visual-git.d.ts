/**
 * Visual Git - Git Operations UI
 * Visual interface for git: status, diff, stage, commit, branch
 */
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
export declare class VisualGit {
    private panel;
    private workspaceRoot;
    constructor();
    getStatus(): Promise<GitFile[]>;
    getBranches(): Promise<GitBranch[]>;
    getCommits(limit?: number): Promise<GitCommit[]>;
    stage(files: string[]): Promise<void>;
    unstage(files: string[]): Promise<void>;
    commit(message: string): Promise<boolean>;
    createBranch(name: string): Promise<boolean>;
    checkout(branch: string): Promise<void>;
    pull(): Promise<void>;
    push(): Promise<void>;
    getDiff(file: string): Promise<string>;
    private runCommand;
    showPanel(): Promise<void>;
    private handleMessage;
    private refresh;
    private getHTML;
}
export {};
//# sourceMappingURL=visual-git.d.ts.map