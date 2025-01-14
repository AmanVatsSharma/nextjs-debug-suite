import { __awaiter, __generator } from "tslib";
import { AnthropicService } from '../ai/anthropic';
// Mock fetch globally
global.fetch = jest.fn();
describe('AnthropicService', function () {
    var service;
    var mockApiKey = 'test-api-key';
    beforeEach(function () {
        service = new AnthropicService(mockApiKey);
        global.fetch.mockClear();
    });
    var mockSuccessResponse = {
        ok: true,
        json: function () { return Promise.resolve({
            content: 'Test explanation\n\n```js\nconst fix = true```\n\nPrevention tips\n\nBest practices'
        }); }
    };
    describe('analyze', function () {
        it('should analyze error requests correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce(mockSuccessResponse);
                        request = {
                            type: 'error',
                            context: {
                                error: {
                                    type: 'TypeError',
                                    location: { file: 'test.ts', line: 10 },
                                    visual: { codePreview: 'const x = null; x.prop;' }
                                }
                            }
                        };
                        return [4 /*yield*/, service.analyze(request)];
                    case 1:
                        response = _a.sent();
                        expect(response).toEqual({
                            explanation: 'Test explanation',
                            suggestedFix: 'const fix = true',
                            confidence: 0.9,
                            relevantDocs: [],
                            similarIssues: [],
                            additionalContext: {
                                prevention: 'Prevention tips',
                                bestPractices: 'Best practices'
                            }
                        });
                        expect(global.fetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.objectContaining({
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': mockApiKey,
                                'anthropic-version': '2023-06-01'
                            }
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should analyze performance requests correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var request, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce(mockSuccessResponse);
                        request = {
                            type: 'performance',
                            context: {
                                metrics: {
                                    memory: { heap: 100, stack: 50 },
                                    performance: { loadTime: 1000 }
                                }
                            }
                        };
                        return [4 /*yield*/, service.analyze(request)];
                    case 1:
                        response = _a.sent();
                        expect(response.explanation).toBe('Test explanation');
                        expect(response.confidence).toBe(0.9);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle API errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            var request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: false,
                            statusText: 'Bad Request'
                        });
                        request = {
                            type: 'general',
                            context: { query: 'test' }
                        };
                        return [4 /*yield*/, expect(service.analyze(request)).rejects.toThrow('Anthropic API error: Bad Request')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('generateDocs', function () {
        it('should generate documentation correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
            var docs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ content: 'Generated docs' }); }
                        });
                        return [4 /*yield*/, service.generateDocs('function test() {}')];
                    case 1:
                        docs = _a.sent();
                        expect(docs).toBe('Generated docs');
                        expect(global.fetch).toHaveBeenCalledWith('https://api.anthropic.com/v1/messages', expect.objectContaining({
                            method: 'POST',
                            body: expect.stringContaining('function test() {}')
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('predictIssue', function () {
        it('should predict issues based on metrics', function () { return __awaiter(void 0, void 0, void 0, function () {
            var metrics, prediction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.fetch.mockResolvedValueOnce({
                            ok: true,
                            json: function () { return Promise.resolve({ content: 'Memory leak detected\n\nOptimize garbage collection' }); }
                        });
                        metrics = { memory: { usage: 90 } };
                        return [4 /*yield*/, service.predictIssue(metrics)];
                    case 1:
                        prediction = _a.sent();
                        expect(prediction).toEqual({
                            prediction: 'Memory leak detected',
                            confidence: 0.85,
                            suggestedAction: 'Optimize garbage collection'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=AnthropicService.test.js.map