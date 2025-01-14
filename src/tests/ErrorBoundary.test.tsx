import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useDebugContext } from '../components/DebugSuiteProvider';

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

  beforeEach(() => {
    (useDebugContext as jest.Mock).mockReturnValue({
      data: { errors: [] },
      config: {
        overlay: {
          theme: 'dark'
        }
      }
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(container).toHaveTextContent('Test content');
  });

  it('renders error UI when an error occurs', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('calls static getDerivedStateFromError correctly', () => {
    const result = ErrorBoundary.getDerivedStateFromError(mockError);
    expect(result).toEqual({ hasError: true, error: mockError });
  });

  it('provides error details in the UI', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(mockError.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Stack Trace/i })).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('allows error recovery', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    // Rerender with non-throwing child
    rerender(
      <ErrorBoundary>
        <div>Recovered content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Recovered content')).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('updates error state when new error occurs', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const firstError = screen.getByText(/Test error/i);
    expect(firstError).toBeInTheDocument();

    // New error
    const NewError = () => {
      throw new Error('New test error');
      return null;
    };

    rerender(
      <ErrorBoundary>
        <NewError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/New test error/i)).toBeInTheDocument();
    
    spy.mockRestore();
  });

  it('provides retry functionality', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;
    
    const ConditionalError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/i)).toBeInTheDocument();

    // Simulate retry
    shouldThrow = false;
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    retryButton.click();

    rerender(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    
    spy.mockRestore();
  });
}); 