/**
 * One-Click Deploy - Cloudflare & Vercel Integration
 * Deploy with a single click to Cloudflare Pages or Vercel
 */
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
export declare class OneClickDeploy {
    private workspaceRoot;
    private config;
    private currentDeployment;
    constructor();
    detectConfig(): Promise<DeployConfig | null>;
    selectProvider(): Promise<DeployConfig | null>;
    deployToVercel(): Promise<DeployResult>;
    deployToCloudflare(): Promise<DeployResult>;
    deployToNetlify(): Promise<DeployResult>;
    deploy(provider?: 'vercel' | 'cloudflare' | 'netlify'): Promise<DeployResult>;
    private buildProject;
    private checkCommand;
    private runCommand;
    showStatus(): void;
    openDeployment(): Promise<void>;
    quickDeploy(): Promise<void>;
}
export {};
//# sourceMappingURL=one-click-deploy.d.ts.map