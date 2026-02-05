import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { logoutFn } from '@/server/auth'

export const Route = createFileRoute('/logout')({
  component: LogoutPage,
})

function LogoutPage() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    ;(async () => {
      setStatus('loading')
      try {
        const result = await logoutFn()

        if (!result.success) {
          throw new Error(result.error || 'Logout failed')
        }

        // Notify other tabs about logout
        if (typeof window !== 'undefined') {
          emitAuthEvent('logout')
        }

        setStatus('done')
        window.location.replace('/login')
      } catch (err: any) {
        setError(err?.message || 'Logout failed')
        setStatus('error')
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <div>
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-foreground">Logging out…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
              <p className="font-semibold mb-2">Logout Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
