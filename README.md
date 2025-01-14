# Next.js Debug Suite 🔍

A comprehensive debugging and monitoring solution for Next.js applications, featuring AI-powered error analysis, performance monitoring, network tracking, and visual debugging tools.

[![npm version](https://badge.fury.io/js/nextjs-debug-suite.svg)](https://badge.fury.io/js/nextjs-debug-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features 🚀

- 🎯 **Visual Debug Interface** - Draggable and resizable debug overlay
- 🧬 **Error DNA System** - Advanced error tracking with AI-powered analysis
- 📊 **Performance Monitoring** - Real-time performance metrics and visualization
- 🌐 **Network Monitoring** - Track and analyze network requests
- 🔄 **State Debugging** - Monitor and track state changes
- 🤖 **AI Integration** - Intelligent error analysis and fix suggestions
- 🎨 **Customizable Themes** - Light, dark, and system themes

## Installation 📦

```bash
# Using npm
npm install nextjs-debug-suite

# Using yarn
yarn add nextjs-debug-suite

# Using pnpm
pnpm add nextjs-debug-suite
```

## Quick Start 🚀

1. Wrap your Next.js application with the `DebugSuiteProvider`:

```tsx
// pages/_app.tsx
import { DebugSuiteProvider } from 'nextjs-debug-suite';

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

function MyApp({ Component, pageProps }) {
  return (
    <DebugSuiteProvider config={config}>
      <Component {...pageProps} />
    </DebugSuiteProvider>
  );
}

export default MyApp;
```

2. Use the debug hooks in your components:

```tsx
import { useDebugger } from 'nextjs-debug-suite';

function MyComponent() {
  const debug = useDebugger('MyComponent');

  useEffect(() => {
    debug.log('Component mounted');
    return () => debug.log('Component unmounted');
  }, []);

  return <div>My Component</div>;
}
```

## Configuration ⚙️

### Basic Configuration

```typescript
interface DebugConfig {
  overlay: {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    size: { width: number; height: number };
    opacity: number;
    theme: 'dark' | 'light' | 'system';
    tabs: Array<'errors' | 'performance' | 'network' | 'console' | 'ai'>;
  };
  monitors: {
    memory: boolean;
    performance: boolean;
    network: boolean;
    console: boolean;
    renders: boolean;
  };
  ai: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'custom';
    features: Array<'analysis' | 'fixes' | 'docs' | 'prediction'>;
  };
}
```

See [Configuration Guide](./docs/configuration.md) for detailed configuration options.

## Features Documentation 📚

- [Error DNA System](./docs/error-dna.md)
- [Performance Monitoring](./docs/performance.md)
- [Network Monitoring](./docs/network.md)
- [State Debugging](./docs/state.md)
- [AI Integration](./docs/ai-integration.md)

## API Reference 📖

- [Debug Hooks](./docs/api/hooks.md)
- [Components](./docs/api/components.md)
- [Utilities](./docs/api/utilities.md)

## Keyboard Shortcuts ⌨️

- `Ctrl + Shift + D` - Toggle debug overlay
- `Ctrl + Shift + P` - Pin/unpin overlay
- `Ctrl + Shift + C` - Clear current tab data
- `Ctrl + Shift + E` - Export current tab data

## Best Practices 🎯

1. **Development Only**
   ```typescript
   const config = {
     enabled: process.env.NODE_ENV === 'development',
     // ...other config
   };
   ```

2. **Performance Considerations**
   - Use selective monitoring in production
   - Implement log rotation for long sessions
   - Clear data periodically

3. **Security**
   - Never log sensitive information
   - Sanitize network request/response data
   - Secure AI API keys

## Contributing 🤝

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## License 📄

MIT © [Your Name/Organization]

## Support 💬

- [GitHub Issues](https://github.com/yourusername/nextjs-debug-suite/issues)
- [Documentation](./docs)
- [Examples](./examples) 