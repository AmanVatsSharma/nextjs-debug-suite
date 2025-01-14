import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DebugSuiteProvider, useDebugContext } from '../components/DebugSuiteProvider';
var TestComponent = function () {
    var _a = useDebugContext(), config = _a.config, data = _a.data, clearData = _a.clearData, exportData = _a.exportData;
    return (React.createElement("div", null,
        React.createElement("div", { "data-testid": "config" }, JSON.stringify(config)),
        React.createElement("div", { "data-testid": "data" }, JSON.stringify(data)),
        React.createElement("button", { onClick: function () { return clearData('errors'); }, "data-testid": "clear-errors" }, "Clear Errors"),
        React.createElement("button", { onClick: function () { return clearData('performance'); }, "data-testid": "clear-performance" }, "Clear Performance"),
        React.createElement("button", { onClick: function () {
                var exported = exportData('errors');
                window.lastExported = exported;
            }, "data-testid": "export-errors" }, "Export Errors")));
};
describe('DebugSuiteProvider', function () {
    var mockConfig = {
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
    it('provides config to children', function () {
        render(React.createElement(DebugSuiteProvider, { config: mockConfig },
            React.createElement(TestComponent, null)));
        var configElement = screen.getByTestId('config');
        expect(JSON.parse(configElement.textContent)).toEqual(mockConfig);
    });
    it('initializes with empty data', function () {
        render(React.createElement(DebugSuiteProvider, { config: mockConfig },
            React.createElement(TestComponent, null)));
        var dataElement = screen.getByTestId('data');
        var data = JSON.parse(dataElement.textContent);
        expect(data.errors).toHaveLength(0);
        expect(data.performance.metrics).toHaveLength(0);
        expect(data.network.requests).toHaveLength(0);
        expect(data.console.logs).toHaveLength(0);
        expect(data.ai.suggestions).toHaveLength(0);
    });
    it('clears data for specific tabs', function () {
        render(React.createElement(DebugSuiteProvider, { config: mockConfig },
            React.createElement(TestComponent, null)));
        // Get initial data
        var initialDataElement = screen.getByTestId('data');
        var initialData = JSON.parse(initialDataElement.textContent);
        // Clear errors
        act(function () {
            screen.getByTestId('clear-errors').click();
        });
        var updatedDataElement = screen.getByTestId('data');
        var updatedData = JSON.parse(updatedDataElement.textContent);
        expect(updatedData.errors).toHaveLength(0);
        expect(updatedData.performance).toEqual(initialData.performance);
        expect(updatedData.network).toEqual(initialData.network);
    });
    it('exports data for specific tabs', function () {
        render(React.createElement(DebugSuiteProvider, { config: mockConfig },
            React.createElement(TestComponent, null)));
        act(function () {
            screen.getByTestId('export-errors').click();
        });
        var exported = window.lastExported;
        expect(exported).toHaveProperty('errors');
        expect(exported).not.toHaveProperty('performance');
        expect(exported).not.toHaveProperty('network');
    });
    it('throws error when useDebugContext is used outside provider', function () {
        var consoleError = jest.spyOn(console, 'error').mockImplementation(function () { });
        expect(function () {
            render(React.createElement(TestComponent, null));
        }).toThrow('useDebugContext must be used within a DebugSuiteProvider');
        consoleError.mockRestore();
    });
});
//# sourceMappingURL=DebugSuiteProvider.test.js.map