import { debug } from '../core/debug';
jest.mock('../core/debug', function () {
    var logs = [];
    var logCallbacks = [];
    var enabled = true;
    var logLevels = new Set(['ERROR', 'WARN', 'INFO']);
    var logCategories = new Set(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);
    var createLogEntry = function (level, category, message, args) { return ({
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        level: level,
        category: category,
        message: message,
        data: args.length > 0 ? args : undefined
    }); };
    var addLog = function (entry) {
        if (!enabled || !logLevels.has(entry.level) || !logCategories.has(entry.category))
            return;
        logs.push(entry);
        logCallbacks.forEach(function (cb) { return cb(entry); });
    };
    return {
        debug: {
            clearLogs: function () {
                logs = [];
            },
            enable: function () {
                enabled = true;
            },
            disable: function () {
                enabled = false;
            },
            setLogLevels: function (levels) {
                logLevels = new Set(levels);
            },
            setLogCategories: function (categories) {
                logCategories = new Set(categories);
            },
            error: function (category, message) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                addLog(createLogEntry('ERROR', category, message, args));
            },
            warn: function (category, message) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                addLog(createLogEntry('WARN', category, message, args));
            },
            info: function (category, message) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                addLog(createLogEntry('INFO', category, message, args));
            },
            debug: function (category, message) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                addLog(createLogEntry('DEBUG', category, message, args));
            },
            trace: function (category, message) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                addLog(createLogEntry('TRACE', category, message, args));
            },
            getLogs: function (filter) {
                if (!filter)
                    return logs;
                return logs.filter(function (entry) {
                    if (filter.level && entry.level !== filter.level)
                        return false;
                    if (filter.category && entry.category !== filter.category)
                        return false;
                    if (filter.search) {
                        var searchLower = filter.search.toLowerCase();
                        return (entry.message.toLowerCase().includes(searchLower) ||
                            (entry.data && JSON.stringify(entry.data).toLowerCase().includes(searchLower)));
                    }
                    return true;
                });
            },
            onLog: function (callback) {
                logCallbacks.push(callback);
                return function () {
                    var index = logCallbacks.indexOf(callback);
                    if (index > -1) {
                        logCallbacks.splice(index, 1);
                    }
                };
            }
        }
    };
});
describe('Debug', function () {
    beforeEach(function () {
        jest.clearAllMocks();
        debug.clearLogs();
        debug.enable();
        debug.setLogLevels(['ERROR', 'WARN', 'INFO']);
        debug.setLogCategories(['ERROR', 'NETWORK', 'PERFORMANCE', 'STATE']);
    });
    it('should log messages with different levels', function () {
        debug.error('ERROR', 'Error message');
        debug.warn('NETWORK', 'Warning message');
        debug.info('PERFORMANCE', 'Info message');
        debug.debug('STATE', 'Debug message');
        debug.trace('CUSTOM', 'Trace message');
        var logs = debug.getLogs();
        expect(logs).toHaveLength(3); // Only ERROR, WARN, INFO are enabled by default
        expect(logs[0].level).toBe('ERROR');
        expect(logs[1].level).toBe('WARN');
        expect(logs[2].level).toBe('INFO');
    });
    it('should filter logs by level', function () {
        debug.error('ERROR', 'Error message');
        debug.warn('NETWORK', 'Warning message');
        debug.info('PERFORMANCE', 'Info message');
        debug.debug('STATE', 'Debug message');
        debug.trace('CUSTOM', 'Trace message');
        debug.setLogLevels(['ERROR', 'WARN']);
        var logs = debug.getLogs({ level: 'ERROR' });
        expect(logs).toHaveLength(1);
        expect(logs[0].level).toBe('ERROR');
    });
    it('should filter logs by category', function () {
        debug.info('NETWORK', 'Network message');
        debug.info('STATE', 'State message');
        debug.info('PERFORMANCE', 'Performance message');
        debug.info('CUSTOM', 'Custom message');
        debug.setLogCategories(['NETWORK', 'STATE']);
        var logs = debug.getLogs({ category: 'NETWORK' });
        expect(logs).toHaveLength(1);
        expect(logs[0].category).toBe('NETWORK');
    });
    it('should handle console method overrides', function () {
        var originalConsoleLog = console.log;
        console.log('Test console.log');
        var logs = debug.getLogs({ category: 'CUSTOM' });
        expect(logs).toHaveLength(1);
        expect(logs[0].message).toBe('Test console.log');
        console.log = originalConsoleLog;
    });
    it('should notify log callbacks', function () {
        var callback = jest.fn();
        var unsubscribe = debug.onLog(callback);
        debug.info('NETWORK', 'Test message');
        expect(callback).toHaveBeenCalledWith(expect.objectContaining({
            level: 'INFO',
            category: 'NETWORK',
            message: 'Test message'
        }));
        unsubscribe();
    });
    it('should respect enabled state', function () {
        debug.disable();
        debug.info('NETWORK', 'Test message');
        var logs = debug.getLogs();
        expect(logs).toHaveLength(0);
        debug.enable();
        debug.info('NETWORK', 'Test message');
        var enabledLogs = debug.getLogs();
        expect(enabledLogs).toHaveLength(1);
    });
    it('should limit log history', function () {
        var maxLogs = 1000;
        for (var i = 0; i < maxLogs + 10; i++) {
            debug.info('NETWORK', "Message ".concat(i));
        }
        var logs = debug.getLogs();
        expect(logs).toHaveLength(maxLogs);
    });
    it('should search logs by content', function () {
        debug.info('NETWORK', 'Test message 1', { data: 'test1' });
        debug.info('NETWORK', 'Test message 2', { data: 'test2' });
        debug.info('NETWORK', 'Different message', { data: 'test3' });
        var logs = debug.getLogs({ search: 'test2' });
        expect(logs).toHaveLength(1);
        expect(logs[0].message).toBe('Test message 2');
    });
});
//# sourceMappingURL=Debug.test.js.map