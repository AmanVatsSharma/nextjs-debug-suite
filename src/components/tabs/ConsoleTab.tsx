import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
import type { DebugLog } from '../../core/types';

const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) =>
    active ? 'white' : theme.colors.text};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.hover};
  }
`;

const SearchInput = styled.input`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  flex: 1;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogEntry = styled.div<{ type: string }>`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-family: monospace;
  font-size: 12px;
  ${({ type, theme }) => {
    switch (type) {
      case 'ERROR':
        return `color: ${theme.colors.error};`;
      case 'WARN':
        return `color: ${theme.colors.warning};`;
      case 'INFO':
        return `color: ${theme.colors.info};`;
      default:
        return `color: ${theme.colors.text};`;
    }
  }}

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`;

const Timestamp = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
`;

const Source = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
`;

const DataPreview = styled.div`
  margin-top: 4px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-radius: 4px;
`;

export const ConsoleTab: React.FC = () => {
  const { debug } = useDebugContext();
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<number>>(new Set());

  useEffect(() => {
    const unsubscribe = debug.subscribe((log) => {
      setLogs(prev => [log, ...prev]);
    });

    return unsubscribe;
  }, [debug]);

  const toggleFilter = (type: string) => {
    const newFilters = new Set(filters);
    if (newFilters.has(type)) {
      newFilters.delete(type);
    } else {
      newFilters.add(type);
    }
    setFilters(newFilters);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredLogs = logs.filter(log => {
    if (filters.size > 0 && !filters.has(log.type)) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <FilterBar>
        <FilterButton
          active={filters.has('ERROR')}
          onClick={() => toggleFilter('ERROR')}
        >
          Errors
        </FilterButton>
        <FilterButton
          active={filters.has('WARN')}
          onClick={() => toggleFilter('WARN')}
        >
          Warnings
        </FilterButton>
        <FilterButton
          active={filters.has('INFO')}
          onClick={() => toggleFilter('INFO')}
        >
          Info
        </FilterButton>
        <SearchInput
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FilterBar>

      <div>
        {filteredLogs.map((log, index) => (
          <LogEntry
            key={index}
            type={log.type}
            onClick={() => toggleExpanded(index)}
          >
            <Timestamp>{new Date(log.timestamp).toLocaleTimeString()}</Timestamp>
            <Source>[{log.source}]</Source>
            <span>{log.message}</span>
            {expandedLogs.has(index) && log.data && (
              <DataPreview>
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  customStyle={{ margin: 0 }}
                >
                  {JSON.stringify(log.data, null, 2)}
                </SyntaxHighlighter>
              </DataPreview>
            )}
          </LogEntry>
        ))}
      </div>
    </div>
  );
}; 