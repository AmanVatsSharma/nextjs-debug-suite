import { parse as parseStackTrace } from 'stacktrace-parser';
import { debug } from './debug';

export interface ErrorDNA {
  id: string;
  timestamp: number;
  error: Error;
  message: string;
  stack?: string;
  componentStack?: string;
  frames?: Array<{
    file?: string;
    methodName?: string;
    lineNumber?: number;
    column?: number;
  }>;
  context?: {
    componentName?: string;
    props?: Record<string, any>;
    state?: Record<string, any>;
    [key: string]: any;
  };
  metadata?: {
    browser?: string;
    os?: string;
    url?: string;
    [key: string]: any;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  lastOccurrence: number;
  firstOccurrence: number;
  resolved: boolean;
  aiAnalysis?: {
    summary?: string;
    suggestedFix?: string;
    confidence?: number;
    relatedIssues?: string[];
  };
}

export class ErrorDNAAnalyzer {
  private debug = debug;
  private errors: Map<string, ErrorDNA> = new Map();
  private errorCallbacks: ((error: ErrorDNA) => void)[] = [];
  private maxErrors = 1000;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers();
    }
  }

  private setupGlobalHandlers() {
    window.onerror = (message, source, line, column, error) => {
      if (error) {
        this.captureError(error, { source, line, column });
      } else {
        this.captureError(new Error(message as string), { source, line, column });
      }
      return false;
    };

    window.onunhandledrejection = (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.captureError(error, { type: 'unhandledRejection' });
    };
  }

  captureError(error: Error, context: Record<string, any> = {}) {
    const dna = this.createErrorDNA(error, context);
    const existingError = this.findSimilarError(dna);

    if (existingError) {
      existingError.frequency += 1;
      existingError.lastOccurrence = Date.now();
      this.errors.set(existingError.id, existingError);
      this.notifyErrorCallbacks(existingError);
    } else {
      this.errors.set(dna.id, dna);
      this.notifyErrorCallbacks(dna);

      if (this.errors.size > this.maxErrors) {
        const oldestError = Array.from(this.errors.values())
          .sort((a, b) => a.lastOccurrence - b.lastOccurrence)[0];
        this.errors.delete(oldestError.id);
      }
    }

    this.debug.log('ERROR', error.message, dna);
    return dna;
  }

  private createErrorDNA(error: Error, context: Record<string, any> = {}): ErrorDNA {
    const timestamp = Date.now();
    const frames = error.stack ? parseStackTrace(error.stack) : undefined;

    const dna: ErrorDNA = {
      id: Math.random().toString(36).substring(7),
      timestamp,
      error,
      message: error.message,
      stack: error.stack,
      frames,
      context: {
        ...context,
        componentName: this.extractComponentName(frames),
      },
      metadata: {
        browser: this.getBrowserInfo(),
        os: this.getOSInfo(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
      severity: this.calculateSeverity(error, context),
      frequency: 1,
      lastOccurrence: timestamp,
      firstOccurrence: timestamp,
      resolved: false,
    };

    return dna;
  }

  private findSimilarError(dna: ErrorDNA): ErrorDNA | undefined {
    return Array.from(this.errors.values()).find(existing => 
      existing.message === dna.message &&
      existing.context?.componentName === dna.context?.componentName &&
      this.compareStacks(existing.frames, dna.frames)
    );
  }

  private compareStacks(stack1?: Array<any>, stack2?: Array<any>): boolean {
    if (!stack1 || !stack2) return false;
    if (stack1.length !== stack2.length) return false;

    return stack1.every((frame, index) => 
      frame.file === stack2[index].file &&
      frame.methodName === stack2[index].methodName
    );
  }

  private calculateSeverity(error: Error, context: Record<string, any>): ErrorDNA['severity'] {
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return 'high';
    }

    if (context.type === 'unhandledRejection') {
      return 'critical';
    }

    if (error.message.toLowerCase().includes('network') || 
        error.message.toLowerCase().includes('fetch') ||
        error.message.toLowerCase().includes('xhr')) {
      return 'medium';
    }

    return 'low';
  }

  private extractComponentName(frames?: Array<any>): string | undefined {
    if (!frames?.length) return undefined;

    const componentFrame = frames.find(frame => {
      const methodName = frame.methodName || '';
      return (
        methodName.includes('render') ||
        methodName.includes('component') ||
        methodName.includes('React')
      );
    });

    return componentFrame?.methodName?.split('.')[0];
  }

  private getBrowserInfo(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const ua = window.navigator.userAgent;
    const browsers = [
      { name: 'Chrome', pattern: /Chrome\/(\d+)/ },
      { name: 'Firefox', pattern: /Firefox\/(\d+)/ },
      { name: 'Safari', pattern: /Version\/(\d+).*Safari/ },
      { name: 'Edge', pattern: /Edg\/(\d+)/ },
    ];

    for (const browser of browsers) {
      const match = ua.match(browser.pattern);
      if (match) {
        return `${browser.name} ${match[1]}`;
      }
    }

    return 'unknown';
  }

  private getOSInfo(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const ua = window.navigator.userAgent;
    const os = [
      { name: 'Windows', pattern: /Windows NT (\d+\.\d+)/ },
      { name: 'Mac', pattern: /Mac OS X (\d+[._]\d+)/ },
      { name: 'Linux', pattern: /Linux/ },
      { name: 'iOS', pattern: /iOS (\d+)/ },
      { name: 'Android', pattern: /Android (\d+)/ },
    ];

    for (const system of os) {
      const match = ua.match(system.pattern);
      if (match) {
        return `${system.name} ${match[1] || ''}`.trim();
      }
    }

    return 'unknown';
  }

  getErrors(filter?: {
    severity?: ErrorDNA['severity'];
    resolved?: boolean;
    componentName?: string;
  }): ErrorDNA[] {
    let errors = Array.from(this.errors.values());

    if (filter) {
      errors = errors.filter(error => {
        if (filter.severity && error.severity !== filter.severity) return false;
        if (filter.resolved !== undefined && error.resolved !== filter.resolved) return false;
        if (filter.componentName && error.context?.componentName !== filter.componentName) return false;
        return true;
      });
    }

    return errors.sort((a, b) => b.lastOccurrence - a.lastOccurrence);
  }

  getError(id: string): ErrorDNA | undefined {
    return this.errors.get(id);
  }

  updateError(id: string, updates: Partial<ErrorDNA>): ErrorDNA | undefined {
    const error = this.errors.get(id);
    if (!error) return undefined;

    const updatedError = { ...error, ...updates };
    this.errors.set(id, updatedError);
    return updatedError;
  }

  resolveError(id: string): ErrorDNA | undefined {
    return this.updateError(id, { resolved: true });
  }

  clearErrors() {
    this.errors.clear();
  }

  onError(callback: (error: ErrorDNA) => void) {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  private notifyErrorCallbacks(error: ErrorDNA) {
    this.errorCallbacks.forEach(callback => callback(error));
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.onerror = null;
      window.onunhandledrejection = null;
    }
    this.errorCallbacks = [];
    this.errors.clear();
  }
} 