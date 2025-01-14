import type { AIService, AIAnalysisRequest, AIAnalysisResponse } from './types';

export class OpenAIService implements AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'gpt-4';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, body: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  private createPrompt(request: AIAnalysisRequest): string {
    switch (request.type) {
      case 'error':
        return `Analyze this error and provide a solution:
Error Type: ${request.context.error?.type}
Location: ${request.context.error?.location.file}:${request.context.error?.location.line}
Code:
${request.context.error?.visual.codePreview}`;

      case 'performance':
        return `Analyze these performance metrics and suggest improvements:
Memory: ${JSON.stringify(request.context.metrics?.memory)}
Performance: ${JSON.stringify(request.context.metrics?.performance)}`;

      case 'network':
        return `Analyze this network activity and suggest optimizations:
${request.context.codeContext}`;

      case 'general':
        return request.context.query || '';
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const prompt = this.createPrompt(request);
    
    const completion = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert developer assistant analyzing Next.js application issues.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    // Parse the response into structured format
    // This is a simple implementation; you might want to make it more robust
    const [explanation, ...rest] = response.split('\n\n');
    const suggestedFix = rest.find(part => part.startsWith('```'))?.replace(/```\w*\n/, '').replace(/```$/, '');
    
    return {
      explanation,
      suggestedFix,
      confidence: 0.8, // You might want to calculate this based on the model's response
      relevantDocs: [],
      similarIssues: [],
    };
  }

  async generateDocs(context: string): Promise<string> {
    const completion = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical writer creating documentation for Next.js applications.',
        },
        {
          role: 'user',
          content: `Generate documentation for this code:\n${context}`,
        },
      ],
      temperature: 0.5,
    });

    return completion.choices[0].message.content;
  }

  async predictIssue(metrics: Record<string, any>): Promise<{
    prediction: string;
    confidence: number;
    suggestedAction?: string;
  }> {
    const completion = await this.makeRequest('/chat/completions', {
      model: this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert system analyzing performance metrics to predict potential issues.',
        },
        {
          role: 'user',
          content: `Analyze these metrics and predict potential issues:\n${JSON.stringify(metrics, null, 2)}`,
        },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content;
    const [prediction, action] = response.split('\n\n');

    return {
      prediction,
      confidence: 0.7,
      suggestedAction: action,
    };
  }
} 