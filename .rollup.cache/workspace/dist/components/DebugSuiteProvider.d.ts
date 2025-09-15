import React from 'react';
import type { DebugConfig, DebugData } from '../types/debug';
interface DebugContextValue {
    config: DebugConfig;
    data: DebugData;
    clearData: (tab: string) => void;
    exportData: (tab: string) => any;
    debug: any;
    network: any;
    performance: any;
}
export declare const useDebugContext: () => DebugContextValue;
interface DebugSuiteProviderProps {
    children: React.ReactNode;
    config: DebugConfig;
}
export declare const DebugSuiteProvider: React.FC<DebugSuiteProviderProps>;
export {};
