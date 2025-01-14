export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  white: string;
}

export interface Theme {
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  hover: '#f0f0f0',
  primary: '#007aff',
  secondary: '#5856d6',
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  white: '#ffffff',
};

const darkColors: ThemeColors = {
  background: '#1a1a1a',
  surface: '#2c2c2c',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#404040',
  hover: '#363636',
  primary: '#0a84ff',
  secondary: '#5e5ce6',
  success: '#32d74b',
  warning: '#ff9f0a',
  error: '#ff453a',
  white: '#ffffff',
};

export const lightTheme: Theme = {
  colors: lightColors,
};

export const darkTheme: Theme = {
  colors: darkColors,
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
}; 