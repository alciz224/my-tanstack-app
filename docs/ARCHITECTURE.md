# Architecture Documentation

## Overview

EduVault is built with **TanStack Start** (full-stack React framework) using a modern, type-safe architecture with server-side rendering (SSR) and client-side hydration.

---

## Tech Stack

- **Framework**: TanStack Start (React + Vite)
- **Router**: TanStack Router (file-based routing)
- **State Management**: Zustand (theme, language, toasts)
- **Styling**: Tailwind CSS with custom theme system
- **Backend**: Django REST API (separate service)
- **Authentication**: Session-based (httpOnly cookies)
- **TypeScript**: Strict mode, full type safety

---

## Core Architecture Patterns

### 1. Server vs Client Functions

**Critical Distinction**: TanStack Start runs code in two contexts:

#### Server Functions (SSR)

- Run on the **server** during SSR
- Have access to incoming request headers (cookies)
- Created with `createServerFn()`
- Example: `getCurrentUserFn()`

```typescript
// src/server/auth.ts
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    // Access incoming request cookies
    const req = (ctx as any)?.request
    const cookieHeader = req?.headers.get('cookie')

    // Forward cookies to backend
    const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
      headers: { Cookie: cookieHeader },
      credentials: 'include',
    })

    // Return user data
    return user
  },
)
```

**Why Server Functions?**

- Enable SSR with authenticated data
- Forward cookies from browser → TanStack Start → Django
- Keep session tokens secure (httpOnly cookies)

#### Client Functions

- Run in the **browser** only
- Access browser APIs (localStorage, fetch with cookies)
- Cannot modify httpOnly cookies from server
- Examples: `loginFn()`, `logoutFn()`, `registerFn()`

```typescript
// src/server/auth.ts (despite filename, these run client-side)
export async function loginFn(data: LoginInput): Promise<AuthResult> {
  // Browser fetch - cookies automatically included
  const res = await fetch('/api/v2/auth/login/', {
    method: 'POST',
    credentials: 'include', // Browser handles cookies
    body: JSON.stringify(data),
  })

  return result
}
```

**Why Client Functions for Auth?**

- Browser must set/clear httpOnly cookies directly
- Server-side functions cannot modify browser cookies
- POST requests need CSRF tokens from browser context

---

### 2. Authentication Flow

#### Login Flow

```
1. User submits login form
   ↓
2. loginFn() (client-side) calls /api/v2/auth/login/
   ↓
3. Django sets session cookie (httpOnly)
   ↓
4. Browser stores cookie automatically
   ↓
5. emitAuthEvent('login') → cross-tab sync
   ↓
6. router.invalidate() → refresh user state
   ↓
7. Navigate to dashboard
```

#### SSR Auth Check

```
1. Browser requests page
   ↓
2. TanStack Start server receives request
   ↓
3. Root route beforeLoad runs getCurrentUserFn()
   ↓
4. getCurrentUserFn() forwards cookies to Django
   ↓
5. Django validates session, returns user
   ↓
6. User data added to route context
   ↓
7. Page rendered with auth state (SSR)
   ↓
8. HTML sent to browser with user data
```

#### Logout Flow

```
1. User navigates to /logout
   ↓
2. logoutFn() (client-side) calls /api/v2/auth/logout/
   ↓
3. Django clears session cookie
   ↓
4. emitAuthEvent('logout') → notify other tabs
   ↓
5. router.invalidate() → clear cached user
   ↓
6. Hard redirect to /login
```

---

### 3. Route Protection

#### Layout-based Protection

```typescript
// src/routes/_authed.tsx
export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location, context }) => {
    const user = context.user // From root route

    if (!user) {
      // Not authenticated - redirect to login
      const from = buildFromParameter(location)
      throw redirect({ to: '/login', search: { from } })
    }

    // Return typed context for child routes
    return { user } as { user: User }
  },
  component: AuthedLayout,
})
```

**How it works:**

- All routes under `_authed/` require authentication
- `beforeLoad` runs before rendering
- Redirects to login if no user
- Child routes get guaranteed non-null user

