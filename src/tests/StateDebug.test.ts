import { StateDebugMonitor } from '../core/stateDebug';
import { debug } from '../core/debug';

jest.mock('../core/debug');

describe('StateDebugMonitor', () => {
  let monitor: StateDebugMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    monitor = new StateDebugMonitor();
  });

  afterEach(() => {
    monitor.destroy();
  });

  describe('trackStateChanges', () => {
    it('should track state changes', () => {
      const initialState = { count: 0 };
      const newState = { count: 1 };

      monitor.trackStateChanges('TestComponent', 'count', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'useState change in TestComponent',
        expect.objectContaining({
          type: 'useState',
          componentName: 'TestComponent',
          prevState: initialState,
          nextState: newState,
          diff: {
            updated: {
              count: { from: 0, to: 1 }
            }
          }
        })
      );
    });

    it('should handle nested state changes', () => {
      const initialState = { user: { name: 'John', age: 25 } };
      const newState = { user: { name: 'John', age: 26 } };

      monitor.trackStateChanges('TestComponent', 'user', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'useState change in TestComponent',
        expect.objectContaining({
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
        })
      );
    });

    it('should handle array state changes', () => {
      const initialState = { items: [1, 2, 3] };
      const newState = { items: [1, 2, 3, 4] };

      monitor.trackStateChanges('TestComponent', 'items', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'useState change in TestComponent',
        expect.objectContaining({
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
        })
      );
    });
  });

  describe('trackContextChanges', () => {
    it('should track context changes', () => {
      const initialContext = { theme: 'light' };
      const newContext = { theme: 'dark' };

      monitor.trackContextChanges('ThemeContext', initialContext, newContext);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'context change in ThemeContext',
        expect.objectContaining({
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
        })
      );
    });

    it('should handle complex context changes', () => {
      const initialContext = { user: { loggedIn: false } };
      const newContext = { user: { loggedIn: true, name: 'John' } };

      monitor.trackContextChanges('UserContext', initialContext, newContext);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'context change in UserContext',
        expect.objectContaining({
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
        })
      );
    });
  });

  describe('calculateDiff', () => {
    it('should return null if states are identical', () => {
      const state = { count: 1 };
      const changes = monitor.getChanges();
      expect(changes).toEqual([]);
    });

    it('should handle undefined and null values', () => {
      const initialState = { value: undefined };
      const newState = { value: null };

      monitor.trackStateChanges('TestComponent', 'value', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'useState change in TestComponent',
        expect.objectContaining({
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
        })
      );
    });
  });
}); 