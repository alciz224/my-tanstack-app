/**
 * Theme Data Types
 *
 * Defines the TypeScript contract for theme-related data operations.
 * Used by both local and API adapters to ensure type safety.
 */

export interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
}

/**
 * Data adapter interface for theme operations.
 * Server functions depend ONLY on this interface - no adapter-specific types leak upward.
 */
export interface ThemeDataAdapter {
  getTheme: () => Promise<ThemeState>
  setTheme: (theme: ThemeState['theme']) => Promise<ThemeState>
  toggleTheme: () => Promise<ThemeState>
  resetToSystem: () => Promise<ThemeState>
}
