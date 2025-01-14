import React from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { EnhancedErrorDNA } from '../../core/types';
import { useDebugContext } from '../DebugSuiteProvider';

const ErrorContainer = styled.div`
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
`;

const ErrorHeader = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
`;

const ErrorContent = styled.div`
  padding: 12px;
`;

const CodePreview = styled.div`
  margin: 8px 0;
  border-radius: 4px;
  overflow: hidden;
`;

const AIAnalysis = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-radius: 4px;
`;

const AITitle = styled.h4`
  margin: 0 0 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

interface ErrorItemProps {
  error: EnhancedErrorDNA;
}

const ErrorItem: React.FC<ErrorItemProps> = ({ error }) => (
  <ErrorContainer>
    <ErrorHeader>
      <ErrorTitle>{error.type} Error</ErrorTitle>
      <ErrorMeta>
        {error.location.file}:{error.location.line}
        {error.location.component && ` in ${error.location.component}`}
      </ErrorMeta>
    </ErrorHeader>
    <ErrorContent>
      <CodePreview>
        <SyntaxHighlighter
          language="typescript"
          style={tomorrow}
          showLineNumbers
          wrapLines
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: error.visual.highlightedLines.includes(lineNumber)
                ? 'rgba(255, 0, 0, 0.1)'
                : undefined,
            },
          })}
        >
          {error.visual.codePreview}
        </SyntaxHighlighter>
      </CodePreview>
      {error.aiAnalysis && (
        <AIAnalysis>
          <AITitle>AI Analysis</AITitle>
          <div>{error.aiAnalysis.explanation}</div>
          {error.aiAnalysis.suggestedFix && (
            <>
              <AITitle>Suggested Fix</AITitle>
              <SyntaxHighlighter
                language="typescript"
                style={tomorrow}
                customStyle={{ margin: 0 }}
              >
                {error.aiAnalysis.suggestedFix}
              </SyntaxHighlighter>
            </>
          )}
        </AIAnalysis>
      )}
    </ErrorContent>
  </ErrorContainer>
);

export const ErrorsTab: React.FC = () => {
  const { config } = useDebugContext();
  const [errors] = React.useState<EnhancedErrorDNA[]>([]); // This will be connected to the error tracking system

  if (errors.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>
        No errors to display
      </div>
    );
  }

  return (
    <div>
      {errors.map(error => (
        <ErrorItem key={error.id} error={error} />
      ))}
    </div>
  );
}; 