export const Theme = {
  SYSTEM: 'system',
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const THEMES = Object.values(Theme);
export type ThemeType = (typeof Theme)[keyof typeof Theme];
