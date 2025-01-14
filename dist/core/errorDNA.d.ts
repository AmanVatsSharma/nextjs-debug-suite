export interface ErrorDNA {
    id: string;
    timestamp: number;
    error: Error;
    message: string;
    stack?: string;
    componentStack?: string;
    frames?: Array<{
        file?: string;
        methodName?: string;
        lineNumber?: number;
        column?: number;
    }>;
    context?: {
        componentName?: string;
        props?: Record<string, any>;
        state?: Record<string, any>;
        [key: string]: any;
    };
    metadata?: {
        browser?: string;
        os?: string;
        url?: string;
        [key: string]: any;
    };
    severity: 'low' | 'medium' | 'high' | 'critical';
    frequency: number;
    lastOccurrence: number;
    firstOccurrence: number;
    resolved: boolean;
    aiAnalysis?: {
        summary?: string;
        suggestedFix?: string;
        confidence?: number;
        relatedIssues?: string[];
    };
}
export declare class ErrorDNAAnalyzer {
    private debug;
    private errors;
    private errorCallbacks;
    private maxErrors;
    constructor();
    private setupGlobalHandlers;
    captureError(error: Error, context?: Record<string, any>): ErrorDNA;
    private createErrorDNA;
    private findSimilarError;
    private compareStacks;
    private calculateSeverity;
    private extractComponentName;
    private getBrowserInfo;
    private getOSInfo;
    getErrors(filter?: {
        severity?: ErrorDNA['severity'];
        resolved?: boolean;
        componentName?: string;
    }): ErrorDNA[];
    getError(id: string): ErrorDNA | undefined;
    updateError(id: string, updates: Partial<ErrorDNA>): ErrorDNA | undefined;
    resolveError(id: string): ErrorDNA | undefined;
    clearErrors(): void;
    onError(callback: (error: ErrorDNA) => void): () => void;
    private notifyErrorCallbacks;
    destroy(): void;
}
