# Performance Monitoring

The Performance Monitoring system provides real-time insights into your Next.js application's performance metrics, including memory usage, render times, and network performance.

## Features

- 📊 Real-time performance metrics
- 🧠 Memory usage tracking
- ⚡ Component render timing
- 🌐 Network performance
- 🎯 FPS monitoring
- 📈 Visual graphs and charts

## Usage

### Basic Setup

```typescript
import { DebugSuiteProvider } from 'nextjs-debug-suite';

const config = {
  monitors: {
    performance: {
      enabled: true,
      trackMemory: true,
      trackFPS: true,
      trackNetwork: true,
      sampleRate: 1000,
    },
  },
};

function MyApp({ Component, pageProps }) {
  return (
    <DebugSuiteProvider config={config}>
      <Component {...pageProps} />
    </DebugSuiteProvider>
  );
}
```

### Component Performance Tracking

```typescript
import { usePerformanceMonitor } from 'nextjs-debug-suite';

function MyComponent() {
  const performance = usePerformanceMonitor('MyComponent');

  useEffect(() => {
    performance.trackRender();
    
    return () => {
      performance.stopTracking();
    };
  }, []);

  return <div>My Component</div>;
}
```

### Custom Metric Tracking

```typescript
import { usePerformanceMonitor } from 'nextjs-debug-suite';

function MyComponent() {
  const performance = usePerformanceMonitor('MyComponent');

  const handleExpensiveOperation = async () => {
    const trackId = performance.startMeasure('expensiveOperation');
    
    try {
      // Your expensive operation
      await someExpensiveTask();
    } finally {
      performance.endMeasure(trackId);
    }
  };

  return <button onClick={handleExpensiveOperation}>Start Operation</button>;
}
```

## Metrics

### 1. Memory Metrics
```typescript
interface MemoryMetrics {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  domNodes: number;
  detachedDomNodes: number;
}
```

### 2. Render Metrics
```typescript
interface RenderMetrics {
  component: string;
  renderTime: number;
  renderCount: number;
  lastRenderTimestamp: number;
  averageRenderTime: number;
  worstRenderTime: number;
}
```

### 3. Network Metrics
```typescript
interface NetworkMetrics {
  requestCount: number;
  totalTransferSize: number;
  averageResponseTime: number;
  slowestRequest: {
    url: string;
    duration: number;
  };
  failedRequests: number;
}
```

### 4. FPS Metrics
```typescript
interface FPSMetrics {
  current: number;
  average: number;
  worst: number;
  drops: number; // Frame drops
  timestamp: number;
}
```

## Visual Features

### 1. Performance Graphs
- Real-time updating graphs
- Multiple metric overlays
- Zoom and pan controls
- Threshold indicators

### 2. Memory Usage Visualization
- Heap size visualization
- Memory trends
- GC events marking
- Memory leaks detection

### 3. Component Render Times
- Tree visualization
- Highlight slow renders
- Render frequency heatmap
- Parent-child render relationships

## Configuration

```typescript
interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;        // ms
  maxDataPoints: number;     // For graphs
  
  memory: {
    enabled: boolean;
    trackDetachedDom: boolean;
    gcEvents: boolean;
  };
  
  renders: {
    enabled: boolean;
    threshold: number;       // ms
    trackHooks: boolean;
    trackEffects: boolean;
  };
  
  network: {
    enabled: boolean;
    slowRequestThreshold: number;  // ms
    trackPayloadSize: boolean;
  };
  
  fps: {
    enabled: boolean;
    dropThreshold: number;   // ms
    warningThreshold: number;// fps
  };
  
  visualization: {
    realtime: boolean;
    graphStyles: {
      lineColor: string;
      fillColor: string;
      textColor: string;
    };
    thresholds: {
      warning: number;
      error: number;
    };
  };
}
```

## Best Practices

### 1. Development Monitoring
```typescript
const config = {
  monitors: {
    performance: {
      enabled: process.env.NODE_ENV === 'development',
      sampleRate: 1000,
      maxDataPoints: 100,
    },
  },
};
```

### 2. Production Monitoring
```typescript
const config = {
  monitors: {
    performance: {
      enabled: true,
      sampleRate: 5000,
      maxDataPoints: 50,
      memory: {
        enabled: false,
      },
      renders: {
        enabled: true,
        threshold: 16, // Only track slow renders
      },
    },
  },
};
```

### 3. Critical Path Monitoring
```typescript
const config = {
  monitors: {
    performance: {
      enabled: true,
      sampleRate: 1000,
      renders: {
        enabled: true,
        criticalPaths: [
          'CheckoutFlow',
          'PaymentProcess',
          'UserAuthentication',
        ],
      },
    },
  },
};
```

## Performance Impact

The monitoring system is designed to have minimal impact on your application's performance:

1. **Sampling Rate**
   - Configurable sampling frequency
   - Smart throttling
   - Batch processing

2. **Memory Usage**
   - Efficient data structures
   - Automatic data pruning
   - Memory-conscious tracking

3. **CPU Usage**
   - Lightweight measurements
   - Background processing
   - Optimized calculations

## Troubleshooting

1. **High Memory Usage**
   - Reduce sampling rate
   - Decrease maxDataPoints
   - Disable unused monitors

2. **Performance Impact**
   - Increase sampling interval
   - Reduce tracking features
   - Use selective monitoring

3. **Data Accuracy**
   - Verify browser support
   - Check sampling rate
   - Validate configuration 