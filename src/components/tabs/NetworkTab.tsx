import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';

const RequestCard = styled.div`
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
`;

const RequestHeader = styled.div<{ status?: number }>`
  padding: 12px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  ${({ status, theme }) => {
    if (!status) return '';
    if (status >= 500) return `color: ${theme.colors.error};`;
    if (status >= 400) return `color: ${theme.colors.warning};`;
    if (status >= 200 && status < 300) return `color: ${theme.colors.success};`;
    return '';
  }}
`;

const Method = styled.span<{ method: string }>`
  font-weight: 600;
  margin-right: 8px;
  ${({ method, theme }) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return `color: ${theme.colors.info};`;
      case 'POST':
        return `color: ${theme.colors.success};`;
      case 'PUT':
        return `color: ${theme.colors.warning};`;
      case 'DELETE':
        return `color: ${theme.colors.error};`;
      default:
        return '';
    }
  }}
`;

const Status = styled.span<{ status?: number }>`
  font-weight: 500;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  ${({ status, theme }) => {
    if (!status) return '';
    if (status >= 500) return `background: ${theme.colors.error}; color: white;`;
    if (status >= 400) return `background: ${theme.colors.warning}; color: white;`;
    if (status >= 200 && status < 300) return `background: ${theme.colors.success}; color: white;`;
    return '';
  }}
`;

const RequestDetails = styled.div`
  padding: 12px;
`;

const DetailSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.h4`
  margin: 0 0 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
`;

interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  duration?: number;
  requestData?: any;
  responseData?: any;
  timestamp: number;
  error?: Error;
}

const NetworkRequest: React.FC<{ request: NetworkRequest }> = ({ request }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <RequestCard>
      <RequestHeader
        status={request.status}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <Method method={request.method}>{request.method}</Method>
          <span>{request.url}</span>
        </div>
        <div>
          {request.status && <Status status={request.status}>{request.status}</Status>}
          {request.duration && (
            <span style={{ marginLeft: 8, fontSize: 12 }}>
              {request.duration.toFixed(2)}ms
            </span>
          )}
        </div>
      </RequestHeader>
      {isExpanded && (
        <RequestDetails>
          {request.requestData && (
            <DetailSection>
              <DetailTitle>Request Data</DetailTitle>
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{ margin: 0 }}
              >
                {JSON.stringify(request.requestData, null, 2)}
              </SyntaxHighlighter>
            </DetailSection>
          )}
          {request.responseData && (
            <DetailSection>
              <DetailTitle>Response Data</DetailTitle>
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{ margin: 0 }}
              >
                {JSON.stringify(request.responseData, null, 2)}
              </SyntaxHighlighter>
            </DetailSection>
          )}
          {request.error && (
            <DetailSection>
              <DetailTitle>Error</DetailTitle>
              <div style={{ color: '#dc2626' }}>{request.error.message}</div>
            </DetailSection>
          )}
        </RequestDetails>
      )}
    </RequestCard>
  );
};

export const NetworkTab: React.FC = () => {
  const { network } = useDebugContext();
  const [requests, setRequests] = useState<NetworkRequest[]>([]);

  useEffect(() => {
    // Subscribe to network events
    const unsubscribe = network.debug.subscribe((log) => {
      if (log.type === 'NETWORK' || log.type === 'NETWORK_ERROR') {
        setRequests(prev => [log.data as NetworkRequest, ...prev]);
      }
    });

    return unsubscribe;
  }, [network]);

  if (requests.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        No network requests captured
      </div>
    );
  }

  return (
    <div>
      {requests.map((request, index) => (
        <NetworkRequest key={index} request={request} />
      ))}
    </div>
  );
}; 