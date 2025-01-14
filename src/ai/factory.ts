import type { AIService, AIConfig } from './types';
import { OpenAIService } from './openai';
import { AnthropicService } from './anthropic';

export class AIServiceFactory {
  static create(config: AIConfig): AIService | null {
    if (!config.enabled || !config.apiKey) {
      return null;
    }

    switch (config.provider) {
      case 'openai':
        return new OpenAIService(config.apiKey);
      case 'anthropic':
        return new AnthropicService(config.apiKey);
      case 'custom':
        // Implement custom provider integration
        return null;
      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  }
}

export class AIServiceManager {
  private static instance: AIServiceManager;
  private service: AIService | null = null;

  private constructor() {}

  static getInstance(): AIServiceManager {
    if (!AIServiceManager.instance) {
      AIServiceManager.instance = new AIServiceManager();
    }
    return AIServiceManager.instance;
  }

  initialize(config: AIConfig) {
    this.service = AIServiceFactory.create(config);
  }

  getService(): AIService | null {
    return this.service;
  }

  isEnabled(): boolean {
    return this.service !== null;
  }
} 