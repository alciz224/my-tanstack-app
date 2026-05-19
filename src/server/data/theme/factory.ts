import { LocalThemeAdapter } from './local.adapter'
import { ApiThemeAdapter } from './api.adapter'
import type { ThemeDataAdapter } from './types'

export function getThemeService(): ThemeDataAdapter {
  // Use local data in development or when explicitly requested
  // Check for VITE_LOCAL_DATA (Vite convention) or NODE_ENV for flexibility
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalThemeAdapter()
  }
  return new ApiThemeAdapter()
}
