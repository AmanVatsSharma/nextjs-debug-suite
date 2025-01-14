'use strict';

var React = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : undefined, done: true };
    }
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var DebugContext = React.createContext(undefined);
var useDebugContext = function () {
    var context = React.useContext(DebugContext);
    if (!context) {
        throw new Error('useDebugContext must be used within a DebugSuiteProvider');
    }
    return context;
};
var DebugSuiteProvider = function (_a) {
    var children = _a.children, initialConfig = _a.config;
    var config = React.useState(initialConfig)[0];
    var _b = React.useState({
        errors: [],
        performance: {
            metrics: [],
            memory: [],
            renders: []
        },
        network: {
            requests: [],
            responses: []
        },
        console: {
            logs: [],
            warnings: [],
            errors: []
        },
        ai: {
            suggestions: [],
            analysis: []
        }
    }), data = _b[0], setData = _b[1];
    var clearData = React.useCallback(function (tab) {
        setData(function (prev) {
            var newData = __assign({}, prev);
            switch (tab) {
                case 'errors':
                    newData.errors = [];
                    break;
                case 'performance':
                    newData.performance = {
                        metrics: [],
                        memory: [],
                        renders: []
                    };
                    break;
                case 'network':
                    newData.network = {
                        requests: [],
                        responses: []
                    };
                    break;
                case 'console':
                    newData.console = {
                        logs: [],
                        warnings: [],
                        errors: []
                    };
                    break;
                case 'ai':
                    newData.ai = {
                        suggestions: [],
                        analysis: []
                    };
                    break;
            }
            return newData;
        });
    }, []);
    var exportData = React.useCallback(function (tab) {
        switch (tab) {
            case 'errors':
                return { errors: data.errors };
            case 'performance':
                return { performance: data.performance };
            case 'network':
                return { network: data.network };
            case 'console':
                return { console: data.console };
            case 'ai':
                return { ai: data.ai };
            default:
                return data;
        }
    }, [data]);
    var value = {
        config: config,
        data: data,
        clearData: clearData,
        exportData: exportData
    };
    return (React.createElement(DebugContext.Provider, { value: value }, children));
};

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
var debug = Debug.getInstance();

var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor() {
        this.debug = debug;
        this.measures = new Map();
        this.logs = [];
        this.maxLogs = 1000;
        this.paintCallbacks = [];
    }
    PerformanceMonitor.prototype.startMeasure = function (name) {
        if (typeof performance === 'undefined')
            return;
        performance.mark("".concat(name, "-start"));
        this.measures.set(name, performance.now());
    };
    PerformanceMonitor.prototype.endMeasure = function (name) {
        if (typeof performance === 'undefined')
            return null;
        var startTime = this.measures.get(name);
        if (!startTime)
            return null;
        var endTime = performance.now();
        var duration = endTime - startTime;
        performance.mark("".concat(name, "-end"));
        performance.measure(name, "".concat(name, "-start"), "".concat(name, "-end"));
        this.measures.delete(name);
        performance.clearMarks("".concat(name, "-start"));
        performance.clearMarks("".concat(name, "-end"));
        this.debug.info('PERFORMANCE', "".concat(name, " took ").concat(duration.toFixed(2), "ms"), { duration: duration });
        this.addLog('measure', { name: name, duration: duration });
        return duration;
    };
    PerformanceMonitor.prototype.trackComponentRender = function (componentName) {
        var _this = this;
        return {
            mount: function () { return _this.startMeasure("".concat(componentName, ":render")); },
            unmount: function () { return _this.endMeasure("".concat(componentName, ":render")); }
        };
    };
    PerformanceMonitor.prototype.trackMemory = function () {
        if (typeof performance === 'undefined')
            return null;
        var memory = performance.memory;
        if (!memory)
            return null;
        var metrics = {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
        this.debug.info('MEMORY', 'Memory Usage', metrics);
        this.addLog('memory', metrics);
        return metrics;
    };
    PerformanceMonitor.prototype.trackResourceTiming = function () {
        return __awaiter(this, undefined, undefined, function () {
            var resources, metrics;
            var _this = this;
            return __generator(this, function (_a) {
                if (typeof performance === 'undefined')
                    return [2 /*return*/, []];
                resources = performance.getEntriesByType('resource');
                metrics = resources.map(function (entry) { return ({
                    name: entry.name,
                    duration: entry.duration,
                    startTime: entry.startTime,
                    transferSize: entry.transferSize
                }); });
                this.debug.info('PERFORMANCE', 'Resource Timing', metrics);
                metrics.forEach(function (metric) { return _this.addLog('resource', metric); });
                return [2 /*return*/, metrics];
            });
        });
    };
    PerformanceMonitor.prototype.trackFirstPaint = function () {
        var _this = this;
        if (typeof performance === 'undefined')
            return function () { };
        var observer = new PerformanceObserver(function (list) {
            var _loop_1 = function (entry) {
                _this.debug.info('PERFORMANCE', entry.name, { startTime: entry.startTime });
                _this.addLog('paint', { name: entry.name, startTime: entry.startTime });
                _this.paintCallbacks.forEach(function (callback) { return callback(entry); });
            };
            for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                _loop_1(entry);
            }
        });
        observer.observe({ entryTypes: ['paint'] });
        return function () { return observer.disconnect(); };
    };
    PerformanceMonitor.prototype.onPaintMetric = function (callback) {
        var _this = this;
        this.paintCallbacks.push(callback);
        return function () {
            var index = _this.paintCallbacks.indexOf(callback);
            if (index > -1) {
                _this.paintCallbacks.splice(index, 1);
            }
        };
    };
    PerformanceMonitor.prototype.getLogs = function (type) {
        return type ? this.logs.filter(function (log) { return log.type === type; }) : this.logs;
    };
    PerformanceMonitor.prototype.clearLogs = function () {
        this.logs = [];
    };
    PerformanceMonitor.prototype.addLog = function (type, data) {
        this.logs.push({
            type: type,
            timestamp: Date.now(),
            data: data
        });
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
    };
    return PerformanceMonitor;
}());

