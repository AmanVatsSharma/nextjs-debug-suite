import { PerformanceMonitor } from '../core/performanceMonitor';
import { debug } from '../core/debug';

// Mock the debug module
jest.mock('../core/debug', () => ({
  debug: {
    log: jest.fn()
  }
}));

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let mockPerformanceNow: jest.SpyInstance;
  let mockGetEntriesByType: jest.SpyInstance;
  let mockPerformanceObserver: jest.Mock;

  beforeEach(() => {
    // Mock performance API if needed
    global.performance = {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
      getEntriesByType: jest.fn(() => []),
    } as any;
    
    monitor = new PerformanceMonitor();
    (debug.log as jest.Mock).mockClear();

    // Mock performance.now()
    mockPerformanceNow = jest.spyOn(performance, 'now');
    mockPerformanceNow.mockReturnValue(1000);

    // Mock performance.getEntriesByType()
    mockGetEntriesByType = jest.spyOn(performance, 'getEntriesByType');
    mockGetEntriesByType.mockReturnValue([]);

    // Mock PerformanceObserver
    mockPerformanceObserver = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn()
    }));
    global.PerformanceObserver = mockPerformanceObserver;
  });

  afterEach(() => {
    mockPerformanceNow.mockRestore();
    mockGetEntriesByType.mockRestore();
  });

  describe('measure', () => {
    it('should measure time between start and end', () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000)  // Start time
        .mockReturnValueOnce(1500); // End time

      monitor.startMeasure('test-operation');
      const duration = monitor.endMeasure('test-operation');

      expect(duration).toBe(500);
      expect(debug.log).toHaveBeenCalledWith(
        'PERFORMANCE',
        'test-operation took 500.00ms'
      );
    });

    it('should return null when ending measure without start', () => {
      const duration = monitor.endMeasure('non-existent');
      expect(duration).toBeNull();
      expect(debug.log).not.toHaveBeenCalled();
    });
  });

  describe('trackComponentRender', () => {
    it('should return mount and unmount functions', () => {
      mockPerformanceNow
        .mockReturnValueOnce(1000)  // Mount time
        .mockReturnValueOnce(1200); // Unmount time

      const tracker = monitor.trackComponentRender('TestComponent');
      
      tracker.mount();
      const duration = tracker.unmount();

      expect(duration).toBe(200);
      expect(debug.log).toHaveBeenCalledWith(
        'PERFORMANCE',
        'TestComponent:render took 200.00ms'
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

      Object.defineProperty(performance, 'memory', {
        value: mockMemory,
        configurable: true
      });

      monitor.trackMemory();

      expect(debug.log).toHaveBeenCalledWith('MEMORY', 'Memory Usage', {
        usedJSHeapSize: 1000000,
        totalJSHeapSize: 2000000,
        limit: 4000000
      });
    });
  });

  describe('trackResourceTiming', () => {
    it('should log resource timings', async () => {
      const mockResource = {
        name: 'test.js',
        duration: 100,
        startTime: 50,
        transferSize: 1024
      };

      mockGetEntriesByType.mockReturnValue([mockResource]);

      await monitor.trackResourceTiming();

      expect(debug.log).toHaveBeenCalledWith('RESOURCES', 'Resource Timing', [
        {
          name: 'test.js',
          duration: 100,
          startTime: 50,
          transferSize: 1024
        }
      ]);
    });
  });

  describe('trackFirstPaint', () => {
    it('should set up paint timing observer', () => {
      const disconnect = monitor.trackFirstPaint();
      
      expect(mockPerformanceObserver).toHaveBeenCalled();
      expect(typeof disconnect).toBe('function');

      // Simulate paint entry
      const mockObserverCallback = mockPerformanceObserver.mock.calls[0][0];
      mockObserverCallback({
        getEntries: () => [{
          name: 'first-paint',
          startTime: 100
        }]
      });

      expect(debug.log).toHaveBeenCalledWith('PAINT', 'first-paint', 100);
    });
  });
}); 