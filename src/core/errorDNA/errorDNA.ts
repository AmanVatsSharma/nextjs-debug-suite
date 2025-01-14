import type { EnhancedErrorDNA } from '../types';
import { StackTraceParser, type StackTraceInfo } from './stackTraceParser';
import { DependencyAnalyzer, type DependencyGraph } from './dependencyAnalyzer';

export class ErrorDNAGenerator {
  private stackTraceParser: StackTraceParser;
  private dependencyAnalyzer: DependencyAnalyzer;

  constructor() {
    this.stackTraceParser = new StackTraceParser();
    this.dependencyAnalyzer = new DependencyAnalyzer();
  }

  async generateDNA(error: Error): Promise<EnhancedErrorDNA> {
    const stackTrace = await this.stackTraceParser.parse(error);
    const dependencies = await this.dependencyAnalyzer.analyzeDependencies(stackTrace.frames);
    
    const errorLocation = this.extractErrorLocation(stackTrace);
    const codePreview = this.generateCodePreview(stackTrace, errorLocation);
    const highlightedLines = this.identifyHighlightedLines(stackTrace, errorLocation);

    return {
      id: this.generateErrorId(error, errorLocation),
      timestamp: Date.now(),
      type: this.determineErrorType(error),
      location: errorLocation,
      package: await this.extractPackageInfo(errorLocation.file),
      visual: {
        codePreview,
        highlightedLines,
        dependencies,
        stackTrace: this.formatStackTrace(stackTrace),
      },
    };
  }

  private extractErrorLocation(stackTrace: StackTraceInfo) {
    const firstFrame = stackTrace.frames[0];
    return {
      file: firstFrame?.file || 'unknown',
      line: firstFrame?.lineNumber || 0,
      column: firstFrame?.column || 0,
      functionName: firstFrame?.methodName || 'unknown',
      component: this.extractComponentName(firstFrame?.file || ''),
    };
  }

  private generateCodePreview(stackTrace: StackTraceInfo, location: { file: string; line: number }) {
    const fileContent = stackTrace.sourceCode?.[location.file];
    if (!fileContent) return '';

    const contextLines = 5;
    const start = Math.max(0, location.line - contextLines);
    const end = Math.min(fileContent.length, location.line + contextLines);

    return fileContent.slice(start, end).join('\n');
  }

  private identifyHighlightedLines(
    stackTrace: StackTraceInfo,
    location: { file: string; line: number }
  ): number[] {
    const lines: number[] = [location.line];

    // Add related lines from the stack trace
    stackTrace.frames.forEach(frame => {
      if (frame.file === location.file && frame.lineNumber) {
        lines.push(frame.lineNumber);
      }
    });

    return [...new Set(lines)].sort((a, b) => a - b);
  }

  private generateErrorId(error: Error, location: { file: string; line: number }): string {
    const hash = this.hashString(
      `${error.name}:${error.message}:${location.file}:${location.line}`
    );
    return `ERR_${hash}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  private determineErrorType(error: Error): EnhancedErrorDNA['type'] {
    if (error instanceof TypeError || error instanceof SyntaxError) {
      return 'type';
    }
    if (error.message.toLowerCase().includes('network')) {
      return 'network';
    }
    if (error.message.toLowerCase().includes('memory') || 
        error.message.toLowerCase().includes('performance')) {
      return 'performance';
    }
    return 'runtime';
  }

  private async extractPackageInfo(filePath: string) {
    try {
      // This should be implemented to:
      // 1. Find the nearest package.json
      // 2. Extract package name and version
      // 3. Determine the path from the package root
      return {
        name: 'unknown',
        version: 'unknown',
        path: filePath.split('/'),
      };
    } catch {
      return undefined;
    }
  }

  private extractComponentName(filePath: string): string | undefined {
    // Extract component name from file path for React components
    const match = filePath.match(/[\/\\]([^\/\\]+)\.(?:tsx?|jsx?)$/);
    if (match && /^[A-Z]/.test(match[1])) {
      return match[1];
    }
    return undefined;
  }

  private formatStackTrace(stackTrace: StackTraceInfo) {
    return {
      frames: stackTrace.frames.map(frame => ({
        file: frame.file,
        line: frame.lineNumber,
        column: frame.column,
        function: frame.methodName,
        context: frame.context,
      })),
    };
  }
} 