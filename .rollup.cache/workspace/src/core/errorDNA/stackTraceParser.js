import { parse } from 'stacktrace-parser';
var StackTraceParser = /** @class */ (function () {
    function StackTraceParser() {
    }
    StackTraceParser.prototype.parse = function (stackTrace) {
        var _this = this;
        if (!stackTrace)
            return [];
        try {
            var frames_1 = parse(stackTrace);
            return frames_1.map(function (frame) { return ({
                fileName: _this.normalizeFileName(frame.file || ''),
                lineNumber: frame.lineNumber || 0,
                columnNumber: frame.column || 0,
                functionName: _this.normalizeFunctionName(frame.methodName || ''),
                source: frame.file
            }); });
        }
        catch (error) {
            return [];
        }
    };
    StackTraceParser.prototype.normalizeFileName = function (fileName) {
        // Remove webpack:// and similar prefixes
        fileName = fileName.replace(/^(webpack|webpack-internal|file):\/\/\/?/, '');
        // Remove query parameters
        fileName = fileName.split('?')[0];
        // Convert Windows paths to Unix-style
        fileName = fileName.replace(/\\/g, '/');
        return fileName;
    };
    StackTraceParser.prototype.normalizeFunctionName = function (functionName) {
        // Remove webpack specific wrappers
        functionName = functionName.replace(/^webpack_require__\./, '');
        // Remove TypeScript async wrapper
        functionName = functionName.replace(/^async\s+/, '');
        // Remove anonymous function markers
        functionName = functionName.replace(/<anonymous>/, 'anonymous');
        // Clean up common patterns
        functionName = functionName
            .replace(/\s+/g, '')
            .replace(/^Object\./, '')
            .replace(/^Array\./, '')
            .replace(/^Function\./, '');
        return functionName || 'anonymous';
    };
    StackTraceParser.prototype.getSourcePosition = function (frame) {
        return {
            line: frame.lineNumber,
            column: frame.columnNumber
        };
    };
    StackTraceParser.prototype.getFunctionContext = function (frame) {
        return frame.functionName || 'anonymous';
    };
    StackTraceParser.prototype.isNodeModule = function (frame) {
        return frame.fileName.includes('node_modules');
    };
    StackTraceParser.prototype.isUserCode = function (frame) {
        return !this.isNodeModule(frame) && !frame.fileName.includes('webpack');
    };
    return StackTraceParser;
}());
export { StackTraceParser };
//# sourceMappingURL=stackTraceParser.js.map