import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetworkVisualizer } from '../components/network/NetworkVisualizer';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { ThemeProvider } from '@emotion/react';
import { lightTheme } from '../components/styles/theme';
// Mock useDebugContext
jest.mock('../components/DebugSuiteProvider', function () { return ({
    useDebugContext: jest.fn()
}); });
var mockRequests = [
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
var mockNetwork = {
    getRequests: jest.fn().mockReturnValue(mockRequests),
    getFailedRequests: jest.fn().mockReturnValue([mockRequests[1]]),
    getSlowRequests: jest.fn().mockReturnValue([mockRequests[1]]),
};
var renderNetworkVisualizer = function () {
    useDebugContext.mockReturnValue({
        network: mockNetwork,
        config: {
            network: {
                slowRequestThreshold: 1000,
            }
        }
    });
    return render(React.createElement(ThemeProvider, { theme: lightTheme },
        React.createElement(NetworkVisualizer, null)));
};
describe('NetworkVisualizer', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    it('renders requests', function () {
        renderNetworkVisualizer();
        var buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(6); // 3 filter buttons + 3 sort buttons
    });
    it('filters failed requests', function () {
        renderNetworkVisualizer();
        fireEvent.click(screen.getByRole('button', { name: /failed/i }));
        expect(mockNetwork.getFailedRequests).toHaveBeenCalled();
    });
    it('filters slow requests', function () {
        renderNetworkVisualizer();
        fireEvent.click(screen.getByRole('button', { name: /slow/i }));
        expect(mockNetwork.getSlowRequests).toHaveBeenCalled();
    });
    it('searches requests by URL', function () {
        renderNetworkVisualizer();
        var searchInput = screen.getByPlaceholderText('Search requests...');
        fireEvent.change(searchInput, { target: { value: 'error' } });
        expect(screen.getByText('https://api.example.com/error')).toBeInTheDocument();
    });
    it('sorts requests by duration', function () {
        renderNetworkVisualizer();
        var durationButton = screen.getByRole('button', { name: /duration/i });
        fireEvent.click(durationButton);
        var requests = screen.getAllByText(/ms/);
        expect(requests[0]).toHaveTextContent('200ms'); // Longest duration first
    });
    it('sorts requests by size', function () {
        renderNetworkVisualizer();
        var sizeButton = screen.getByRole('button', { name: /size/i });
        fireEvent.click(sizeButton);
        var requests = screen.getAllByText(/[kb]/i);
        expect(requests[0]).toHaveTextContent('1.0KB'); // Largest size first
    });
});
//# sourceMappingURL=NetworkVisualizer.test.js.map