import React from 'react';
import type { EnhancedErrorDNA } from '../../core/types';
import type { DependencyGraph } from '../../core/errorDNA/dependencyAnalyzer';
interface ErrorDNAVisualizerProps {
    errorDNA: EnhancedErrorDNA;
    dependencyGraph?: DependencyGraph;
}
export declare const ErrorDNAVisualizer: React.FC<ErrorDNAVisualizerProps>;
export {};
