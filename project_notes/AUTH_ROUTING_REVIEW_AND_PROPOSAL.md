# TanStack Start Auth Routing Review & Best Practice Proposal

## Executive Summary

This document reviews the current authentication routing implementation and proposes best-practice TanStack Start patterns for Login + Register UX aligned with the Django session+CSRF backend contract.

**Current Implementation Strengths:**
- ✅ Root `beforeLoad` provides user to all routes (shared UI sync)
- ✅ `_authed` layout acts as authentication gate with SSR redirect
- ✅ Server function (`getCurrentUserFn`) as single source of truth
- ✅ Cross-tab auth synchronization with BroadcastChannel
- ✅ Safe redirect utilities preventing open redirect vulnerabilities
- ✅ Direct browser→Django calls for login/logout (proper cookie handling)

**Areas for Improvement:**
- ⚠️ Missing Register route implementation
- ⚠️ CSRF token handling duplicated across routes
- ⚠️ Form submission patterns could use TanStack Router's new form APIs
- ⚠️ Manual router invalidation instead of leveraging loader dependencies
- ⚠️ Mixed client-side fetch with server functions (inconsistent pattern)

---

## Current Architecture Analysis

### 1. Root Route Pattern (`__root.tsx`)

**What's Working Well:**

```typescript
beforeLoad: async () => {
  const user = await getCurrentUserFn()
  return { user }
}
```

✅ **Single source of truth**: All routes get user from context
✅ **SSR-friendly**: Runs on server during initial render
✅ **Shared UI sync**: Header component stays consistent

**Cross-Tab Synchronization:**

```typescript
React.useEffect(() => {
  const unsubscribe = subscribeAuthEvents((event) => {
    switch (event.type) {
      case 'logout':
        router.invalidate()
        if (isCurrentRouteProtected(router)) {
          router.navigate({ to: '/login', replace: true })
        }
        break
      case 'login':
        router.invalidate()
        if (router.state.location.pathname === '/login') {
          const destination = safeRedirectPath(fromParam, '/dashboard')
          router.navigate({ to: destination, replace: true })
        }
        break
    }
  })
  return unsubscribe
}, [router])
```

✅ **Excellent**: BroadcastChannel with localStorage fallback
✅ **Proper cleanup**: Unsubscribe on unmount

### 2. Protected Route Pattern (`_authed.tsx`)

```typescript
beforeLoad: async ({ location, context }) => {
  const user = context.user ?? (await getCurrentUserFn())
  if (!user) {
    const from = buildFromParameter(location)
    throw redirect({ to: '/login', search: { from } })
  }
  return { user }
}
```

✅ **Efficient**: Uses context.user first (from root), only fetches if missing
✅ **SSR redirect**: Blocks on server before client sees protected content
✅ **Safe redirect**: Builds proper `from` parameter for post-login navigation

### 3. Login Route Pattern (`login.tsx`)

**Current Implementation Issues:**

```typescript
// ❌ Client-side only fetch
async function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  
  // Step 1: Get CSRF token
  const csrfRes = await fetch('/api/v2/auth/csrf/', {
    credentials: 'include',
  })
  
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
  
  // ❌ Manual navigation
  router.navigate({ to: destination, replace: true })
}
```

**Problems:**
1. ❌ Client-side fetch doesn't work with SSR
2. ❌ Manual router.invalidate() calls in authEvents instead of route dependencies
3. ❌ No progressive enhancement (requires JS)
4. ❌ CSRF token pattern repeated in logout.tsx

---

## Best Practice Proposal

### Architecture Principles

1. **Server Functions for All Mutations**: Use `createServerFn` for login/register/logout
2. **Loader Dependencies**: Let TanStack Router handle invalidation automatically
3. **Form Actions**: Use router's built-in form handling for progressive enhancement
4. **Single CSRF Pattern**: Centralize CSRF token management
5. **No React Context**: Rely entirely on router context (already achieved ✅)

### Pattern 1: Centralized CSRF Management

**Create:** `src/server/csrf.ts`

