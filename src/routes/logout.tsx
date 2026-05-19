import { createFileRoute, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { logoutFn } from '@/server/auth'
import { toast } from '@/stores/toastStore'
import { useTranslation } from '@/lib/i18n'

/**
 * Logout page - handles user logout and cleanup
 * This page performs client-side logout to properly clear cookies
 */
export const Route = createFileRoute('/logout')({
  component: LogoutPage,
})

function LogoutPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [status, setStatus] = React.useState<
    'idle' | 'loading' | 'done' | 'error'
  >('idle')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    ;(async () => {
      if (!isMounted) return
      setStatus('loading')

      try {
        // Call logout on backend (clears session cookies)
        const result = await logoutFn()

        if (!isMounted) return

        if (!result.success) {
          throw new Error(result.error || 'Logout failed')
        }

        // Notify other tabs about logout (cross-tab sync)
        emitAuthEvent('logout')

        setStatus('done')

        // Show success toast
        toast.success(
          t('auth.logoutSuccess') || 'Logged out',
          t('auth.logoutSuccessMessage') ||
            'You have been logged out successfully.',
        )

        // Small delay to show success state
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (!isMounted) return

        // Invalidate router cache to clear user state
        router.invalidate()

        // Hard redirect to login (clears any client state)
        window.location.replace('/login')
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message || 'Logout failed')
        setStatus('error')
      }
    })()

    return () => {
      isMounted = false
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center animate-scale-in">
          {status === 'loading' && (
            <div className="animate-fade-in">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"
                role="status"
                aria-label="Logging out"
              ></div>
              <p className="text-foreground">{t('auth.loggingOut')}</p>
            </div>
          )}
          {status === 'done' && (
            <div className="animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-foreground font-semibold">
                {t('auth.logoutSuccess') || 'Logged out successfully'}
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg animate-fade-in-up">
              <p className="font-semibold mb-2">{t('errors.logoutFailed')}</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => (window.location.href = '/login')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t('nav.signIn') || 'Go to Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
