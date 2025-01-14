import React from 'react';
import styled from '@emotion/styled';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ErrorDNAGenerator } from '../core/errorDNA/errorDNA';
import type { EnhancedErrorDNA } from '../core/types';
import { useDebugContext } from './DebugSuiteProvider';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
`;

const ErrorHeader = styled.div`
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h2`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.error};
  font-size: 18px;
`;

const ErrorMeta = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CodeSection = styled.div`
  margin: 16px 0;
`;

const SectionTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const DependencySection = styled.div`
  margin: 16px 0;
`;

const DependencyGraph = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.colors.tabBackground};
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
`;

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorDNA?: EnhancedErrorDNA;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorDNAGenerator: ErrorDNAGenerator;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.errorDNAGenerator = new ErrorDNAGenerator();
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const errorDNA = await this.errorDNAGenerator.generateDNA(error);
      this.setState({ errorDNA, errorInfo });
    } catch (e) {
      console.error('Failed to generate error DNA:', e);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return <ErrorBoundaryFallback errorState={this.state} />;
  }
}

const ErrorBoundaryFallback: React.FC<{ errorState: ErrorBoundaryState }> = ({ errorState }) => {
  const { error, errorDNA } = errorState;
  const { config } = useDebugContext();

  if (!error) return null;

  return (
    <ErrorContainer>
      <ErrorHeader>
        <ErrorTitle>{error.name}: {error.message}</ErrorTitle>
        {errorDNA && (
          <ErrorMeta>
            {errorDNA.location.file}:{errorDNA.location.line}
            {errorDNA.location.component && ` in ${errorDNA.location.component}`}
          </ErrorMeta>
        )}
      </ErrorHeader>

      {errorDNA && (
        <>
          <CodeSection>
            <SectionTitle>Code Preview</SectionTitle>
            <SyntaxHighlighter
              language="typescript"
              style={tomorrow}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber: number) => ({
                style: {
                  backgroundColor: errorDNA.visual.highlightedLines.includes(lineNumber)
                    ? 'rgba(255, 0, 0, 0.1)'
                    : undefined,
                },
              })}
            >
              {errorDNA.visual.codePreview}
            </SyntaxHighlighter>
          </CodeSection>

          <DependencySection>
            <SectionTitle>Dependencies</SectionTitle>
            <DependencyGraph>
              {Object.entries(errorDNA.visual.dependencies.nodes).map(([id, node]) => (
                <div key={id}>
                  {node.name} ({node.type}):
                  {node.dependencies.length > 0 && (
                    <ul>
                      {node.dependencies.map(dep => (
                        <li key={dep}>{dep}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </DependencyGraph>
          </DependencySection>

          {config.ai?.enabled && errorDNA.aiAnalysis && (
            <>
              <SectionTitle>AI Analysis</SectionTitle>
              <div>{errorDNA.aiAnalysis.explanation}</div>
              {errorDNA.aiAnalysis.suggestedFix && (
                <CodeSection>
                  <SectionTitle>Suggested Fix</SectionTitle>
                  <SyntaxHighlighter
                    language="typescript"
                    style={tomorrow}
                  >
                    {errorDNA.aiAnalysis.suggestedFix}
                  </SyntaxHighlighter>
                </CodeSection>
              )}
            </>
          )}
        </>
      )}
    </ErrorContainer>
  );
}; 