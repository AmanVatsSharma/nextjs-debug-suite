import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme, Theme } from './styles/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  isDark?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isDark = false,
}) => {
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  );
}; 