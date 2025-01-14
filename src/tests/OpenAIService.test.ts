import { OpenAIService } from '../ai/openai';
import type { AIAnalysisRequest } from '../ai/types';
import type { EnhancedErrorDNA } from '../core/types';
import '@testing-library/jest-dom';
import '@types/jest';

// Mock fetch globally
global.fetch = jest.fn();

describe('OpenAIService', () => {
  let service: OpenAIService;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    service = new OpenAIService(mockApiKey);
    (global.fetch as jest.Mock).mockClear();
  });

  const mockSuccessResponse = {
    ok: true,
    json: () => Promise.resolve({
      choices: [{
        message: {
          content: 'Test explanation\n\n```js\nconst fix = true;\n```\n\nPrevention tips\n\nBest practices'
        }
      }]
    })
  };

  describe('analyze', () => {
    it('should analyze error requests correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const mockError: EnhancedErrorDNA = {
        id: 'test-error-1',
        timestamp: Date.now(),
        type: 'runtime',
            location: {
              file: 'test.ts',
              line: 10,
              column: 5,
              functionName: 'testFunction',
              component: 'TestComponent'
        },
            visual: {
              codePreview: 'const x = null; x.prop;',
              highlightedLines: [10],
              dependencies: {},
              stackTrace: []
        }
      };

      const request: AIAnalysisRequest = {
        type: 'error',
        context: {
          error: mockError
        }
      };

      const response = await service.analyze(request);

      expect(response).toEqual({
        explanation: 'Test explanation',
        suggestedFix: 'const fix = true;',
        confidence: 0.9,
        relevantDocs: [],
        similarIssues: [],
        additionalContext: {
          prevention: 'Prevention tips',
          bestPractices: 'Best practices'
        }
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockApiKey}`
          }
        })
      );
    });

    it('should analyze performance requests correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const request: AIAnalysisRequest = {
        type: 'performance',
        context: {
          metrics: {
            memory: {
              used: 100,
              total: 200,
              limit: 500
            },
            performance: {
              fcp: 1000,
              lcp: 2000,
              fid: 100
            }
          }
        }
      };

      const response = await service.analyze(request);
      expect(response.explanation).toBe('Test explanation');
      expect(response.confidence).toBe(0.9);
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      });

      const request: AIAnalysisRequest = {
        type: 'general',
        context: { query: 'test' }
      };

      await expect(service.analyze(request)).rejects.toThrow('OpenAI API error: Bad Request');
    });
  });

  describe('generateDocs', () => {
    it('should generate documentation correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: 'Generated docs'
            }
          }]
        })
      });

      const docs = await service.generateDocs('function test() {}');
      expect(docs).toBe('Generated docs');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('function test() {}')
        })
      );
    });
  });

  describe('predictIssue', () => {
    it('should predict issues based on metrics', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{
            message: {
              content: 'Memory leak detected\n\nOptimize garbage collection'
            }
          }]
        })
      });

      const metrics = {
        memory: {
          used: 90,
          total: 100,
          limit: 100
        }
      };
      
      const prediction = await service.predictIssue(metrics);

      expect(prediction).toEqual({
        prediction: 'Memory leak detected',
        confidence: 0.85,
        suggestedAction: 'Optimize garbage collection'
      });
    });
  });
}); 