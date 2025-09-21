import type { EnhancedErrorDNA } from '../types';
import { StackTraceParser, type StackTraceInfo, type StackFrame } from './stackTraceParser';
import { DependencyAnalyzer, type DependencyGraph } from './dependencyAnalyzer';

export class ErrorDNAGenerator {
  private stackTraceParser: StackTraceParser;
  private dependencyAnalyzer: DependencyAnalyzer;

  constructor(parser?: StackTraceParser, analyzer?: DependencyAnalyzer) {
    this.stackTraceParser = parser || new StackTraceParser();
    this.dependencyAnalyzer = analyzer || new DependencyAnalyzer(process.cwd());
  }

  async generateDNA(error: Error): Promise<EnhancedErrorDNA> {
    const stackTrace = this.stackTraceParser.parse(error.stack || '');
    const dependencies = await this.dependencyAnalyzer.getDependencyGraph(stackTrace[0]?.fileName || '');
    
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

  private extractErrorLocation(stackTrace: StackFrame[]) {
    const firstFrame = stackTrace[0];
    return {
      file: firstFrame?.fileName || 'unknown',
      line: firstFrame?.lineNumber || 0,
      column: firstFrame?.columnNumber || 0,
      functionName: firstFrame?.functionName || 'unknown',
      component: this.extractComponentName(firstFrame?.fileName || ''),
    };
  }

  private generateCodePreview(stackTrace: StackFrame[], location: { file: string; line: number }) {
    // For now, return a placeholder since we don't have source code access
    return `// Code preview for ${location.file} at line ${location.line}`;
  }

  private identifyHighlightedLines(
    stackTrace: StackFrame[],
    location: { file: string; line: number }
  ): number[] {
    const lines: number[] = [location.line];

    // Add related lines from the stack trace
    stackTrace.forEach(frame => {
      if (frame.fileName === location.file && frame.lineNumber) {
        lines.push(frame.lineNumber);
      }
    });

    return Array.from(new Set(lines)).sort((a, b) => a - b);
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

  private formatStackTrace(stackTrace: StackFrame[]) {
    return {
      frames: stackTrace.map(frame => ({
        file: frame.fileName,
        line: frame.lineNumber,
        column: frame.columnNumber,
        function: frame.functionName,
        context: frame.source,
      })),
    };
  }
} 