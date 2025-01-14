import React, { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { NetworkRequest } from '../../core/networkMonitor';
import { useDebugContext } from '../DebugSuiteProvider';
import { RequestDetails } from './RequestDetails';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  cursor: pointer;
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.hover};
  }
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const RequestList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  border-right: 1px solid ${props => props.theme.colors.border};
`;

const DetailsPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const RequestItem = styled.div<{ failed?: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  background: ${props => {
    if (props.selected) return props.theme.colors.primary + '20';
    if (props.failed) return props.theme.colors.error + '20';
    return props.theme.colors.surface;
  }};
  cursor: pointer;
  &:hover {
    background: ${props => props.selected ? props.theme.colors.primary + '30' : props.theme.colors.hover};
  }
`;

const Method = styled.span<{ method: string }>`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
  background: ${props => {
    switch (props.method) {
      case 'GET': return props.theme.colors.success + '20';
      case 'POST': return props.theme.colors.primary + '20';
      case 'PUT': return props.theme.colors.warning + '20';
      case 'DELETE': return props.theme.colors.error + '20';
      default: return props.theme.colors.surface;
    }
  }};
  color: ${props => {
    switch (props.method) {
      case 'GET': return props.theme.colors.success;
      case 'POST': return props.theme.colors.primary;
      case 'PUT': return props.theme.colors.warning;
      case 'DELETE': return props.theme.colors.error;
      default: return props.theme.colors.text;
    }
  }};
`;

interface StatusProps {
  $status: number | null;
}

const StatusContainer = styled.span<StatusProps>`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 8px;
  background: ${props => {
    if (!props.$status) return props.theme.colors.surface;
    if (props.$status < 300) return props.theme.colors.success + '20';
    if (props.$status < 400) return props.theme.colors.warning + '20';
    return props.theme.colors.error + '20';
  }};
  color: ${props => {
    if (!props.$status) return props.theme.colors.text;
    if (props.$status < 300) return props.theme.colors.success;
    if (props.$status < 400) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
`;

interface DurationProps {
  $duration: number | null;
}

const DurationContainer = styled.span<DurationProps>`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-right: 8px;
  background: ${props => {
    if (!props.$duration) return props.theme.colors.surface;
    if (props.$duration < 300) return props.theme.colors.success + '20';
    if (props.$duration < 1000) return props.theme.colors.warning + '20';
    return props.theme.colors.error + '20';
  }};
  color: ${props => {
    if (!props.$duration) return props.theme.colors.text;
    if (props.$duration < 300) return props.theme.colors.success;
    if (props.$duration < 1000) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
`;

const Url = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.colors.text};
`;

const Size = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: 8px;
`;

export const NetworkVisualizer: React.FC = () => {
  const { network } = useDebugContext();
  const [filter, setFilter] = useState<'all' | 'failed' | 'slow'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'size'>('time');
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);

  const requests = useMemo(() => {
    let filtered: NetworkRequest[];

    // Apply filter
    switch (filter) {
      case 'failed':
        filtered = network.getFailedRequests();
        break;
      case 'slow':
        filtered = network.getSlowRequests();
        break;
      default:
        filtered = network.getRequests();
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(req => 
        req.url.toLowerCase().includes(searchLower) ||
        req.method.toLowerCase().includes(searchLower) ||
        (req.status?.toString() || '').includes(searchLower)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'size':
          return (b.size || 0) - (a.size || 0);
        default:
          return b.startTime - a.startTime;
      }
    });
  }, [network, filter, search, sortBy]);

  const formatSize = (size?: number) => {
    if (!size) return 'N/A';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    if (duration < 1000) return `${duration.toFixed(0)}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <Container>
      <Toolbar>
        <Button active={filter === 'all'} onClick={() => setFilter('all')}>All</Button>
        <Button active={filter === 'failed'} onClick={() => setFilter('failed')}>Failed</Button>
        <Button active={filter === 'slow'} onClick={() => setFilter('slow')}>Slow</Button>
        <SearchInput
          placeholder="Search requests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button active={sortBy === 'time'} onClick={() => setSortBy('time')}>Time</Button>
        <Button active={sortBy === 'duration'} onClick={() => setSortBy('duration')}>Duration</Button>
        <Button active={sortBy === 'size'} onClick={() => setSortBy('size')}>Size</Button>
      </Toolbar>
      <Content>
        <RequestList>
          {requests.map(request => (
            <RequestItem
              key={request.id}
              failed={request.error !== undefined || (request.status !== undefined && request.status >= 400)}
              selected={selectedRequest?.id === request.id}
              onClick={() => setSelectedRequest(request)}
            >
              <Method method={request.method}>{request.method}</Method>
              <StatusContainer $status={request.status ?? null}>
                {request.status || 'Pending'}
              </StatusContainer>
              <DurationContainer $duration={request.duration ?? null}>
                {formatDuration(request.duration)}
              </DurationContainer>
              <Url>{request.url}</Url>
              <Size>{formatSize(request.size)}</Size>
            </RequestItem>
          ))}
        </RequestList>
        <DetailsPanel>
          {selectedRequest && <RequestDetails request={selectedRequest} />}
        </DetailsPanel>
      </Content>
    </Container>
  );
}; 