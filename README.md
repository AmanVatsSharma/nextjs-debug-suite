# Next.js Debug Suite 🔍

> **⚠️ Beta Release Notice**: This is a beta version (0.1.0-beta.1) of the Next.js Debug Suite. While the core functionality is production-ready, we are actively working on improving test coverage and stability. If you encounter any issues, please contact our support team through [GitHub Issues](https://github.com/AmanVatsSharma/nextjs-debug-suite/issues) or email at aman95026@gmail.com. Your feedback is valuable in making this package more robust.

A comprehensive debugging and monitoring solution for Next.js applications, featuring AI-powered error analysis, performance monitoring, network tracking, and visual debugging tools.

[![npm version](https://badge.fury.io/js/next-debug-suite.svg)](https://www.npmjs.com/package/next-debug-suite)
[![GitHub](https://img.shields.io/github/license/AmanVatsSharma/nextjs-debug-suite)](https://github.com/AmanVatsSharma/nextjs-debug-suite/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/AmanVatsSharma/nextjs-debug-suite)](https://github.com/AmanVatsSharma/nextjs-debug-suite/issues)

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
npm install next-debug-suite@beta

# Using yarn
yarn add next-debug-suite@beta

# Using pnpm
pnpm add next-debug-suite@beta
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

Please read our [Contributing Guide](https://github.com/AmanVatsSharma/nextjs-debug-suite/blob/main/CONTRIBUTING.md) before submitting a Pull Request to the project.

## License 📄

MIT © [Your Name/Organization]

## Support 💬

If you have any questions or need help with setup, feel free to:

- [Open an issue](https://github.com/AmanVatsSharma/nextjs-debug-suite/issues)
- [Start a discussion](https://github.com/AmanVatsSharma/nextjs-debug-suite/discussions)

## Support 💬

- [GitHub Issues](https://github.com/yourusername/nextjs-debug-suite/issues)
- [Documentation](./docs)
- [Examples](./examples) 