import { debug } from '../core/debug';
import type { LogEntry } from '../core/debug';

jest.mock('../core/debug');

describe('Debug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    debug.clearLogs();
    debug.enable();
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