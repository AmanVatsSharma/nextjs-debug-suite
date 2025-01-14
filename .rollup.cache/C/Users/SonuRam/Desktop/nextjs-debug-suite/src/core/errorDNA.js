import { __assign } from "tslib";
import { parse as parseStackTrace } from 'stacktrace-parser';
import { debug } from './debug';
var ErrorDNAAnalyzer = /** @class */ (function () {
    function ErrorDNAAnalyzer() {
        this.debug = debug;
        this.errors = new Map();
        this.errorCallbacks = [];
        this.maxErrors = 1000;
        if (typeof window !== 'undefined') {
            this.setupGlobalHandlers();
        }
    }
    ErrorDNAAnalyzer.prototype.setupGlobalHandlers = function () {
        var _this = this;
        window.onerror = function (message, source, line, column, error) {
            if (error) {
                _this.captureError(error, { source: source, line: line, column: column });
            }
            else {
                _this.captureError(new Error(message), { source: source, line: line, column: column });
            }
            return false;
        };
        window.onunhandledrejection = function (event) {
            var error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
            _this.captureError(error, { type: 'unhandledRejection' });
        };
    };
    ErrorDNAAnalyzer.prototype.captureError = function (error, context) {
        if (context === void 0) { context = {}; }
        var dna = this.createErrorDNA(error, context);
        var existingError = this.findSimilarError(dna);
        if (existingError) {
            existingError.frequency += 1;
            existingError.lastOccurrence = Date.now();
            this.errors.set(existingError.id, existingError);
            this.notifyErrorCallbacks(existingError);
        }
        else {
            this.errors.set(dna.id, dna);
            this.notifyErrorCallbacks(dna);
            if (this.errors.size > this.maxErrors) {
                var oldestError = Array.from(this.errors.values())
                    .sort(function (a, b) { return a.lastOccurrence - b.lastOccurrence; })[0];
                this.errors.delete(oldestError.id);
            }
        }
        this.debug.log('ERROR', error.message, dna);
        return dna;
    };
    ErrorDNAAnalyzer.prototype.createErrorDNA = function (error, context) {
        if (context === void 0) { context = {}; }
        var timestamp = Date.now();
        var frames = error.stack ? parseStackTrace(error.stack) : undefined;
        var dna = {
            id: Math.random().toString(36).substring(7),
            timestamp: timestamp,
            error: error,
            message: error.message,
            stack: error.stack,
            frames: frames,
            context: __assign(__assign({}, context), { componentName: this.extractComponentName(frames) }),
            metadata: {
                browser: this.getBrowserInfo(),
                os: this.getOSInfo(),
                url: typeof window !== 'undefined' ? window.location.href : undefined,
            },
            severity: this.calculateSeverity(error, context),
            frequency: 1,
            lastOccurrence: timestamp,
            firstOccurrence: timestamp,
            resolved: false,
        };
        return dna;
    };
    ErrorDNAAnalyzer.prototype.findSimilarError = function (dna) {
        var _this = this;
        return Array.from(this.errors.values()).find(function (existing) {
            var _a, _b;
            return existing.message === dna.message &&
                ((_a = existing.context) === null || _a === void 0 ? void 0 : _a.componentName) === ((_b = dna.context) === null || _b === void 0 ? void 0 : _b.componentName) &&
                _this.compareStacks(existing.frames, dna.frames);
        });
    };
    ErrorDNAAnalyzer.prototype.compareStacks = function (stack1, stack2) {
        if (!stack1 || !stack2)
            return false;
        if (stack1.length !== stack2.length)
            return false;
        return stack1.every(function (frame, index) {
            return frame.file === stack2[index].file &&
                frame.methodName === stack2[index].methodName;
        });
    };
    ErrorDNAAnalyzer.prototype.calculateSeverity = function (error, context) {
        if (error instanceof TypeError || error instanceof ReferenceError) {
            return 'high';
        }
        if (context.type === 'unhandledRejection') {
            return 'critical';
        }
        if (error.message.toLowerCase().includes('network') ||
            error.message.toLowerCase().includes('fetch') ||
            error.message.toLowerCase().includes('xhr')) {
            return 'medium';
        }
        return 'low';
    };
    ErrorDNAAnalyzer.prototype.extractComponentName = function (frames) {
        var _a;
        if (!(frames === null || frames === void 0 ? void 0 : frames.length))
            return undefined;
        var componentFrame = frames.find(function (frame) {
            var methodName = frame.methodName || '';
            return (methodName.includes('render') ||
                methodName.includes('component') ||
                methodName.includes('React'));
        });
        return (_a = componentFrame === null || componentFrame === void 0 ? void 0 : componentFrame.methodName) === null || _a === void 0 ? void 0 : _a.split('.')[0];
    };
    ErrorDNAAnalyzer.prototype.getBrowserInfo = function () {
        if (typeof window === 'undefined')
            return 'unknown';
        var ua = window.navigator.userAgent;
        var browsers = [
            { name: 'Chrome', pattern: /Chrome\/(\d+)/ },
            { name: 'Firefox', pattern: /Firefox\/(\d+)/ },
            { name: 'Safari', pattern: /Version\/(\d+).*Safari/ },
            { name: 'Edge', pattern: /Edg\/(\d+)/ },
        ];
        for (var _i = 0, browsers_1 = browsers; _i < browsers_1.length; _i++) {
            var browser = browsers_1[_i];
            var match = ua.match(browser.pattern);
            if (match) {
                return "".concat(browser.name, " ").concat(match[1]);
            }
        }
        return 'unknown';
    };
    ErrorDNAAnalyzer.prototype.getOSInfo = function () {
        if (typeof window === 'undefined')
            return 'unknown';
        var ua = window.navigator.userAgent;
        var os = [
            { name: 'Windows', pattern: /Windows NT (\d+\.\d+)/ },
            { name: 'Mac', pattern: /Mac OS X (\d+[._]\d+)/ },
            { name: 'Linux', pattern: /Linux/ },
            { name: 'iOS', pattern: /iOS (\d+)/ },
            { name: 'Android', pattern: /Android (\d+)/ },
        ];
        for (var _i = 0, os_1 = os; _i < os_1.length; _i++) {
            var system = os_1[_i];
            var match = ua.match(system.pattern);
            if (match) {
                return "".concat(system.name, " ").concat(match[1] || '').trim();
            }
        }
        return 'unknown';
    };
    ErrorDNAAnalyzer.prototype.getErrors = function (filter) {
        var errors = Array.from(this.errors.values());
        if (filter) {
            errors = errors.filter(function (error) {
                var _a;
                if (filter.severity && error.severity !== filter.severity)
                    return false;
                if (filter.resolved !== undefined && error.resolved !== filter.resolved)
                    return false;
                if (filter.componentName && ((_a = error.context) === null || _a === void 0 ? void 0 : _a.componentName) !== filter.componentName)
                    return false;
                return true;
            });
        }
        return errors.sort(function (a, b) { return b.lastOccurrence - a.lastOccurrence; });
    };
    ErrorDNAAnalyzer.prototype.getError = function (id) {
        return this.errors.get(id);
    };
    ErrorDNAAnalyzer.prototype.updateError = function (id, updates) {
        var error = this.errors.get(id);
        if (!error)
            return undefined;
        var updatedError = __assign(__assign({}, error), updates);
        this.errors.set(id, updatedError);
        return updatedError;
    };
    ErrorDNAAnalyzer.prototype.resolveError = function (id) {
        return this.updateError(id, { resolved: true });
    };
    ErrorDNAAnalyzer.prototype.clearErrors = function () {
        this.errors.clear();
    };
    ErrorDNAAnalyzer.prototype.onError = function (callback) {
        var _this = this;
        this.errorCallbacks.push(callback);
        return function () {
            var index = _this.errorCallbacks.indexOf(callback);
            if (index > -1) {
                _this.errorCallbacks.splice(index, 1);
            }
        };
    };
    ErrorDNAAnalyzer.prototype.notifyErrorCallbacks = function (error) {
        this.errorCallbacks.forEach(function (callback) { return callback(error); });
    };
    ErrorDNAAnalyzer.prototype.destroy = function () {
        if (typeof window !== 'undefined') {
            window.onerror = null;
            window.onunhandledrejection = null;
        }
        this.errorCallbacks = [];
        this.errors.clear();
    };
    return ErrorDNAAnalyzer;
}());
export { ErrorDNAAnalyzer };
//# sourceMappingURL=errorDNA.js.map