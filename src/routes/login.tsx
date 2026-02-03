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
  beforeLoad: async ({ search }) => {
    // If already authenticated, redirect away from login page
    const user = await getCurrentUserFn()
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
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-white text-2xl font-bold">Login</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-slate-300 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
          />
        </div>
        <div>
          <label className="block text-slate-300 mb-1">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="w-full px-3 py-2 rounded bg-slate-800 text-white border border-slate-700"
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
