import type { EnhancedErrorDNA } from '../core/types';
export type AIProvider = 'openai' | 'anthropic' | 'custom';
export interface AIConfig {
    provider: AIProvider;
    apiKey?: string;
    features: Array<'analysis' | 'fixes' | 'docs' | 'prediction'>;
    enabled: boolean;
}
export interface AIAnalysisRequest {
    type: 'error' | 'performance' | 'network' | 'general';
    context: {
        error?: EnhancedErrorDNA;
        metrics?: {
            memory?: {
                used: number;
                total: number;
                limit: number;
            };
            performance?: {
                fcp: number;
                lcp: number;
                fid: number;
            };
        };
        codeContext?: string;
        query?: string;
    };
}
export interface AIAnalysisResponse {
    explanation: string;
    suggestedFix?: string;
    confidence: number;
    relevantDocs?: string[];
    similarIssues?: string[];
    additionalContext?: Record<string, any>;
}
export interface AIService {
    analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
    generateDocs(context: string): Promise<string>;
    predictIssue(metrics: Record<string, any>): Promise<{
        prediction: string;
        confidence: number;
        suggestedAction?: string;
    }>;
}
