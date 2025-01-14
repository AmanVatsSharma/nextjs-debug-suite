import React from 'react';
import type { DependencyGraph } from '../../core/errorDNA/dependencyAnalyzer';
interface DependencyVisualizerProps {
    graph: DependencyGraph;
    errorNodeId?: string;
}
export declare const DependencyVisualizer: React.FC<DependencyVisualizerProps>;
export {};