var NetworkMonitor = /** @class */ (function () {
    function NetworkMonitor() {
        this.debug = debug;
        this.requests = [];
        this.maxRequests = 1000;
        this.requestCallbacks = [];
        this.originalFetch = typeof window !== 'undefined' ? window.fetch : fetch;
        this.originalXHR = typeof window !== 'undefined' ? window.XMLHttpRequest : XMLHttpRequest;
        if (typeof window !== 'undefined') {
            this.monitorFetch();
            this.monitorXHR();
        }
    }
    NetworkMonitor.prototype.monitorFetch = function () {
        var _this = this;
        window.fetch = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, undefined, undefined, function () {
                var request, response, clonedResponse, _a, _c, error_1;
                var _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            request = this.createRequest(args[0] instanceof URL ? args[0].toString() : args[0], ((_d = args[1]) === null || _d === undefined ? undefined : _d.method) || 'GET');
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, this.originalFetch.apply(window, args)];
                        case 2:
                            response = _e.sent();
                            clonedResponse = response.clone();
                            request.status = response.status;
                            request.statusText = response.statusText;
                            request.headers = this.parseHeaders(response.headers);
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 5, , 7]);
                            _a = request;
                            return [4 /*yield*/, clonedResponse.json()];
                        case 4:
                            _a.responseBody = _e.sent();
                            return [3 /*break*/, 7];
                        case 5:
                            _e.sent();
                            _c = request;
                            return [4 /*yield*/, clonedResponse.text()];
                        case 6:
                            _c.responseBody = _e.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            this.completeRequest(request);
                            return [2 /*return*/, response];
                        case 8:
                            error_1 = _e.sent();
                            request.error = error_1;
                            this.completeRequest(request);
                            throw error_1;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
    };
    NetworkMonitor.prototype.monitorXHR = function () {
        var self = this;
        window.XMLHttpRequest = /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super.call(this) || this;
                _this.request = self.createRequest('', 'GET');
                _this.addEventListener('load', function () {
                    _this.request.status = _this.status;
                    _this.request.statusText = _this.statusText;
                    _this.request.headers = self.parseHeaders(_this.getAllResponseHeaders());
                    try {
                        _this.request.responseBody = JSON.parse(_this.responseText);
                    }
                    catch (_a) {
                        _this.request.responseBody = _this.responseText;
                    }
                    self.completeRequest(_this.request);
                });
                _this.addEventListener('error', function (event) {
                    _this.request.error = new Error('XHR request failed');
                    self.completeRequest(_this.request);
                });
                return _this;
            }
            class_1.prototype.open = function (method, url) {
                this.request.method = method;
                this.request.url = url;
                _super.prototype.open.call(this, method, url);
            };
            class_1.prototype.send = function (body) {
                if (body) {
                    try {
                        this.request.requestBody = JSON.parse(body);
                    }
                    catch (_a) {
                        this.request.requestBody = body;
                    }
                }
                _super.prototype.send.call(this, body);
            };
            return class_1;
        }(XMLHttpRequest));
    };
    NetworkMonitor.prototype.createRequest = function (url, method) {
        var request = {
            id: Math.random().toString(36).substring(7),
            url: typeof url === 'string' ? url : url.url,
            method: method,
            startTime: Date.now()
        };
        this.requests.unshift(request);
        if (this.requests.length > this.maxRequests) {
            this.requests = this.requests.slice(0, this.maxRequests);
        }
        this.debug.info('NETWORK', "Request started: ".concat(method, " ").concat(request.url), request);
        return request;
    };
    NetworkMonitor.prototype.completeRequest = function (request) {
        request.endTime = Date.now();
        request.duration = request.endTime - request.startTime;
        var status = request.status ? "".concat(request.status, " ").concat(request.statusText) : 'Failed';
        this.debug.info('NETWORK', "Request completed: ".concat(request.method, " ").concat(request.url), {
            status: status,
            duration: request.duration,
            request: request
        });
        this.requestCallbacks.forEach(function (callback) { return callback(request); });
    };
    NetworkMonitor.prototype.parseHeaders = function (headers) {
        if (headers instanceof Headers) {
            var obj_1 = {};
            headers.forEach(function (value, key) {
                obj_1[key] = value;
            });
            return obj_1;
        }
        if (typeof headers === 'string') {
            return headers.split('\r\n')
                .filter(function (line) { return line; })
                .reduce(function (obj, line) {
                var _a = line.split(': '), key = _a[0], value = _a[1];
                obj[key.toLowerCase()] = value;
                return obj;
            }, {});
        }
        return {};
    };
    NetworkMonitor.prototype.getRequests = function () {
        return this.requests;
    };
    NetworkMonitor.prototype.clearRequests = function () {
        this.requests = [];
    };
    NetworkMonitor.prototype.onRequest = function (callback) {
        var _this = this;
        this.requestCallbacks.push(callback);
        return function () {
            var index = _this.requestCallbacks.indexOf(callback);
            if (index > -1) {
                _this.requestCallbacks.splice(index, 1);
            }
        };
    };
    NetworkMonitor.prototype.destroy = function () {
        if (typeof window !== 'undefined') {
            window.fetch = this.originalFetch;
            window.XMLHttpRequest = this.originalXHR;
        }
        this.requestCallbacks = [];
        this.requests = [];
    };
    return NetworkMonitor;
}());

