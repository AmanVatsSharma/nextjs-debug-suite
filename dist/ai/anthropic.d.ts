import type { AIService, AIAnalysisRequest, AIAnalysisResponse } from './types';
export declare class AnthropicService implements AIService {
    private apiKey;
    private baseUrl;
    private model;
    constructor(apiKey: string);
    private makeRequest;
    private createPrompt;
    analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse>;
    generateDocs(context: string): Promise<string>;
    predictIssue(metrics: Record<string, any>): Promise<{
        prediction: string;
        confidence: number;
        suggestedAction?: string;
    }>;
}
