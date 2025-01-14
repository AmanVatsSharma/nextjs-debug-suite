import type { StackTraceParser } from './stackTraceParser';
import type { DependencyAnalyzer } from './dependencyAnalyzer';
import type { EnhancedErrorDNA } from '../types';
export declare class ErrorDNA {
    private stackTraceParser;
    private dependencyAnalyzer;
    constructor(stackTraceParser: StackTraceParser, dependencyAnalyzer: DependencyAnalyzer);
    analyze(error: Error): Promise<EnhancedErrorDNA>;
    private generateErrorId;
    private determineErrorType;
    private extractComponentName;
    private extractPackageInfo;
    getDependencyGraph(filePath?: string): Promise<{}>;
    getImports(filePath: string): Promise<import("./dependencyAnalyzer").ImportInfo[]>;
    getExports(filePath: string): Promise<import("./dependencyAnalyzer").ExportInfo[]>;
}
