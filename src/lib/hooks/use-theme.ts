import { resetMode, setMode, userPrefersMode } from 'mode-watcher';

/**
 * Cycles through theme modes: system → light → dark → system
 */
export function cycleThemeMode(): void {
  const currentUserMode = userPrefersMode.current;
  if (currentUserMode === 'system') {
    setMode('light');
  } else if (currentUserMode === 'light') {
    setMode('dark');
  } else {
    resetMode();
  }
}

/**
 * Sets up a keyboard listener for theme cycling.
 * Listens for 't' key and cycles through themes.
 * Ignores key presses when typing in input fields.
 *
 * @returns Cleanup function to remove the event listener
 */
export function setupThemeCyclingKeyListener(): () => void {
  const keyListener = (e: KeyboardEvent) => {
    // Ignore key presses when typing in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (e.key === 't') {
      cycleThemeMode();
    }
  };

  window.addEventListener('keydown', keyListener);

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', keyListener);
  };
}

/**
 * Custom hook for theme cycling with keyboard support.
 */
export function useTheme() {
  return {
    cycleMode: cycleThemeMode,
    setupKeyListener: setupThemeCyclingKeyListener
  };
}
