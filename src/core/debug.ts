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

class Debug {
  private static instance: Debug;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private logCallbacks: ((entry: LogEntry) => void)[] = [];
  private enabled = true;
  private logLevels: Set<LogLevel> = new Set(['ERROR', 'WARN', 'INFO']);
  private logCategories: Set<LogCategory> = new Set(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupConsoleOverrides();
    }
  }

  static getInstance(): Debug {
    if (!Debug.instance) {
      Debug.instance = new Debug();
    }
    return Debug.instance;
  }

  private setupConsoleOverrides() {
    const originalConsole = {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      log: console.log
    };

    console.error = (...args) => {
      this.error('CUSTOM', ...args);
      originalConsole.error.apply(console, args);
    };

    console.warn = (...args) => {
      this.warn('CUSTOM', ...args);
      originalConsole.warn.apply(console, args);
    };

    console.info = (...args) => {
      this.info('CUSTOM', ...args);
      originalConsole.info.apply(console, args);
    };

    console.debug = (...args) => {
      this.debug('CUSTOM', ...args);
      originalConsole.debug.apply(console, args);
    };

    console.log = (...args) => {
      this.log('CUSTOM', ...args);
      originalConsole.log.apply(console, args);
    };
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = new Set(levels);
  }

  setLogCategories(categories: LogCategory[]) {
    this.logCategories = new Set(categories);
  }

  error(category: LogCategory, message: string, ...args: any[]) {
    this.log('ERROR', category, message, ...args);
  }

  warn(category: LogCategory, message: string, ...args: any[]) {
    this.log('WARN', category, message, ...args);
  }

  info(category: LogCategory, message: string, ...args: any[]) {
    this.log('INFO', category, message, ...args);
  }

  debug(category: LogCategory, message: string, ...args: any[]) {
    this.log('DEBUG', category, message, ...args);
  }

  trace(category: LogCategory, message: string, ...args: any[]) {
    this.log('TRACE', category, message, ...args);
  }

  log(level: LogLevel, category: LogCategory, message: string, ...args: any[]) {
    if (!this.enabled) return;
    if (!this.logLevels.has(level)) return;
    if (!this.logCategories.has(category)) return;

    const entry: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      level,
      category,
      message,
      data: args.length === 1 ? args[0] : args.length > 1 ? args : undefined,
      stackTrace: new Error().stack
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    this.notifyLogCallbacks(entry);
  }

  getLogs(filter?: {
    level?: LogLevel;
    category?: LogCategory;
    search?: string;
  }): LogEntry[] {
    if (!filter) return this.logs;

    return this.logs.filter(entry => {
      if (filter.level && entry.level !== filter.level) return false;
      if (filter.category && entry.category !== filter.category) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return (
          entry.message.toLowerCase().includes(searchLower) ||
          JSON.stringify(entry.data).toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }

  getLog(id: string): LogEntry | undefined {
    return this.logs.find(entry => entry.id === id);
  }

  clearLogs() {
    this.logs = [];
  }

  onLog(callback: (entry: LogEntry) => void) {
    this.logCallbacks.push(callback);
    return () => {
      const index = this.logCallbacks.indexOf(callback);
      if (index > -1) {
        this.logCallbacks.splice(index, 1);
      }
    };
  }

  private notifyLogCallbacks(entry: LogEntry) {
    this.logCallbacks.forEach(callback => callback(entry));
  }
}

export const debug = Debug.getInstance(); 