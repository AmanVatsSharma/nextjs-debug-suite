import { AIServiceFactory, AIServiceManager } from '../ai/factory';
import { OpenAIService } from '../ai/openai';
import { AnthropicService } from '../ai/anthropic';
import type { AIConfig } from '../ai/types';

jest.mock('../ai/openai');
jest.mock('../ai/anthropic');

describe('AIServiceFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when AI is disabled', () => {
    const config: AIConfig = {
      enabled: false,
      provider: 'openai',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    expect(AIServiceFactory.create(config)).toBeNull();
  });

  it('should return null when API key is missing', () => {
    const config: AIConfig = {
      enabled: true,
      provider: 'openai',
      apiKey: '',
      features: ['analysis', 'fixes']
    };
    expect(AIServiceFactory.create(config)).toBeNull();
  });

  it('should create OpenAI service when provider is openai', () => {
    const config: AIConfig = {
      enabled: true,
      provider: 'openai',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    const service = AIServiceFactory.create(config);
    expect(service).toBeInstanceOf(OpenAIService);
  });

  it('should create Anthropic service when provider is anthropic', () => {
    const config: AIConfig = {
      enabled: true,
      provider: 'anthropic',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    const service = AIServiceFactory.create(config);
    expect(service).toBeInstanceOf(AnthropicService);
  });

  it('should return null for custom provider', () => {
    const config: AIConfig = {
      enabled: true,
      provider: 'custom',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    expect(AIServiceFactory.create(config)).toBeNull();
  });

  it('should throw error for unsupported provider', () => {
    const config: AIConfig = {
      enabled: true,
      provider: 'unsupported' as any,
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    expect(() => AIServiceFactory.create(config)).toThrow('Unsupported AI provider: unsupported');
  });
});

describe('AIServiceManager', () => {
  beforeEach(() => {
    // Reset the singleton instance
    // @ts-ignore: Accessing private property for testing
    AIServiceManager.instance = undefined;
  });

  it('should maintain singleton instance', () => {
    const instance1 = AIServiceManager.getInstance();
    const instance2 = AIServiceManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize with AI service', () => {
    const manager = AIServiceManager.getInstance();
    const config: AIConfig = {
      enabled: true,
      provider: 'openai',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    
    manager.initialize(config);
    expect(manager.isEnabled()).toBe(true);
    expect(manager.getService()).toBeInstanceOf(OpenAIService);
  });

  it('should handle disabled AI service', () => {
    const manager = AIServiceManager.getInstance();
    const config: AIConfig = {
      enabled: false,
      provider: 'openai',
      apiKey: 'test-key',
      features: ['analysis', 'fixes']
    };
    
    manager.initialize(config);
    expect(manager.isEnabled()).toBe(false);
    expect(manager.getService()).toBeNull();
  });
}); 