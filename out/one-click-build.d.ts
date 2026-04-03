/**
 * One-Click Build - Automated Build System
 * Single command to build, package, and prepare for deployment
 */
interface BuildConfig {
    buildCommand: string;
    outputDir: string;
    artifacts: string[];
    preBuild: string[];
    postBuild: string[];
}
interface BuildResult {
    success: boolean;
    duration: number;
    output: string;
    errors: string[];
    artifacts: string[];
}
export declare class OneClickBuild {
    private workspaceRoot;
    private terminal;
    private buildConfig;
    constructor();
    detectAndConfigure(): Promise<BuildConfig | null>;
    build(): Promise<BuildResult>;
    private runCommand;
    private verifyArtifacts;
    clean(): Promise<void>;
    package(): Promise<string | null>;
    showStatus(): void;
    quickBuild(): Promise<void>;
}
export {};
//# sourceMappingURL=one-click-build.d.ts.map