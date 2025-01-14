import type { AIService, AIAnalysisRequest, AIAnalysisResponse } from './types';

export class AnthropicService implements AIService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1';
  private model = 'claude-2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, body: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    return response.json();
  }

  private createPrompt(request: AIAnalysisRequest): string {
    const basePrompt = 'You are Claude, an AI assistant with expertise in Next.js development. ';
    
    switch (request.type) {
      case 'error':
        return `${basePrompt}Please analyze this error and provide a detailed solution:
Error Type: ${request.context.error?.type}
Location: ${request.context.error?.location.file}:${request.context.error?.location.line}
Code:
${request.context.error?.visual.codePreview}

Provide your analysis in this format:
1. Explanation of the error
2. Root cause
3. Solution with code example
4. Prevention tips`;

      case 'performance':
        return `${basePrompt}Please analyze these performance metrics and suggest optimizations:
Memory: ${JSON.stringify(request.context.metrics?.memory)}
Performance: ${JSON.stringify(request.context.metrics?.performance)}

Provide your analysis in this format:
1. Current performance assessment
2. Identified bottlenecks
3. Optimization suggestions with code examples
4. Monitoring recommendations`;

      case 'network':
        return `${basePrompt}Please analyze this network activity and suggest improvements:
${request.context.codeContext}

Provide your analysis in this format:
1. Current network patterns
2. Potential optimizations
3. Code examples for implementation
4. Best practices recommendations`;

      case 'general':
        return `${basePrompt}${request.context.query}

Provide your response in this format:
1. Analysis
2. Recommendations
3. Code examples (if applicable)
4. Additional considerations`;
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const prompt = this.createPrompt(request);
    
    const completion = await this.makeRequest('/messages', {
      model: this.model,
      messages: [{
        role: 'user',
        content: prompt,
      }],
      max_tokens: 1000,
    });

    const response = completion.content;
    
    // Parse the structured response
    const sections = response.split('\n\n');
    const explanation = sections[0];
    const suggestedFix = sections.find(section => section.includes('```'))
      ?.match(/```[\s\S]*?```/)?.[0]
      ?.replace(/```\w*\n/, '')
      ?.replace(/```$/, '');

    return {
      explanation,
      suggestedFix,
      confidence: 0.9,
      relevantDocs: [],
      similarIssues: [],
      additionalContext: {
        prevention: sections.find(s => s.toLowerCase().includes('prevent')),
        bestPractices: sections.find(s => s.toLowerCase().includes('best practice')),
      },
    };
  }

  async generateDocs(context: string): Promise<string> {
    const completion = await this.makeRequest('/messages', {
      model: this.model,
      messages: [{
        role: 'user',
        content: `You are a technical writer. Generate comprehensive documentation for this code, including examples and best practices:\n${context}`,
      }],
      max_tokens: 1000,
    });

    return completion.content;
  }

  async predictIssue(metrics: Record<string, any>): Promise<{
    prediction: string;
    confidence: number;
    suggestedAction?: string;
  }> {
    const completion = await this.makeRequest('/messages', {
      model: this.model,
      messages: [{
        role: 'user',
        content: `You are a system analyst. Based on these metrics, predict potential issues and suggest preventive actions:\n${JSON.stringify(metrics, null, 2)}`,
      }],
      max_tokens: 500,
    });

    const response = completion.content;
    const [prediction, action] = response.split('\n\n');

    return {
      prediction,
      confidence: 0.85,
      suggestedAction: action,
    };
  }
} 