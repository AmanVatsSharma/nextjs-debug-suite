export interface DependencyNode {
    id: string;
    type: 'file' | 'package' | 'module';
    name: string;
    path: string;
}
export interface DependencyEdge {
    source: string;
    target: string;
    type: 'import' | 'export' | 'uses';
}
export interface DependencyGraph {
    nodes: DependencyNode[];
    edges: DependencyEdge[];
}
export interface ImportInfo {
    name: string;
    path: string;
    isDefault: boolean;
    isType: boolean;
}
export interface ExportInfo {
    name: string;
    isDefault: boolean;
    isType: boolean;
}
export declare class DependencyAnalyzer {
    private rootDir;
    private fileCache;
    private program;
    constructor(rootDir: string);
    analyze(fileContent: string): Promise<{
        imports: ImportInfo[];
        exports: ExportInfo[];
    }>;
    getDependencyGraph(filePath: string): Promise<DependencyGraph>;
    getImports(filePath: string): Promise<ImportInfo[]>;
    getExports(filePath: string): Promise<ExportInfo[]>;
    private resolvePath;
}
