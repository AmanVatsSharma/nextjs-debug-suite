# Configuration Guide

This guide covers all configuration options available in the Next.js Debug Suite.

## Basic Configuration

The debug suite is configured through the `config` prop of the `DebugSuiteProvider`:

```typescript
const config = {
  overlay: {
    position: 'bottom-right',
    theme: 'dark',
    opacity: 0.9,
  },
  monitors: {
    performance: true,
    network: true,
    console: true,
  },
  ai: {
    enabled: true,
    provider: 'openai',
  },
};
```

## Full Configuration Reference

### Overlay Configuration

```typescript
interface OverlayConfig {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size: {
    width: number;  // Default: 400
    height: number; // Default: 600
  };
  opacity: number;  // 0-1, Default: 0.9
  theme: 'dark' | 'light' | 'system';
  tabs: Array<'errors' | 'performance' | 'network' | 'console' | 'ai'>;
  shortcuts: {
    toggle: string;    // Default: 'ctrl+shift+d'
    pin: string;       // Default: 'ctrl+shift+p'
    clear: string;     // Default: 'ctrl+shift+c'
    export: string;    // Default: 'ctrl+shift+e'
  };
}
```

### Monitors Configuration

```typescript
interface MonitorsConfig {
  memory: {
    enabled: boolean;
    sampleRate: number;     // ms, Default: 1000
    maxDataPoints: number;  // Default: 100
  };
  performance: {
    enabled: boolean;
    trackMemory: boolean;
    trackFPS: boolean;
    trackNetwork: boolean;
    sampleRate: number;     // ms, Default: 1000
  };
  network: {
    enabled: boolean;
    maxEntries: number;     // Default: 100
    ignorePatterns: string[];
    includeHeaders: boolean;
    includeBodies: boolean;
  };
  console: {
    enabled: boolean;
    maxEntries: number;     // Default: 1000
    logLevels: Array<'log' | 'info' | 'warn' | 'error'>;
  };
  renders: {
    enabled: boolean;
    trackHooks: boolean;
    trackEffects: boolean;
  };
}
```

### AI Configuration

```typescript
interface AIConfig {
  enabled: boolean;
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  features: Array<'analysis' | 'fixes' | 'docs' | 'prediction'>;
  options: {
    model?: string;           // Default: 'gpt-4'
    temperature?: number;     // Default: 0.7
    maxTokens?: number;       // Default: 2048
    customEndpoint?: string;  // For custom providers
  };
}
```

## Environment Variables

```env
# AI Provider Keys
NEXT_DEBUG_OPENAI_KEY=your_openai_key
NEXT_DEBUG_ANTHROPIC_KEY=your_anthropic_key

# Feature Flags
NEXT_DEBUG_ENABLED=true
NEXT_DEBUG_AI_ENABLED=true

# Performance
NEXT_DEBUG_SAMPLE_RATE=1000
NEXT_DEBUG_MAX_ENTRIES=1000
```

## Usage Examples

### Development Only Configuration

```typescript
const config = {
  enabled: process.env.NODE_ENV === 'development',
  overlay: {
    position: 'bottom-right',
    theme: 'system',
  },
  monitors: {
    performance: true,
    network: {
      enabled: true,
      ignorePatterns: ['/api/health', '/_next/static/.*'],
    },
  },
};
```

### Production Safe Configuration

```typescript
const config = {
  enabled: true,
  overlay: {
    position: 'bottom-right',
    opacity: 0.8,
  },
  monitors: {
    performance: {
      enabled: true,
      sampleRate: 5000,
      trackMemory: false,
    },
    network: {
      enabled: true,
      includeHeaders: false,
      includeBodies: false,
    },
    console: false,
  },
  ai: {
    enabled: false,
  },
};
```

### Custom Theme Configuration

```typescript
const config = {
  overlay: {
    theme: 'custom',
    customTheme: {
      colors: {
        background: '#1a1a1a',
        text: '#ffffff',
        primary: '#61dafb',
        secondary: '#282c34',
        error: '#ff6b6b',
        warning: '#ffd93d',
        success: '#6bff6b',
      },
      fonts: {
        main: 'Inter, system-ui, sans-serif',
        code: 'JetBrains Mono, monospace',
      },
    },
  },
};
``` 