export interface DebugConfig {
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

export interface PerformanceMetric {
  timestamp: number;
  value: number;
  type: string;
}

export interface MemoryMetric {
  timestamp: number;
  heap: number;
  stack: number;
}

export interface RenderMetric {
  component: string;
  duration: number;
  timestamp: number;
}

export interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
}

export interface NetworkResponse {
  requestId: string;
  status: number;
  headers: Record<string, string>;
  body?: any;
  duration: number;
  timestamp: number;
}

export interface ConsoleEntry {
  level: 'log' | 'warn' | 'error';
  message: string;
  timestamp: number;
  stack?: string;
}

export interface AISuggestion {
  type: 'fix' | 'optimization' | 'security';
  content: string;
  confidence: number;
  timestamp: number;
}

export interface AIAnalysis {
  type: 'error' | 'performance' | 'security';
  content: string;
  suggestions: string[];
  timestamp: number;
}

export interface DebugData {
  errors: Array<{
    message: string;
    stack: string;
    timestamp: number;
  }>;
  performance: {
    metrics: PerformanceMetric[];
    memory: MemoryMetric[];
    renders: RenderMetric[];
  };
  network: {
    requests: NetworkRequest[];
    responses: NetworkResponse[];
  };
  console: {
    logs: ConsoleEntry[];
    warnings: ConsoleEntry[];
    errors: ConsoleEntry[];
  };
  ai: {
    suggestions: AISuggestion[];
    analysis: AIAnalysis[];
  };
} 