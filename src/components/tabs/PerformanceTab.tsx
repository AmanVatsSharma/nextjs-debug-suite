import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDebugContext } from '../DebugSuiteProvider';

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.tabBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
`;

const MetricTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const MetricValue = styled.div<{ status?: 'warning' | 'error' | 'success' }>`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme, status }) => {
    switch (status) {
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.primary;
    }
  }};
`;

const MetricMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status?: 'warning' | 'error' | 'success';
  timestamp: number;
}

interface ResourceMetric {
  name: string;
  duration: number;
  size: number;
  timestamp: number;
}

export const PerformanceTab: React.FC = () => {
  const { performance } = useDebugContext();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [resources, setResources] = useState<ResourceMetric[]>([]);

  useEffect(() => {
    // Memory metrics
    const memoryInterval = setInterval(() => {
      performance.trackMemory();
    }, 5000);

    // Resource timing
    const resourceInterval = setInterval(() => {
      performance.trackResourceTiming();
    }, 10000);

    return () => {
      clearInterval(memoryInterval);
      clearInterval(resourceInterval);
    };
  }, [performance]);

  const getStatusForMetric = (name: string, value: number): PerformanceMetric['status'] => {
    switch (name) {
      case 'Memory Usage':
        return value > 80 ? 'error' : value > 60 ? 'warning' : 'success';
      case 'First Paint':
        return value > 3000 ? 'error' : value > 1000 ? 'warning' : 'success';
      default:
        return undefined;
    }
  };

  return (
    <div>
      <Section>
        <SectionTitle>Real-time Metrics</SectionTitle>
        {metrics.map(metric => (
          <MetricCard key={metric.name}>
            <MetricTitle>{metric.name}</MetricTitle>
            <MetricValue status={metric.status}>
              {metric.value.toFixed(2)} {metric.unit}
            </MetricValue>
            <MetricMeta>
              Last updated: {new Date(metric.timestamp).toLocaleTimeString()}
            </MetricMeta>
          </MetricCard>
        ))}
      </Section>

      <Section>
        <SectionTitle>Resource Performance</SectionTitle>
        {resources.map(resource => (
          <MetricCard key={resource.name}>
            <MetricTitle>{resource.name}</MetricTitle>
            <MetricValue>
              {resource.duration.toFixed(2)} ms
            </MetricValue>
            <MetricMeta>
              Size: {(resource.size / 1024).toFixed(2)} KB
            </MetricMeta>
          </MetricCard>
        ))}
      </Section>
    </div>
  );
}; 