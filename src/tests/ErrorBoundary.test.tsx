import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { darkTheme } from '../components/styles/theme';

// Mock the debug context
jest.mock('../components/DebugSuiteProvider', () => ({
  useDebugContext: jest.fn()
}));

describe('ErrorBoundary', () => {
  const mockError = new Error('Test error');
  const mockErrorInfo = {
    componentStack: '\n    at Component\n    at div\n    at App'
  };

  // Component that throws an error
  const ThrowError = () => {
    throw mockError;
    return null;
  };

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={darkTheme}>
        {ui}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    (useDebugContext as jest.Mock).mockReturnValue({
      data: { errors: [] },
      config: {
        overlay: {
          theme: 'dark'
        },
        ai: {
          enabled: false
        }
      }
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { container } = renderWithTheme(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('Test content');
  });

  it('renders error UI when an error occurs', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('calls static getDerivedStateFromError correctly', () => {
    const result = ErrorBoundary.getDerivedStateFromError(mockError);
    expect(result).toEqual({ hasError: true, error: mockError });
  });

  it('provides error details in the UI', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });

  it('allows error recovery', async () => {
    const { rerender } = renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    // Rerender with non-throwing child
    await act(async () => {
      rerender(
        <ErrorBoundary>
          <div>Recovered content</div>
        </ErrorBoundary>
      );
    });

    // Wait for state update
    await screen.findByText('Recovered content');
  });

  it('updates error state when new error occurs', async () => {
    const { rerender } = renderWithTheme(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();

    // New error
    const NewError = () => {
      throw new Error('New test error');
      return null;
    };

    await act(async () => {
      rerender(
        <ErrorBoundary>
          <NewError />
        </ErrorBoundary>
      );
    });

    // Wait for state update
    await screen.findByText('Error: New test error');
  });
}); 