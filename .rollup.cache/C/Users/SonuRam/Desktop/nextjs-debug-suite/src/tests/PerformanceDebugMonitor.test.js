import { __awaiter, __generator } from "tslib";
import { PerformanceMonitor } from '../core/performanceMonitor';
import { debug } from '../core/debug';
jest.mock('../core/debug');
describe('PerformanceMonitor', function () {
    var monitor;
    var mockPerformanceNow;
    beforeEach(function () {
        jest.clearAllMocks();
        monitor = new PerformanceMonitor();
        // Mock performance.now()
        mockPerformanceNow = jest.spyOn(performance, 'now');
        mockPerformanceNow.mockReturnValue(0);
        // Mock performance.mark and measure
        global.performance.mark = jest.fn();
        global.performance.measure = jest.fn();
        global.performance.clearMarks = jest.fn();
        // Mock PerformanceObserver
        global.PerformanceObserver = /** @class */ (function () {
            function class_1(callback) {
                this.callback = callback;
            }
            class_1.prototype.observe = function () { };
            class_1.prototype.disconnect = function () { };
            return class_1;
        }());
    });
    afterEach(function () {
        mockPerformanceNow.mockRestore();
    });
    describe('measure', function () {
        it('should measure time between start and end', function () {
            mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(100);
            monitor.startMeasure('test');
            var duration = monitor.endMeasure('test');
            expect(duration).toBe(100);
            expect(debug.info).toHaveBeenCalledWith('PERFORMANCE', 'test took 100.00ms', { duration: 100 });
        });
        it('should return null when ending measure without start', function () {
            var duration = monitor.endMeasure('nonexistent');
            expect(duration).toBeNull();
        });
    });
    describe('trackComponentRender', function () {
        it('should return mount and unmount functions', function () {
            mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(50);
            var _a = monitor.trackComponentRender('TestComponent'), mount = _a.mount, unmount = _a.unmount;
            mount();
            var duration = unmount();
            expect(duration).toBe(50);
            expect(debug.info).toHaveBeenCalledWith('PERFORMANCE', 'TestComponent:render took 50.00ms', { duration: 50 });
        });
    });
    describe('trackMemory', function () {
        it('should log memory usage when available', function () {
            var mockMemory = {
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            };
            performance.memory = mockMemory;
            var metrics = monitor.trackMemory();
            expect(metrics).toEqual(mockMemory);
            expect(debug.info).toHaveBeenCalledWith('MEMORY', 'Memory Usage', mockMemory);
        });
        it('should return null when memory API is not available', function () {
            performance.memory = undefined;
            var metrics = monitor.trackMemory();
            expect(metrics).toBeNull();
        });
    });
    describe('trackResourceTiming', function () {
        it('should log resource timings', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResource, metrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResource = {
                            name: 'test.js',
                            duration: 100,
                            startTime: 0,
                            transferSize: 1000
                        };
                        global.performance.getEntriesByType = jest.fn().mockReturnValue([mockResource]);
                        return [4 /*yield*/, monitor.trackResourceTiming()];
                    case 1:
                        metrics = _a.sent();
                        expect(metrics).toEqual([mockResource]);
                        expect(debug.info).toHaveBeenCalledWith('PERFORMANCE', 'Resource Timing', [mockResource]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('trackFirstPaint', function () {
        it('should set up paint timing observer', function () {
            var cleanup = monitor.trackFirstPaint();
            expect(typeof cleanup).toBe('function');
        });
        it('should handle paint callbacks', function () {
            var mockEntry = {
                name: 'first-paint',
                startTime: 100
            };
            var callback = jest.fn();
            monitor.onPaintMetric(callback);
            // Simulate PerformanceObserver callback
            var observer = new global.PerformanceObserver();
            observer.callback({ getEntries: function () { return [mockEntry]; } });
            expect(callback).toHaveBeenCalledWith(mockEntry);
            expect(debug.info).toHaveBeenCalledWith('PERFORMANCE', 'first-paint', { startTime: 100 });
        });
    });
});
//# sourceMappingURL=PerformanceDebugMonitor.test.js.map