#### Route Structure

```
src/routes/
├── __root.tsx              # Loads user for all routes
├── _auth.tsx               # Public layout (login, register)
│   ├── login.tsx
│   └── register.tsx
├── _authed.tsx             # Protected layout
│   ├── dashboard.tsx
│   ├── admin.route.tsx     # Role-based route
│   ├── student.route.tsx
│   └── teacher.route.tsx
├── index.tsx               # Landing page
└── logout.tsx              # Logout handler
```

---

### 4. Type Safety

#### Route Context Types

```typescript
// src/types/router.ts
export interface RouteContext {
  user: User | null // Available in all routes
}

export interface AuthedRouteContext extends RouteContext {
  user: User // Non-null (guaranteed in protected routes)
}
```

#### API Response Types

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: ApiError
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
  fieldErrors?: Record<string, string[]>
  retryAfter?: number
}
```

---

### 5. Cross-Tab Synchronization

```typescript
// src/auth/authEvents.ts
const AUTH_CHANNEL = 'eduvault-auth'
const channel = new BroadcastChannel(AUTH_CHANNEL)

export function emitAuthEvent(type: 'login' | 'logout') {
  channel.postMessage({ type, timestamp: Date.now() })
}

export function subscribeAuthEvents(callback: (event) => void) {
  const handler = (event: MessageEvent) => callback(event.data)
  channel.addEventListener('message', handler)
  return () => channel.removeEventListener('message', handler)
}
```

**Usage in Root Route:**

```typescript
// src/routes/__root.tsx
React.useEffect(() => {
  const unsubscribe = subscribeAuthEvents((event) => {
    if (event.type === 'logout') {
      router.invalidate() // Refresh auth state
      if (isCurrentRouteProtected(router)) {
        router.navigate({ to: '/login', replace: true })
      }
    }
  })
  return unsubscribe
}, [router])
```

---

### 6. Error Handling

#### Error Boundaries

```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />
    }
    return this.props.children
  }
}
```

**Applied at Route Level:**

```typescript
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<RouterContext>()({
  errorComponent: ({ error, reset }) => <ErrorFallback error={error} reset={reset} />,
})
```

#### Structured Error Responses

```typescript
// Server functions return typed errors
const result = await loginFn(credentials)

if (!result.success) {
  if (result.fieldErrors) {
    // Field-specific validation errors
    setFieldErrors(result.fieldErrors)
  } else if (result.errorCode === 'ACCOUNT_LOCKED') {
    // Handle account lock
  } else if (result.retryAfter) {
    // Handle rate limiting
  }
}
```

---

### 7. State Management

#### Zustand Stores

```typescript
// src/stores/toastStore.ts
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = generateId()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    // Auto-dismiss
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, toast.duration)
  },
}))

