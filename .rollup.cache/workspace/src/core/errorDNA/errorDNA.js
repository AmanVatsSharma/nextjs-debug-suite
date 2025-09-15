import { __awaiter, __generator } from "tslib";
import { StackTraceParser } from './stackTraceParser';
import { DependencyAnalyzer } from './dependencyAnalyzer';
var ErrorDNAGenerator = /** @class */ (function () {
    function ErrorDNAGenerator() {
        this.stackTraceParser = new StackTraceParser();
        this.dependencyAnalyzer = new DependencyAnalyzer(process.cwd());
    }
    ErrorDNAGenerator.prototype.generateDNA = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            var stackTrace, dependencies, errorLocation, codePreview, highlightedLines;
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stackTrace = this.stackTraceParser.parse(error.stack || '');
                        return [4 /*yield*/, this.dependencyAnalyzer.getDependencyGraph(((_b = stackTrace[0]) === null || _b === void 0 ? void 0 : _b.fileName) || '')];
                    case 1:
                        dependencies = _c.sent();
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
                    case 2: return [2 /*return*/, (_a.package = _c.sent(),
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
        var firstFrame = stackTrace[0];
        return {
            file: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.fileName) || 'unknown',
            line: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.lineNumber) || 0,
            column: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.columnNumber) || 0,
            functionName: (firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.functionName) || 'unknown',
            component: this.extractComponentName((firstFrame === null || firstFrame === void 0 ? void 0 : firstFrame.fileName) || ''),
        };
    };
    ErrorDNAGenerator.prototype.generateCodePreview = function (stackTrace, location) {
        // For now, return a placeholder since we don't have source code access
        return "// Code preview for ".concat(location.file, " at line ").concat(location.line);
    };
    ErrorDNAGenerator.prototype.identifyHighlightedLines = function (stackTrace, location) {
        var lines = [location.line];
        // Add related lines from the stack trace
        stackTrace.forEach(function (frame) {
            if (frame.fileName === location.file && frame.lineNumber) {
                lines.push(frame.lineNumber);
            }
        });
        return Array.from(new Set(lines)).sort(function (a, b) { return a - b; });
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
            frames: stackTrace.map(function (frame) { return ({
                file: frame.fileName,
                line: frame.lineNumber,
                column: frame.columnNumber,
                function: frame.functionName,
                context: frame.source,
            }); }),
        };
    };
    return ErrorDNAGenerator;
}());
export { ErrorDNAGenerator };
//# sourceMappingURL=errorDNA.js.map