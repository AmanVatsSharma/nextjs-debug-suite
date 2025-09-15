export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
export type LogCategory = 'ERROR' | 'NETWORK' | 'PERFORMANCE' | 'STATE' | 'MEMORY' | 'RESOURCES' | 'PAINT' | 'CUSTOM';
export interface LogEntry {
    id: string;
    timestamp: number;
    level: LogLevel;
    category: LogCategory;
    message: string;
    data?: any;
    source?: string;
    stackTrace?: string;
}
declare class Debug {
    private static instance;
    private logs;
    private maxLogs;
    private logCallbacks;
    private enabled;
    private logLevels;
    private logCategories;
    private constructor();
    static getInstance(): Debug;
    private setupConsoleOverrides;
    enable(): void;
    disable(): void;
    setLogLevels(levels: LogLevel[]): void;
    setLogCategories(categories: LogCategory[]): void;
    error(category: LogCategory, message: string, ...args: any[]): void;
    warn(category: LogCategory, message: string, ...args: any[]): void;
    info(category: LogCategory, message: string, ...args: any[]): void;
    debug(category: LogCategory, message: string, ...args: any[]): void;
    trace(category: LogCategory, message: string, ...args: any[]): void;
    log(level: LogLevel, category: LogCategory, message: string, ...args: any[]): void;
    getLogs(filter?: {
        level?: LogLevel;
        category?: LogCategory;
        search?: string;
    }): LogEntry[];
    getLog(id: string): LogEntry | undefined;
    clearLogs(): void;
    onLog(callback: (entry: LogEntry) => void): () => void;
    private notifyLogCallbacks;
}
export declare const debug: Debug;
export {};