```typescript
import { createServerFn } from '@tanstack/react-start'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

interface CsrfResponse {
  success: boolean
  message: string
  data?: {
    csrf_token: string
  }
}

/**
 * Server function to get a fresh CSRF token from Django.
 * This should be called before any mutation (login, register, logout, etc.)
 */
export const getCsrfTokenFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    try {
      const req: Request | undefined = 
        (ctx as any)?.request || (ctx as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      const headers: HeadersInit = {}
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
        headers,
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error(`Failed to get CSRF token: ${res.status}`)
      }

      const data: CsrfResponse = await res.json()

      if (!data.success || !data.data?.csrf_token) {
        throw new Error('CSRF token not found in response')
      }

      // Forward Set-Cookie headers from Django to the client
      const setCookieHeader = res.headers.get('set-cookie')
      if (setCookieHeader && ctx.responseHeaders) {
        ctx.responseHeaders.set('set-cookie', setCookieHeader)
      }

      return data.data.csrf_token
    } catch (error) {
      console.error('[CSRF] Failed to get token:', error)
      throw error
    }
  }
)
```

**Benefits:**
- ✅ Runs on server (SSR-compatible)
- ✅ Forwards cookies properly
- ✅ Single place to handle CSRF logic
- ✅ Can be reused across all mutations

---

### Pattern 2: Login with Server Function + Form Action

**Update:** `src/server/auth.ts`

