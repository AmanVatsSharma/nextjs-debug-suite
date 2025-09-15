import { __awaiter, __generator } from "tslib";
import { debug } from './debug';
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
        return __awaiter(this, void 0, void 0, function () {
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
export { PerformanceMonitor };
//# sourceMappingURL=performanceMonitor.js.map