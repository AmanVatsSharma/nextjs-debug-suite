import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetworkVisualizer } from '../components/network/NetworkVisualizer';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '../components/styles/theme';

// Mock useDebugContext
jest.mock('../components/DebugSuiteProvider', () => ({
  useDebugContext: jest.fn()
}));

const mockRequests = [
  {
    id: '1',
    method: 'GET',
    url: 'https://api.example.com/data',
    status: 200,
    startTime: Date.now(),
    duration: 100,
    size: 1024,
  },
  {
    id: '2',
    method: 'POST',
    url: 'https://api.example.com/error',
    status: 500,
    startTime: Date.now() - 1000,
    duration: 200,
    size: 512,
    error: new Error('Test error'),
  }
];

const mockNetwork = {
  getRequests: jest.fn().mockReturnValue(mockRequests),
  getFailedRequests: jest.fn().mockReturnValue([mockRequests[1]]),
  getSlowRequests: jest.fn().mockReturnValue([mockRequests[1]]),
};

const renderNetworkVisualizer = () => {
  (useDebugContext as jest.Mock).mockReturnValue({
    network: mockNetwork,
    config: {
      network: {
        slowRequestThreshold: 1000,
      }
    }
  });

  return render(
    <ThemeProvider theme={lightTheme}>
      <NetworkVisualizer />
    </ThemeProvider>
  );
};

describe('NetworkVisualizer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders requests', () => {
    renderNetworkVisualizer();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6); // 3 filter buttons + 3 sort buttons
  });

  it('filters failed requests', () => {
    renderNetworkVisualizer();
    fireEvent.click(screen.getByRole('button', { name: /failed/i }));
    expect(mockNetwork.getFailedRequests).toHaveBeenCalled();
  });

  it('filters slow requests', () => {
    renderNetworkVisualizer();
    fireEvent.click(screen.getByRole('button', { name: /slow/i }));
    expect(mockNetwork.getSlowRequests).toHaveBeenCalled();
  });

  it('searches requests by URL', () => {
    renderNetworkVisualizer();
    const searchInput = screen.getByPlaceholderText('Search requests...');
    fireEvent.change(searchInput, { target: { value: 'error' } });
    expect(screen.getByText('https://api.example.com/error')).toBeInTheDocument();
  });

  it('sorts requests by duration', () => {
    renderNetworkVisualizer();
    const durationButton = screen.getByRole('button', { name: /duration/i });
    fireEvent.click(durationButton);
    const requests = screen.getAllByText(/ms/);
    expect(requests[0]).toHaveTextContent('200ms'); // Longest duration first
  });

  it('sorts requests by size', () => {
    renderNetworkVisualizer();
    const sizeButton = screen.getByRole('button', { name: /size/i });
    fireEvent.click(sizeButton);
    const requests = screen.getAllByText(/[kb]/i);
    expect(requests[0]).toHaveTextContent('1.0KB'); // Largest size first
  });
}); 