declare module 'stacktrace-parser' {
  export interface StackFrame {
    file?: string;
    methodName?: string;
    lineNumber?: number;
    column?: number;
  }

  export function parse(stackTrace: string): StackFrame[];
} 