var StateDebugMonitor = /** @class */ (function () {
    function StateDebugMonitor() {
        this.debug = debug;
        this.changes = [];
        this.maxChanges = 1000;
        this.changeCallbacks = [];
        this.contextPatches = new Map();
    }
    StateDebugMonitor.prototype.trackReduxChanges = function () {
        var _this = this;
        this.reduxMiddleware = function (store) { return function (next) { return function (action) {
            var prevState = store.getState();
            var result = next(action);
            var nextState = store.getState();
            _this.captureChange({
                type: 'redux',
                action: {
                    type: action.type,
                    payload: action.payload
                },
                prevState: prevState,
                nextState: nextState
            });
            return result;
        }; }; };
        return this.reduxMiddleware;
    };
    StateDebugMonitor.prototype.trackContextChanges = function (contextName, prevValue, nextValue) {
        var patch = this.contextPatches.get(contextName);
        var timestamp = Date.now();
        if (patch && timestamp - patch.timestamp < 100) {
            // Debounce rapid context changes
            this.contextPatches.set(contextName, {
                timestamp: timestamp,
                prevValue: patch.prevValue,
                nextValue: nextValue
            });
        }
        else {
            this.contextPatches.set(contextName, {
                timestamp: timestamp,
                prevValue: prevValue,
                nextValue: nextValue
            });
            this.captureChange({
                type: 'context',
                componentName: contextName,
                prevState: prevValue,
                nextState: nextValue
            });
        }
    };
    StateDebugMonitor.prototype.trackStateChanges = function (componentName, hookId, prevState, nextState) {
        this.captureChange({
            type: 'useState',
            componentName: componentName,
            action: { type: "".concat(componentName, ":").concat(hookId) },
            prevState: prevState,
            nextState: nextState
        });
    };
    StateDebugMonitor.prototype.trackCustomChanges = function (name, prevState, nextState, metadata) {
        this.captureChange(__assign({ type: 'custom', componentName: name, prevState: prevState, nextState: nextState }, metadata));
    };
    StateDebugMonitor.prototype.captureChange = function (change) {
        var timestamp = Date.now();
        var id = Math.random().toString(36).substring(7);
        var stateChange = {
            id: id,
            timestamp: timestamp,
            type: change.type || 'custom',
            componentName: change.componentName,
            action: change.action,
            prevState: change.prevState,
            nextState: change.nextState,
            diff: this.calculateDiff(change.prevState, change.nextState)
        };
        this.changes.unshift(stateChange);
        if (this.changes.length > this.maxChanges) {
            this.changes = this.changes.slice(0, this.maxChanges);
        }
        this.debug.log('STATE', "".concat(stateChange.type, " change in ").concat(stateChange.componentName || 'unknown'), stateChange);
        this.notifyChangeCallbacks(stateChange);
    };
    StateDebugMonitor.prototype.calculateDiff = function (prev, next) {
        if (!prev || !next)
            return {};
        var added = {};
        var removed = {};
        var updated = {};
        // Find added and updated
        Object.keys(next).forEach(function (key) {
            if (!(key in prev)) {
                added[key] = next[key];
            }
            else if (prev[key] !== next[key]) {
                updated[key] = {
                    from: prev[key],
                    to: next[key]
                };
            }
        });
        // Find removed
        Object.keys(prev).forEach(function (key) {
            if (!(key in next)) {
                removed[key] = prev[key];
            }
        });
        return {
            added: Object.keys(added).length ? added : undefined,
            removed: Object.keys(removed).length ? removed : undefined,
            updated: Object.keys(updated).length ? updated : undefined
        };
    };
    StateDebugMonitor.prototype.getChanges = function (filter) {
        if (!filter)
            return this.changes;
        return this.changes.filter(function (change) {
            var _a;
            if (filter.type && change.type !== filter.type)
                return false;
            if (filter.componentName && change.componentName !== filter.componentName)
                return false;
            if (filter.actionType && ((_a = change.action) === null || _a === undefined ? undefined : _a.type) !== filter.actionType)
                return false;
            return true;
        });
    };
    StateDebugMonitor.prototype.getChange = function (id) {
        return this.changes.find(function (change) { return change.id === id; });
    };
    StateDebugMonitor.prototype.getLatestChange = function (componentName) {
        if (componentName) {
            return this.changes.find(function (change) { return change.componentName === componentName; });
        }
        return this.changes[0];
    };
    StateDebugMonitor.prototype.clearChanges = function () {
        this.changes = [];
        this.contextPatches.clear();
    };
    StateDebugMonitor.prototype.onChange = function (callback) {
        var _this = this;
        this.changeCallbacks.push(callback);
        return function () {
            var index = _this.changeCallbacks.indexOf(callback);
            if (index > -1) {
                _this.changeCallbacks.splice(index, 1);
            }
        };
    };
    StateDebugMonitor.prototype.notifyChangeCallbacks = function (change) {
        this.changeCallbacks.forEach(function (callback) { return callback(change); });
    };
    StateDebugMonitor.prototype.destroy = function () {
        this.changeCallbacks = [];
        this.clearChanges();
    };
    return StateDebugMonitor;
}());

exports.DebugSuiteProvider = DebugSuiteProvider;
exports.NetworkMonitor = NetworkMonitor;
exports.PerformanceMonitor = PerformanceMonitor;
exports.StateDebugMonitor = StateDebugMonitor;
exports.debug = debug;
exports.useDebugContext = useDebugContext;
//# sourceMappingURL=index.js.map
