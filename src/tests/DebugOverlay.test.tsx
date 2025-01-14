import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DebugOverlay } from '../components/DebugOverlay';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from '../components/styles/theme';

// Mock the context hook
jest.mock('../components/DebugSuiteProvider', () => ({
  useDebugContext: jest.fn()
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
}));

// Mock react-icons
jest.mock('react-icons/md', () => ({
  MdDragIndicator: () => <div data-testid="drag-indicator" />
}));

// Mock tab components
jest.mock('../components/tabs/ErrorsTab', () => ({
  ErrorsTab: () => <div data-testid="errors-content">Errors Content</div>
}));

jest.mock('../components/tabs/PerformanceTab', () => ({
  PerformanceTab: () => <div data-testid="performance-content">Performance Content</div>
}));

jest.mock('../components/tabs/NetworkTab', () => ({
  NetworkTab: () => <div data-testid="network-content">Network Content</div>
}));

jest.mock('../components/tabs/ConsoleTab', () => ({
  ConsoleTab: () => <div data-testid="console-content">Console Content</div>
}));

jest.mock('../components/tabs/AITab', () => ({
  AITab: () => <div data-testid="ai-content">AI Content</div>
}));

describe('DebugOverlay', () => {
  const mockClearData = jest.fn();
  const mockExportData = jest.fn();
  const mockConfig = {
    overlay: {
      tabs: ['errors', 'performance', 'network', 'console', 'ai'],
      position: 'top-right',
      size: { width: 400, height: 300 },
      opacity: 0.9,
      theme: 'dark'
    }
  };

  beforeEach(() => {
    // Mock URL.createObjectURL
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
    
    // Mock document.createElement for the download link
    const mockLink = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn()
    };
    document.createElement = jest.fn().mockReturnValue(mockLink);

    (useDebugContext as jest.Mock).mockReturnValue({
      config: mockConfig,
      clearData: mockClearData,
      exportData: mockExportData
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderDebugOverlay = () => {
    return render(
      <ThemeProvider theme={darkTheme}>
        <DebugOverlay />
      </ThemeProvider>
    );
  };

  it('renders all configured tabs', () => {
    renderDebugOverlay();
    mockConfig.overlay.tabs.forEach(tab => {
      const tabElement = screen.getByText(tab.charAt(0).toUpperCase() + tab.slice(1));
      expect(tabElement).toBeInTheDocument();
    });
  });

  it('switches tab content when clicking different tabs', () => {
    renderDebugOverlay();
    
    // Initial tab should be errors
    expect(screen.getByTestId('errors-content')).toBeInTheDocument();
    
    // Click Performance tab
    fireEvent.click(screen.getByText('Performance'));
    expect(screen.getByTestId('performance-content')).toBeInTheDocument();

    // Click Network tab
    fireEvent.click(screen.getByText('Network'));
    expect(screen.getByTestId('network-content')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderDebugOverlay();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders resize handle', () => {
    renderDebugOverlay();
    expect(screen.getByTestId('drag-indicator')).toBeInTheDocument();
  });

  it('applies correct initial size from config', () => {
    renderDebugOverlay();
    const overlay = screen.getByTestId('overlay-container');
    expect(overlay).toHaveStyle({
      width: '400px',
      height: '300px'
    });
  });

  it('applies correct opacity from config', () => {
    renderDebugOverlay();
    const overlay = screen.getByTestId('overlay-container');
    expect(overlay).toHaveStyle({
      opacity: '0.9'
    });
  });

  it('calls clearData when Clear button is clicked', () => {
    renderDebugOverlay();
    fireEvent.click(screen.getByText('Clear'));
    expect(mockClearData).toHaveBeenCalledWith('errors'); // Initial tab
  });

  it('calls exportData when Export button is clicked', () => {
    renderDebugOverlay();
    fireEvent.click(screen.getByText('Export'));
    expect(mockExportData).toHaveBeenCalledWith('errors'); // Initial tab
  });
}); 