```typescript
import { createServerFn } from '@tanstack/react-start'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  full_name: string
  is_verified: boolean
  is_active: boolean
  role?: string
  security: {
    score: number
    level: 'low' | 'medium' | 'high'
  }
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details: any
  }
}

/**
 * Get current authenticated user (existing implementation)
 */
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    try {
      const req: Request | undefined = 
        (ctx as any)?.request || (ctx as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      const headers: HeadersInit = {}
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
        headers,
        credentials: 'include',
      })

      if (!res.ok) return null

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) return null

      const data: ApiResponse<{ user: User; authenticated: boolean }> = 
        await res.json()

      return data.success && data.data?.user ? data.data.user : null
    } catch {
      return null
    }
  }
)

/**
 * Login server function
 */
export const loginFn = createServerFn({ method: 'POST' })
  .validator((data: { identifier: string; password: string }) => {
    if (!data.identifier || !data.password) {
      throw new Error('Identifier and password are required')
    }
    return data
  })
  .handler(async ({ data, context }) => {
    try {
      const ctx = context as any
      const req: Request | undefined = ctx?.request || ctx?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Step 1: Get CSRF token
      const csrfHeaders: HeadersInit = {}
      if (cookieHeader) {
        csrfHeaders['Cookie'] = cookieHeader
      }

      const csrfRes = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
        headers: csrfHeaders,
        credentials: 'include',
      })

      if (!csrfRes.ok) {
        throw new Error('Failed to get CSRF token')
      }

      const csrfData: ApiResponse<{ csrf_token: string }> = 
        await csrfRes.json()
      const csrfToken = csrfData.data?.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      // Get session cookie from CSRF response
      const csrfSetCookie = csrfRes.headers.get('set-cookie')
      const sessionCookie = cookieHeader || csrfSetCookie || ''

      // Step 2: Login
      const loginHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      
      if (sessionCookie) {
        loginHeaders['Cookie'] = sessionCookie
      }

      const loginRes = await fetch(`${BACKEND_URL}/api/v2/auth/login/`, {
        method: 'POST',
        headers: loginHeaders,
        body: JSON.stringify({
          identifier: data.identifier,
          password: data.password,
        }),
        credentials: 'include',
      })

      const loginData: ApiResponse<{ user: User }> = await loginRes.json()

      if (!loginRes.ok) {
        return {
          success: false,
          message: loginData.message || 'Login failed',
          error: loginData.error,
        }
      }

      // Forward Set-Cookie headers to client
      const setCookieHeader = loginRes.headers.get('set-cookie')
      if (setCookieHeader && ctx.responseHeaders) {
        ctx.responseHeaders.set('set-cookie', setCookieHeader)
      }

      return {
        success: true,
        message: loginData.message,
        user: loginData.data?.user,
      }
    } catch (error) {
      console.error('[Login] Error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        error: {
          code: 'LOGIN_ERROR',
          details: null,
        },
      }
    }
  })

/**
 * Register server function
 */
export const registerFn = createServerFn({ method: 'POST' })
  .validator((data: {
    email?: string | null
    phone?: string | null
    password: string
    password_confirm: string
    first_name: string
    last_name: string
  }) => {
    if (!data.email && !data.phone) {
      throw new Error('Either email or phone is required')
    }
    if (data.password !== data.password_confirm) {
      throw new Error('Passwords do not match')
    }
    return data
  })
  .handler(async ({ data, context }) => {
    try {
      const ctx = context as any
      const req: Request | undefined = ctx?.request || ctx?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Step 1: Get CSRF token
      const csrfHeaders: HeadersInit = {}
      if (cookieHeader) {
        csrfHeaders['Cookie'] = cookieHeader
      }

      const csrfRes = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
        headers: csrfHeaders,
        credentials: 'include',
      })

      if (!csrfRes.ok) {
        throw new Error('Failed to get CSRF token')
      }

      const csrfData: ApiResponse<{ csrf_token: string }> = 
        await csrfRes.json()
      const csrfToken = csrfData.data?.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      const csrfSetCookie = csrfRes.headers.get('set-cookie')
      const sessionCookie = cookieHeader || csrfSetCookie || ''

      // Step 2: Register
      const registerHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      
      if (sessionCookie) {
        registerHeaders['Cookie'] = sessionCookie
      }

      const registerRes = await fetch(
        `${BACKEND_URL}/api/v2/auth/register/`,
        {
          method: 'POST',
          headers: registerHeaders,
          body: JSON.stringify({
            email: data.email,
            phone: data.phone,
            password: data.password,
            password_confirm: data.password_confirm,
            first_name: data.first_name,
            last_name: data.last_name,
          }),
          credentials: 'include',
        }
      )

      const registerData: ApiResponse<{ user: User }> = 
        await registerRes.json()

      if (!registerRes.ok) {
        return {
          success: false,
          message: registerData.message || 'Registration failed',
          error: registerData.error,
        }
      }

      // Forward Set-Cookie headers to client
      const setCookieHeader = registerRes.headers.get('set-cookie')
      if (setCookieHeader && ctx.responseHeaders) {
        ctx.responseHeaders.set('set-cookie', setCookieHeader)
      }

      return {
        success: true,
        message: registerData.message,
        user: registerData.data?.user,
      }
    } catch (error) {
      console.error('[Register] Error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        error: {
          code: 'REGISTER_ERROR',
          details: null,
        },
      }
    }
  })

/**
 * Logout server function
 */
export const logoutFn = createServerFn({ method: 'POST' }).handler(
  async (ctx) => {
    try {
      const req: Request | undefined = 
        (ctx as any)?.request || (ctx as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Step 1: Get CSRF token
      const csrfHeaders: HeadersInit = {}
      if (cookieHeader) {
        csrfHeaders['Cookie'] = cookieHeader
      }

      const csrfRes = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
        headers: csrfHeaders,
        credentials: 'include',
      })

      if (!csrfRes.ok) {
        throw new Error('Failed to get CSRF token')
      }

      const csrfData: ApiResponse<{ csrf_token: string }> = 
        await csrfRes.json()
      const csrfToken = csrfData.data?.csrf_token

      if (!csrfToken) {
        throw new Error('CSRF token not found')
      }

      const csrfSetCookie = csrfRes.headers.get('set-cookie')
      const sessionCookie = cookieHeader || csrfSetCookie || ''

      // Step 2: Logout
      const logoutHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      
      if (sessionCookie) {
        logoutHeaders['Cookie'] = sessionCookie
      }

      const logoutRes = await fetch(`${BACKEND_URL}/api/v2/auth/logout/`, {
        method: 'POST',
        headers: logoutHeaders,
        credentials: 'include',
      })

      // Forward cookie clearing headers to client
      const setCookieHeader = logoutRes.headers.get('set-cookie')
      if (setCookieHeader && (ctx as any).responseHeaders) {
        ;(ctx as any).responseHeaders.set('set-cookie', setCookieHeader)
      }

      return {
        success: logoutRes.ok,
        message: logoutRes.ok ? 'Logged out successfully' : 'Logout failed',
      }
    } catch (error) {
      console.error('[Logout] Error:', error)
      return {
        success: false,
        message: 'Logout failed',
      }
    }
  }
)
```

