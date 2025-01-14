import { __awaiter, __generator } from "tslib";
var AnthropicService = /** @class */ (function () {
    function AnthropicService(apiKey) {
        this.baseUrl = 'https://api.anthropic.com/v1';
        this.model = 'claude-2';
        this.apiKey = apiKey;
    }
    AnthropicService.prototype.makeRequest = function (endpoint, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-API-Key': this.apiKey,
                                'anthropic-version': '2023-06-01',
                            },
                            body: JSON.stringify(body),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Anthropic API error: ".concat(response.statusText));
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    AnthropicService.prototype.createPrompt = function (request) {
        var _a, _b, _c, _d, _e, _f;
        var basePrompt = 'You are Claude, an AI assistant with expertise in Next.js development. ';
        switch (request.type) {
            case 'error':
                return "".concat(basePrompt, "Please analyze this error and provide a detailed solution:\nError Type: ").concat((_a = request.context.error) === null || _a === void 0 ? void 0 : _a.type, "\nLocation: ").concat((_b = request.context.error) === null || _b === void 0 ? void 0 : _b.location.file, ":").concat((_c = request.context.error) === null || _c === void 0 ? void 0 : _c.location.line, "\nCode:\n").concat((_d = request.context.error) === null || _d === void 0 ? void 0 : _d.visual.codePreview, "\n\nProvide your analysis in this format:\n1. Explanation of the error\n2. Root cause\n3. Solution with code example\n4. Prevention tips");
            case 'performance':
                return "".concat(basePrompt, "Please analyze these performance metrics and suggest optimizations:\nMemory: ").concat(JSON.stringify((_e = request.context.metrics) === null || _e === void 0 ? void 0 : _e.memory), "\nPerformance: ").concat(JSON.stringify((_f = request.context.metrics) === null || _f === void 0 ? void 0 : _f.performance), "\n\nProvide your analysis in this format:\n1. Current performance assessment\n2. Identified bottlenecks\n3. Optimization suggestions with code examples\n4. Monitoring recommendations");
            case 'network':
                return "".concat(basePrompt, "Please analyze this network activity and suggest improvements:\n").concat(request.context.codeContext, "\n\nProvide your analysis in this format:\n1. Current network patterns\n2. Potential optimizations\n3. Code examples for implementation\n4. Best practices recommendations");
            case 'general':
                return "".concat(basePrompt).concat(request.context.query, "\n\nProvide your response in this format:\n1. Analysis\n2. Recommendations\n3. Code examples (if applicable)\n4. Additional considerations");
        }
    };
    AnthropicService.prototype.analyze = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, completion, response, sections, explanation, suggestedFix;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        prompt = this.createPrompt(request);
                        return [4 /*yield*/, this.makeRequest('/messages', {
                                model: this.model,
                                messages: [{
                                        role: 'user',
                                        content: prompt,
                                    }],
                                max_tokens: 1000,
                            })];
                    case 1:
                        completion = _e.sent();
                        response = completion.content;
                        sections = response.split('\n\n');
                        explanation = sections[0];
                        suggestedFix = (_d = (_c = (_b = (_a = sections.find(function (section) { return section.includes('```'); })) === null || _a === void 0 ? void 0 : _a.match(/```[\s\S]*?```/)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.replace(/```\w*\n/, '')) === null || _d === void 0 ? void 0 : _d.replace(/```$/, '');
                        return [2 /*return*/, {
                                explanation: explanation,
                                suggestedFix: suggestedFix,
                                confidence: 0.9,
                                relevantDocs: [],
                                similarIssues: [],
                                additionalContext: {
                                    prevention: sections.find(function (s) { return s.toLowerCase().includes('prevent'); }),
                                    bestPractices: sections.find(function (s) { return s.toLowerCase().includes('best practice'); }),
                                },
                            }];
                }
            });
        });
    };
    AnthropicService.prototype.generateDocs = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var completion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.makeRequest('/messages', {
                            model: this.model,
                            messages: [{
                                    role: 'user',
                                    content: "You are a technical writer. Generate comprehensive documentation for this code, including examples and best practices:\n".concat(context),
                                }],
                            max_tokens: 1000,
                        })];
                    case 1:
                        completion = _a.sent();
                        return [2 /*return*/, completion.content];
                }
            });
        });
    };
    AnthropicService.prototype.predictIssue = function (metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var completion, response, _a, prediction, action;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.makeRequest('/messages', {
                            model: this.model,
                            messages: [{
                                    role: 'user',
                                    content: "You are a system analyst. Based on these metrics, predict potential issues and suggest preventive actions:\n".concat(JSON.stringify(metrics, null, 2)),
                                }],
                            max_tokens: 500,
                        })];
                    case 1:
                        completion = _b.sent();
                        response = completion.content;
                        _a = response.split('\n\n'), prediction = _a[0], action = _a[1];
                        return [2 /*return*/, {
                                prediction: prediction,
                                confidence: 0.85,
                                suggestedAction: action,
                            }];
                }
            });
        });
    };
    return AnthropicService;
}());
export { AnthropicService };
//# sourceMappingURL=anthropic.js.map