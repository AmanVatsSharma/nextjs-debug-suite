import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { useTheme } from '@emotion/react';
import { darkTheme, lightTheme } from '../components/styles/theme';

// Test component that uses the theme
const TestComponent = () => {
  const theme = useTheme();
  return (
    <div data-testid="theme-test">
      {JSON.stringify(theme)}
    </div>
  );
};

describe('ThemeProvider', () => {
  it('provides dark theme when specified', () => {
    const { getByTestId } = render(
      <ThemeProvider isDark={true}>
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe(darkTheme.colors.background);
    expect(theme.colors.text).toBe(darkTheme.colors.text);
  });

  it('provides light theme when specified', () => {
    const { getByTestId } = render(
      <ThemeProvider isDark={false}>
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe(lightTheme.colors.background);
    expect(theme.colors.text).toBe(lightTheme.colors.text);
  });

  it('uses light theme by default', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe(lightTheme.colors.background);
    expect(theme.colors.text).toBe(lightTheme.colors.text);
  });
}); 