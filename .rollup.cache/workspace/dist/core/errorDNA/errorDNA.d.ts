import type { EnhancedErrorDNA } from '../types';
export declare class ErrorDNAGenerator {
    private stackTraceParser;
    private dependencyAnalyzer;
    constructor();
    generateDNA(error: Error): Promise<EnhancedErrorDNA>;
    private extractErrorLocation;
    private generateCodePreview;
    private identifyHighlightedLines;
    private generateErrorId;
    private hashString;
    private determineErrorType;
    private extractPackageInfo;
    private extractComponentName;
    private formatStackTrace;
}
