/**
 * Local Theme Adapter
 *
 * In-memory mock implementation of theme data for development and testing.
 * Returns deterministic data with simulated network latency.
 */

import { BaseThemeAdapter } from './base.adapter'
import type { ThemeDataAdapter, ThemeState } from './types'

export class LocalThemeAdapter
  extends BaseThemeAdapter
  implements ThemeDataAdapter
{
  private themeState: ThemeState = {
    theme: 'system',
    resolvedTheme: 'light', // Default resolved theme
  }

  constructor() {
    super()
    // Simulate reading from persistent storage (localStorage) on init
    this.initializeFromStorage()
  }

  private initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('theme-storage')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.state?.theme) {
            this.themeState.theme = parsed.state.theme as ThemeState['theme']
          }
        }
      } catch (e) {
        // Ignore storage errors, use defaults
        console.warn(
          '[LocalThemeAdapter] Failed to read theme from storage:',
          e,
        )
      }
    }
  }

  async getTheme(): Promise<ThemeState> {
    await this.delay(50) // Simulate network delay

    // Update resolved theme based on current theme setting
    const resolved = this.resolveTheme(this.themeState.theme)

    return {
      ...this.themeState,
      resolvedTheme: resolved,
    }
  }

  async setTheme(theme: ThemeState['theme']): Promise<ThemeState> {
    await this.delay(75) // Simulate network delay

    // Validate input
    if (!['light', 'dark', 'system'].includes(theme)) {
      throw new Error(`Invalid theme value: ${theme}`)
    }

    this.themeState.theme = theme
    const resolved = this.resolveTheme(theme)
    this.themeState.resolvedTheme = resolved

    // Persist to localStorage (simulating real behavior)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'theme-storage',
          JSON.stringify({
            state: { theme: this.themeState.theme },
          }),
        )
      } catch (e) {
        console.warn('[LocalThemeAdapter] Failed to write theme to storage:', e)
      }
    }

    return {
      ...this.themeState,
      resolvedTheme: resolved,
    }
  }

  async toggleTheme(): Promise<ThemeState> {
    await this.delay(60) // Simulate network delay

    // Toggle between light and dark, preserving system setting
    let newTheme: ThemeState['theme']

    switch (this.themeState.theme) {
      case 'light':
        newTheme = 'dark'
        break
      case 'dark':
        newTheme = 'light'
        break
      case 'system':
        // When in system mode, toggle based on current resolved theme
        newTheme = this.themeState.resolvedTheme === 'light' ? 'dark' : 'light'
        break
    }

    return this.setTheme(newTheme)
  }

  async resetToSystem(): Promise<ThemeState> {
    await this.delay(50) // Simulate network delay

    return this.setTheme('system')
  }

  /**
   * Helper method to resolve theme setting to actual light/dark value
   * Matches the logic in zustand theme store
   */
  private resolveTheme(theme: ThemeState['theme']): 'light' | 'dark' {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return 'light' // Default when window is undefined (SSR)
    }
    return theme
  }
}
