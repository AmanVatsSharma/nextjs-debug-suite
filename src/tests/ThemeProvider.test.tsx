import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { useTheme } from '@emotion/react';

// Mock matchMedia for system theme detection
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

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
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it('provides dark theme when specified', () => {
    const { getByTestId } = render(
      <ThemeProvider theme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe('#1a1a1a');
    expect(theme.colors.text).toBe('#ffffff');
  });

  it('provides light theme when specified', () => {
    const { getByTestId } = render(
      <ThemeProvider theme="light">
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe('#ffffff');
    expect(theme.colors.text).toBe('#000000');
  });

  it('uses system theme preference when set to system', () => {
    // Mock system dark theme preference
    mockMatchMedia(true);

    const { getByTestId } = render(
      <ThemeProvider theme="system">
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.colors.background).toBe('#1a1a1a');
    expect(theme.colors.text).toBe('#ffffff');
  });

  it('updates theme when system preference changes', () => {
    let mediaQueryCallback: ((e: { matches: boolean }) => void) | null = null;
    
    // Mock matchMedia with callback capture
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: (event: string, cb: any) => {
        if (event === 'change') {
          mediaQueryCallback = cb;
        }
      },
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { getByTestId } = render(
      <ThemeProvider theme="system">
        <TestComponent />
      </ThemeProvider>
    );

    // Initial light theme
    let themeTest = getByTestId('theme-test');
    let theme = JSON.parse(themeTest.textContent!);
    expect(theme.colors.background).toBe('#ffffff');

    // Simulate system theme change to dark
    if (mediaQueryCallback) {
      mediaQueryCallback({ matches: true });
    }

    themeTest = getByTestId('theme-test');
    theme = JSON.parse(themeTest.textContent!);
    expect(theme.colors.background).toBe('#1a1a1a');
  });

  it('provides consistent spacing and typography values', () => {
    const { getByTestId } = render(
      <ThemeProvider theme="light">
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.spacing).toBeDefined();
    expect(theme.typography).toBeDefined();
    expect(theme.typography.fontFamily).toBeDefined();
    expect(theme.typography.fontSize).toBeDefined();
  });

  it('provides breakpoint values', () => {
    const { getByTestId } = render(
      <ThemeProvider theme="light">
        <TestComponent />
      </ThemeProvider>
    );

    const themeTest = getByTestId('theme-test');
    const theme = JSON.parse(themeTest.textContent!);
    
    expect(theme.breakpoints).toBeDefined();
    expect(theme.breakpoints.mobile).toBeDefined();
    expect(theme.breakpoints.tablet).toBeDefined();
    expect(theme.breakpoints.desktop).toBeDefined();
  });
}); 