import { debug } from '../core/debug';
import type { LogEntry, LogLevel, LogCategory } from '../core/debug';

jest.mock('../core/debug', () => {
  let logs: LogEntry[] = [];
  let logCallbacks: ((entry: LogEntry) => void)[] = [];
  let enabled = true;
  let logLevels = new Set(['ERROR', 'WARN', 'INFO']);
  let logCategories = new Set(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);

  const createLogEntry = (level: LogLevel, category: LogCategory, message: string, args: any[]): LogEntry => ({
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    level,
    category,
    message,
    data: args.length > 0 ? args : undefined
  });

  const addLog = (entry: LogEntry) => {
    if (!enabled || !logLevels.has(entry.level) || !logCategories.has(entry.category)) return;
    logs.push(entry);
    logCallbacks.forEach(cb => cb(entry));
  };

  return {
    debug: {
      clearLogs: () => {
        logs = [];
      },
      enable: () => {
        enabled = true;
      },
      disable: () => {
        enabled = false;
      },
      setLogLevels: (levels: LogLevel[]) => {
        logLevels = new Set(levels);
      },
      setLogCategories: (categories: LogCategory[]) => {
        logCategories = new Set(categories);
      },
      error: (category: LogCategory, message: string, ...args: any[]) => {
        addLog(createLogEntry('ERROR', category, message, args));
      },
      warn: (category: LogCategory, message: string, ...args: any[]) => {
        addLog(createLogEntry('WARN', category, message, args));
      },
      info: (category: LogCategory, message: string, ...args: any[]) => {
        addLog(createLogEntry('INFO', category, message, args));
      },
      debug: (category: LogCategory, message: string, ...args: any[]) => {
        addLog(createLogEntry('DEBUG', category, message, args));
      },
      trace: (category: LogCategory, message: string, ...args: any[]) => {
        addLog(createLogEntry('TRACE', category, message, args));
      },
      getLogs: (filter?: { level?: LogLevel; category?: LogCategory; search?: string }) => {
        if (!filter) return logs;
        return logs.filter(entry => {
          if (filter.level && entry.level !== filter.level) return false;
          if (filter.category && entry.category !== filter.category) return false;
          if (filter.search) {
            const searchLower = filter.search.toLowerCase();
            return (
              entry.message.toLowerCase().includes(searchLower) ||
              (entry.data && JSON.stringify(entry.data).toLowerCase().includes(searchLower))
            );
          }
          return true;
        });
      },
      onLog: (callback: (entry: LogEntry) => void) => {
        logCallbacks.push(callback);
        return () => {
          const index = logCallbacks.indexOf(callback);
          if (index > -1) {
            logCallbacks.splice(index, 1);
          }
        };
      }
    }
  };
});

describe('Debug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    debug.clearLogs();
    debug.enable();
    debug.setLogLevels(['ERROR', 'WARN', 'INFO']);
    debug.setLogCategories(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);
  });

  it('should log messages with different levels', () => {
    debug.error('ERROR', 'Error message');
    debug.warn('NETWORK', 'Warning message');
    debug.info('PERFORMANCE', 'Info message');
    debug.debug('STATE', 'Debug message');
    debug.trace('CUSTOM', 'Trace message');

    const logs = debug.getLogs();
    expect(logs).toHaveLength(3); // Only ERROR, WARN, INFO are enabled by default
    expect(logs[0].level).toBe('ERROR');
    expect(logs[1].level).toBe('WARN');
    expect(logs[2].level).toBe('INFO');
  });

  it('should filter logs by level', () => {
    debug.error('ERROR', 'Error message');
    debug.warn('NETWORK', 'Warning message');
    debug.info('PERFORMANCE', 'Info message');
    debug.debug('STATE', 'Debug message');
    debug.trace('CUSTOM', 'Trace message');

    debug.setLogLevels(['ERROR', 'WARN']);
    const logs = debug.getLogs({ level: 'ERROR' });
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe('ERROR');
  });

  it('should filter logs by category', () => {
    debug.info('NETWORK', 'Network message');
    debug.info('STATE', 'State message');
    debug.info('PERFORMANCE', 'Performance message');
    debug.info('CUSTOM', 'Custom message');

    debug.setLogCategories(['NETWORK', 'STATE']);
    const logs = debug.getLogs({ category: 'NETWORK' });
    expect(logs).toHaveLength(1);
    expect(logs[0].category).toBe('NETWORK');
  });

  it('should handle console method overrides', () => {
    const originalConsoleLog = console.log;
    console.log('Test console.log');

    const logs = debug.getLogs({ category: 'CUSTOM' });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test console.log');

    console.log = originalConsoleLog;
  });

  it('should notify log callbacks', () => {
    const callback = jest.fn();
    const unsubscribe = debug.onLog(callback);

    debug.info('NETWORK', 'Test message');

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        level: 'INFO',
        category: 'NETWORK',
        message: 'Test message'
      })
    );

    unsubscribe();
  });

  it('should respect enabled state', () => {
    debug.disable();
    debug.info('NETWORK', 'Test message');

    const logs = debug.getLogs();
    expect(logs).toHaveLength(0);

    debug.enable();
    debug.info('NETWORK', 'Test message');

    const enabledLogs = debug.getLogs();
    expect(enabledLogs).toHaveLength(1);
  });

  it('should limit log history', () => {
    const maxLogs = 1000;
    for (let i = 0; i < maxLogs + 10; i++) {
      debug.info('NETWORK', `Message ${i}`);
    }

    const logs = debug.getLogs();
    expect(logs).toHaveLength(maxLogs);
  });

  it('should search logs by content', () => {
    debug.info('NETWORK', 'Test message 1', { data: 'test1' });
    debug.info('NETWORK', 'Test message 2', { data: 'test2' });
    debug.info('NETWORK', 'Different message', { data: 'test3' });

    const logs = debug.getLogs({ search: 'test2' });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test message 2');
  });
}); 