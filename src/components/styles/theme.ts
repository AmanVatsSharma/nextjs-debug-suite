export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
  };
  surface: string;
  text: {
    primary: string;
    secondary: string;
  };
  textSecondary: string;
  border: string;
  hover: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: {
    background: string;
  };
  highlight: {
    background: string;
  };
  info: string;
  tabBackground: string;
  white: string;
}

export interface Theme {
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
  },
  surface: '#f5f5f5',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
  },
  textSecondary: '#666666',
  border: '#e0e0e0',
  hover: '#f0f0f0',
  primary: '#007aff',
  secondary: '#5856d6',
  success: '#34c759',
  warning: '#ff9500',
  error: {
    background: '#ff3b30',
  },
  highlight: {
    background: '#fff3cd',
  },
  info: '#17a2b8',
  tabBackground: '#f8f9fa',
  white: '#ffffff',
};

const darkColors: ThemeColors = {
  background: {
    primary: '#1a1a1a',
    secondary: '#2c2c2c',
  },
  surface: '#2c2c2c',
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
  },
  textSecondary: '#a0a0a0',
  border: '#404040',
  hover: '#363636',
  primary: '#0a84ff',
  secondary: '#5e5ce6',
  success: '#32d74b',
  warning: '#ff9f0a',
  error: {
    background: '#ff453a',
  },
  highlight: {
    background: '#3d2914',
  },
  info: '#17a2b8',
  tabBackground: '#2c2c2c',
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