import { parse, StackFrame as ParsedStackFrame } from 'stacktrace-parser';

export interface StackFrame {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  functionName: string;
  source?: string;
}

export class StackTraceParser {
  parse(stackTrace: string): StackFrame[] {
    if (!stackTrace) return [];

    try {
      const frames = parse(stackTrace);
      return frames.map((frame: ParsedStackFrame) => ({
        fileName: this.normalizeFileName(frame.file || ''),
        lineNumber: frame.lineNumber || 0,
        columnNumber: frame.column || 0,
        functionName: this.normalizeFunctionName(frame.methodName || ''),
        source: frame.file
      }));
    } catch (error) {
      return [];
    }
  }

  private normalizeFileName(fileName: string): string {
    // Remove webpack:// and similar prefixes
    fileName = fileName.replace(/^(webpack|webpack-internal|file):\/\/\/?/, '');
    
    // Remove query parameters
    fileName = fileName.split('?')[0];
    
    // Convert Windows paths to Unix-style
    fileName = fileName.replace(/\\/g, '/');
    
    return fileName;
  }

  private normalizeFunctionName(functionName: string): string {
    // Remove webpack specific wrappers
    functionName = functionName.replace(/^webpack_require__\./, '');
    
    // Remove TypeScript async wrapper
    functionName = functionName.replace(/^async\s+/, '');
    
    // Remove anonymous function markers
    functionName = functionName.replace(/<anonymous>/, 'anonymous');
    
    // Clean up common patterns
    functionName = functionName
      .replace(/\s+/g, '')
      .replace(/^Object\./, '')
      .replace(/^Array\./, '')
      .replace(/^Function\./, '');
    
    return functionName || 'anonymous';
  }

  getSourcePosition(frame: StackFrame): { line: number; column: number } {
    return {
      line: frame.lineNumber,
      column: frame.columnNumber
    };
  }

  getFunctionContext(frame: StackFrame): string {
    return frame.functionName || 'anonymous';
  }

  isNodeModule(frame: StackFrame): boolean {
    return frame.fileName.includes('node_modules');
  }

  isUserCode(frame: StackFrame): boolean {
    return !this.isNodeModule(frame) && !frame.fileName.includes('webpack');
  }
} 