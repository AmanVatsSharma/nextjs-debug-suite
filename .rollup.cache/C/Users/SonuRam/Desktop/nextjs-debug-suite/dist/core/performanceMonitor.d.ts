interface PerformanceLog {
    type: 'measure' | 'memory' | 'resource' | 'paint';
    timestamp: number;
    data: any;
}
export declare class PerformanceMonitor {
    private debug;
    private measures;
    private logs;
    private maxLogs;
    private paintCallbacks;
    startMeasure(name: string): void;
    endMeasure(name: string): number | null;
    trackComponentRender(componentName: string): {
        mount: () => void;
        unmount: () => number | null;
    };
    trackMemory(): {
        usedJSHeapSize: any;
        totalJSHeapSize: any;
        jsHeapSizeLimit: any;
    } | null;
    trackResourceTiming(): Promise<{
        name: string;
        duration: number;
        startTime: number;
        transferSize: number;
    }[]>;
    trackFirstPaint(): () => void;
    onPaintMetric(callback: (entry: PerformanceEntry) => void): () => void;
    getLogs(type?: string): PerformanceLog[];
    clearLogs(): void;
    private addLog;
}
export {};
