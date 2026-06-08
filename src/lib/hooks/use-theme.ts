import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

import type { ThemeType } from '$config';
import { config } from '$config';

const themeModes = config.theme.modes;

/**
 * The user-selectable theme preference.
 */
export type Mode = ThemeType;

/**
 * Client-facing theme controls shared by theme UI components.
 */
export type ThemeControls = {
  cycleMode: () => void;
  readonly selectedMode: Mode;
  setMode: (mode: Mode) => void;
  setupKeyListener: () => () => void;
};

/**
 * Applies a theme preference. System mode resets the stored override.
 */
export function setThemeMode(mode: Mode): void {
  if (mode === themeModes.SYSTEM) {
    resetMode();
    return;
  }

  setMode(mode);
}

/**
 * Cycles through theme modes: system -> light -> dark -> system.
 */
export function cycleThemeMode(): void {
  const currentUserMode = userPrefersMode.current;

  if (currentUserMode === themeModes.SYSTEM) {
    setThemeMode(themeModes.LIGHT);
  } else if (currentUserMode === themeModes.LIGHT) {
    setThemeMode(themeModes.DARK);
  } else {
    setThemeMode(themeModes.SYSTEM);
  }
}

/**
 * Registers the keyboard shortcut for cycling themes.
 *
 * @returns A cleanup function that removes the listener.
 */
export function setupThemeCyclingKeyListener(): () => void {
  const keyListener = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === 't') {
      cycleThemeMode();
    }
  };

  window.addEventListener('keydown', keyListener);

  return () => {
    window.removeEventListener('keydown', keyListener);
  };
}

/**
 * Returns the shared theme API used by theme controls.
 */
export function useTheme(): ThemeControls {
  return {
    cycleMode: cycleThemeMode,
    get selectedMode(): Mode {
      return userPrefersMode.current;
    },
    setMode: setThemeMode,
    setupKeyListener: setupThemeCyclingKeyListener
  };
}
