import { __assign } from "tslib";
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { RequestDetails } from '../components/network/RequestDetails';
import { lightTheme } from '../components/styles/theme';
var mockRequest = {
    id: '1',
    url: 'https://api.example.com/users',
    method: 'POST',
    startTime: Date.now() - 5000,
    endTime: Date.now() - 4800,
    duration: 200,
    status: 201,
    statusText: 'Created',
    initiator: 'fetch',
    size: 1024,
    requestHeaders: {
        'content-type': 'application/json',
        'authorization': 'Bearer token',
    },
    responseHeaders: {
        'content-type': 'application/json',
        'cache-control': 'no-cache',
    },
    requestBody: {
        name: 'John Doe',
        email: 'john@example.com',
    },
    responseBody: {
        id: 123,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00Z',
    },
};
var mockErrorRequest = {
    id: '2',
    url: 'https://api.example.com/users/invalid',
    method: 'GET',
    startTime: Date.now() - 3000,
    endTime: Date.now() - 2800,
    duration: 200,
    status: 404,
    statusText: 'Not Found',
    initiator: 'fetch',
    error: new Error('Resource not found'),
};
var renderRequestDetails = function (request) {
    return render(React.createElement(ThemeProvider, { theme: lightTheme },
        React.createElement(RequestDetails, { request: request })));
};
describe('RequestDetails', function () {
    it('displays general request information', function () {
        renderRequestDetails(mockRequest);
        var generalSection = screen.getByRole('heading', { name: /General/i }).parentElement;
        expect(generalSection).toBeInTheDocument();
        var grid = within(generalSection).getByRole('grid');
        expect(within(grid).getByText(mockRequest.url)).toBeInTheDocument();
        expect(within(grid).getByText(mockRequest.method)).toBeInTheDocument();
        expect(within(grid).getByText(mockRequest.status.toString())).toBeInTheDocument();
        expect(within(grid).getByText('200ms')).toBeInTheDocument();
        expect(within(grid).getByText('1.0KB')).toBeInTheDocument();
        expect(within(grid).getByText(mockRequest.initiator)).toBeInTheDocument();
    });
    it('displays request headers', function () {
        renderRequestDetails(mockRequest);
        var headersSection = screen.getByRole('heading', { name: /Request Headers/i }).parentElement;
        expect(headersSection).toBeInTheDocument();
        var grid = within(headersSection).getByRole('grid');
        expect(within(grid).getByText(/^content-type:$/i)).toBeInTheDocument();
        expect(within(grid).getByText('application/json')).toBeInTheDocument();
        expect(within(grid).getByText(/^authorization:$/i)).toBeInTheDocument();
        expect(within(grid).getByText('Bearer token')).toBeInTheDocument();
    });
    it('displays response headers', function () {
        renderRequestDetails(mockRequest);
        var headersSection = screen.getByRole('heading', { name: /Response Headers/i }).parentElement;
        expect(headersSection).toBeInTheDocument();
        var grid = within(headersSection).getByRole('grid');
        expect(within(grid).getByText(/^content-type:$/i)).toBeInTheDocument();
        expect(within(grid).getByText('application/json')).toBeInTheDocument();
        expect(within(grid).getByText(/^cache-control:$/i)).toBeInTheDocument();
        expect(within(grid).getByText('no-cache')).toBeInTheDocument();
    });
    it('displays request body', function () {
        renderRequestDetails(mockRequest);
        var bodySection = screen.getByRole('heading', { name: /Request Body/i }).parentElement;
        expect(bodySection).toBeInTheDocument();
        var codeBlock = within(bodySection).getByText(function (content) {
            return content.includes('"name": "John Doe"') &&
                content.includes('"email": "john@example.com"') &&
                !content.includes('"id"');
        } // Ensure we're not matching response body
        );
        expect(codeBlock).toBeInTheDocument();
    });
    it('displays response body', function () {
        renderRequestDetails(mockRequest);
        var bodySection = screen.getByRole('heading', { name: /Response Body/i }).parentElement;
        expect(bodySection).toBeInTheDocument();
        var codeBlock = within(bodySection).getByText(function (content) {
            return content.includes('"id": 123') &&
                content.includes('"name": "John Doe"') &&
                content.includes('"email": "john@example.com"') &&
                content.includes('"createdAt": "2023-01-01T00:00:00Z"');
        });
        expect(codeBlock).toBeInTheDocument();
    });
    it('displays error information for failed requests', function () {
        renderRequestDetails(mockErrorRequest);
        var errorSection = screen.getByRole('heading', { name: /Error/i }).parentElement;
        expect(errorSection).toBeInTheDocument();
        var errorMessage = within(errorSection).getByText(/Resource not found/i);
        expect(errorMessage).toBeInTheDocument();
    });
    it('formats request body as JSON when possible', function () {
        var requestWithStringBody = __assign(__assign({}, mockRequest), { requestBody: JSON.stringify({ test: 'value' }) });
        renderRequestDetails(requestWithStringBody);
        var bodySection = screen.getByRole('heading', { name: /Request Body/i }).parentElement;
        var codeBlock = within(bodySection).getByText(function (content) {
            return content.includes('"test": "value"');
        });
        expect(codeBlock).toBeInTheDocument();
    });
    it('displays raw request body when not JSON', function () {
        var requestWithRawBody = __assign(__assign({}, mockRequest), { requestBody: 'plain text content' });
        renderRequestDetails(requestWithRawBody);
        var bodySection = screen.getByRole('heading', { name: /Request Body/i }).parentElement;
        expect(within(bodySection).getByText('plain text content')).toBeInTheDocument();
    });
    it('handles missing optional fields', function () {
        var minimalRequest = {
            id: '3',
            url: 'https://api.example.com/test',
            method: 'GET',
            startTime: Date.now(),
            initiator: 'fetch',
        };
        renderRequestDetails(minimalRequest);
        var generalSection = screen.getByRole('heading', { name: /General/i }).parentElement;
        var grid = within(generalSection).getByRole('grid');
        var naValues = within(grid).getAllByText('N/A');
        expect(naValues).toHaveLength(2); // Duration and Size
        expect(within(grid).getByText('Pending')).toBeInTheDocument(); // Status
        expect(screen.queryByRole('heading', { name: /Request Headers/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Response Headers/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Request Body/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /Response Body/i })).not.toBeInTheDocument();
    });
});
//# sourceMappingURL=RequestDetails.test.js.map