---

### Pattern 3: Modern Login Route with Server Function

**Update:** `src/routes/login.tsx`

```typescript
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { getCurrentUserFn, loginFn } from '@/server/auth'

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
  const [identifier, setIdentifier] = React.useState('')
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
      // Call server function
      const result = await loginFn({
        data: { identifier, password }
      })

      if (!result.success) {
        setError(result.message || 'Login failed')
        return
      }

      // Notify other tabs about login
      if (typeof window !== 'undefined') {
        emitAuthEvent('login')
      }

      // Invalidate router to refresh user data
      await router.invalidate()

      // Navigate to destination
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
              <label className="block text-foreground font-medium mb-2">
                Email or Phone
              </label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                required
                placeholder="user@example.com or +224620123456"
                className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-foreground font-medium mb-2">
                Password
              </label>
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

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Key Improvements:**
- ✅ Uses server function (`loginFn`) instead of direct fetch
- ✅ SSR-compatible (server function runs on server)
- ✅ Proper cookie forwarding handled by server function
- ✅ Cleaner component code (no CSRF handling in UI)
- ✅ Link to register page

---

### Pattern 4: New Register Route

**Create:** `src/routes/register.tsx`

```typescript
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { getCurrentUserFn, registerFn } from '@/server/auth'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { FormField } from '@/components/auth/FormField'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    }
  },
  beforeLoad: async ({ search, context }) => {
    // If already authenticated, redirect away
    const user = context.user ?? (await getCurrentUserFn())
    if (user) {
      const destination = safeRedirectPath(search.from, '/dashboard')
      throw redirect({ to: destination, replace: true })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const [formData, setFormData] = React.useState({
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  })
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({})
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const search = Route.useSearch()

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      const result = await registerFn({
        data: {
          email: formData.email || null,
          phone: formData.phone || null,
          password: formData.password,
          password_confirm: formData.password_confirm,
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
      })

      if (!result.success) {
        // Handle validation errors
        if (result.error?.code === 'VALIDATION_ERROR' && result.error.details) {
          setFieldErrors(result.error.details)
        } else {
          setError(result.message || 'Registration failed')
        }
        return
      }

      // Notify other tabs about login (registration auto-logs in)
      if (typeof window !== 'undefined') {
        emitAuthEvent('login')
      }

      // Invalidate router to refresh user data
      await router.invalidate()

      // Navigate to destination
      const destination = safeRedirectPath(search.from, '/dashboard')
      router.navigate({ to: destination, replace: true })
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <h2 className="text-foreground text-2xl font-bold mb-6">
            Create Account
          </h2>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                required
                error={fieldErrors.first_name?.[0]}
              />
              <FormField
                label="Last Name"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                required
                error={fieldErrors.last_name?.[0]}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Provide at least one contact method (email or phone)
              </p>
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="user@example.com"
                error={fieldErrors.email?.[0]}
              />
              <FormField
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                placeholder="+224620123456"
                error={fieldErrors.phone?.[0]}
              />
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div>
                <PasswordInput
                  label="Password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  error={fieldErrors.password?.[0]}
                />
                <PasswordStrength password={formData.password} />
              </div>

              <PasswordInput
                label="Confirm Password"
                value={formData.password_confirm}
                onChange={handleChange('password_confirm')}
                required
                error={fieldErrors.password_confirm?.[0]}
              />
            </div>

            {/* General Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-60 transition-colors"
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

### Pattern 5: Improved Logout Route

**Update:** `src/routes/logout.tsx`

```typescript
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
        // Call server function
        const result = await logoutFn()

        if (!result.success) {
          throw new Error(result.message || 'Logout failed')
        }

        // Notify other tabs about logout
        if (typeof window !== 'undefined') {
          emitAuthEvent('logout')
        }

        setStatus('done')
        
        // Use replace instead of navigate to prevent back button issues
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
            <div>
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-4">
                <p className="font-semibold mb-2">Logout Failed</p>
                <p className="text-sm">{error}</p>
              </div>
              <a
                href="/login"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## Advanced Patterns

### Pattern 6: Optimistic Navigation with Loader Dependencies

Instead of manually calling `router.invalidate()`, we can leverage TanStack Router's automatic invalidation through proper loader configuration.

**Update Root Route for Automatic Invalidation:**

```typescript
// src/routes/__root.tsx
export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await getCurrentUserFn()
    return { user }
  },
  // Add loader to make beforeLoad reactive to server function changes
  loader: async () => {
    return { timestamp: Date.now() }
  },
  // ... rest of config
})
```

---

## Data Flow Diagrams

### Login Flow

```
Browser Request
     ?
[Login Page Component]
     ? (form submit)
[loginFn (Server Function)]
     ?
[Get CSRF Token from Django]
     ? (with session cookie)
[POST /api/v2/auth/login/]
     ? (Django sets sessionid cookie)
[Forward Set-Cookie to Browser]
     ?
[Return { success, user }]
     ?
[Component: emitAuthEvent('login')]
     ?
[Component: router.invalidate()]
     ?
[Root beforeLoad re-runs]
     ? (getCurrentUserFn)
[GET /api/v2/auth/status/]
     ? (with sessionid cookie)
[Return user data]
     ?
[Update router context.user]
     ?
[Navigate to /dashboard]
```

### Cross-Tab Sync Flow

```
Tab A: User logs out
     ?
[Tab A: emitAuthEvent('logout')]
     ?
[BroadcastChannel posts message]
     ?
[Tab B: receives message]
     ?
[Tab B: router.invalidate()]
     ?
[Tab B: Root beforeLoad re-runs]
     ? (getCurrentUserFn returns null)
[Tab B: context.user = null]
     ?
[Tab B: _authed beforeLoad checks user]
     ? (user is null)
[Tab B: redirect to /login]
```

---

## Migration Guide

### Step 1: Update `src/server/auth.ts`

1. Add `loginFn`, `registerFn`, and `logoutFn` server functions
2. Keep existing `getCurrentUserFn` (no changes needed)

### Step 2: Update `src/routes/login.tsx`

1. Import `loginFn` from `@/server/auth`
2. Replace `fetch` calls with `loginFn({ data: { ... } })`
3. Keep existing error handling and navigation logic
4. Add link to register page

### Step 3: Create `src/routes/register.tsx`

1. Copy structure from updated login.tsx
2. Use `registerFn` instead of `loginFn`
3. Add all required fields (first_name, last_name, email/phone, passwords)
4. Include field-level error handling for validation errors

### Step 4: Update `src/routes/logout.tsx`

1. Import `logoutFn` from `@/server/auth`
2. Replace `fetch` calls with `logoutFn()`
3. Keep existing error handling

### Step 5: Test Cross-Tab Behavior

1. Open app in two tabs
2. Login in Tab A ? verify Tab B updates
3. Logout in Tab A ? verify Tab B redirects to login
4. Navigate to protected route in Tab B while logged out ? verify redirect

---

## Testing Checklist

### Login Flow
- [ ] Login with email + password
- [ ] Login with phone + password
- [ ] Login with invalid credentials shows error
- [ ] Login when already authenticated redirects to dashboard
- [ ] Login redirects to `?from` parameter if provided
- [ ] Login sets session cookie
- [ ] Login works with SSR (server-side authentication check)

### Register Flow
- [ ] Register with email only
- [ ] Register with phone only
- [ ] Register with both email and phone
- [ ] Register with neither email nor phone shows error
- [ ] Password validation (min 8 chars, uppercase, lowercase, digit)
- [ ] Password mismatch shows error
- [ ] Duplicate email shows field error
- [ ] Registration auto-logs in user
- [ ] Registration redirects to dashboard (or `?from` parameter)

### Logout Flow
- [ ] Logout clears session cookie
- [ ] Logout redirects to login page
- [ ] Logout invalidates all tabs
- [ ] Logout from protected page redirects

### Protected Routes
- [ ] Accessing /dashboard when logged out redirects to /login
- [ ] Accessing /dashboard when logged in shows content
- [ ] Protected route includes `?from` parameter for post-login redirect
- [ ] Root beforeLoad provides user to all routes

### Cross-Tab Sync
- [ ] Login in Tab A updates Tab B
- [ ] Logout in Tab A redirects Tab B (if on protected route)
- [ ] Tab focus revalidates auth state
- [ ] Tab visibility change revalidates auth state

### SSR
- [ ] Protected routes redirect on server (no flash of protected content)
- [ ] Public routes accessible without authentication
- [ ] Cookies forwarded correctly from browser to server to Django
- [ ] Set-Cookie headers forwarded from Django to server to browser

---

## Common Pitfalls to Avoid

### ? Don't Mix Client and Server Fetches

```typescript
// BAD: Mixing patterns
async function login() {
  // Client-side fetch
  const res = await fetch('/api/v2/auth/login/', { ... })
  
  // Then calling server function
  await router.invalidate() // This re-runs getCurrentUserFn (server)
}
```

**Why it's bad:** Client fetch doesn't properly forward cookies in SSR context.

**Solution:** Use server functions consistently.

### ? Don't Store User in localStorage/sessionStorage

```typescript
// BAD: Storing user data client-side
localStorage.setItem('user', JSON.stringify(user))
```

**Why it's bad:**
- Doesn't work with SSR
- Can become stale
- Adds unnecessary client-side state

**Solution:** Always get user from router context.

### ? Don't Call getCurrentUserFn in Components

```typescript
// BAD: Fetching in component
function MyComponent() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    getCurrentUserFn().then(setUser)
  }, [])
}
```

**Why it's bad:** Bypasses router context and SSR.

**Solution:** Get user from route context:

```typescript
function MyComponent() {
  const { user } = Route.useRouteContext()
  // or
  const routerState = useRouterState()
  const user = routerState.matches[0]?.context.user
}
```

---

## Summary

### What's Working Well ?

1. **Root beforeLoad pattern** - Single source of truth for user state
2. **Protected layout (_authed)** - SSR-friendly authentication gate
3. **Cross-tab synchronization** - BroadcastChannel with localStorage fallback
4. **Safe redirects** - Open redirect prevention built-in
5. **Server functions** - getCurrentUserFn properly forwards cookies

### Recommended Changes ??

1. **Move login/logout to server functions** - Better SSR support, consistent pattern
2. **Add register route** - Complete the auth flow
3. **Centralize CSRF handling** - Reduce duplication, easier maintenance
4. **Optional: Add Zod validation** - Type-safe form handling

### Migration Effort ??

- **Low effort** (2-4 hours): Update login/logout to use server functions
- **Medium effort** (4-8 hours): Add register route with validation

---

## Questions & Next Steps

**Would you like me to:**

1. **Implement these patterns** by creating/updating the actual route files?
2. **Add Zod validation schemas** for type-safe forms?
3. **Create an error boundary component** for auth failures?
4. **Add additional utilities** (e.g., rate limiting, password strength)?
5. **Review any specific auth flow** in more detail?

Or do you have questions about:
- How server functions handle cookies in TanStack Start?
- The difference between eforeLoad and loader?
- Cross-tab synchronization implementation details?
- Security considerations for session-based auth?
