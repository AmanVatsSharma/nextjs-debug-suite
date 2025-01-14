import { __awaiter, __generator } from "tslib";
import { PerformanceMonitor } from '../core/performanceMonitor';
describe('PerformanceMonitor', function () {
    var monitor;
    beforeEach(function () {
        jest.clearAllMocks();
        // Mock performance API
        var mockPerformance = {
            now: jest.fn(),
            mark: jest.fn(),
            measure: jest.fn(),
            getEntriesByType: jest.fn(),
            clearMarks: jest.fn(),
            clearMeasures: jest.fn()
        };
        global.performance = mockPerformance;
        // Mock PerformanceObserver
        global.PerformanceObserver = jest.fn().mockImplementation(function (callback) { return ({
            observe: jest.fn(),
            disconnect: jest.fn(),
            takeRecords: jest.fn(),
            callback: callback
        }); });
        monitor = new PerformanceMonitor();
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    describe('performance measurements', function () {
        it('should measure execution time', function () {
            performance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);
            monitor.startMeasure('test');
            var duration = monitor.endMeasure('test');
            expect(duration).toBe(50);
            expect(debug.info).toHaveBeenCalledWith('PERFORMANCE', 'test took 50.00ms', expect.any(Object));
        });
        it('should handle missing start time', function () {
            var duration = monitor.endMeasure('nonexistent');
            expect(duration).toBeNull();
        });
        it('should track component render times', function () {
            var tracker = monitor.trackComponentRender('TestComponent');
            var performanceNow = performance.now;
            performanceNow.mockReturnValueOnce(100).mockReturnValueOnce(200);
            tracker.mount();
            tracker.unmount();
            expect(performance.mark).toHaveBeenCalledWith('TestComponent:render-start');
            expect(performance.mark).toHaveBeenCalledWith('TestComponent:render-end');
        });
    });
    describe('memory tracking', function () {
        it('should track memory usage', function () {
            var metrics = monitor.trackMemory();
            expect(metrics).toEqual({
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            });
        });
        it('should handle missing memory API', function () {
            delete performance.memory;
            var metrics = monitor.trackMemory();
            expect(metrics).toBeNull();
        });
    });
    describe('resource timing', function () {
        it('should track resource timing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockResources, metrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockResources = [
                            {
                                name: 'https://example.com/script.js',
                                duration: 100,
                                startTime: 50,
                                transferSize: 1024
                            }
                        ];
                        performance.getEntriesByType.mockReturnValue(mockResources);
                        return [4 /*yield*/, monitor.trackResourceTiming()];
                    case 1:
                        metrics = _a.sent();
                        expect(metrics).toEqual([{
                                name: 'https://example.com/script.js',
                                duration: 100,
                                startTime: 50,
                                transferSize: 1024
                            }]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('paint timing', function () {
        var mockObserver;
        var mockDisconnect;
        var mockObserve;
        beforeEach(function () {
            mockDisconnect = jest.fn();
            mockObserve = jest.fn();
            mockObserver = jest.fn(function () { return ({
                observe: mockObserve,
                disconnect: mockDisconnect
            }); });
            global.PerformanceObserver = mockObserver;
        });
        it('should track first paint', function () {
            var cleanup = monitor.trackFirstPaint();
            expect(mockObserve).toHaveBeenCalledWith({ entryTypes: ['paint'] });
            cleanup();
            expect(mockDisconnect).toHaveBeenCalled();
        });
        it('should notify paint callbacks', function () {
            var callback = jest.fn();
            var unsubscribe = monitor.onPaintMetric(callback);
            var mockEntry = {
                name: 'first-paint',
                startTime: 100
            };
            // Simulate paint event
            var observer = mockObserver.mock.results[0].value;
            observer.observe.mock.calls[0][0].callback({
                getEntries: function () { return [mockEntry]; }
            });
            expect(callback).toHaveBeenCalledWith(mockEntry);
            unsubscribe();
            observer.observe.mock.calls[0][0].callback({
                getEntries: function () { return [mockEntry]; }
            });
            expect(callback).toHaveBeenCalledTimes(1);
        });
    });
    describe('log management', function () {
        it('should store and retrieve logs', function () {
            monitor.startMeasure('test');
            monitor.endMeasure('test');
            var logs = monitor.getLogs();
            expect(logs).toHaveLength(1);
            expect(logs[0].type).toBe('measure');
            expect(logs[0].data).toHaveProperty('name', 'test');
        });
        it('should filter logs by type', function () {
            monitor.startMeasure('test1');
            monitor.endMeasure('test1');
            monitor.trackMemory();
            var measureLogs = monitor.getLogs('measure');
            var memoryLogs = monitor.getLogs('memory');
            expect(measureLogs).toHaveLength(1);
            expect(memoryLogs).toHaveLength(1);
        });
        it('should clear logs', function () {
            monitor.startMeasure('test');
            monitor.endMeasure('test');
            monitor.clearLogs();
            expect(monitor.getLogs()).toHaveLength(0);
        });
        it('should limit the number of logs', function () {
            var maxLogs = 1000;
            for (var i = 0; i < maxLogs + 10; i++) {
                monitor.startMeasure("test".concat(i));
                monitor.endMeasure("test".concat(i));
            }
            expect(monitor.getLogs()).toHaveLength(maxLogs);
        });
    });
});
//# sourceMappingURL=PerformanceMonitor.test.js.map