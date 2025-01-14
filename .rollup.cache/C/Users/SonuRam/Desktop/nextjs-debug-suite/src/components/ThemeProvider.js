import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from './styles/theme';
export var ThemeProvider = function (_a) {
    var children = _a.children, _b = _a.isDark, isDark = _b === void 0 ? false : _b;
    var theme = isDark ? darkTheme : lightTheme;
    return (React.createElement(EmotionThemeProvider, { theme: theme }, children));
};
//# sourceMappingURL=ThemeProvider.js.map