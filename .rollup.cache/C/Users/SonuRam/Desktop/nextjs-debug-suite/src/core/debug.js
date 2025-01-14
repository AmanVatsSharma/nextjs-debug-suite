import { __spreadArray } from "tslib";
var Debug = /** @class */ (function () {
    function Debug() {
        this.logs = [];
        this.maxLogs = 1000;
        this.logCallbacks = [];
        this.enabled = true;
        this.logLevels = new Set(['ERROR', 'WARN', 'INFO']);
        this.logCategories = new Set(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);
        if (typeof window !== 'undefined') {
            this.setupConsoleOverrides();
        }
    }
    Debug.getInstance = function () {
        if (!Debug.instance) {
            Debug.instance = new Debug();
        }
        return Debug.instance;
    };
    Debug.prototype.setupConsoleOverrides = function () {
        var _this = this;
        var originalConsole = {
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug,
            log: console.log
        };
        console.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.error.apply(_this, __spreadArray(['CUSTOM'], args, false));
            originalConsole.error.apply(console, args);
        };
        console.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.warn.apply(_this, __spreadArray(['CUSTOM'], args, false));
            originalConsole.warn.apply(console, args);
        };
        console.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.info.apply(_this, __spreadArray(['CUSTOM'], args, false));
            originalConsole.info.apply(console, args);
        };
        console.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.debug.apply(_this, __spreadArray(['CUSTOM'], args, false));
            originalConsole.debug.apply(console, args);
        };
        console.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this.log.apply(_this, __spreadArray(['CUSTOM'], args, false));
            originalConsole.log.apply(console, args);
        };
    };
    Debug.prototype.enable = function () {
        this.enabled = true;
    };
    Debug.prototype.disable = function () {
        this.enabled = false;
    };
    Debug.prototype.setLogLevels = function (levels) {
        this.logLevels = new Set(levels);
    };
    Debug.prototype.setLogCategories = function (categories) {
        this.logCategories = new Set(categories);
    };
    Debug.prototype.error = function (category, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['ERROR', category, message], args, false));
    };
    Debug.prototype.warn = function (category, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['WARN', category, message], args, false));
    };
    Debug.prototype.info = function (category, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['INFO', category, message], args, false));
    };
    Debug.prototype.debug = function (category, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['DEBUG', category, message], args, false));
    };
    Debug.prototype.trace = function (category, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.log.apply(this, __spreadArray(['TRACE', category, message], args, false));
    };
    Debug.prototype.log = function (level, category, message) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (!this.enabled)
            return;
        if (!this.logLevels.has(level))
            return;
        if (!this.logCategories.has(category))
            return;
        var entry = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            level: level,
            category: category,
            message: message,
            data: args.length === 1 ? args[0] : args.length > 1 ? args : undefined,
            stackTrace: new Error().stack
        };
        this.logs.unshift(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        this.notifyLogCallbacks(entry);
    };
    Debug.prototype.getLogs = function (filter) {
        if (!filter)
            return this.logs;
        return this.logs.filter(function (entry) {
            if (filter.level && entry.level !== filter.level)
                return false;
            if (filter.category && entry.category !== filter.category)
                return false;
            if (filter.search) {
                var searchLower = filter.search.toLowerCase();
                return (entry.message.toLowerCase().includes(searchLower) ||
                    JSON.stringify(entry.data).toLowerCase().includes(searchLower));
            }
            return true;
        });
    };
    Debug.prototype.getLog = function (id) {
        return this.logs.find(function (entry) { return entry.id === id; });
    };
    Debug.prototype.clearLogs = function () {
        this.logs = [];
    };
    Debug.prototype.onLog = function (callback) {
        var _this = this;
        this.logCallbacks.push(callback);
        return function () {
            var index = _this.logCallbacks.indexOf(callback);
            if (index > -1) {
                _this.logCallbacks.splice(index, 1);
            }
        };
    };
    Debug.prototype.notifyLogCallbacks = function (entry) {
        this.logCallbacks.forEach(function (callback) { return callback(entry); });
    };
    return Debug;
}());
export var debug = Debug.getInstance();
//# sourceMappingURL=debug.js.map