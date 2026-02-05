import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { getCurrentUserFn } from '@/server/auth'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    }
  },
  beforeLoad: async ({ search, context }) => {
    // If already authenticated, redirect away from login page
    const user = context.user ?? (await getCurrentUserFn())
    if (user) {
      const destination = safeRedirectPath(search.from, '/dashboard')
      throw redirect({ to: destination, replace: true })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const search = Route.useSearch()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Call Django directly from browser (via Vite proxy)
      // This ensures cookies are set properly in the browser
      
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
      
      // Step 2: Login
      const loginRes = await fetch('/api/v2/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ identifier: email, password }),
      })
      
      if (!loginRes.ok) {
        let errorMessage = 'Login failed'
        try {
          const errorData = await loginRes.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = await loginRes.text()
        }
        throw new Error(errorMessage)
      }
      
      // Notify other tabs about login (they will invalidate and redirect)
      if (typeof window !== 'undefined') {
        emitAuthEvent('login')
      }
      
      // Navigate to the safe redirect destination
      const destination = safeRedirectPath(search.from, '/dashboard')
      router.navigate({ to: destination, replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h2 className="text-foreground text-2xl font-bold mb-6">Login</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-foreground font-medium mb-2">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-foreground font-medium mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-60 transition-colors"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
