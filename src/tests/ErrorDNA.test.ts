import { ErrorDNA } from '../core/errorDNA/errorDNA';
import { StackTraceParser } from '../core/errorDNA/stackTraceParser';
import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';

describe('ErrorDNA', () => {
  let errorDNA: ErrorDNA;
  let mockStackTraceParser: jest.Mocked<StackTraceParser>;
  let mockDependencyAnalyzer: jest.Mocked<DependencyAnalyzer>;

  beforeEach(() => {
    mockStackTraceParser = {
      parse: jest.fn(),
      readFileContent: jest.fn(),
      getCodePreview: jest.fn(),
    } as any;

    mockDependencyAnalyzer = {
      analyze: jest.fn(),
      getDependencyGraph: jest.fn(),
      getImports: jest.fn(),
      getExports: jest.fn(),
    } as any;

    errorDNA = new ErrorDNA(mockStackTraceParser, mockDependencyAnalyzer);
  });

  describe('analyze', () => {
    const mockError = new Error('Test error');
    mockError.stack = `Error: Test error
    at Component (/app/src/components/Test.tsx:10:20)
    at processChild (/app/node_modules/react-dom/cjs/react-dom.development.js:7344:14)
    at processChildren (/app/node_modules/react-dom/cjs/react-dom.development.js:7309:5)`;

    const mockStackFrames = [
      {
        fileName: '/app/src/components/Test.tsx',
        lineNumber: 10,
        columnNumber: 20,
        functionName: 'Component',
        source: 'app',
      },
    ];

    const mockCodePreview = {
      code: 'const value = undefined;\nconst result = value.toString();',
      highlightedLines: [10],
    };

    const mockDependencies = {
      imports: [
        { source: 'react', specifiers: ['useState', 'useEffect'] },
        { source: '../utils/helpers', specifiers: ['formatData'] },
      ],
      exports: [
        { name: 'Component', type: 'named' },
      ],
    };

    beforeEach(() => {
      mockStackTraceParser.parse.mockResolvedValue(mockStackFrames);
      mockStackTraceParser.getCodePreview.mockResolvedValue(mockCodePreview);
      mockDependencyAnalyzer.analyze.mockResolvedValue(mockDependencies);
    });

    it('analyzes error and returns DNA information', async () => {
      const result = await errorDNA.analyze(mockError);

      expect(result).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Number),
        type: 'runtime',
        location: {
          file: '/app/src/components/Test.tsx',
          line: 10,
          column: 20,
          functionName: 'Component',
          component: 'Component',
        },
        package: undefined,
        visual: {
          codePreview: mockCodePreview.code,
          highlightedLines: mockCodePreview.highlightedLines,
          dependencies: mockDependencies,
          stackTrace: mockStackFrames,
        },
      });
    });

    it('identifies error type based on stack trace', async () => {
      // Runtime error
      const runtimeResult = await errorDNA.analyze(mockError);
      expect(runtimeResult.type).toBe('runtime');

      // Type error
      const typeError = new TypeError('Type error');
      typeError.stack = mockError.stack;
      const typeResult = await errorDNA.analyze(typeError);
      expect(typeResult.type).toBe('type');

      // Network error
      const networkError = new Error('Failed to fetch');
      networkError.stack = mockError.stack;
      const networkResult = await errorDNA.analyze(networkError);
      expect(networkResult.type).toBe('network');
    });

    it('extracts component name from function name', async () => {
      const result = await errorDNA.analyze(mockError);
      expect(result.location.component).toBe('Component');

      // With namespace
      mockStackFrames[0].functionName = 'Components.MyComponent';
      mockStackTraceParser.parse.mockResolvedValueOnce(mockStackFrames);
      const namespaceResult = await errorDNA.analyze(mockError);
      expect(namespaceResult.location.component).toBe('MyComponent');

      // Anonymous function
      mockStackFrames[0].functionName = '';
      mockStackTraceParser.parse.mockResolvedValueOnce(mockStackFrames);
      const anonymousResult = await errorDNA.analyze(mockError);
      expect(anonymousResult.location.component).toBeUndefined();
    });

    it('identifies package information for node_modules errors', async () => {
      mockStackFrames[0].fileName = '/app/node_modules/package-name/dist/index.js';
      mockStackTraceParser.parse.mockResolvedValueOnce(mockStackFrames);

      const result = await errorDNA.analyze(mockError);
      expect(result.package).toEqual({
        name: 'package-name',
        version: undefined,
        path: ['dist', 'index.js'],
      });
    });

    it('handles missing stack trace gracefully', async () => {
      const errorWithoutStack = new Error('No stack');
      delete errorWithoutStack.stack;

      const result = await errorDNA.analyze(errorWithoutStack);
      expect(result).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Number),
        type: 'runtime',
        location: {
          file: 'unknown',
          line: 0,
          column: 0,
          functionName: 'unknown',
        },
        visual: {
          stackTrace: [],
        },
      });
    });

    it('handles parser errors gracefully', async () => {
      mockStackTraceParser.parse.mockRejectedValueOnce(new Error('Parser error'));

      const result = await errorDNA.analyze(mockError);
      expect(result).toEqual({
        id: expect.any(String),
        timestamp: expect.any(Number),
        type: 'runtime',
        location: {
          file: 'unknown',
          line: 0,
          column: 0,
          functionName: 'unknown',
        },
        visual: {
          stackTrace: [],
        },
      });
    });
  });

  describe('getDependencyGraph', () => {
    const mockDependencyGraph = {
      nodes: [
        { id: 'Test.tsx', type: 'component' },
        { id: 'helpers.ts', type: 'utility' },
      ],
      edges: [
        { source: 'Test.tsx', target: 'helpers.ts', type: 'import' },
      ],
    };

    beforeEach(() => {
      mockDependencyAnalyzer.getDependencyGraph.mockResolvedValue(mockDependencyGraph);
    });

    it('returns dependency graph for a file', async () => {
      const result = await errorDNA.getDependencyGraph('/app/src/components/Test.tsx');
      expect(result).toEqual(mockDependencyGraph);
    });

    it('handles analyzer errors gracefully', async () => {
      mockDependencyAnalyzer.getDependencyGraph.mockRejectedValueOnce(new Error('Analyzer error'));

      const result = await errorDNA.getDependencyGraph('/app/src/components/Test.tsx');
      expect(result).toEqual({
        nodes: [],
        edges: [],
      });
    });
  });

  describe('getImports', () => {
    const mockImports = [
      { source: 'react', specifiers: ['useState', 'useEffect'] },
      { source: '../utils/helpers', specifiers: ['formatData'] },
    ];

    beforeEach(() => {
      mockDependencyAnalyzer.getImports.mockResolvedValue(mockImports);
    });

    it('returns imports for a file', async () => {
      const result = await errorDNA.getImports('/app/src/components/Test.tsx');
      expect(result).toEqual(mockImports);
    });

    it('handles analyzer errors gracefully', async () => {
      mockDependencyAnalyzer.getImports.mockRejectedValueOnce(new Error('Analyzer error'));

      const result = await errorDNA.getImports('/app/src/components/Test.tsx');
      expect(result).toEqual([]);
    });
  });

  describe('getExports', () => {
    const mockExports = [
      { name: 'Component', type: 'named' },
      { name: 'default', type: 'default' },
    ];

    beforeEach(() => {
      mockDependencyAnalyzer.getExports.mockResolvedValue(mockExports);
    });

    it('returns exports for a file', async () => {
      const result = await errorDNA.getExports('/app/src/components/Test.tsx');
      expect(result).toEqual(mockExports);
    });

    it('handles analyzer errors gracefully', async () => {
      mockDependencyAnalyzer.getExports.mockRejectedValueOnce(new Error('Analyzer error'));

      const result = await errorDNA.getExports('/app/src/components/Test.tsx');
      expect(result).toEqual([]);
    });
  });
}); 