import { debug, LogLevel, LogCategory, LogEntry } from '../core/debug';

describe('Debug', () => {
  beforeEach(() => {
    debug.clearLogs();
    debug.enable();
    debug.setLogLevels(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']);
    debug.setLogCategories(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE', 'MEMORY', 'RESOURCES', 'PAINT', 'CUSTOM']);
  });

  it('should create log entries with correct structure', () => {
    debug.info('NETWORK', 'Test message', { data: 'test' });
    const logs = debug.getLogs();
    expect(logs).toHaveLength(1);

    const entry = logs[0];
    expect(entry).toMatchObject({
      level: 'INFO',
      category: 'NETWORK',
      message: 'Test message',
      data: { data: 'test' }
    });
    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();
    expect(entry.stackTrace).toBeDefined();
  });

  it('should filter logs by level', () => {
    debug.error('ERROR', 'Error message');
    debug.warn('NETWORK', 'Warning message');
    debug.info('STATE', 'Info message');
    debug.debug('PERFORMANCE', 'Debug message');
    debug.trace('CUSTOM', 'Trace message');

    debug.setLogLevels(['ERROR', 'WARN']);
    const logs = debug.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs[0].level).toBe('WARN');
    expect(logs[1].level).toBe('ERROR');
  });

  it('should filter logs by category', () => {
    debug.info('NETWORK', 'Network message');
    debug.info('STATE', 'State message');
    debug.info('PERFORMANCE', 'Performance message');

    debug.setLogCategories(['NETWORK', 'STATE']);
    const logs = debug.getLogs();
    expect(logs).toHaveLength(2);
    expect(logs.map(log => log.category)).toEqual(['STATE', 'NETWORK']);
  });

  it('should search logs by message and data', () => {
    debug.info('NETWORK', 'Test network request', { url: 'https://api.example.com' });
    debug.info('STATE', 'State update', { component: 'TestComponent' });
    debug.info('PERFORMANCE', 'Performance metric', { duration: 100 });

    const logs = debug.getLogs({ search: 'network' });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test network request');
  });

  it('should notify callbacks when new logs are added', () => {
    const callback = jest.fn();
    const unsubscribe = debug.onLog(callback);

    debug.info('NETWORK', 'Test message');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({
      level: 'INFO',
      category: 'NETWORK',
      message: 'Test message'
    }));

    unsubscribe();
    debug.info('NETWORK', 'Another message');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should limit the number of stored logs', () => {
    const maxLogs = 1000;
    for (let i = 0; i < maxLogs + 10; i++) {
      debug.info('CUSTOM', `Message ${i}`);
    }

    const logs = debug.getLogs();
    expect(logs).toHaveLength(maxLogs);
    expect(logs[0].message).toBe(`Message ${maxLogs + 9}`);
    expect(logs[maxLogs - 1].message).toBe(`Message 10`);
  });

  it('should handle console method overrides', () => {
    const originalConsoleLog = console.log;
    const mockConsoleLog = jest.fn();
    console.log = mockConsoleLog;

    console.log('Test console.log');
    expect(mockConsoleLog).toHaveBeenCalledWith('Test console.log');
    
    const logs = debug.getLogs({ category: 'CUSTOM' });
    expect(logs).toHaveLength(1);
    expect(logs[0].message).toBe('Test console.log');

    console.log = originalConsoleLog;
  });

  it('should disable and enable logging', () => {
    debug.disable();
    debug.info('NETWORK', 'Test message');
    expect(debug.getLogs()).toHaveLength(0);

    debug.enable();
    debug.info('NETWORK', 'Test message');
    expect(debug.getLogs()).toHaveLength(1);
  });
}); 