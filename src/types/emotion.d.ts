import '@emotion/react';
import type { ThemeColors } from '../components/styles/theme';

declare module '@emotion/react' {
  export interface Theme {
    colors: ThemeColors;
  }
} 