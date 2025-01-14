export interface DebugLog {
    timestamp: number;
    type: string;
    message: string;
    data?: any;
    source?: string;
    stackTrace?: string;
}
export interface DebugOptions {
    console: boolean;
    persist: boolean;
    maxLogs?: number;
    logLevel: 'verbose' | 'normal' | 'minimal';
}
export interface DebugInterface {
    overlay: {
        position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
        size: {
            width: number;
            height: number;
        };
        opacity: number;
        theme: 'dark' | 'light' | 'system';
        tabs: Array<'errors' | 'performance' | 'network' | 'console' | 'ai'>;
    };
    monitors: {
        memory: boolean;
        performance: boolean;
        network: boolean;
        console: boolean;
        renders: boolean;
    };
    ai?: {
        enabled: boolean;
        provider: 'openai' | 'anthropic' | 'custom';
        apiKey?: string;
        features: Array<'analysis' | 'fixes' | 'docs' | 'prediction'>;
    };
}
export interface EnhancedErrorDNA {
    id: string;
    timestamp: number;
    type: 'runtime' | 'build' | 'type' | 'network' | 'performance';
    location: {
        file: string;
        line: number;
        column: number;
        functionName: string;
        component?: string;
    };
    package?: {
        name: string;
        version: string;
        path: string[];
    };
    visual: {
        codePreview: string;
        highlightedLines: number[];
        dependencies: any;
        stackTrace: any;
    };
    aiAnalysis?: {
        explanation: string;
        suggestedFix: string;
        confidence: number;
        relevantDocs: string[];
        similarIssues: string[];
    };
}
