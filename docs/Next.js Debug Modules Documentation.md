# Next.js Debug Modules System

## Overview
A comprehensive debugging system for Next.js applications that provides specialized debugging modules for different aspects of application development. The system includes various debugger types and a unified interface for managing them.

## Core Modules

### 1. Base Debug Monitor (`debug.ts`)
```typescript
const DEBUG = process.env.NODE_ENV === 'development';

interface DebugLog {
  timestamp: number;
  type: string;
  message: string;
  data?: any;
  source?: string;
  stackTrace?: string;
}

interface DebugOptions {
  console: boolean;
  persist: boolean;
  maxLogs?: number;
  logLevel: 'verbose' | 'normal' | 'minimal';
}

class DebugMonitor {
  private static instance: DebugMonitor;
  private logs: DebugLog[] = [];
  private subscribers: ((log: DebugLog) => void)[] = [];
  private options: DebugOptions;

  private constructor(options: Partial<DebugOptions> = {}) {
    this.options = {
      console: true,
      persist: false,
      maxLogs: 1000,
      logLevel: 'normal',
      ...options
    };

    if (typeof window !== 'undefined') {
      (window as any).__debugMonitor = this;
    }
  }

  static getInstance(options?: Partial<DebugOptions>): DebugMonitor {
    if (!DebugMonitor.instance) {
      DebugMonitor.instance = new DebugMonitor(options);
    }
    return DebugMonitor.instance;
  }

  log(type: string, message: string, data?: any) {
    if (!DEBUG) return;
    
    const log: DebugLog = {
      timestamp: Date.now(),
      type,
      message,
      data,
      stackTrace: new Error().stack,
      source: this.getCallerInfo()
    };

    this.logs.push(log);
    if (this.options.console) {
      console.log(`[${type}] ${message}`, data);
    }
    this.notifySubscribers(log);
    this.maintainLogLimit();
  }

  private getCallerInfo(): string {
    const error = new Error();
    const stack = error.stack?.split('\n')[3];
    return stack?.trim() || 'unknown';
  }

  private maintainLogLimit() {
    if (this.options.maxLogs && this.logs.length > this.options.maxLogs) {
      this.logs = this.logs.slice(-this.options.maxLogs);
    }
  }

  subscribe(callback: (log: DebugLog) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(log: DebugLog) {
    this.subscribers.forEach(sub => sub(log));
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }

  setOptions(options: Partial<DebugOptions>) {
    this.options = { ...this.options, ...options };
  }
}

export const debug = DebugMonitor.getInstance();
export const useDebugger = (componentName: string) => {
  return {
    log: (message: string, data?: any) => debug.log(componentName, message, data),
    error: (message: string, error?: any) => debug.log(`${componentName}:ERROR`, message, error),
    warn: (message: string, data?: any) => debug.log(`${componentName}:WARN`, message, data),
    info: (message: string, data?: any) => debug.log(`${componentName}:INFO`, message, data),
  };
};
```

### 2. Performance Monitor (`performanceMonitor.ts`)

The Performance Monitor provides comprehensive performance tracking capabilities for your Next.js application:

```typescript
class PerformanceMonitor {
  startMeasure(name: string): void
  endMeasure(name: string): number | null
  trackComponentRender(componentName: string): { mount: () => void, unmount: () => void }
  trackMemory(): void
  trackResourceTiming(): Promise<void>
  trackFirstPaint(): () => void
  onPaintMetric(callback: (entry: PerformanceEntry) => void): () => void
  getLogs(type?: string): PerformanceLog[]
  clearLogs(): void
}
```

Example usage:

```typescript
import { PerformanceMonitor } from './performanceMonitor';

const monitor = new PerformanceMonitor();
const tracker = monitor.trackComponentRender('HeavyComponent');

// In your component
useEffect(() => {
  tracker.mount();
  return () => tracker.unmount();
}, []);
```

### 3. Network Monitor (`networkMonitor.ts`)

The Network Monitor provides comprehensive network request tracking:

```typescript
class NetworkMonitor {
  getRequests(): NetworkRequest[]
  clearRequests(): void
  onRequest(callback: (request: NetworkRequest) => void): () => void
  destroy(): void
}
```

Example usage:

```typescript
import { NetworkMonitor } from './networkMonitor';

const monitor = new NetworkMonitor();
monitor.onRequest((request) => {
  console.log(`Request ${request.method} ${request.url} completed in ${request.duration}ms`);
});
```

