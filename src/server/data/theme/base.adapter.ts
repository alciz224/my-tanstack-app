/**
 * Base Theme Adapter
 *
 * Abstract base class providing shared helpers for theme adapters.
 * Implements common error handling and utility methods.
 */

import type { ThemeDataAdapter, ThemeState } from './types'

export abstract class BaseThemeAdapter implements ThemeDataAdapter {
  /**
   * Wraps errors with operation context for consistent error handling
   */
  protected wrapError(operation: string, error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`[Theme:${operation}] ${error.message}`, {
        cause: error,
      })
    }
    return new Error(`[Theme:${operation}] Unknown error: ${String(error)}`)
  }

  /**
   * Simulates network delay for local development
   * Helps test loading states and race conditions
   */
  protected async delay(ms: number = 100): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Abstract methods that must be implemented by concrete adapters
   */
  abstract getTheme(): Promise<ThemeState>
  abstract setTheme(theme: ThemeState['theme']): Promise<ThemeState>
  abstract toggleTheme(): Promise<ThemeState>
  abstract resetToSystem(): Promise<ThemeState>
}
