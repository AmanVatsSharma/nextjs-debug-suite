import { __awaiter, __generator } from "tslib";
var ErrorDNA = /** @class */ (function () {
    function ErrorDNA(stackTraceParser, dependencyAnalyzer) {
        this.stackTraceParser = stackTraceParser;
        this.dependencyAnalyzer = dependencyAnalyzer;
    }
    ErrorDNA.prototype.analyze = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var stackTrace, firstFrame, errorDNA;
            var _a, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        stackTrace = this.stackTraceParser.parse(error.stack || '');
                        firstFrame = stackTrace[0];
                        _a = {
                            id: this.generateErrorId(),
                            timestamp: Date.now(),
                            type: this.determineErrorType(error),
                            location: {
                                file: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.fileName) || 'unknown',
                                line: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.lineNumber) || 0,
                                column: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.columnNumber) || 0,
                                functionName: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.functionName) || 'unknown',
                                component: this.extractComponentName(firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.functionName)
                            }
                        };
                        _b = {
                            codePreview: ((_c = error.stack) === null || _c === void 0 ? void 0 : _c.split('\n')[0]) || error.message,
                            highlightedLines: [(firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.lineNumber) || 0]
                        };
                        return [4 /*yield*/, this.getDependencyGraph(firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.fileName)];
                    case 1:
                        errorDNA = (_a.visual = (_b.dependencies = _e.sent(),
                            _b.stackTrace = stackTrace,
                            _b),
                            _a);
                        if ((_d = firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.fileName) === null || _d === void 0 ? void 0 : _d.includes('node_modules')) {
                            errorDNA.package = this.extractPackageInfo(firstFrame.fileName);
                        }
                        return [2 /*return*/, errorDNA];
                }
            });
        });
    };
    ErrorDNA.prototype.generateErrorId = function () {
        return "err_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
    };
    ErrorDNA.prototype.determineErrorType = function (error) {
        if (error instanceof TypeError || error instanceof ReferenceError) {
            return 'runtime';
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
            return 'network';
        }
        if (error.message.includes('type') || error.message.includes('TypeScript')) {
            return 'type';
        }
        if (error.message.includes('performance') || error.message.includes('timeout')) {
            return 'performance';
        }
        return 'runtime';
    };
    ErrorDNA.prototype.extractComponentName = function (functionName) {
        if (!functionName)
            return undefined;
        // Common React component patterns
        var patterns = [
            /^[A-Z][a-zA-Z]*$/, // Simple component name
            /^[A-Z][a-zA-Z]*Component$/, // Suffixed with Component
            /^use[A-Z][a-zA-Z]*$/, // Hook name
            /^render[A-Z][a-zA-Z]*$/ // Render method
        ];
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var pattern = patterns_1[_i];
            var match = functionName.match(pattern);
            if (match)
                return match[0];
        }
        return undefined;
    };
    ErrorDNA.prototype.extractPackageInfo = function (filePath) {
        var parts = filePath.split('node_modules/');
        if (parts.length < 2)
            return undefined;
        var packagePath = parts[1].split('/');
        var scopedPackage = packagePath[0].startsWith('@');
        return {
            name: scopedPackage ? "".concat(packagePath[0], "/").concat(packagePath[1]) : packagePath[0],
            version: 'unknown', // Would need package.json analysis for this
            path: packagePath
        };
    };
    ErrorDNA.prototype.getDependencyGraph = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!filePath)
                            return [2 /*return*/, {}];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dependencyAnalyzer.getDependencyGraph(filePath)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {}];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ErrorDNA.prototype.getImports = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dependencyAnalyzer.getImports(filePath)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ErrorDNA.prototype.getExports = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dependencyAnalyzer.getExports(filePath)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ErrorDNA;
}());
export { ErrorDNA };
//# sourceMappingURL=index.js.map