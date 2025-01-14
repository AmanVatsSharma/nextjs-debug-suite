import { __awaiter, __generator } from "tslib";
import { ErrorDNAGenerator } from '../core/errorDNA/errorDNA';
describe('ErrorDNAGenerator', function () {
    var errorDNA;
    var mockStackTraceParser;
    var mockDependencyAnalyzer;
    beforeEach(function () {
        mockStackTraceParser = {
            parse: jest.fn(),
        };
        mockDependencyAnalyzer = {
            analyzeDependencies: jest.fn(),
        };
        errorDNA = new ErrorDNAGenerator();
    });
    describe('generateDNA', function () {
        it('analyzes error and returns DNA information', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, mockStackTrace, dna;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Test error');
                        mockStackTrace = {
                            frames: [{
                                    file: 'src/components/Button.tsx',
                                    lineNumber: 42,
                                    column: 5,
                                    methodName: 'onClick',
                                    context: 'export class Button',
                                }],
                            sourceCode: {
                                'src/components/Button.tsx': ['line1', 'line2', 'line3'],
                            },
                        };
                        mockStackTraceParser.parse.mockResolvedValue(mockStackTrace);
                        mockDependencyAnalyzer.analyzeDependencies.mockResolvedValue({
                            nodes: [],
                            edges: [],
                        });
                        return [4 /*yield*/, errorDNA.generateDNA(error)];
                    case 1:
                        dna = _a.sent();
                        expect(dna).toEqual(expect.objectContaining({
                            type: 'runtime',
                            location: expect.objectContaining({
                                file: 'src/components/Button.tsx',
                                line: 42,
                                column: 5,
                                functionName: 'onClick',
                                component: 'Button',
                            }),
                            visual: expect.objectContaining({
                                codePreview: expect.any(String),
                                highlightedLines: expect.arrayContaining([42]),
                                dependencies: expect.objectContaining({
                                    nodes: [],
                                    edges: [],
                                }),
                                stackTrace: expect.objectContaining({
                                    frames: expect.arrayContaining([
                                        expect.objectContaining({
                                            file: 'src/components/Button.tsx',
                                            line: 42,
                                            column: 5,
                                            function: 'onClick',
                                        }),
                                    ]),
                                }),
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('identifies error type based on stack trace', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, mockStackTrace, dna;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new TypeError('Invalid type');
                        mockStackTrace = {
                            frames: [{
                                    file: 'src/utils/validation.ts',
                                    lineNumber: 15,
                                    column: 3,
                                    methodName: 'validateInput',
                                }],
                        };
                        mockStackTraceParser.parse.mockResolvedValue(mockStackTrace);
                        mockDependencyAnalyzer.analyzeDependencies.mockResolvedValue({
                            nodes: [],
                            edges: [],
                        });
                        return [4 /*yield*/, errorDNA.generateDNA(error)];
                    case 1:
                        dna = _a.sent();
                        expect(dna.type).toBe('type');
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles missing stack trace gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error, dna;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('No stack trace');
                        mockStackTraceParser.parse.mockResolvedValue({
                            frames: [],
                        });
                        mockDependencyAnalyzer.analyzeDependencies.mockResolvedValue({
                            nodes: [],
                            edges: [],
                        });
                        return [4 /*yield*/, errorDNA.generateDNA(error)];
                    case 1:
                        dna = _a.sent();
                        expect(dna).toEqual(expect.objectContaining({
                            location: expect.objectContaining({
                                file: 'unknown',
                                line: 0,
                                column: 0,
                                functionName: 'unknown',
                            }),
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles parser errors gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error('Parser error');
                        mockStackTraceParser.parse.mockRejectedValue(new Error('Parse failed'));
                        mockDependencyAnalyzer.analyzeDependencies.mockResolvedValue({
                            nodes: [],
                            edges: [],
                        });
                        return [4 /*yield*/, expect(errorDNA.generateDNA(error)).rejects.toThrow('Parse failed')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=ErrorDNA.test.js.map