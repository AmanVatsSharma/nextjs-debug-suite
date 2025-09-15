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
export declare const lightTheme: Theme;
export declare const darkTheme: Theme;
export declare const getTheme: (isDark: boolean) => Theme;
