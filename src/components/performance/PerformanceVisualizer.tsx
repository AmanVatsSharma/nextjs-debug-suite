import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { PerformanceMetric } from '../../core/performanceMonitor';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
`;

const MetricGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MetricValue = styled.span`
  font-family: monospace;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BarChart = styled(motion.div)`
  width: 100%;
  height: 200px;
  position: relative;
  margin-top: 1rem;
`;

const Bar = styled(motion.div)<{ height: string; color: string }>`
  position: absolute;
  bottom: 0;
  width: 20px;
  height: ${props => props.height};
  background-color: ${props => props.color};
  border-radius: 4px 4px 0 0;
`;

const BarLabel = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
`;

interface PerformanceVisualizerProps {
  metrics: PerformanceMetric[];
}

export const PerformanceVisualizer: React.FC<PerformanceVisualizerProps> = ({
  metrics,
}) => {
  const renderMetrics = useMemo(() => {
    return metrics.filter(metric => metric.type === 'render');
  }, [metrics]);

  const memoryMetrics = useMemo(() => {
    return metrics.filter(metric => metric.type === 'memory');
  }, [metrics]);

  const resourceMetrics = useMemo(() => {
    return metrics.filter(metric => metric.type === 'resource');
  }, [metrics]);

  const maxRenderTime = useMemo(() => {
    return Math.max(...renderMetrics.map(metric => metric.duration || 0));
  }, [renderMetrics]);

  return (
    <Container>
      <MetricGroup>
        <MetricHeader>
          <MetricTitle>Component Render Times</MetricTitle>
          <MetricValue>{renderMetrics.length} renders</MetricValue>
        </MetricHeader>
        <BarChart>
          {renderMetrics.map((metric, index) => {
            const height = metric.duration ? (metric.duration / maxRenderTime) * 180 : 0;
            return (
              <Bar
                key={`${metric.name}-${metric.timestamp}`}
                height={`${height}px`}
                color={metric.duration && metric.duration > 16 ? '#ff5252' : '#4caf50'}
                style={{ left: `${index * 30}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ duration: 0.3 }}
              >
                <BarLabel>{metric.name}</BarLabel>
              </Bar>
            );
          })}
        </BarChart>
      </MetricGroup>

      {memoryMetrics.length > 0 && (
        <MetricGroup>
          <MetricHeader>
            <MetricTitle>Memory Usage</MetricTitle>
            <MetricValue>
              {((memoryMetrics[memoryMetrics.length - 1].details?.usedJSHeapSize || 0) / 1024 / 1024).toFixed(1)} MB
            </MetricValue>
          </MetricHeader>
        </MetricGroup>
      )}

      {resourceMetrics.length > 0 && (
        <MetricGroup>
          <MetricHeader>
            <MetricTitle>Resource Timings</MetricTitle>
            <MetricValue>{resourceMetrics.length} resources</MetricValue>
          </MetricHeader>
          {resourceMetrics.map(metric => (
            <div key={`${metric.name}-${metric.timestamp}`}>
              <MetricValue>
                {metric.name} - {metric.duration?.toFixed(2)}ms
                {metric.details?.size && ` (${(metric.details.size / 1024).toFixed(1)} KB)`}
              </MetricValue>
            </div>
          ))}
        </MetricGroup>
      )}
    </Container>
  );
}; 