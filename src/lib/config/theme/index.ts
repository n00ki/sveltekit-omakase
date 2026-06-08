import type { ThemeConfig, ThemeType } from '../config.schema';

export const themeConfig: ThemeConfig = {
  modes: {
    SYSTEM: 'system',
    LIGHT: 'light',
    DARK: 'dark'
  }
};

export type { ThemeType };
