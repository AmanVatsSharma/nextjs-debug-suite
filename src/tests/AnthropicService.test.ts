import { AnthropicService } from '../ai/anthropic';
import type { AIAnalysisRequest } from '../ai/types';

// Mock fetch globally
global.fetch = jest.fn();

describe('AnthropicService', () => {
  let service: AnthropicService;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    service = new AnthropicService(mockApiKey);
    (global.fetch as jest.Mock).mockClear();
  });

  const mockSuccessResponse = {
    ok: true,
    json: () => Promise.resolve({
      content: 'Test explanation\n\n```js\nconst fix = true```\n\nPrevention tips\n\nBest practices'
    })
  };

  describe('analyze', () => {
    it('should analyze error requests correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

      const request: AIAnalysisRequest = {
        type: 'error',
        context: {
          error: {
            type: 'TypeError',
            location: { file: 'test.ts', line: 10 },
            visual: { codePreview: 'const x = null; x.prop;' }
          }
        }
      };

      const response = await service.analyze(request);

      expect(response).toEqual({
        explanation: 'Test explanation',
        suggestedFix: 'const fix = true',
        confidence: 0.9,
        relevantDocs: [],
        similarIssues: [],
        additionalContext: {
          prevention: 'Prevention tips',
          bestPractices: 'Best practices'
        }
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': mockApiKey,
            'anthropic-version': '2023-06-01'
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
            memory: { heap: 100, stack: 50 },
            performance: { loadTime: 1000 }
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

      await expect(service.analyze(request)).rejects.toThrow('Anthropic API error: Bad Request');
    });
  });

  describe('generateDocs', () => {
    it('should generate documentation correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ content: 'Generated docs' })
      });

      const docs = await service.generateDocs('function test() {}');
      expect(docs).toBe('Generated docs');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.anthropic.com/v1/messages',
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
        json: () => Promise.resolve({ content: 'Memory leak detected\n\nOptimize garbage collection' })
      });

      const metrics = { memory: { usage: 90 } };
      const prediction = await service.predictIssue(metrics);

      expect(prediction).toEqual({
        prediction: 'Memory leak detected',
        confidence: 0.85,
        suggestedAction: 'Optimize garbage collection'
      });
    });
  });
}); 