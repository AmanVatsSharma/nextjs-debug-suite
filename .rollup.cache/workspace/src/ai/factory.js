import { OpenAIService } from './openai';
import { AnthropicService } from './anthropic';
var AIServiceFactory = /** @class */ (function () {
    function AIServiceFactory() {
    }
    AIServiceFactory.create = function (config) {
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
                throw new Error("Unsupported AI provider: ".concat(config.provider));
        }
    };
    return AIServiceFactory;
}());
export { AIServiceFactory };
var AIServiceManager = /** @class */ (function () {
    function AIServiceManager() {
        this.service = null;
    }
    AIServiceManager.getInstance = function () {
        if (!AIServiceManager.instance) {
            AIServiceManager.instance = new AIServiceManager();
        }
        return AIServiceManager.instance;
    };
    AIServiceManager.prototype.initialize = function (config) {
        this.service = AIServiceFactory.create(config);
    };
    AIServiceManager.prototype.getService = function () {
        return this.service;
    };
    AIServiceManager.prototype.isEnabled = function () {
        return this.service !== null;
    };
    return AIServiceManager;
}());
export { AIServiceManager };
//# sourceMappingURL=factory.js.map