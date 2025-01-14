import type { StackTraceParser } from './stackTraceParser';
import type { DependencyAnalyzer } from './dependencyAnalyzer';
import type { EnhancedErrorDNA } from '../types';

export class ErrorDNA {
  constructor(
    private stackTraceParser: StackTraceParser,
    private dependencyAnalyzer: DependencyAnalyzer
  ) {}

  async analyze(error: Error): Promise<EnhancedErrorDNA> {
    const stackTrace = this.stackTraceParser.parse(error.stack || '');
    const firstFrame = stackTrace[0];

    const errorDNA: EnhancedErrorDNA = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      type: this.determineErrorType(error),
      location: {
        file: firstFrame?.fileName || 'unknown',
        line: firstFrame?.lineNumber || 0,
        column: firstFrame?.columnNumber || 0,
        functionName: firstFrame?.functionName || 'unknown',
        component: this.extractComponentName(firstFrame?.functionName)
      },
      visual: {
        codePreview: error.stack?.split('\n')[0] || error.message,
        highlightedLines: [firstFrame?.lineNumber || 0],
        dependencies: await this.getDependencyGraph(firstFrame?.fileName),
        stackTrace: stackTrace
      }
    };

    if (firstFrame?.fileName?.includes('node_modules')) {
      errorDNA.package = this.extractPackageInfo(firstFrame.fileName);
    }

    return errorDNA;
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineErrorType(error: Error): EnhancedErrorDNA['type'] {
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return 'runtime';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.message.includes('type') || error.message.includes('TypeScript')) {
      return 'type';
    }
    if (error.message.includes('performance') || error.message.includes('timeout')) {
      return 'performance';
    }
    return 'runtime';
  }

  private extractComponentName(functionName?: string): string | undefined {
    if (!functionName) return undefined;

    // Common React component patterns
    const patterns = [
      /^[A-Z][a-zA-Z]*$/, // Simple component name
      /^[A-Z][a-zA-Z]*Component$/, // Suffixed with Component
      /^use[A-Z][a-zA-Z]*$/, // Hook name
      /^render[A-Z][a-zA-Z]*$/ // Render method
    ];

    for (const pattern of patterns) {
      const match = functionName.match(pattern);
      if (match) return match[0];
    }

    return undefined;
  }

  private extractPackageInfo(filePath: string): EnhancedErrorDNA['package'] {
    const parts = filePath.split('node_modules/');
    if (parts.length < 2) return undefined;

    const packagePath = parts[1].split('/');
    const scopedPackage = packagePath[0].startsWith('@');
    
    return {
      name: scopedPackage ? `${packagePath[0]}/${packagePath[1]}` : packagePath[0],
      version: 'unknown', // Would need package.json analysis for this
      path: packagePath
    };
  }

  async getDependencyGraph(filePath?: string) {
    if (!filePath) return {};
    try {
      return await this.dependencyAnalyzer.getDependencyGraph(filePath);
    } catch (error) {
      return {};
    }
  }

  async getImports(filePath: string) {
    try {
      return await this.dependencyAnalyzer.getImports(filePath);
    } catch (error) {
      return [];
    }
  }

  async getExports(filePath: string) {
    try {
      return await this.dependencyAnalyzer.getExports(filePath);
    } catch (error) {
      return [];
    }
  }
} 