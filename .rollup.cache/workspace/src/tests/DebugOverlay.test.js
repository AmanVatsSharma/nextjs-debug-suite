import { __assign, __rest } from "tslib";
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DebugOverlay } from '../components/DebugOverlay';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { ThemeProvider } from '@emotion/react';
import { darkTheme } from '../components/styles/theme';
// Mock the context hook
jest.mock('../components/DebugSuiteProvider', function () { return ({
    useDebugContext: jest.fn()
}); });
// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', function () { return ({
    motion: {
        div: function (_a) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return React.createElement("div", __assign({}, props), children);
        }
    },
}); });
// Mock react-icons
jest.mock('react-icons/md', function () { return ({
    MdDragIndicator: function () { return React.createElement("div", { "data-testid": "drag-indicator" }); }
}); });
// Mock tab components
jest.mock('../components/tabs/ErrorsTab', function () { return ({
    ErrorsTab: function () { return React.createElement("div", { "data-testid": "errors-content" }, "Errors Content"); }
}); });
jest.mock('../components/tabs/PerformanceTab', function () { return ({
    PerformanceTab: function () { return React.createElement("div", { "data-testid": "performance-content" }, "Performance Content"); }
}); });
jest.mock('../components/tabs/NetworkTab', function () { return ({
    NetworkTab: function () { return React.createElement("div", { "data-testid": "network-content" }, "Network Content"); }
}); });
jest.mock('../components/tabs/ConsoleTab', function () { return ({
    ConsoleTab: function () { return React.createElement("div", { "data-testid": "console-content" }, "Console Content"); }
}); });
jest.mock('../components/tabs/AITab', function () { return ({
    AITab: function () { return React.createElement("div", { "data-testid": "ai-content" }, "AI Content"); }
}); });
describe('DebugOverlay', function () {
    var mockClearData = jest.fn();
    var mockExportData = jest.fn();
    var mockConfig = {
        overlay: {
            tabs: ['errors', 'performance', 'network', 'console', 'ai'],
            position: 'top-right',
            size: { width: 400, height: 300 },
            opacity: 0.9,
            theme: 'dark'
        }
    };
    beforeEach(function () {
        // Mock URL.createObjectURL
        URL.createObjectURL = jest.fn(function () { return 'mock-url'; });
        URL.revokeObjectURL = jest.fn();
        // Mock document.createElement for the download link
        var mockLink = {
            href: '',
            download: '',
            click: jest.fn(),
            remove: jest.fn()
        };
        document.createElement = jest.fn().mockReturnValue(mockLink);
        useDebugContext.mockReturnValue({
            config: mockConfig,
            clearData: mockClearData,
            exportData: mockExportData
        });
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    var renderDebugOverlay = function () {
        return render(React.createElement(ThemeProvider, { theme: darkTheme },
            React.createElement(DebugOverlay, null)));
    };
    it('renders all configured tabs', function () {
        renderDebugOverlay();
        mockConfig.overlay.tabs.forEach(function (tab) {
            var tabElement = screen.getByText(tab.charAt(0).toUpperCase() + tab.slice(1));
            expect(tabElement).toBeInTheDocument();
        });
    });
    it('switches tab content when clicking different tabs', function () {
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
    it('renders action buttons', function () {
        renderDebugOverlay();
        expect(screen.getByText('Clear')).toBeInTheDocument();
        expect(screen.getByText('Export')).toBeInTheDocument();
    });
    it('renders resize handle', function () {
        renderDebugOverlay();
        expect(screen.getByTestId('drag-indicator')).toBeInTheDocument();
    });
    it('applies correct initial size from config', function () {
        renderDebugOverlay();
        var overlay = screen.getByTestId('overlay-container');
        expect(overlay).toHaveStyle({
            width: '400px',
            height: '300px'
        });
    });
    it('applies correct opacity from config', function () {
        renderDebugOverlay();
        var overlay = screen.getByTestId('overlay-container');
        expect(overlay).toHaveStyle({
            opacity: '0.9'
        });
    });
    it('calls clearData when Clear button is clicked', function () {
        renderDebugOverlay();
        fireEvent.click(screen.getByText('Clear'));
        expect(mockClearData).toHaveBeenCalledWith('errors'); // Initial tab
    });
    it('calls exportData when Export button is clicked', function () {
        renderDebugOverlay();
        fireEvent.click(screen.getByText('Export'));
        expect(mockExportData).toHaveBeenCalledWith('errors'); // Initial tab
    });
});
//# sourceMappingURL=DebugOverlay.test.js.map