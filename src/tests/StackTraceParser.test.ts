import { StackTraceParser } from '../core/errorDNA/stackTraceParser';

describe('StackTraceParser', () => {
  let parser: StackTraceParser;

  beforeEach(() => {
    parser = new StackTraceParser();
  });

  it('should parse a Chrome stack trace', () => {
    const stackTrace = `
      Error: Test error
          at Component (webpack://my-app/src/components/Component.tsx:10:15)
          at renderWithHooks (webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js:14985:18)
          at mountIndeterminateComponent (webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js:17811:13)
          at async Promise.all (index 0)
    `;

    const frames = parser.parse(stackTrace);
    expect(frames).toEqual([
      {
        fileName: 'src/components/Component.tsx',
        lineNumber: 10,
        columnNumber: 15,
        functionName: 'Component',
        source: 'webpack://my-app/src/components/Component.tsx'
      },
      {
        fileName: 'node_modules/react-dom/cjs/react-dom.development.js',
        lineNumber: 14985,
        columnNumber: 18,
        functionName: 'renderWithHooks',
        source: 'webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js'
      },
      {
        fileName: 'node_modules/react-dom/cjs/react-dom.development.js',
        lineNumber: 17811,
        columnNumber: 13,
        functionName: 'mountIndeterminateComponent',
        source: 'webpack://my-app/node_modules/react-dom/cjs/react-dom.development.js'
      }
    ]);
  });

  it('should parse a Firefox stack trace', () => {
    const stackTrace = `
      TestError@http://localhost:3000/static/js/bundle.js:1234:5
      Component@http://localhost:3000/static/js/main.chunk.js:567:8
      dispatchEvent@http://localhost:3000/static/js/vendor.chunk.js:89:10
    `;

    const frames = parser.parse(stackTrace);
    expect(frames).toEqual([
      {
        fileName: 'static/js/bundle.js',
        lineNumber: 1234,
        columnNumber: 5,
        functionName: 'TestError',
        source: 'http://localhost:3000/static/js/bundle.js'
      },
      {
        fileName: 'static/js/main.chunk.js',
        lineNumber: 567,
        columnNumber: 8,
        functionName: 'Component',
        source: 'http://localhost:3000/static/js/main.chunk.js'
      },
      {
        fileName: 'static/js/vendor.chunk.js',
        lineNumber: 89,
        columnNumber: 10,
        functionName: 'dispatchEvent',
        source: 'http://localhost:3000/static/js/vendor.chunk.js'
      }
    ]);
  });

  it('should normalize file names', () => {
    const stackTrace = `
      Error: Test error
          at Component (webpack://my-app/./src/components/Component.tsx?1234:10:15)
          at Handler (file:///C:/Users/test/project/src/handlers/error.ts:20:30)
          at Process (webpack-internal:///./node_modules/process/index.js:30:40)
    `;

    const frames = parser.parse(stackTrace);
    expect(frames.map(f => f.fileName)).toEqual([
      'src/components/Component.tsx',
      'C:/Users/test/project/src/handlers/error.ts',
      'node_modules/process/index.js'
    ]);
  });

  it('should normalize function names', () => {
    const stackTrace = `
      Error: Test error
          at async Function.handleRequest [as handler] (webpack://api/./src/handler.ts:25:10)
          at Object.<anonymous> (webpack://app/./src/index.ts:15:20)
          at Module../src/components/Component.tsx (webpack://app/./src/components/Component.tsx:8:30)
    `;

    const frames = parser.parse(stackTrace);
    expect(frames.map(f => f.functionName)).toEqual([
      'handleRequest',
      'anonymous',
      'Component'
    ]);
  });

  it('should handle empty or invalid stack traces', () => {
    expect(parser.parse('')).toEqual([]);
    expect(parser.parse('Invalid stack trace')).toEqual([]);
    expect(parser.parse(undefined as any)).toEqual([]);
  });

  it('should identify source positions', () => {
    const frame = {
      fileName: 'src/component.tsx',
      lineNumber: 10,
      columnNumber: 15,
      functionName: 'Component',
      source: 'webpack://app/src/component.tsx'
    };

    const position = parser.getSourcePosition(frame);
    expect(position).toEqual({
      line: 10,
      column: 15
    });
  });

  it('should identify node modules and user code', () => {
    const userFrame = {
      fileName: 'src/components/MyComponent.tsx',
      lineNumber: 1,
      columnNumber: 1,
      functionName: 'MyComponent',
      source: 'src/components/MyComponent.tsx'
    };

    const nodeModuleFrame = {
      fileName: 'node_modules/react/index.js',
      lineNumber: 1,
      columnNumber: 1,
      functionName: 'createElement',
      source: 'node_modules/react/index.js'
    };

    expect(parser.isNodeModule(userFrame)).toBe(false);
    expect(parser.isNodeModule(nodeModuleFrame)).toBe(true);
    expect(parser.isUserCode(userFrame)).toBe(true);
    expect(parser.isUserCode(nodeModuleFrame)).toBe(false);
  });

  it('should get function context', () => {
    const frame = {
      fileName: 'src/component.tsx',
      lineNumber: 10,
      columnNumber: 15,
      functionName: 'MyComponent',
      source: 'src/component.tsx'
    };

    expect(parser.getFunctionContext(frame)).toBe('MyComponent');
    expect(parser.getFunctionContext({ ...frame, functionName: '' })).toBe('anonymous');
  });
}); 