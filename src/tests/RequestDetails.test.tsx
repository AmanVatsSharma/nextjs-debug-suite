import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { RequestDetails } from '../components/network/RequestDetails';
import { NetworkRequest } from '../core/networkMonitor';
import { lightTheme } from '../components/styles/theme';

const mockRequest: NetworkRequest = {
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

const mockErrorRequest: NetworkRequest = {
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

const renderRequestDetails = (request: NetworkRequest) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <RequestDetails request={request} />
    </ThemeProvider>
  );
};

describe('RequestDetails', () => {
  it('displays general request information', () => {
    renderRequestDetails(mockRequest);

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText(mockRequest.url)).toBeInTheDocument();
    expect(screen.getByText(mockRequest.method)).toBeInTheDocument();
    expect(screen.getByText(mockRequest.status!.toString())).toBeInTheDocument();
    expect(screen.getByText('200ms')).toBeInTheDocument();
    expect(screen.getByText('1.0KB')).toBeInTheDocument();
    expect(screen.getByText(mockRequest.initiator)).toBeInTheDocument();
  });

  it('displays request headers', () => {
    renderRequestDetails(mockRequest);

    expect(screen.getByText('Request Headers')).toBeInTheDocument();
    expect(screen.getByText('content-type:')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('authorization:')).toBeInTheDocument();
    expect(screen.getByText('Bearer token')).toBeInTheDocument();
  });

  it('displays response headers', () => {
    renderRequestDetails(mockRequest);

    expect(screen.getByText('Response Headers')).toBeInTheDocument();
    expect(screen.getByText('content-type:')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('cache-control:')).toBeInTheDocument();
    expect(screen.getByText('no-cache')).toBeInTheDocument();
  });

  it('displays request body', () => {
    renderRequestDetails(mockRequest);

    expect(screen.getByText('Request Body')).toBeInTheDocument();
    const requestBody = screen.getByText((content) => 
      content.includes('"name": "John Doe"') && 
      content.includes('"email": "john@example.com"')
    );
    expect(requestBody).toBeInTheDocument();
  });

  it('displays response body', () => {
    renderRequestDetails(mockRequest);

    expect(screen.getByText('Response Body')).toBeInTheDocument();
    const responseBody = screen.getByText((content) => 
      content.includes('"id": 123') && 
      content.includes('"name": "John Doe"') && 
      content.includes('"email": "john@example.com"') &&
      content.includes('"createdAt": "2023-01-01T00:00:00Z"')
    );
    expect(responseBody).toBeInTheDocument();
  });

  it('displays error information for failed requests', () => {
    renderRequestDetails(mockErrorRequest);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Resource not found')).toBeInTheDocument();
  });

  it('formats request body as JSON when possible', () => {
    const requestWithStringBody: NetworkRequest = {
      ...mockRequest,
      requestBody: JSON.stringify({ test: 'value' }),
    };

    renderRequestDetails(requestWithStringBody);
    const requestBody = screen.getByText((content) => 
      content.includes('"test": "value"')
    );
    expect(requestBody).toBeInTheDocument();
  });

  it('displays raw request body when not JSON', () => {
    const requestWithRawBody: NetworkRequest = {
      ...mockRequest,
      requestBody: 'plain text content',
    };

    renderRequestDetails(requestWithRawBody);
    expect(screen.getByText('plain text content')).toBeInTheDocument();
  });

  it('handles missing optional fields', () => {
    const minimalRequest: NetworkRequest = {
      id: '3',
      url: 'https://api.example.com/test',
      method: 'GET',
      startTime: Date.now(),
      initiator: 'fetch',
    };

    renderRequestDetails(minimalRequest);

    const naValues = screen.getAllByText('N/A');
    expect(naValues).toHaveLength(2); // Duration and Size
    expect(screen.getByText('Pending')).toBeInTheDocument(); // Status
    expect(screen.queryByText('Request Headers')).not.toBeInTheDocument();
    expect(screen.queryByText('Response Headers')).not.toBeInTheDocument();
    expect(screen.queryByText('Request Body')).not.toBeInTheDocument();
    expect(screen.queryByText('Response Body')).not.toBeInTheDocument();
  });
}); 