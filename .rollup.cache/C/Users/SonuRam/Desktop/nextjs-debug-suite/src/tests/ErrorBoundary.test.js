import { __awaiter, __generator } from "tslib";
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useDebugContext } from '../components/DebugSuiteProvider';
import { darkTheme } from '../components/styles/theme';
// Mock the debug context
jest.mock('../components/DebugSuiteProvider', function () { return ({
    useDebugContext: jest.fn()
}); });
describe('ErrorBoundary', function () {
    var mockError = new Error('Test error');
    var mockErrorInfo = {
        componentStack: '\n    at Component\n    at div\n    at App'
    };
    // Component that throws an error
    var ThrowError = function () {
        throw mockError;
        return null;
    };
    var renderWithTheme = function (ui) {
        return render(React.createElement(ThemeProvider, { theme: darkTheme }, ui));
    };
    beforeEach(function () {
        useDebugContext.mockReturnValue({
            data: { errors: [] },
            config: {
                overlay: {
                    theme: 'dark'
                },
                ai: {
                    enabled: false
                }
            }
        });
        jest.spyOn(console, 'error').mockImplementation(function () { });
    });
    afterEach(function () {
        jest.clearAllMocks();
    });
    it('renders children when there is no error', function () {
        var container = renderWithTheme(React.createElement(ErrorBoundary, null,
            React.createElement("div", null, "Test content"))).container;
        expect(container).toHaveTextContent('Test content');
    });
    it('renders error UI when an error occurs', function () {
        renderWithTheme(React.createElement(ErrorBoundary, null,
            React.createElement(ThrowError, null)));
        expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
    it('calls static getDerivedStateFromError correctly', function () {
        var result = ErrorBoundary.getDerivedStateFromError(mockError);
        expect(result).toEqual({ hasError: true, error: mockError });
    });
    it('provides error details in the UI', function () {
        renderWithTheme(React.createElement(ErrorBoundary, null,
            React.createElement(ThrowError, null)));
        expect(screen.getByText('Error: Test error')).toBeInTheDocument();
    });
    it('allows error recovery', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rerender;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rerender = renderWithTheme(React.createElement(ErrorBoundary, null,
                        React.createElement(ThrowError, null))).rerender;
                    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
                    // Rerender with non-throwing child
                    return [4 /*yield*/, act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                rerender(React.createElement(ErrorBoundary, null,
                                    React.createElement("div", null, "Recovered content")));
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    // Rerender with non-throwing child
                    _a.sent();
                    // Wait for state update
                    return [4 /*yield*/, screen.findByText('Recovered content')];
                case 2:
                    // Wait for state update
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates error state when new error occurs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rerender, NewError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rerender = renderWithTheme(React.createElement(ErrorBoundary, null,
                        React.createElement(ThrowError, null))).rerender;
                    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
                    NewError = function () {
                        throw new Error('New test error');
                        return null;
                    };
                    return [4 /*yield*/, act(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                rerender(React.createElement(ErrorBoundary, null,
                                    React.createElement(NewError, null)));
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    // Wait for state update
                    return [4 /*yield*/, screen.findByText('Error: New test error')];
                case 2:
                    // Wait for state update
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=ErrorBoundary.test.js.map