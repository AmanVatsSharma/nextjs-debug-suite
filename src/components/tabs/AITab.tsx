import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDebugContext } from '../DebugSuiteProvider';
import { AIServiceManager } from '../../ai/factory';
import type { AIAnalysisResponse } from '../../ai/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const QueryInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 12px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ResponseContainer = styled.div`
  margin-top: 20px;
  flex: 1;
  overflow-y: auto;
`;

const ResponseCard = styled.div`
  background: ${({ theme }) => theme.colors.tabBackground};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResponseTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const ResponseContent = styled.div`
  padding: 12px;
`;

const CodeBlock = styled.div`
  margin: 8px 0;
  border-radius: 4px;
  overflow: hidden;
`;

interface AIResponse extends AIAnalysisResponse {
  type: 'analysis' | 'suggestion' | 'documentation';
  title: string;
  timestamp: number;
}

export const AITab: React.FC = () => {
  const { config } = useDebugContext();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const aiService = AIServiceManager.getInstance().getService();

  const handleSubmit = async () => {
    if (!query.trim() || !config.ai?.enabled || !aiService) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysisResponse = await aiService.analyze({
        type: 'general',
        context: {
          query,
        },
      });

      const response: AIResponse = {
        ...analysisResponse,
        type: 'analysis',
        title: 'AI Analysis',
        timestamp: Date.now(),
      };

      setResponses(prev => [response, ...prev]);
      setQuery('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      console.error('AI Analysis Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!config.ai?.enabled) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        AI features are disabled. Enable them in the configuration to use this feature.
      </div>
    );
  }

  if (!aiService) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        AI service is not configured. Please provide an API key in the configuration.
      </div>
    );
  }

  return (
    <Container>
      <QueryInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about performance, errors, or request suggestions for improvements..."
      />
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </Button>

      {error && (
        <div style={{ color: '#dc2626', margin: '12px 0', padding: '8px', background: '#fee2e2', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <ResponseContainer>
        {responses.map((response, index) => (
          <ResponseCard key={index}>
            <ResponseHeader>
              <ResponseTitle>{response.title}</ResponseTitle>
              <span style={{ fontSize: 12, color: '#666' }}>
                {new Date(response.timestamp).toLocaleTimeString()}
              </span>
            </ResponseHeader>
            <ResponseContent>
              <div>{response.explanation}</div>
              {response.suggestedFix && (
                <CodeBlock>
                  <SyntaxHighlighter
                    language="typescript"
                    style={tomorrow}
                    customStyle={{ margin: 0 }}
                  >
                    {response.suggestedFix}
                  </SyntaxHighlighter>
                </CodeBlock>
              )}
              {response.additionalContext && Object.entries(response.additionalContext).map(([key, value]) => (
                <div key={key} style={{ marginTop: 12 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: 13, color: '#666' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h4>
                  <div>{value}</div>
                </div>
              ))}
            </ResponseContent>
          </ResponseCard>
        ))}
      </ResponseContainer>
    </Container>
  );
}; 