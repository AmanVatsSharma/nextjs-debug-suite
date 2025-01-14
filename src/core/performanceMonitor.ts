import { debug } from './debug';

interface PerformanceMeasure {
  name: string;
  startTime: number;
  duration: number;
}

interface PerformanceLog {
  type: 'measure' | 'memory' | 'resource' | 'paint';
  timestamp: number;
  data: any;
}

export class PerformanceMonitor {
  private debug = debug;
  private measures = new Map<string, number>();
  private logs: PerformanceLog[] = [];
  private maxLogs = 1000;
  private paintCallbacks: ((entry: PerformanceEntry) => void)[] = [];

  startMeasure(name: string) {
    if (typeof performance === 'undefined') return;
    
    performance.mark(`${name}-start`);
    this.measures.set(name, performance.now());
  }

  endMeasure(name: string): number | null {
    if (typeof performance === 'undefined') return null;
    
    const startTime = this.measures.get(name);
    if (!startTime) return null;

    const endTime = performance.now();
    const duration = endTime - startTime;

    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    this.measures.delete(name);
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);

    this.debug.info('PERFORMANCE', `${name} took ${duration.toFixed(2)}ms`, { duration });
    this.addLog('measure', { name, duration });

    return duration;
  }

  trackComponentRender(componentName: string) {
    return {
      mount: () => this.startMeasure(`${componentName}:render`),
      unmount: () => this.endMeasure(`${componentName}:render`)
    };
  }

  trackMemory() {
    if (typeof performance === 'undefined') return null;
    
    const memory = (performance as any).memory;
    if (!memory) return null;

    const metrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };

    this.debug.info('MEMORY', 'Memory Usage', metrics);
    this.addLog('memory', metrics);

    return metrics;
  }

  async trackResourceTiming() {
    if (typeof performance === 'undefined') return [];

    const resources = performance.getEntriesByType('resource');
    const metrics = resources.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime,
      transferSize: (entry as PerformanceResourceTiming).transferSize
    }));

    this.debug.info('PERFORMANCE', 'Resource Timing', metrics);
    metrics.forEach(metric => this.addLog('resource', metric));

    return metrics;
  }

  trackFirstPaint() {
    if (typeof performance === 'undefined') return () => {};

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.debug.info('PERFORMANCE', entry.name, { startTime: entry.startTime });
        this.addLog('paint', { name: entry.name, startTime: entry.startTime });
        this.paintCallbacks.forEach(callback => callback(entry));
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    return () => observer.disconnect();
  }

  onPaintMetric(callback: (entry: PerformanceEntry) => void) {
    this.paintCallbacks.push(callback);
    return () => {
      const index = this.paintCallbacks.indexOf(callback);
      if (index > -1) {
        this.paintCallbacks.splice(index, 1);
      }
    };
  }

  getLogs(type?: string) {
    return type ? this.logs.filter(log => log.type === type) : this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  private addLog(type: PerformanceLog['type'], data: any) {
    this.logs.push({
      type,
      timestamp: Date.now(),
      data
    });

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
} 