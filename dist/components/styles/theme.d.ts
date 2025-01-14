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
export declare const lightTheme: Theme;
export declare const darkTheme: Theme;
export declare const getTheme: (isDark: boolean) => Theme;
