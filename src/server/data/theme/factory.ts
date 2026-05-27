import { LocalThemeAdapter } from './local.adapter'
import { ApiThemeAdapter } from './api.adapter'
import type { ThemeDataAdapter } from './types'

export function getThemeService(): ThemeDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalThemeAdapter()
  }
  return new ApiThemeAdapter()
}