### 4. State Debug Monitor (`stateDebug.ts`)
```typescript
interface StateChange {
  component: string;
  property: string;
  previousValue: any;
  newValue: any;
  timestamp: number;
}

class StateDebugMonitor extends DebugMonitor {
  private stateHistory: StateChange[] = [];

  trackState<T>(
    componentName: string,
    propertyName: string,
    value: T,
    previousValue: T
  ) {
    const change: StateChange = {
      component: componentName,
      property: propertyName,
      previousValue,
      newValue: value,
      timestamp: Date.now()
    };

    this.stateHistory.push(change);
    this.log('STATE', `State change in ${componentName}`, change);
  }

  getStateHistory(componentName?: string) {
    return componentName
      ? this.stateHistory.filter(change => change.component === componentName)
      : this.stateHistory;
  }

  clearStateHistory() {
    this.stateHistory = [];
  }
}
```

### 5. Debug UI Manager (`debugUI.tsx`)
```typescript
import React, { useState, useEffect } from 'react';

interface DebugUIProps {
  monitors: {
    base?: boolean;
    performance?: boolean;
    network?: boolean;
    state?: boolean;
  };
}

export const DebugUI: React.FC<DebugUIProps> = ({ monitors }) => {
  const [activeTab, setActiveTab] = useState('base');
  const [logs, setLogs] = useState<DebugLog[]>([]);

  useEffect(() => {
    const unsubscribe = debug.subscribe((log) => {
      setLogs(current => [...current, log]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="debug-ui">
      <div className="debug-tabs">
        {Object.entries(monitors).map(([key, enabled]) => (
          enabled && (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={activeTab === key ? 'active' : ''}
            >
              {key}
            </button>
          )
        ))}
      </div>
      <div className="debug-content">
        {/* Render appropriate content based on activeTab */}
      </div>
    </div>
  );
};
```

## Usage Examples

### Basic Usage
```typescript
// In your component
import { useDebugger } from './debug';

function MyComponent() {
  const debug = useDebugger('MyComponent');

  useEffect(() => {
    debug.log('Component mounted');
    return () => debug.log('Component unmounted');
  }, []);

  return <div>My Component</div>;
}
```

### Performance Tracking
```typescript
import { performanceDebug } from './performanceDebug';

function HeavyComponent() {
  const tracker = performanceDebug.trackComponentRender('HeavyComponent');

  useEffect(() => {
    tracker.mount();
    return () => tracker.unmount();
  }, []);

  return <div>Heavy Component</div>;
}
```

### Network Tracking
```typescript
import { networkDebug } from './networkDebug';

async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    networkDebug.log('API_ERROR', 'Failed to fetch data', error);
    throw error;
  }
}
```

### State Tracking
```typescript
import { stateDebug } from './stateDebug';
import { useState, useEffect } from 'react';

function StatefulComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    stateDebug.trackState('StatefulComponent', 'count', count, count - 1);
  }, [count]);

  return <div>Count: {count}</div>;
}
```

## Integration

### Setup Debug UI
```typescript
// pages/_app.tsx
import { DebugUI } from './debugUI';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && (
        <DebugUI
          monitors={{
            base: true,
            performance: true,
            network: true,
            state: true
          }}
        />
      )}
    </>
  );
}
```

## Configuration
```typescript
// debug.config.ts
export const debugConfig = {
  monitors: {
    base: {
      enabled: true,
      console: true,
      persist: false,
      maxLogs: 1000
    },
    performance: {
      enabled: true,
      trackMemory: true,
      sampleRate: 1000
    },
    network: {
      enabled: true,
      ignoreUrls: ['/api/health'],
      maxResponseSize: 1024 * 1024
    },
    state: {
      enabled: true,
      maxHistory: 100
    }
  },
  ui: {
    position: 'bottom-right',
    theme: 'dark',
    shortcut: 'ctrl+shift+d'
  }
};
```

## Best Practices

1. **Selective Debugging**
   - Enable only needed monitors
   - Use appropriate log levels
   - Clear logs periodically

2. **Performance Considerations**
   - Use sampling for performance monitoring
   - Limit log history
   - Disable in production

3. **Security**
   - Never log sensitive information
   - Sanitize network logs
   - Use appropriate log levels

4. **Maintainability**
   - Use consistent naming
   - Group related logs
   - Add context to logs

Would you like me to:
1. Add more specialized debug monitors?
2. Enhance the UI components?
3. Add more configuration options?
4. Include additional usage examples?