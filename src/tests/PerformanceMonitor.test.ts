import { PerformanceMonitor } from '../core/performanceMonitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock performance API
    const mockPerformance = {
      now: jest.fn(),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn(),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn()
    };
    
    global.performance = mockPerformance as any;
    
    // Mock PerformanceObserver
    global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
      callback
    }));
    
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performance measurements', () => {
    it('should measure execution time', () => {
      performance.now.mockReturnValueOnce(100).mockReturnValueOnce(150);
      
      monitor.startMeasure('test');
      const duration = monitor.endMeasure('test');
      
      expect(duration).toBe(50);
      expect(debug.info).toHaveBeenCalledWith(
        'PERFORMANCE',
        'test took 50.00ms',
        expect.any(Object)
      );
    });

    it('should handle missing start time', () => {
      const duration = monitor.endMeasure('nonexistent');
      expect(duration).toBeNull();
    });

    it('should track component render times', () => {
      const tracker = monitor.trackComponentRender('TestComponent');
      const performanceNow = performance.now as jest.Mock;
      performanceNow.mockReturnValueOnce(100).mockReturnValueOnce(200);

      tracker.mount();
      tracker.unmount();

      expect(performance.mark).toHaveBeenCalledWith('TestComponent:render-start');
      expect(performance.mark).toHaveBeenCalledWith('TestComponent:render-end');
    });
  });

  describe('memory tracking', () => {
    it('should track memory usage', () => {
      const metrics = monitor.trackMemory();

      expect(metrics).toEqual({
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000
      });
    });

    it('should handle missing memory API', () => {
      delete (performance as any).memory;
      const metrics = monitor.trackMemory();
      expect(metrics).toBeNull();
    });
  });

  describe('resource timing', () => {
    it('should track resource timing', async () => {
      const mockResources = [
        {
          name: 'https://example.com/script.js',
          duration: 100,
          startTime: 50,
          transferSize: 1024
        }
      ];

      (performance.getEntriesByType as jest.Mock).mockReturnValue(mockResources);

      const metrics = await monitor.trackResourceTiming();
      expect(metrics).toEqual([{
        name: 'https://example.com/script.js',
        duration: 100,
        startTime: 50,
        transferSize: 1024
      }]);
    });
  });

  describe('paint timing', () => {
    let mockObserver: any;
    let mockDisconnect: jest.Mock;
    let mockObserve: jest.Mock;

    beforeEach(() => {
      mockDisconnect = jest.fn();
      mockObserve = jest.fn();
      mockObserver = jest.fn(() => ({
        observe: mockObserve,
        disconnect: mockDisconnect
      }));
      (global as any).PerformanceObserver = mockObserver;
    });

    it('should track first paint', () => {
      const cleanup = monitor.trackFirstPaint();
      expect(mockObserve).toHaveBeenCalledWith({ entryTypes: ['paint'] });

      cleanup();
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should notify paint callbacks', () => {
      const callback = jest.fn();
      const unsubscribe = monitor.onPaintMetric(callback);

      const mockEntry = {
        name: 'first-paint',
        startTime: 100
      };

      // Simulate paint event
      const observer = mockObserver.mock.results[0].value;
      observer.observe.mock.calls[0][0].callback({
        getEntries: () => [mockEntry]
      });

      expect(callback).toHaveBeenCalledWith(mockEntry);

      unsubscribe();
      observer.observe.mock.calls[0][0].callback({
        getEntries: () => [mockEntry]
      });
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('log management', () => {
    it('should store and retrieve logs', () => {
      monitor.startMeasure('test');
      monitor.endMeasure('test');

      const logs = monitor.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('measure');
      expect(logs[0].data).toHaveProperty('name', 'test');
    });

    it('should filter logs by type', () => {
      monitor.startMeasure('test1');
      monitor.endMeasure('test1');
      monitor.trackMemory();

      const measureLogs = monitor.getLogs('measure');
      const memoryLogs = monitor.getLogs('memory');

      expect(measureLogs).toHaveLength(1);
      expect(memoryLogs).toHaveLength(1);
    });

    it('should clear logs', () => {
      monitor.startMeasure('test');
      monitor.endMeasure('test');
      monitor.clearLogs();

      expect(monitor.getLogs()).toHaveLength(0);
    });

    it('should limit the number of logs', () => {
      const maxLogs = 1000;
      for (let i = 0; i < maxLogs + 10; i++) {
        monitor.startMeasure(`test${i}`);
        monitor.endMeasure(`test${i}`);
      }

      expect(monitor.getLogs()).toHaveLength(maxLogs);
    });
  });
}); 