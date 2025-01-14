import React from 'react';
import styled from '@emotion/styled';
import { NetworkRequest } from '../../core/networkMonitor';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 8px;
  font-family: monospace;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 16px;
  align-items: baseline;
`;

const Label = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
`;

const Value = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: 12px;
  word-break: break-all;
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  color: ${props => props.theme.colors.text};
`;

interface RequestDetailsProps {
  request: NetworkRequest;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({ request }) => {
  const formatHeaders = (headers?: Record<string, string>) => {
    if (!headers) return null;
    return Object.entries(headers).map(([key, value]) => (
      <React.Fragment key={key}>
        <Label>{key}:</Label>
        <Value>{value}</Value>
      </React.Fragment>
    ));
  };

  const formatBody = (body: any) => {
    if (!body) return null;
    try {
      if (typeof body === 'string') {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(body);
          return JSON.stringify(parsed, null, 2);
        } catch {
          // If not JSON, return as is
          return body;
        }
      }
      return JSON.stringify(body, null, 2);
    } catch (error) {
      return String(body);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration.toFixed(0)}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatSize = (size?: number) => {
    if (!size) return 'N/A';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <Container>
      <Section>
        <SectionTitle>General</SectionTitle>
        <InfoGrid role="grid" aria-label="General Information">
          <Label>URL:</Label>
          <Value>{request.url}</Value>
          <Label>Method:</Label>
          <Value>{request.method}</Value>
          <Label>Status:</Label>
          <Value>{request.status || 'Pending'}</Value>
          <Label>Duration:</Label>
          <Value>{formatDuration(request.duration)}</Value>
          <Label>Size:</Label>
          <Value>{formatSize(request.size)}</Value>
          <Label>Initiator:</Label>
          <Value>{request.initiator}</Value>
        </InfoGrid>
      </Section>

      {request.requestHeaders && (
        <Section>
          <SectionTitle>Request Headers</SectionTitle>
          <InfoGrid role="grid" aria-label="Request Headers">
            {formatHeaders(request.requestHeaders)}
          </InfoGrid>
        </Section>
      )}

      {request.responseHeaders && (
        <Section>
          <SectionTitle>Response Headers</SectionTitle>
          <InfoGrid role="grid" aria-label="Response Headers">
            {formatHeaders(request.responseHeaders)}
          </InfoGrid>
        </Section>
      )}

      {request.requestBody && (
        <Section>
          <SectionTitle>Request Body</SectionTitle>
          <CodeBlock>{formatBody(request.requestBody)}</CodeBlock>
        </Section>
      )}

      {request.responseBody && (
        <Section>
          <SectionTitle>Response Body</SectionTitle>
          <CodeBlock>{formatBody(request.responseBody)}</CodeBlock>
        </Section>
      )}

      {request.error && (
        <Section>
          <SectionTitle>Error</SectionTitle>
          <CodeBlock style={{ color: props => props.theme.colors.error }}>
            {request.error.message}
            {request.error.stack && `\n\n${request.error.stack}`}
          </CodeBlock>
        </Section>
      )}
    </Container>
  );
}; 