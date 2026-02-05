import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

// Helper to get system theme
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Helper to resolve theme
const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme: Theme) => {
        const resolved = resolveTheme(theme)
        set({ theme, resolvedTheme: resolved })
        
        // Apply to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(resolved)
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state && typeof window !== 'undefined') {
          const resolved = resolveTheme(state.theme)
          const root = window.document.documentElement
          root.classList.remove('light', 'dark')
          root.classList.add(resolved)
        }
      },
    }
  )
)

// Initialize theme on client
if (typeof window !== 'undefined') {
  // Apply theme immediately to prevent flash
  const stored = localStorage.getItem('theme-storage')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      const resolved = resolveTheme(state.theme)
      document.documentElement.classList.add(resolved)
    } catch (e) {
      document.documentElement.classList.add('light')
    }
  } else {
    document.documentElement.classList.add(resolveTheme('system'))
  }

  // Listen to system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    const store = useThemeStore.getState()
    if (store.theme === 'system') {
      store.setTheme('system') // Re-resolve
    }
  })
}
