import { ErrorDNAGenerator } from '../core/errorDNA/errorDNA';
import { StackTraceParser } from '../core/errorDNA/stackTraceParser';
import { DependencyAnalyzer } from '../core/errorDNA/dependencyAnalyzer';

describe('ErrorDNAGenerator', () => {
  let errorDNA: ErrorDNAGenerator;
  let mockStackTraceParser: jest.Mocked<StackTraceParser>;
  let mockDependencyAnalyzer: jest.Mocked<DependencyAnalyzer>;

  beforeEach(() => {
    mockStackTraceParser = {
      parse: jest.fn(),
    } as any as jest.Mocked<StackTraceParser>;

    mockDependencyAnalyzer = {
      getDependencyGraph: jest.fn(),
    } as any as jest.Mocked<DependencyAnalyzer>;

    errorDNA = new ErrorDNAGenerator(mockStackTraceParser as any, mockDependencyAnalyzer as any);
  });

  describe('generateDNA', () => {
    it('analyzes error and returns DNA information', async () => {
      const error = new Error('Test error');
      const mockStackTrace = {
        frames: [{
          fileName: 'src/components/Button.tsx',
          lineNumber: 42,
          columnNumber: 5,
          functionName: 'onClick',
          source: 'export class Button',
        }],
        sourceCode: {
          'src/components/Button.tsx': ['line1', 'line2', 'line3'],
        },
      };

      mockStackTraceParser.parse.mockReturnValue(mockStackTrace.frames);
      mockDependencyAnalyzer.getDependencyGraph.mockResolvedValue({
        nodes: [],
        edges: [],
      });

      const dna = await errorDNA.generateDNA(error);

      expect(dna).toEqual(expect.objectContaining({
        type: 'runtime',
        location: expect.objectContaining({
          file: 'src/components/Button.tsx',
          line: 42,
          column: 5,
          functionName: 'onClick',
          component: 'Button',
        }),
        visual: expect.objectContaining({
          codePreview: expect.any(String),
          highlightedLines: expect.arrayContaining([42]),
          dependencies: expect.objectContaining({
            nodes: [],
            edges: [],
          }),
          stackTrace: expect.objectContaining({
            frames: expect.arrayContaining([
              expect.objectContaining({
                file: 'src/components/Button.tsx',
                line: 42,
                column: 5,
                function: 'onClick',
              }),
            ]),
          }),
        }),
      }));
    });

    it('identifies error type based on stack trace', async () => {
      const error = new TypeError('Invalid type');
      const mockStackTrace = {
        frames: [{
          fileName: 'src/utils/validation.ts',
          lineNumber: 15,
          columnNumber: 3,
          functionName: 'validateInput',
        }],
      };

      mockStackTraceParser.parse.mockReturnValue(mockStackTrace.frames);
      mockDependencyAnalyzer.getDependencyGraph.mockResolvedValue({
        nodes: [],
        edges: [],
      });

      const dna = await errorDNA.generateDNA(error);
      expect(dna.type).toBe('type');
    });

    it('handles missing stack trace gracefully', async () => {
      const error = new Error('No stack trace');
      mockStackTraceParser.parse.mockReturnValue([]);
      mockDependencyAnalyzer.getDependencyGraph.mockResolvedValue({
        nodes: [],
        edges: [],
      });

      const dna = await errorDNA.generateDNA(error);
      expect(dna).toEqual(expect.objectContaining({
        location: expect.objectContaining({
          file: 'unknown',
          line: 0,
          column: 0,
          functionName: 'unknown',
        }),
      }));
    });

    it('handles parser errors gracefully', async () => {
      const error = new Error('Parser error');
      mockStackTraceParser.parse.mockImplementation(() => { throw new Error('Parse failed'); });
      mockDependencyAnalyzer.getDependencyGraph.mockResolvedValue({
        nodes: [],
        edges: [],
      });

      await expect(errorDNA.generateDNA(error)).rejects.toThrow('Parse failed');
    });
  });
}); 