import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import {
  getThemeFn,
  resetThemeFn,
  setThemeFn,
  toggleThemeFn,
} from '@/server/api/theme'

export const Route = createFileRoute('/_authed/super-admin/theme-settings')({
  loader: async () => {
    const { data: themeData } = await getThemeFn()
    return { themeData }
  },
  component: ThemeSettingsPage,
})

function ThemeSettingsPage() {
  const { themeData } = useRouteLoaderData<typeof Route>()
  const { theme, setTheme: setZustandTheme } = useThemeStore()

  // Query to get current theme from server
  const {
    data: serverTheme,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      const { data } = await getThemeFn()
      return data
    },
  })

  // Mutations for theme operations
  const setThemeMutation = useMutation({
    mutationFn: (theme: 'light' | 'dark' | 'system') =>
      setThemeFn({ data: { theme } }),
    onSuccess: (data) => {
      // Update zustand store with server response
      setZustandTheme(data.data.theme)
    },
  })

  const toggleThemeMutation = useMutation({
    mutationFn: toggleThemeFn,
    onSuccess: (data) => {
      setZustandTheme(data.data.theme)
    },
  })

  const resetThemeMutation = useMutation({
    mutationFn: resetThemeFn,
    onSuccess: (data) => {
      setZustandTheme(data.data.theme)
    },
  })

  const handleSetTheme = (theme: 'light' | 'dark' | 'system') => {
    setThemeMutation.mutate(theme)
  }

  const handleToggleTheme = () => {
    toggleThemeMutation.mutate()
  }

  const handleResetTheme = () => {
    resetThemeMutation.mutate()
  }

  if (isLoading) return <div>Loading theme settings...</div>
  if (isError) return <div>Error loading theme settings</div>

  const currentTheme = serverTheme ?? themeData

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Theme Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
              {currentTheme.theme === 'light' && (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
              {currentTheme.theme === 'dark' && (
                <Moon className="h-5 w-5 text-yellow-300" />
              )}
              {currentTheme.theme === 'system' && (
                <Monitor className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="font-medium">Current Theme</h3>
              <p className="text-sm text-muted-foreground">
                {currentTheme.theme} ({currentTheme.resolvedTheme})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSetTheme('light')}
              disabled={setThemeMutation.isPending}
              className={`group relative flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors
                ${
                  currentTheme.theme === 'light'
                    ? 'bg-primary text-primary-foreground'
                    : 'border input-background hover:bg-accent/50'
                }`}
            >
              <span className="flex-1 text-left">Light</span>
              <span className="ml-2 flex h-4 w-4 items-center justify-center">
                {currentTheme.theme === 'light' && (
                  <Sun className="h-3 w-3 text-primary-foreground" />
                )}
              </span>
            </button>

            <button
              onClick={() => handleSetTheme('dark')}
              disabled={setThemeMutation.isPending}
              className={`group relative flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors
                ${
                  currentTheme.theme === 'dark'
                    ? 'bg-primary text-primary-foreground'
                    : 'border input-background hover:bg-accent/50'
                }`}
            >
              <span className="flex-1 text-left">Dark</span>
              <span className="ml-2 flex h-4 w-4 items-center justify-center">
                {currentTheme.theme === 'dark' && (
                  <Moon className="h-3 w-3 text-primary-foreground" />
                )}
              </span>
            </button>

            <button
              onClick={() => handleSetTheme('system')}
              disabled={setThemeMutation.isPending}
              className={`group relative flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors
                ${
                  currentTheme.theme === 'system'
                    ? 'bg-primary text-primary-foreground'
                    : 'border input-background hover:bg-accent/50'
                }`}
            >
              <span className="flex-1 text-left">System</span>
              <span className="ml-2 flex h-4 w-4 items-center justify-center">
                {currentTheme.theme === 'system' && (
                  <Monitor className="h-3 w-3 text-primary-foreground" />
                )}
              </span>
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleToggleTheme}
              disabled={toggleThemeMutation.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium transition-colors border input-background hover:bg-accent/50"
            >
              {toggleThemeMutation.isPending ? 'Toggling...' : 'Toggle Theme'}
            </button>

            <button
              onClick={handleResetTheme}
              disabled={resetThemeMutation.isPending}
              className="flex-1 px-4 py-2 text-sm font-medium transition-colors border input-background hover:bg-accent/50"
            >
              {resetThemeMutation.isPending
                ? 'Resetting...'
                : 'Reset to System'}
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Theme Preview</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Sample Card</h3>
            <p className="text-muted-foreground">
              This is a sample text to preview how colors appear in the current
              theme.
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Primary Button
            </button>
            <button className="px-4 py-2 border hover:bg-accent/50">
              Secondary Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
