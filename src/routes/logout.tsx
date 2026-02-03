import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'

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
        // Call Django directly from browser (via Vite proxy)
        // This ensures cookies are cleared properly in the browser
        
        // Step 1: Get CSRF token
        const csrfRes = await fetch('/api/v2/auth/csrf/', {
          credentials: 'include',
        })
        
        if (!csrfRes.ok) {
          throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
        }

        const csrfData = await csrfRes.json()
        const csrfToken = csrfData?.data?.csrf_token
        
        if (!csrfToken) {
          throw new Error('CSRF token not found in response')
        }
        
        // Step 2: Logout
        await fetch('/api/v2/auth/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        })
        
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
    <div className="p-6 max-w-md mx-auto text-slate-200">
      {status === 'loading' && <p>Logging out…</p>}
      {status === 'error' && <p className="text-red-400">{error}</p>}
    </div>
  )
}
