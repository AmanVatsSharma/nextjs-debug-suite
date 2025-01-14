import { PerformanceMonitor } from '../core/performanceMonitor';
import { debug } from '../core/debug';

jest.mock('../core/debug');

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let mockPerformanceNow: jest.SpyInstance;

  beforeEach(() => {
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
    (global as any).PerformanceObserver = class {
      constructor(callback: any) {
        this.callback = callback;
      }
      observe() {}
      disconnect() {}
      callback: any;
    };
  });

  afterEach(() => {
    mockPerformanceNow.mockRestore();
  });

  describe('measure', () => {
    it('should measure time between start and end', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(100);

      monitor.startMeasure('test');
      const duration = monitor.endMeasure('test');

      expect(duration).toBe(100);
      expect(debug.info).toHaveBeenCalledWith(
        'PERFORMANCE',
        'test took 100.00ms',
        { duration: 100 }
      );
    });

    it('should return null when ending measure without start', () => {
      const duration = monitor.endMeasure('nonexistent');
      expect(duration).toBeNull();
    });
  });

  describe('trackComponentRender', () => {
    it('should return mount and unmount functions', () => {
      mockPerformanceNow.mockReturnValueOnce(0).mockReturnValueOnce(50);

      const { mount, unmount } = monitor.trackComponentRender('TestComponent');
      
      mount();
      const duration = unmount();

      expect(duration).toBe(50);
      expect(debug.info).toHaveBeenCalledWith(
        'PERFORMANCE',
        'TestComponent:render took 50.00ms',
        { duration: 50 }
      );
    });
  });

  describe('trackMemory', () => {
    it('should log memory usage when available', () => {
      const mockMemory = {
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        jsHeapSizeLimit: 4000000
      };

      (performance as any).memory = mockMemory;

      const metrics = monitor.trackMemory();

      expect(metrics).toEqual(mockMemory);
      expect(debug.info).toHaveBeenCalledWith(
        'MEMORY',
        'Memory Usage',
        mockMemory
      );
    });

    it('should return null when memory API is not available', () => {
      (performance as any).memory = undefined;
      const metrics = monitor.trackMemory();
      expect(metrics).toBeNull();
    });
  });

  describe('trackResourceTiming', () => {
    it('should log resource timings', async () => {
      const mockResource = {
        name: 'test.js',
        duration: 100,
        startTime: 0,
        transferSize: 1000
      };

      global.performance.getEntriesByType = jest.fn().mockReturnValue([mockResource]);

      const metrics = await monitor.trackResourceTiming();

      expect(metrics).toEqual([mockResource]);
      expect(debug.info).toHaveBeenCalledWith(
        'PERFORMANCE',
        'Resource Timing',
        [mockResource]
      );
    });
  });

  describe('trackFirstPaint', () => {
    it('should set up paint timing observer', () => {
      const cleanup = monitor.trackFirstPaint();
      expect(typeof cleanup).toBe('function');
    });

    it('should handle paint callbacks', () => {
      const mockEntry = {
        name: 'first-paint',
        startTime: 100
      };

      const callback = jest.fn();
      monitor.onPaintMetric(callback);

      // Simulate PerformanceObserver callback
      const observer = new (global as any).PerformanceObserver();
      observer.callback({ getEntries: () => [mockEntry] });

      expect(callback).toHaveBeenCalledWith(mockEntry);
      expect(debug.info).toHaveBeenCalledWith(
        'PERFORMANCE',
        'first-paint',
        { startTime: 100 }
      );
    });
  });
}); 