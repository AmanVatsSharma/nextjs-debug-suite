import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { useTheme } from '@emotion/react';
import { darkTheme, lightTheme } from '../components/styles/theme';
// Test component that uses the theme
var TestComponent = function () {
    var theme = useTheme();
    return (React.createElement("div", { "data-testid": "theme-test" }, JSON.stringify(theme)));
};
describe('ThemeProvider', function () {
    it('provides dark theme when specified', function () {
        var getByTestId = render(React.createElement(ThemeProvider, { isDark: true },
            React.createElement(TestComponent, null))).getByTestId;
        var themeTest = getByTestId('theme-test');
        var theme = JSON.parse(themeTest.textContent);
        expect(theme.colors.background).toBe(darkTheme.colors.background);
        expect(theme.colors.text).toBe(darkTheme.colors.text);
    });
    it('provides light theme when specified', function () {
        var getByTestId = render(React.createElement(ThemeProvider, { isDark: false },
            React.createElement(TestComponent, null))).getByTestId;
        var themeTest = getByTestId('theme-test');
        var theme = JSON.parse(themeTest.textContent);
        expect(theme.colors.background).toBe(lightTheme.colors.background);
        expect(theme.colors.text).toBe(lightTheme.colors.text);
    });
    it('uses light theme by default', function () {
        var getByTestId = render(React.createElement(ThemeProvider, null,
            React.createElement(TestComponent, null))).getByTestId;
        var themeTest = getByTestId('theme-test');
        var theme = JSON.parse(themeTest.textContent);
        expect(theme.colors.background).toBe(lightTheme.colors.background);
        expect(theme.colors.text).toBe(lightTheme.colors.text);
    });
});
//# sourceMappingURL=ThemeProvider.test.js.map