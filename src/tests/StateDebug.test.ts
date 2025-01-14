import { StateDebugMonitor } from '../core/stateDebug';
import { debug } from '../core/debug';

// Mock the debug module
jest.mock('../core/debug', () => ({
  debug: {
    log: jest.fn()
  }
}));

describe('StateDebugMonitor', () => {
  let monitor: StateDebugMonitor;

  beforeEach(() => {
    monitor = new StateDebugMonitor();
    (debug.log as jest.Mock).mockClear();
  });

  describe('trackState', () => {
    it('should track state changes', () => {
      const initialState = { count: 0 };
      const newState = { count: 1 };

      monitor.trackState('TestComponent', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'TestComponent state changed',
        {
          previous: initialState,
          current: newState,
          diff: { count: { from: 0, to: 1 } }
        }
      );
    });

    it('should handle nested state changes', () => {
      const initialState = { user: { name: 'John', age: 25 } };
      const newState = { user: { name: 'John', age: 26 } };

      monitor.trackState('TestComponent', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'TestComponent state changed',
        {
          previous: initialState,
          current: newState,
          diff: { user: { age: { from: 25, to: 26 } } }
        }
      );
    });

    it('should handle array state changes', () => {
      const initialState = { items: [1, 2, 3] };
      const newState = { items: [1, 2, 3, 4] };

      monitor.trackState('TestComponent', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'TestComponent state changed',
        {
          previous: initialState,
          current: newState,
          diff: { items: { length: { from: 3, to: 4 }, added: [4] } }
        }
      );
    });
  });

  describe('trackProps', () => {
    it('should track prop changes', () => {
      const initialProps = { title: 'Hello' };
      const newProps = { title: 'World' };

      monitor.trackProps('TestComponent', initialProps, newProps);

      expect(debug.log).toHaveBeenCalledWith(
        'PROPS',
        'TestComponent props changed',
        {
          previous: initialProps,
          current: newProps,
          diff: { title: { from: 'Hello', to: 'World' } }
        }
      );
    });

    it('should handle added props', () => {
      const initialProps = { title: 'Hello' };
      const newProps = { title: 'Hello', subtitle: 'World' };

      monitor.trackProps('TestComponent', initialProps, newProps);

      expect(debug.log).toHaveBeenCalledWith(
        'PROPS',
        'TestComponent props changed',
        {
          previous: initialProps,
          current: newProps,
          diff: { subtitle: { from: undefined, to: 'World' } }
        }
      );
    });

    it('should handle removed props', () => {
      const initialProps = { title: 'Hello', subtitle: 'World' };
      const newProps = { title: 'Hello' };

      monitor.trackProps('TestComponent', initialProps, newProps);

      expect(debug.log).toHaveBeenCalledWith(
        'PROPS',
        'TestComponent props changed',
        {
          previous: initialProps,
          current: newProps,
          diff: { subtitle: { from: 'World', to: undefined } }
        }
      );
    });
  });

  describe('trackContext', () => {
    it('should track context changes', () => {
      const initialContext = { theme: 'light' };
      const newContext = { theme: 'dark' };

      monitor.trackContext('ThemeContext', initialContext, newContext);

      expect(debug.log).toHaveBeenCalledWith(
        'CONTEXT',
        'ThemeContext value changed',
        {
          previous: initialContext,
          current: newContext,
          diff: { theme: { from: 'light', to: 'dark' } }
        }
      );
    });

    it('should handle complex context changes', () => {
      const initialContext = { user: { loggedIn: false } };
      const newContext = { user: { loggedIn: true, name: 'John' } };

      monitor.trackContext('UserContext', initialContext, newContext);

      expect(debug.log).toHaveBeenCalledWith(
        'CONTEXT',
        'UserContext value changed',
        {
          previous: initialContext,
          current: newContext,
          diff: {
            user: {
              loggedIn: { from: false, to: true },
              name: { from: undefined, to: 'John' }
            }
          }
        }
      );
    });
  });

  describe('getStateDiff', () => {
    it('should return null if states are identical', () => {
      const state = { count: 1 };
      const diff = monitor.getStateDiff(state, state);
      expect(diff).toBeNull();
      expect(debug.log).not.toHaveBeenCalled();
    });

    it('should handle undefined and null values', () => {
      const initialState = { value: undefined };
      const newState = { value: null };

      monitor.trackState('TestComponent', initialState, newState);

      expect(debug.log).toHaveBeenCalledWith(
        'STATE',
        'TestComponent state changed',
        {
          previous: initialState,
          current: newState,
          diff: { value: { from: undefined, to: null } }
        }
      );
    });
  });
}); 