// Helper functions
export const toast = {
  success: (title, message) =>
    useToastStore.getState().addToast({ type: 'success', title, message }),
  error: (title, message) =>
    useToastStore.getState().addToast({ type: 'error', title, message }),
}
```

**Stores:**

- `themeStore` - Theme (light/dark/system) + localStorage persistence
- `languageStore` - i18n language selection
- `toastStore` - Global toast notifications

---

## Design Decisions

### Why Session-based Auth (not JWT)?

✅ **Advantages:**

- httpOnly cookies prevent XSS attacks
- Server-side session invalidation
- Simpler mobile app integration
- No token refresh complexity

❌ **Tradeoffs:**

- Requires cookie forwarding in SSR
- CSRF protection needed for mutations
- Slightly more complex than localStorage tokens

### Why TanStack Start?

✅ **Advantages:**

- True SSR with React (fast initial loads)
- File-based routing (convention over configuration)
- Type-safe route context
- Built-in devtools
- Server functions (no separate API layer)

### Why Separate Django Backend?

✅ **Advantages:**

- Existing Django investment
- Complex auth logic in Python
- Database ORM (Django models)
- Admin interface for management
- Clear separation of concerns

---

## Security Considerations

### CSRF Protection

- All mutations require CSRF token
- Token fetched from `/api/v2/auth/csrf/`
- Sent in `X-CSRFToken` header

### Cookie Security

- httpOnly cookies (JavaScript cannot access)
- Secure flag in production (HTTPS only)
- SameSite=Lax (CSRF protection)

### Redirect Safety

```typescript
// src/auth/redirects.ts
export function safeRedirectPath(path?: string, fallback = '/'): string {
  // Only allow internal redirects
  if (!path || path.startsWith('http') || path.includes('://')) {
    return fallback
  }
  return path.startsWith('/') ? path : fallback
}
```

### Input Validation

- Client-side validation for UX
- Server-side validation enforced by Django
- Type safety prevents invalid data shapes

---

## Performance Optimizations

### Code Splitting

- Route-based code splitting (automatic)
- Lazy loading heavy components
- Dynamic imports for optional features

### SSR Benefits

- Faster first contentful paint
- SEO-friendly (search engines see content)
- Progressive enhancement (works without JS)

### Caching Strategy

- Route loader caching (TanStack Router)
- Browser cache for static assets
- No aggressive API caching (auth state must be fresh)

---

## Development Workflow

### Adding a New Protected Route

1. Create route file under `_authed/`

```typescript
// src/routes/_authed/new-feature.tsx
export const Route = createFileRoute('/_authed/new-feature')({
  component: NewFeature,
})

function NewFeature() {
  const { user } = Route.useRouteContext() // User guaranteed non-null
  return <div>Protected content</div>
}
```

2. Access user from context (typed, non-null)
3. Add navigation link in sidebar/nav

### Adding a New Server Function

1. Define function in `src/server/auth.ts`

```typescript
export const myServerFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const req = (ctx as any)?.request
    const cookieHeader = req?.headers.get('cookie')

    const res = await fetch(`${BACKEND_URL}/api/v2/...`, {
      headers: { Cookie: cookieHeader },
      credentials: 'include',
    })

    return await res.json()
  },
)
```

2. Import and call from routes/components
3. Handle loading/error states

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Login/logout works
- [ ] Protected routes redirect to login
- [ ] Cross-tab logout syncs
- [ ] SSR shows correct auth state
- [ ] Error boundaries catch failures
- [ ] Toast notifications appear
- [ ] Loading states show during async ops

### Future: Automated Tests

- Unit tests for utilities (validation, redirects)
- Integration tests for auth flow
- E2E tests for critical paths

---

## Common Pitfalls

### ❌ Using Server Functions for Mutations

```typescript
// WRONG - server can't set browser cookies
export const loginServerFn = createServerFn().handler(async (data) => {
  await fetch(`${BACKEND_URL}/login/`) // Cookie won't be set in browser!
})
```

✅ **Correct:**

```typescript
// RIGHT - client function sets cookies in browser
export async function loginFn(data) {
  await fetch('/api/v2/auth/login/', { credentials: 'include' })
}
```

### ❌ Forgetting Cookie Forwarding in SSR

```typescript
// WRONG - cookies not forwarded
const res = await fetch(`${BACKEND_URL}/api/...`) // No cookies!
```

✅ **Correct:**

```typescript
// RIGHT - forward cookies from browser request
const cookieHeader = req?.headers.get('cookie')
const res = await fetch(`${BACKEND_URL}/api/...`, {
  headers: { Cookie: cookieHeader },
})
```

### ❌ Not Invalidating Router After Auth Change

```typescript
// WRONG - stale user data
await loginFn(data)
router.navigate('/dashboard') // Still shows old user!
```

✅ **Correct:**

```typescript
// RIGHT - refresh user data
await loginFn(data)
router.invalidate() // Re-run root beforeLoad
router.navigate('/dashboard')
```

---

## Next Steps

- [ ] Add password reset flow
- [ ] Add email/phone verification
- [ ] Implement role-based permissions
- [ ] Add session timeout handling
- [ ] Build core features (school years, classes, etc.)

---

## Resources

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [V2 API Contract](../V2_API_CONTRACT.md)
- [Frontend Plan](../FRONTEND_PLAN.md)
