import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DebugOverlay } from '../components/DebugOverlay';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { ThemeProvider } from '@emotion/react';

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

describe('DebugOverlay', () => {
  const mockConfig = {
    overlay: {
      tabs: ['errors', 'performance', 'network', 'console', 'ai'],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      opacity: 0.9,
      theme: 'dark'
    }
  };

  beforeEach(() => {
    (useDebugContext as jest.Mock).mockReturnValue({ config: mockConfig });
  });

  it('renders all configured tabs', () => {
    render(<DebugOverlay />);
    
    mockConfig.overlay.tabs.forEach(tab => {
      const tabElement = screen.getByText(tab.charAt(0).toUpperCase() + tab.slice(1));
      expect(tabElement).toBeInTheDocument();
    });
  });

  it('switches tab content when clicking different tabs', () => {
    render(<DebugOverlay />);
    
    // Click Performance tab
    fireEvent.click(screen.getByText('Performance'));
    expect(screen.getByTestId('performance-tab')).toBeInTheDocument();

    // Click Network tab
    fireEvent.click(screen.getByText('Network'));
    expect(screen.getByTestId('network-tab')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<DebugOverlay />);
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders resize handle', () => {
    render(<DebugOverlay />);
    expect(screen.getByTestId('drag-indicator')).toBeInTheDocument();
  });

  it('applies correct initial size from config', () => {
    render(<DebugOverlay />);
    
    const overlay = screen.getByTestId('overlay-container');
    expect(overlay).toHaveStyle({
      width: '400px',
      height: '300px'
    });
  });

  it('applies correct opacity from config', () => {
    render(<DebugOverlay />);
    
    const overlay = screen.getByTestId('overlay-container');
    expect(overlay).toHaveStyle({
      opacity: '0.9'
    });
  });

  // Add mock implementations for tab components
  const mockTabComponents = () => {
    jest.mock('../components/tabs/ErrorsTab', () => ({
      ErrorsTab: () => <div data-testid="errors-tab">Errors Content</div>
    }));
    
    jest.mock('../components/tabs/PerformanceTab', () => ({
      PerformanceTab: () => <div data-testid="performance-tab">Performance Content</div>
    }));
    
    jest.mock('../components/tabs/NetworkTab', () => ({
      NetworkTab: () => <div data-testid="network-tab">Network Content</div>
    }));
    
    jest.mock('../components/tabs/ConsoleTab', () => ({
      ConsoleTab: () => <div data-testid="console-tab">Console Content</div>
    }));
    
    jest.mock('../components/tabs/AITab', () => ({
      AITab: () => <div data-testid="ai-tab">AI Content</div>
    }));
  };

  beforeAll(() => {
    mockTabComponents();
  });
}); 