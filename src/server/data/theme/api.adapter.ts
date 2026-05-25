/**
 * API Theme Adapter
 *
 * Real implementation that fetches theme data from the backend API.
 * Forwards cookies during SSR to maintain session consistency.
 */

import { getRequest } from '@tanstack/react-start/server'
import { BaseThemeAdapter } from './base.adapter'
import type { ThemeDataAdapter, ThemeState } from './types'

export class ApiThemeAdapter
  extends BaseThemeAdapter
  implements ThemeDataAdapter
{
  private API_BASE_URL: string

  constructor() {
    super()
    // Backend API base URL - adjust as needed for your Django backend
    this.API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8000'
  }

  /**
   * Extracts cookies from incoming request for forwarding to backend
   * Essential for SSR to maintain session consistency
   */
  private getCookieHeader(): string | undefined {
    try {
      const request = getRequest()
      if (!request) return undefined

      const cookieHeader = request.headers.get('cookie')
      return cookieHeader || undefined
    } catch (e) {
      // getWebRequest() throws when called outside server context
      // This is expected during CSR or when imported incorrectly
      return undefined
    }
  }

  async getTheme(): Promise<ThemeState> {
    await this.delay(50) // Simulate slight delay for consistency

    try {
      const cookieHeader = this.getCookieHeader()
      const headers: HeadersInit = {}

      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${this.API_BASE_URL}/api/v1/theme/`, {
        method: 'GET',
        headers,
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch theme: ${res.status}`)
      }

      const data = await res.json()

      // Assuming backend returns theme state in expected format
      if (data.success && data.data) {
        const themeData = data.data as ThemeState
        // Ensure resolvedTheme is present
        return {
          ...themeData,
          resolvedTheme:
            themeData.resolvedTheme || this.resolveThemeFromState(themeData),
        }
      } else {
        // Fallback to defaults if response format unexpected
        return this.getDefaultThemeState()
      }
    } catch (error) {
      throw this.wrapError('getTheme', error)
    }
  }

  async setTheme(theme: ThemeState['theme']): Promise<ThemeState> {
    await this.delay(75) // Simulate network delay

    // Validate input
    if (!['light', 'dark', 'system'].includes(theme)) {
      throw new Error(`Invalid theme value: ${theme}`)
    }

    try {
      const cookieHeader = this.getCookieHeader()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${this.API_BASE_URL}/api/v1/theme/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ theme }),
      })

      if (!res.ok) {
        throw new Error(`Failed to set theme: ${res.status}`)
      }

      const data = await res.json()

      if (data.success && data.data) {
        const themeData = data.data as ThemeState
        return {
          ...themeData,
          resolvedTheme:
            themeData.resolvedTheme || this.resolveThemeFromState(themeData),
        }
      } else {
        // Optimistic update fallback
        return this.updateThemeStateOptimistically(theme)
      }
    } catch (error) {
      throw this.wrapError('setTheme', error)
    }
  }

  async toggleTheme(): Promise<ThemeState> {
    await this.delay(60) // Simulate network delay

    try {
      const cookieHeader = this.getCookieHeader()
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }

      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${this.API_BASE_URL}/api/v1/theme/toggle`, {
        method: 'POST',
        headers,
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Failed to toggle theme: ${res.status}`)
      }

      const data = await res.json()

      if (data.success && data.data) {
        const themeData = data.data as ThemeState
        return {
          ...themeData,
          resolvedTheme:
            themeData.resolvedTheme || this.resolveThemeFromState(themeData),
        }
      } else {
        // Fallback: get current theme and toggle optimistically
        const current = await this.getTheme()
        let newTheme: ThemeState['theme']

        switch (current.theme) {
          case 'light':
            newTheme = 'dark'
            break
          case 'dark':
            newTheme = 'light'
            break
          case 'system':
            newTheme = current.resolvedTheme === 'light' ? 'dark' : 'light'
            break
        }

        return this.setTheme(newTheme)
      }
    } catch (error) {
      throw this.wrapError('toggleTheme', error)
    }
  }

  async resetToSystem(): Promise<ThemeState> {
    await this.delay(50) // Simulate network delay

    return this.setTheme('system')
  }

  /**
   * Helper to resolve theme setting to actual light/dark value
   * Matches the logic used in zustand theme store
   */
  private resolveThemeFromState(
    themeState: Partial<ThemeState>,
  ): 'light' | 'dark' {
    const theme = themeState.theme ?? 'system'

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

  /**
   * Returns a default theme state when API calls fail
   * Prevents UI from breaking during backend issues
   */
  private getDefaultThemeState(): ThemeState {
    const resolved =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : 'light' // Default for SSR

    return {
      theme: 'system',
      resolvedTheme: resolved,
    }
  }

  /**
   * Optimistic update fallback when API call succeeds but returns unexpected format
   */
  private updateThemeStateOptimistically(
    theme: ThemeState['theme'],
  ): ThemeState {
    const resolved = this.resolveThemeFromState({ theme })
    return { theme, resolvedTheme: resolved }
  }
}
