export interface StackFrame {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    functionName: string;
    source?: string;
}
export declare class StackTraceParser {
    parse(stackTrace: string): StackFrame[];
    private normalizeFileName;
    private normalizeFunctionName;
    getSourcePosition(frame: StackFrame): {
        line: number;
        column: number;
    };
    getFunctionContext(frame: StackFrame): string;
    isNodeModule(frame: StackFrame): boolean;
    isUserCode(frame: StackFrame): boolean;
}
