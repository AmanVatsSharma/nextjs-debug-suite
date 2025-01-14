import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { motion } from 'framer-motion';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { EnhancedErrorDNA } from '../../core/types';
import type { DependencyGraph } from '../../core/errorDNA/dependencyAnalyzer';
import { DependencyVisualizer } from './DependencyVisualizer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ErrorLocation = styled.div`
  font-family: monospace;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CodePreview = styled(motion.div)`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

const HighlightedLine = styled.div<{ isError?: boolean }>`
  background: ${({ theme, isError }) => isError 
    ? theme.colors.error.background 
    : theme.colors.highlight.background};
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5rem;
  opacity: 0.3;
`;

interface ErrorDNAVisualizerProps {
  errorDNA: EnhancedErrorDNA;
  dependencyGraph?: DependencyGraph;
}

export const ErrorDNAVisualizer: React.FC<ErrorDNAVisualizerProps> = ({
  errorDNA,
  dependencyGraph,
}) => {
  const theme = useTheme();

  return (
    <Container>
      <Header>
        <Title>Error DNA Analysis</Title>
        <ErrorLocation>
          {errorDNA.location.file}:{errorDNA.location.line}
        </ErrorLocation>
      </Header>

      <CodePreview
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {errorDNA.visual.highlightedLines.map(line => (
          <HighlightedLine
            key={line}
            style={{ top: `${(line - 1) * 1.5}rem` }}
            isError={line === errorDNA.location.line}
          />
        ))}
        <SyntaxHighlighter
          language="typescript"
          style={vs2015}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            borderRadius: '4px',
            fontSize: '0.9rem',
            background: theme.colors.background.primary,
            color: theme.colors.text.primary,
          }}
        >
          {errorDNA.visual.codePreview}
        </SyntaxHighlighter>
      </CodePreview>

      {errorDNA.aiAnalysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4>AI Analysis</h4>
          <p>{errorDNA.aiAnalysis.explanation}</p>
          {errorDNA.aiAnalysis.suggestedFix && (
            <>
              <h4>Suggested Fix</h4>
              <SyntaxHighlighter
                language="typescript"
                style={vs2015}
                customStyle={{
                  margin: 0,
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  background: theme.colors.background.primary,
                  color: theme.colors.text.primary,
                }}
              >
                {errorDNA.aiAnalysis.suggestedFix}
              </SyntaxHighlighter>
            </>
          )}
        </motion.div>
      )}

      {dependencyGraph && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h4>Dependency Chain</h4>
          <DependencyVisualizer
            graph={dependencyGraph}
            errorNodeId={errorDNA.location.file}
          />
        </motion.div>
      )}
    </Container>
  );
}; 