# Error DNA System

The Error DNA System is a sophisticated error tracking and analysis system that provides deep insights into errors in your Next.js application.

## Overview

The Error DNA System captures not just the error itself, but also:
- The complete error context
- Dependencies involved
- Code preview with syntax highlighting
- AI-powered analysis and fix suggestions
- Visual dependency graph
- Stack trace visualization

## Features

### 1. Error Capture
```typescript
interface ErrorDNA {
  id: string;
  timestamp: number;
  type: 'runtime' | 'build' | 'type' | 'network' | 'performance';
  location: {
    file: string;
    line: number;
    column: number;
    functionName: string;
    component?: string;
  };
}
```

### 2. Dependency Analysis
```typescript
interface DependencyInfo {
  nodes: {
    [id: string]: {
      id: string;
      name: string;
      type: 'component' | 'hook' | 'function' | 'module';
      dependencies: string[];
    };
  };
  edges: Array<{
    from: string;
    to: string;
    type: 'imports' | 'calls' | 'renders' | 'uses';
  }>;
}
```

### 3. Visual Representation
```typescript
interface VisualData {
  codePreview: string;
  highlightedLines: number[];
  dependencies: DependencyGraph;
  stackTrace: VisualStack;
}
```

## Usage

### Basic Error Tracking

```typescript
import { useDebugger } from 'nextjs-debug-suite';

function MyComponent() {
  const debug = useDebugger('MyComponent');

  try {
    // Your code
  } catch (error) {
    debug.error('Failed to process data', error);
  }
}
```

### Custom Error Tracking

```typescript
import { useErrorDNA } from 'nextjs-debug-suite';

function MyComponent() {
  const { trackError, analyzeError } = useErrorDNA();

  const handleError = async (error: Error) => {
    const errorDNA = await trackError(error);
    const analysis = await analyzeError(errorDNA);
    
    console.log('Error Analysis:', analysis);
  };
}
```

### Error Boundary Integration

```typescript
import { ErrorBoundary } from 'nextjs-debug-suite';

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div>
          <h1>Something went wrong</h1>
          <button onClick={reset}>Try again</button>
        </div>
      )}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## AI Integration

The Error DNA System integrates with AI services to provide:

1. **Error Analysis**
   - Root cause identification
   - Context understanding
   - Impact assessment

2. **Fix Suggestions**
   - Code-level fix proposals
   - Best practices recommendations
   - Similar issue references

3. **Documentation Links**
   - Relevant documentation
   - Stack Overflow references
   - GitHub issues

## Visual Features

### 1. Dependency Graph
- Interactive visualization of dependencies
- Highlight error path
- Zoom and pan controls
- Node filtering

### 2. Stack Trace Visualization
- Collapsible stack frames
- Source code preview
- Line highlighting
- Jump to source

### 3. Code Preview
- Syntax highlighting
- Error line highlighting
- Context lines
- Copy to clipboard

## Configuration

```typescript
interface ErrorDNAConfig {
  tracking: {
    enabled: boolean;
    captureStackTrace: boolean;
    sourceMaps: boolean;
    maxStackFrames: number;
  };
  analysis: {
    ai: {
      enabled: boolean;
      provider: 'openai' | 'anthropic';
      confidence: number;
    };
    dependencies: {
      depth: number;
      includeNodeModules: boolean;
    };
  };
  visual: {
    codePreview: {
      contextLines: number;
      theme: string;
    };
    dependencyGraph: {
      layout: 'force' | 'hierarchical';
      maxNodes: number;
    };
  };
}
```

## Best Practices

1. **Error Grouping**
   - Group similar errors
   - Track occurrence frequency
   - Identify patterns

2. **Performance**
   - Use selective error tracking
   - Implement rate limiting
   - Cache analysis results

3. **Security**
   - Sanitize error messages
   - Remove sensitive data
   - Limit stack trace info in production

4. **Maintenance**
   - Regular error review
   - Update AI models
   - Refine tracking rules 