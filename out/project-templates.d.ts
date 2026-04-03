/**
 * Project Templates - One-Click Starters
 * Pre-built project templates for quick starts
 */
interface Template {
    id: string;
    name: string;
    description: string;
    category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'tool';
    icon: string;
    stack: string[];
    files: Record<string, string>;
}
export declare class ProjectTemplates {
    private workspaceRoot;
    constructor();
    getAll(): Template[];
    getByCategory(category: string): Template[];
    showSelector(): Promise<Template | null>;
    createFromTemplate(template: Template, projectName: string): Promise<boolean>;
    quickCreate(): Promise<void>;
}
export {};
//# sourceMappingURL=project-templates.d.ts.map