export interface StateChange {
    id: string;
    timestamp: number;
    type: 'redux' | 'context' | 'useState' | 'custom';
    componentName?: string;
    action?: {
        type: string;
        payload?: any;
    };
    prevState: any;
    nextState: any;
    diff?: {
        added?: Record<string, any>;
        removed?: Record<string, any>;
        updated?: Record<string, any>;
    };
}
export declare class StateDebugMonitor {
    private debug;
    private changes;
    private maxChanges;
    private changeCallbacks;
    private reduxMiddleware?;
    private contextPatches;
    trackReduxChanges(): any;
    trackContextChanges(contextName: string, prevValue: any, nextValue: any): void;
    trackStateChanges(componentName: string, hookId: string, prevState: any, nextState: any): void;
    trackCustomChanges(name: string, prevState: any, nextState: any, metadata?: Record<string, any>): void;
    private captureChange;
    private calculateDiff;
    getChanges(filter?: {
        type?: StateChange['type'];
        componentName?: string;
        actionType?: string;
    }): StateChange[];
    getChange(id: string): StateChange | undefined;
    getLatestChange(componentName?: string): StateChange | undefined;
    clearChanges(): void;
    onChange(callback: (change: StateChange) => void): () => void;
    private notifyChangeCallbacks;
    destroy(): void;
}
