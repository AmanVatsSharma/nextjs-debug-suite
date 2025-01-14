import { __awaiter, __generator } from "tslib";
var OpenAIService = /** @class */ (function () {
    function OpenAIService(apiKey) {
        this.baseUrl = 'https://api.openai.com/v1';
        this.model = 'gpt-4';
        this.apiKey = apiKey;
    }
    OpenAIService.prototype.makeRequest = function (endpoint, body) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl).concat(endpoint), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(this.apiKey),
                            },
                            body: JSON.stringify(body),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("OpenAI API error: ".concat(response.statusText));
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        });
    };
    OpenAIService.prototype.createPrompt = function (request) {
        var _a, _b, _c, _d, _e, _f;
        switch (request.type) {
            case 'error':
                return "Analyze this error and provide a solution:\nError Type: ".concat((_a = request.context.error) === null || _a === void 0 ? void 0 : _a.type, "\nLocation: ").concat((_b = request.context.error) === null || _b === void 0 ? void 0 : _b.location.file, ":").concat((_c = request.context.error) === null || _c === void 0 ? void 0 : _c.location.line, "\nCode:\n").concat((_d = request.context.error) === null || _d === void 0 ? void 0 : _d.visual.codePreview);
            case 'performance':
                return "Analyze these performance metrics and suggest improvements:\nMemory: ".concat(JSON.stringify((_e = request.context.metrics) === null || _e === void 0 ? void 0 : _e.memory), "\nPerformance: ").concat(JSON.stringify((_f = request.context.metrics) === null || _f === void 0 ? void 0 : _f.performance));
            case 'network':
                return "Analyze this network activity and suggest optimizations:\n".concat(request.context.codeContext);
            case 'general':
                return request.context.query || '';
        }
    };
    OpenAIService.prototype.analyze = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, completion, response, _a, explanation, rest, suggestedFix;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        prompt = this.createPrompt(request);
                        return [4 /*yield*/, this.makeRequest('/chat/completions', {
                                model: this.model,
                                messages: [
                                    {
                                        role: 'system',
                                        content: 'You are an expert developer assistant analyzing Next.js application issues.',
                                    },
                                    {
                                        role: 'user',
                                        content: prompt,
                                    },
                                ],
                                temperature: 0.7,
                            })];
                    case 1:
                        completion = _c.sent();
                        response = completion.choices[0].message.content;
                        _a = response.split('\n\n'), explanation = _a[0], rest = _a.slice(1);
                        suggestedFix = (_b = rest.find(function (part) { return part.startsWith('```'); })) === null || _b === void 0 ? void 0 : _b.replace(/```\w*\n/, '').replace(/```$/, '');
                        return [2 /*return*/, {
                                explanation: explanation,
                                suggestedFix: suggestedFix,
                                confidence: 0.8, // You might want to calculate this based on the model's response
                                relevantDocs: [],
                                similarIssues: [],
                            }];
                }
            });
        });
    };
    OpenAIService.prototype.generateDocs = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var completion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.makeRequest('/chat/completions', {
                            model: this.model,
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are an expert technical writer creating documentation for Next.js applications.',
                                },
                                {
                                    role: 'user',
                                    content: "Generate documentation for this code:\n".concat(context),
                                },
                            ],
                            temperature: 0.5,
                        })];
                    case 1:
                        completion = _a.sent();
                        return [2 /*return*/, completion.choices[0].message.content];
                }
            });
        });
    };
    OpenAIService.prototype.predictIssue = function (metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var completion, response, _a, prediction, action;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.makeRequest('/chat/completions', {
                            model: this.model,
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are an expert system analyzing performance metrics to predict potential issues.',
                                },
                                {
                                    role: 'user',
                                    content: "Analyze these metrics and predict potential issues:\n".concat(JSON.stringify(metrics, null, 2)),
                                },
                            ],
                            temperature: 0.3,
                        })];
                    case 1:
                        completion = _b.sent();
                        response = completion.choices[0].message.content;
                        _a = response.split('\n\n'), prediction = _a[0], action = _a[1];
                        return [2 /*return*/, {
                                prediction: prediction,
                                confidence: 0.7,
                                suggestedAction: action,
                            }];
                }
            });
        });
    };
    return OpenAIService;
}());
export { OpenAIService };
//# sourceMappingURL=openai.js.map