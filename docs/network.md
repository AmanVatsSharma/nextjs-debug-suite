# Network Monitoring

The Network Monitoring system provides comprehensive tracking and analysis of all network requests in your Next.js application, including API calls, static asset loading, and data fetching.

## Features

- 🌐 Real-time request tracking
- 📊 Performance analytics
- 🔍 Request/Response inspection
- ⚠️ Error detection
- 📈 Visual timeline
- 🔄 WebSocket monitoring

## Usage

### Basic Setup

```typescript
import { DebugSuiteProvider } from 'nextjs-debug-suite';

const config = {
  monitors: {
    network: {
      enabled: true,
      includeHeaders: true,
      includeBodies: true,
      maxEntries: 100,
      ignorePatterns: [
        '/api/health',
        '/_next/static/.*',
      ],
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

### Request Tracking

```typescript
import { useNetworkMonitor } from 'nextjs-debug-suite';

function MyComponent() {
  const network = useNetworkMonitor();

  const fetchData = async () => {
    const trackingId = network.trackRequest({
      url: '/api/data',
      method: 'GET',
      tags: ['data-fetch', 'critical'],
    });

    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } catch (error) {
      network.markRequestFailed(trackingId, error);
      throw error;
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

### WebSocket Monitoring

```typescript
import { useNetworkMonitor } from 'nextjs-debug-suite';

function WebSocketComponent() {
  const network = useNetworkMonitor();

  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com');
    
    const cleanup = network.trackWebSocket(ws, {
      name: 'MainWebSocket',
      tags: ['realtime', 'chat'],
    });

    return () => {
      cleanup();
      ws.close();
    };
  }, []);

  return <div>WebSocket Component</div>;
}
```

## Network Metrics

### 1. Request Metrics
```typescript
interface RequestMetrics {
  id: string;
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status?: number;
  size?: number;
  type: 'xhr' | 'fetch' | 'websocket';
  tags?: string[];
}
```

### 2. Response Metrics
```typescript
interface ResponseMetrics {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  size: number;
  type: string;
  duration: number;
  cached: boolean;
}
```

### 3. Error Metrics
```typescript
interface ErrorMetrics {
  type: 'network' | 'timeout' | 'abort' | 'parse';
  message: string;
  code?: string;
  details?: any;
  retries?: number;
}
```

## Visual Features

### 1. Network Timeline
- Request waterfall
- Duration visualization
- Concurrent requests
- Resource types
- Error indicators

### 2. Request Details
- Headers inspection
- Payload viewer
- Response preview
- Timing breakdown
- Cookie information

### 3. Analytics Dashboard
- Request volume
- Success rates
- Average latency
- Bandwidth usage
- Error distribution

## Configuration

```typescript
interface NetworkConfig {
  enabled: boolean;
  maxEntries: number;
  
  tracking: {
    includeHeaders: boolean;
    includeBodies: boolean;
    maxBodySize: number;      // bytes
    ignorePatterns: string[];
    includeCookies: boolean;
  };
  
  websocket: {
    enabled: boolean;
    trackMessages: boolean;
    maxMessageSize: number;   // bytes
  };
  
  performance: {
    slowRequestThreshold: number;  // ms
    timeoutThreshold: number;      // ms
    retryTracking: boolean;
  };
  
  visualization: {
    realtime: boolean;
    maxTimelineItems: number;
    groupSimilarRequests: boolean;
    theme: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
  };
}
```

## Best Practices

### 1. Development Configuration
```typescript
const config = {
  monitors: {
    network: {
      enabled: true,
      includeHeaders: true,
      includeBodies: true,
      tracking: {
        ignorePatterns: [
          '/api/health',
          '/_next/static/.*',
          '\\.hot-update\\.json$',
        ],
      },
    },
  },
};
```

### 2. Production Configuration
```typescript
const config = {
  monitors: {
    network: {
      enabled: true,
      includeHeaders: false,
      includeBodies: false,
      maxEntries: 50,
      performance: {
        slowRequestThreshold: 1000,
        timeoutThreshold: 5000,
      },
    },
  },
};
```

### 3. Critical Path Monitoring
```typescript
const config = {
  monitors: {
    network: {
      enabled: true,
      criticalPaths: {
        '/api/checkout': {
          timeout: 3000,
          retries: 3,
          priority: 'high',
        },
        '/api/auth': {
          timeout: 2000,
          retries: 2,
          priority: 'high',
        },
      },
    },
  },
};
```

## Security Considerations

1. **Sensitive Data**
   - Filter authentication headers
   - Mask sensitive form data
   - Exclude security tokens

2. **Data Storage**
   - Limit response storage
   - Clear sensitive data
   - Implement data expiry

3. **Access Control**
   - Restrict debug access
   - Implement role-based viewing
   - Secure WebSocket monitoring

## Troubleshooting

1. **High Memory Usage**
   - Reduce maxEntries
   - Disable body tracking
   - Implement aggressive filtering

2. **Performance Impact**
   - Increase filtering
   - Reduce tracking detail
   - Disable real-time updates

3. **Missing Requests**
   - Check ignorePatterns
   - Verify tracking setup
   - Review browser support 