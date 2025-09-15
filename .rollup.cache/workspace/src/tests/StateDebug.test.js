import { StateDebugMonitor } from '../core/stateDebug';
import { debug } from '../core/debug';
jest.mock('../core/debug');
describe('StateDebugMonitor', function () {
    var monitor;
    beforeEach(function () {
        jest.clearAllMocks();
        monitor = new StateDebugMonitor();
    });
    afterEach(function () {
        monitor.destroy();
    });
    describe('trackStateChanges', function () {
        it('should track state changes', function () {
            var initialState = { count: 0 };
            var newState = { count: 1 };
            monitor.trackStateChanges('TestComponent', 'count', initialState, newState);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'useState change in TestComponent', expect.objectContaining({
                type: 'useState',
                componentName: 'TestComponent',
                prevState: initialState,
                nextState: newState,
                diff: {
                    updated: {
                        count: { from: 0, to: 1 }
                    }
                }
            }));
        });
        it('should handle nested state changes', function () {
            var initialState = { user: { name: 'John', age: 25 } };
            var newState = { user: { name: 'John', age: 26 } };
            monitor.trackStateChanges('TestComponent', 'user', initialState, newState);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'useState change in TestComponent', expect.objectContaining({
                type: 'useState',
                componentName: 'TestComponent',
                prevState: initialState,
                nextState: newState,
                diff: {
                    updated: {
                        user: {
                            from: { name: 'John', age: 25 },
                            to: { name: 'John', age: 26 }
                        }
                    }
                }
            }));
        });
        it('should handle array state changes', function () {
            var initialState = { items: [1, 2, 3] };
            var newState = { items: [1, 2, 3, 4] };
            monitor.trackStateChanges('TestComponent', 'items', initialState, newState);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'useState change in TestComponent', expect.objectContaining({
                type: 'useState',
                componentName: 'TestComponent',
                prevState: initialState,
                nextState: newState,
                diff: {
                    updated: {
                        items: {
                            from: [1, 2, 3],
                            to: [1, 2, 3, 4]
                        }
                    }
                }
            }));
        });
    });
    describe('trackContextChanges', function () {
        it('should track context changes', function () {
            var initialContext = { theme: 'light' };
            var newContext = { theme: 'dark' };
            monitor.trackContextChanges('ThemeContext', initialContext, newContext);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'context change in ThemeContext', expect.objectContaining({
                type: 'context',
                componentName: 'ThemeContext',
                prevState: initialContext,
                nextState: newContext,
                diff: {
                    updated: {
                        theme: {
                            from: 'light',
                            to: 'dark'
                        }
                    }
                }
            }));
        });
        it('should handle complex context changes', function () {
            var initialContext = { user: { loggedIn: false } };
            var newContext = { user: { loggedIn: true, name: 'John' } };
            monitor.trackContextChanges('UserContext', initialContext, newContext);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'context change in UserContext', expect.objectContaining({
                type: 'context',
                componentName: 'UserContext',
                prevState: initialContext,
                nextState: newContext,
                diff: {
                    updated: {
                        user: {
                            from: { loggedIn: false },
                            to: { loggedIn: true, name: 'John' }
                        }
                    }
                }
            }));
        });
    });
    describe('calculateDiff', function () {
        it('should return null if states are identical', function () {
            var state = { count: 1 };
            var changes = monitor.getChanges();
            expect(changes).toEqual([]);
        });
        it('should handle undefined and null values', function () {
            var initialState = { value: undefined };
            var newState = { value: null };
            monitor.trackStateChanges('TestComponent', 'value', initialState, newState);
            expect(debug.log).toHaveBeenCalledWith('STATE', 'useState change in TestComponent', expect.objectContaining({
                type: 'useState',
                componentName: 'TestComponent',
                prevState: initialState,
                nextState: newState,
                diff: {
                    updated: {
                        value: {
                            from: undefined,
                            to: null
                        }
                    }
                }
            }));
        });
    });
});
//# sourceMappingURL=StateDebug.test.js.map