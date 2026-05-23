/**
 * Theme API Server Functions
 *
 * Server functions for theme-related endpoints.
 * These run on the server during SSR and forward cookies to Django.
 *
 * Pattern:
 * - GET requests: createServerFn with serverFetch (cookie forwarding for SSR)
 * - Mutations (POST/PATCH/DELETE): use server functions in @/server/api/theme-mutations
 *   (serverMutate forwards cookies + CSRF to Django)
 */

import { createServerFn } from '@tanstack/react-start'
import type { ThemeState } from '@/server/data/theme/types'

// ============================================================================
// Theme Operations
// ============================================================================

/**
 * Get current theme state
 * GET /api/v2/theme/
 */
export const getThemeFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/theme/factory'))
      .getThemeService()
      .getTheme()
  },
)

/**
 * Set theme to specific value
 * POST /api/v2/theme/
 */
export const setThemeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { theme: ThemeState['theme'] })
  .handler(async ({ data }) => {
    return (await import('@/server/data/theme/factory'))
      .getThemeService()
      .setTheme(data.theme)
  })

/**
 * Toggle theme between light/dark
 * POST /api/v2/theme/toggle
 */
export const toggleThemeFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    return (await import('@/server/data/theme/factory'))
      .getThemeService()
      .toggleTheme()
  },
)

/**
 * Reset theme to system default
 * POST /api/v2/theme/reset
 */
export const resetThemeFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    return (await import('@/server/data/theme/factory'))
      .getThemeService()
      .resetToSystem()
  },
)

// ============================================================================
// Usage Examples (for documentation)
// ============================================================================

/**
 * EXAMPLE: Using in a route loader
 *
 * export const Route = createFileRoute('/settings/theme')({
 *   loader: async () => {
 *     const data = await getThemeFn()
 *     return { theme: data }
 *   },
 *   component: ThemeSettingsPage,
 * })
 *
 * EXAMPLE: Using mutations (server functions)
 *
 * import {
 *   setThemeFn,
 *   toggleThemeFn,
 *   resetThemeFn,
 * } from '@/server/api/theme'
 *
 * const setThemeMutation = useMutation({
 *   mutationFn: async (input: { theme: 'light' | 'dark' | 'system' }) => {
 *     const result = await setThemeFn({ data: input })
 *     if (!result.success) throw new Error(result.error)
 *     return result.data
 *   },
 *   onSuccess: () => {
 *     // Invalidate theme queries if needed
 *     // queryClient.invalidateQueries({ queryKey: themeKeys.theme() })
 *   },
 * })
 */
