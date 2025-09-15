import type { AIService, AIConfig } from './types';
export declare class AIServiceFactory {
    static create(config: AIConfig): AIService | null;
}
export declare class AIServiceManager {
    private static instance;
    private service;
    private constructor();
    static getInstance(): AIServiceManager;
    initialize(config: AIConfig): void;
    getService(): AIService | null;
    isEnabled(): boolean;
}
