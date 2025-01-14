import { __awaiter, __generator, __spreadArray } from "tslib";
import { StackTraceParser } from './stackTraceParser';
import { DependencyAnalyzer } from './dependencyAnalyzer';
var ErrorDNAGenerator = /** @class */ (function () {
    function ErrorDNAGenerator() {
        this.stackTraceParser = new StackTraceParser();
        this.dependencyAnalyzer = new DependencyAnalyzer();
    }
    ErrorDNAGenerator.prototype.generateDNA = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var stackTrace, dependencies, errorLocation, codePreview, highlightedLines;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stackTraceParser.parse(error)];
                    case 1:
                        stackTrace = _b.sent();
                        return [4 /*yield*/, this.dependencyAnalyzer.analyzeDependencies(stackTrace.frames)];
                    case 2:
                        dependencies = _b.sent();
                        errorLocation = this.extractErrorLocation(stackTrace);
                        codePreview = this.generateCodePreview(stackTrace, errorLocation);
                        highlightedLines = this.identifyHighlightedLines(stackTrace, errorLocation);
                        _a = {
                            id: this.generateErrorId(error, errorLocation),
                            timestamp: Date.now(),
                            type: this.determineErrorType(error),
                            location: errorLocation
                        };
                        return [4 /*yield*/, this.extractPackageInfo(errorLocation.file)];
                    case 3: return [2 /*return*/, (_a.package = _b.sent(),
                            _a.visual = {
                                codePreview: codePreview,
                                highlightedLines: highlightedLines,
                                dependencies: dependencies,
                                stackTrace: this.formatStackTrace(stackTrace),
                            },
                            _a)];
                }
            });
        });
    };
    ErrorDNAGenerator.prototype.extractErrorLocation = function (stackTrace) {
        var firstFrame = stackTrace.frames[0];
        return {
            file: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.file) || 'unknown',
            line: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.lineNumber) || 0,
            column: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.column) || 0,
            functionName: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.methodName) || 'unknown',
            component: this.extractComponentName((firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.file) || ''),
        };
    };
    ErrorDNAGenerator.prototype.generateCodePreview = function (stackTrace, location) {
        var _a;
        var fileContent = (_a = stackTrace.sourceCode) === null || _a === void 0 ? void 0 : _a[location.file];
        if (!fileContent)
            return '';
        var contextLines = 5;
        var start = Math.max(0, location.line - contextLines);
        var end = Math.min(fileContent.length, location.line + contextLines);
        return fileContent.slice(start, end).join('\n');
    };
    ErrorDNAGenerator.prototype.identifyHighlightedLines = function (stackTrace, location) {
        var lines = [location.line];
        // Add related lines from the stack trace
        stackTrace.frames.forEach(function (frame) {
            if (frame.file === location.file && frame.lineNumber) {
                lines.push(frame.lineNumber);
            }
        });
        return __spreadArray([], new Set(lines), true).sort(function (a, b) { return a - b; });
    };
    ErrorDNAGenerator.prototype.generateErrorId = function (error, location) {
        var hash = this.hashString("".concat(error.name, ":").concat(error.message, ":").concat(location.file, ":").concat(location.line));
        return "ERR_".concat(hash);
    };
    ErrorDNAGenerator.prototype.hashString = function (str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).substring(0, 8);
    };
    ErrorDNAGenerator.prototype.determineErrorType = function (error) {
        if (error instanceof TypeError || error instanceof SyntaxError) {
            return 'type';
        }
        if (error.message.toLowerCase().includes('network')) {
            return 'network';
        }
        if (error.message.toLowerCase().includes('memory') ||
            error.message.toLowerCase().includes('performance')) {
            return 'performance';
        }
        return 'runtime';
    };
    ErrorDNAGenerator.prototype.extractPackageInfo = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // This should be implemented to:
                    // 1. Find the nearest package.json
                    // 2. Extract package name and version
                    // 3. Determine the path from the package root
                    return [2 /*return*/, {
                            name: 'unknown',
                            version: 'unknown',
                            path: filePath.split('/'),
                        }];
                }
                catch (_b) {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    ErrorDNAGenerator.prototype.extractComponentName = function (filePath) {
        // Extract component name from file path for React components
        var match = filePath.match(/[\/\\]([^\/\\]+)\.(?:tsx?|jsx?)$/);
        if (match && /^[A-Z]/.test(match[1])) {
            return match[1];
        }
        return undefined;
    };
    ErrorDNAGenerator.prototype.formatStackTrace = function (stackTrace) {
        return {
            frames: stackTrace.frames.map(function (frame) { return ({
                file: frame.file,
                line: frame.lineNumber,
                column: frame.column,
                function: frame.methodName,
                context: frame.context,
            }); }),
        };
    };
    return ErrorDNAGenerator;
}());
export { ErrorDNAGenerator };
//# sourceMappingURL=errorDNA.js.map