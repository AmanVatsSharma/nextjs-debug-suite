import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { NetworkVisualizer } from '../components/network/NetworkVisualizer';
import { DebugSuiteProvider } from '../components/DebugSuiteProvider';
import { NetworkRequest } from '../core/networkMonitor';
import { lightTheme } from '../components/styles/theme';

const mockRequests: NetworkRequest[] = [
  {
    id: '1',
    url: 'https://api.example.com/users',
    method: 'GET',
    startTime: Date.now() - 5000,
    endTime: Date.now() - 4800,
    duration: 200,
    status: 200,
    statusText: 'OK',
    initiator: 'fetch',
    size: 1024,
  },
  {
    id: '2',
    url: 'https://api.example.com/posts',
    method: 'POST',
    startTime: Date.now() - 3000,
    endTime: Date.now() - 1000,
    duration: 2000,
    status: 500,
    statusText: 'Internal Server Error',
    initiator: 'fetch',
    error: new Error('Server error'),
    size: 512,
  },
  {
    id: '3',
    url: 'https://api.example.com/comments',
    method: 'GET',
    startTime: Date.now() - 1000,
    initiator: 'fetch',
  },
];

jest.mock('../core/networkMonitor', () => ({
  NetworkMonitor: jest.fn().mockImplementation(() => ({
    getRequests: () => mockRequests,
    getFailedRequests: () => mockRequests.filter(req => req.error || (req.status && req.status >= 400)),
    getSlowRequests: () => mockRequests.filter(req => req.duration && req.duration > 1000),
  })),
}));

const renderNetworkVisualizer = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <DebugSuiteProvider>
        <NetworkVisualizer />
      </DebugSuiteProvider>
    </ThemeProvider>
  );
};

describe('NetworkVisualizer', () => {
  it('renders all requests by default', () => {
    renderNetworkVisualizer();
    const requests = screen.getAllByRole('button');
    expect(requests).toHaveLength(mockRequests.length);
  });

  it('filters failed requests', () => {
    renderNetworkVisualizer();
    const failedButton = screen.getByText('Failed');
    fireEvent.click(failedButton);
    const requests = screen.getAllByRole('button');
    const failedRequests = mockRequests.filter(req => req.error || (req.status && req.status >= 400));
    expect(requests.length - 7).toBe(failedRequests.length); // Subtract 7 toolbar buttons
  });

  it('filters slow requests', () => {
    renderNetworkVisualizer();
    const slowButton = screen.getByText('Slow');
    fireEvent.click(slowButton);
    const requests = screen.getAllByRole('button');
    const slowRequests = mockRequests.filter(req => req.duration && req.duration > 1000);
    expect(requests.length - 7).toBe(slowRequests.length); // Subtract 7 toolbar buttons
  });

  it('searches requests by URL', () => {
    renderNetworkVisualizer();
    const searchInput = screen.getByPlaceholderText('Search requests...');
    fireEvent.change(searchInput, { target: { value: 'users' } });
    const requests = screen.getAllByRole('button');
    const filteredRequests = mockRequests.filter(req => req.url.includes('users'));
    expect(requests.length - 7).toBe(filteredRequests.length); // Subtract 7 toolbar buttons
  });

  it('displays request details when a request is selected', () => {
    renderNetworkVisualizer();
    const requests = screen.getAllByRole('button').slice(7); // Skip toolbar buttons
    fireEvent.click(requests[0]);
    
    // Check if details are displayed
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText(mockRequests[0].url)).toBeInTheDocument();
    expect(screen.getByText(mockRequests[0].method)).toBeInTheDocument();
    expect(screen.getByText(mockRequests[0].status!.toString())).toBeInTheDocument();
  });

  it('sorts requests by duration', () => {
    renderNetworkVisualizer();
    const durationButton = screen.getByText('Duration');
    fireEvent.click(durationButton);
    
    const requests = screen.getAllByRole('button').slice(7); // Skip toolbar buttons
    const durations = requests.map(req => {
      const durationText = within(req).getByText(/\d+ms|\d+\.\d+s/);
      return parseFloat(durationText.textContent!.replace('ms', '').replace('s', '000'));
    });
    
    expect(durations).toEqual([...durations].sort((a, b) => b - a));
  });

  it('sorts requests by size', () => {
    renderNetworkVisualizer();
    const sizeButton = screen.getByText('Size');
    fireEvent.click(sizeButton);
    
    const requests = screen.getAllByRole('button').slice(7); // Skip toolbar buttons
    const sizes = requests.map(req => {
      const sizeText = within(req).getByText(/\d+B|\d+\.\d+KB|\d+\.\d+MB/);
      return parseFloat(sizeText.textContent!.replace('B', '').replace('KB', '000').replace('MB', '000000'));
    });
    
    expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
  });
}); 