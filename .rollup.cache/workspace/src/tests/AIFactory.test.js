import { AIServiceFactory, AIServiceManager } from '../ai/factory';
import { OpenAIService } from '../ai/openai';
import { AnthropicService } from '../ai/anthropic';
jest.mock('../ai/openai');
jest.mock('../ai/anthropic');
describe('AIServiceFactory', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    it('should return null when AI is disabled', function () {
        var config = {
            enabled: false,
            provider: 'openai',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        expect(AIServiceFactory.create(config)).toBeNull();
    });
    it('should return null when API key is missing', function () {
        var config = {
            enabled: true,
            provider: 'openai',
            apiKey: '',
            features: ['analysis', 'fixes']
        };
        expect(AIServiceFactory.create(config)).toBeNull();
    });
    it('should create OpenAI service when provider is openai', function () {
        var config = {
            enabled: true,
            provider: 'openai',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        var service = AIServiceFactory.create(config);
        expect(service).toBeInstanceOf(OpenAIService);
    });
    it('should create Anthropic service when provider is anthropic', function () {
        var config = {
            enabled: true,
            provider: 'anthropic',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        var service = AIServiceFactory.create(config);
        expect(service).toBeInstanceOf(AnthropicService);
    });
    it('should return null for custom provider', function () {
        var config = {
            enabled: true,
            provider: 'custom',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        expect(AIServiceFactory.create(config)).toBeNull();
    });
    it('should throw error for unsupported provider', function () {
        var config = {
            enabled: true,
            provider: 'unsupported',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        expect(function () { return AIServiceFactory.create(config); }).toThrow('Unsupported AI provider: unsupported');
    });
});
describe('AIServiceManager', function () {
    beforeEach(function () {
        // Reset the singleton instance
        // @ts-ignore: Accessing private property for testing
        AIServiceManager.instance = undefined;
    });
    it('should maintain singleton instance', function () {
        var instance1 = AIServiceManager.getInstance();
        var instance2 = AIServiceManager.getInstance();
        expect(instance1).toBe(instance2);
    });
    it('should initialize with AI service', function () {
        var manager = AIServiceManager.getInstance();
        var config = {
            enabled: true,
            provider: 'openai',
            apiKey: 'test-key',
            features: ['analysis', 'fixes']
        };
        manager.initialize(config);
        expect(manager.isEnabled()).toBe(true);
        expect(manager.getService()).toBeInstanceOf(OpenAIService);
    });
    it('should handle disabled AI service', function () {
        var manager = AIServiceManager.getInstance();
        var config = {
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
//# sourceMappingURL=AIFactory.test.js.map