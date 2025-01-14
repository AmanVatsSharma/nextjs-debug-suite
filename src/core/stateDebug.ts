import { debug } from './debug';

export interface StateChange {
  id: string;
  timestamp: number;
  type: 'redux' | 'context' | 'useState' | 'custom';
  componentName?: string;
  action?: {
    type: string;
    payload?: any;
  };
  prevState: any;
  nextState: any;
  diff?: {
    added?: Record<string, any>;
    removed?: Record<string, any>;
    updated?: Record<string, any>;
  };
}

export class StateDebugMonitor {
  private debug = debug;
  private changes: StateChange[] = [];
  private maxChanges = 1000;
  private changeCallbacks: ((change: StateChange) => void)[] = [];
  private reduxMiddleware?: any;
  private contextPatches = new Map<string, any>();

  trackReduxChanges() {
    this.reduxMiddleware = (store: any) => (next: any) => (action: any) => {
      const prevState = store.getState();
      const result = next(action);
      const nextState = store.getState();

      this.captureChange({
        type: 'redux',
        action: {
          type: action.type,
          payload: action.payload
        },
        prevState,
        nextState
      });

      return result;
    };

    return this.reduxMiddleware;
  }

  trackContextChanges(contextName: string, prevValue: any, nextValue: any) {
    const patch = this.contextPatches.get(contextName);
    const timestamp = Date.now();

    if (patch && timestamp - patch.timestamp < 100) {
      // Debounce rapid context changes
      this.contextPatches.set(contextName, {
        timestamp,
        prevValue: patch.prevValue,
        nextValue
      });
    } else {
      this.contextPatches.set(contextName, {
        timestamp,
        prevValue,
        nextValue
      });

      this.captureChange({
        type: 'context',
        componentName: contextName,
        prevState: prevValue,
        nextState: nextValue
      });
    }
  }

  trackStateChanges(componentName: string, hookId: string, prevState: any, nextState: any) {
    this.captureChange({
      type: 'useState',
      componentName,
      action: { type: `${componentName}:${hookId}` },
      prevState,
      nextState
    });
  }

  trackCustomChanges(name: string, prevState: any, nextState: any, metadata?: Record<string, any>) {
    this.captureChange({
      type: 'custom',
      componentName: name,
      prevState,
      nextState,
      ...metadata
    });
  }

  private captureChange(change: Partial<StateChange>) {
    const timestamp = Date.now();
    const id = Math.random().toString(36).substring(7);

    const stateChange: StateChange = {
      id,
      timestamp,
      type: change.type || 'custom',
      componentName: change.componentName,
      action: change.action,
      prevState: change.prevState,
      nextState: change.nextState,
      diff: this.calculateDiff(change.prevState, change.nextState)
    };

    this.changes.unshift(stateChange);
    if (this.changes.length > this.maxChanges) {
      this.changes = this.changes.slice(0, this.maxChanges);
    }

    this.debug.log('STATE', `${stateChange.type} change in ${stateChange.componentName || 'unknown'}`, stateChange);
    this.notifyChangeCallbacks(stateChange);
  }

  private calculateDiff(prev: any, next: any): StateChange['diff'] {
    if (!prev || !next) return {};
    
    const added: Record<string, any> = {};
    const removed: Record<string, any> = {};
    const updated: Record<string, any> = {};

    // Find added and updated
    Object.keys(next).forEach(key => {
      if (!(key in prev)) {
        added[key] = next[key];
      } else if (prev[key] !== next[key]) {
        updated[key] = {
          from: prev[key],
          to: next[key]
        };
      }
    });

    // Find removed
    Object.keys(prev).forEach(key => {
      if (!(key in next)) {
        removed[key] = prev[key];
      }
    });

    return {
      added: Object.keys(added).length ? added : undefined,
      removed: Object.keys(removed).length ? removed : undefined,
      updated: Object.keys(updated).length ? updated : undefined
    };
  }

  getChanges(filter?: {
    type?: StateChange['type'];
    componentName?: string;
    actionType?: string;
  }): StateChange[] {
    if (!filter) return this.changes;

    return this.changes.filter(change => {
      if (filter.type && change.type !== filter.type) return false;
      if (filter.componentName && change.componentName !== filter.componentName) return false;
      if (filter.actionType && change.action?.type !== filter.actionType) return false;
      return true;
    });
  }

  getChange(id: string): StateChange | undefined {
    return this.changes.find(change => change.id === id);
  }

  getLatestChange(componentName?: string): StateChange | undefined {
    if (componentName) {
      return this.changes.find(change => change.componentName === componentName);
    }
    return this.changes[0];
  }

  clearChanges() {
    this.changes = [];
    this.contextPatches.clear();
  }

  onChange(callback: (change: StateChange) => void) {
    this.changeCallbacks.push(callback);
    return () => {
      const index = this.changeCallbacks.indexOf(callback);
      if (index > -1) {
        this.changeCallbacks.splice(index, 1);
      }
    };
  }

  private notifyChangeCallbacks(change: StateChange) {
    this.changeCallbacks.forEach(callback => callback(change));
  }

  destroy() {
    this.changeCallbacks = [];
    this.clearChanges();
  }
} 