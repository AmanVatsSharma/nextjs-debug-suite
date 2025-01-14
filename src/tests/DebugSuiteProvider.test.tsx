import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DebugSuiteProvider, useDebugContext } from '../components/DebugSuiteProvider';
import type { DebugConfig } from '../types/debug';

const TestComponent = () => {
  const { config, data, clearData, exportData } = useDebugContext();
  return (
    <div>
      <div data-testid="config">{JSON.stringify(config)}</div>
      <div data-testid="data">{JSON.stringify(data)}</div>
      <button onClick={() => clearData('errors')} data-testid="clear-errors">Clear Errors</button>
      <button onClick={() => clearData('performance')} data-testid="clear-performance">Clear Performance</button>
      <button onClick={() => {
        const exported = exportData('errors');
        (window as any).lastExported = exported;
      }} data-testid="export-errors">Export Errors</button>
    </div>
  );
};

describe('DebugSuiteProvider', () => {
  const mockConfig: DebugConfig = {
    overlay: {
      position: 'bottom-right',
      size: { width: 400, height: 600 },
      opacity: 0.95,
      theme: 'dark',
      tabs: ['errors', 'performance', 'network', 'console', 'ai']
    },
    monitors: {
      memory: true,
      performance: true,
      network: true,
      console: true,
      renders: true
    },
    ai: {
      enabled: true,
      provider: 'openai',
      features: ['analysis', 'fixes']
    }
  };

  it('provides config to children', () => {
    render(
      <DebugSuiteProvider config={mockConfig}>
        <TestComponent />
      </DebugSuiteProvider>
    );

    const configElement = screen.getByTestId('config');
    expect(JSON.parse(configElement.textContent!)).toEqual(mockConfig);
  });

  it('initializes with empty data', () => {
    render(
      <DebugSuiteProvider config={mockConfig}>
        <TestComponent />
      </DebugSuiteProvider>
    );

    const dataElement = screen.getByTestId('data');
    const data = JSON.parse(dataElement.textContent!);
    
    expect(data.errors).toHaveLength(0);
    expect(data.performance.metrics).toHaveLength(0);
    expect(data.network.requests).toHaveLength(0);
    expect(data.console.logs).toHaveLength(0);
    expect(data.ai.suggestions).toHaveLength(0);
  });

  it('clears data for specific tabs', () => {
    render(
      <DebugSuiteProvider config={mockConfig}>
        <TestComponent />
      </DebugSuiteProvider>
    );

    // Get initial data
    const initialDataElement = screen.getByTestId('data');
    const initialData = JSON.parse(initialDataElement.textContent!);

    // Clear errors
    act(() => {
      screen.getByTestId('clear-errors').click();
    });

    const updatedDataElement = screen.getByTestId('data');
    const updatedData = JSON.parse(updatedDataElement.textContent!);

    expect(updatedData.errors).toHaveLength(0);
    expect(updatedData.performance).toEqual(initialData.performance);
    expect(updatedData.network).toEqual(initialData.network);
  });

  it('exports data for specific tabs', () => {
    render(
      <DebugSuiteProvider config={mockConfig}>
        <TestComponent />
      </DebugSuiteProvider>
    );

    act(() => {
      screen.getByTestId('export-errors').click();
    });

    const exported = (window as any).lastExported;
    expect(exported).toHaveProperty('errors');
    expect(exported).not.toHaveProperty('performance');
    expect(exported).not.toHaveProperty('network');
  });

  it('throws error when useDebugContext is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDebugContext must be used within a DebugSuiteProvider');

    consoleError.mockRestore();
  });
}); 