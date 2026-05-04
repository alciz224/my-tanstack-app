# Skill: TanStack Start — Authentication & Authorization

> SSR-safe authentication, RBAC (Role-Based Access Control), protected routes, and cookie-based session handling. The critical skill for any app with users.

---

## 1. Core Principle: Router Context, Not React Context

The #1 rule: **Never use React Context (useAuth hook) in beforeLoad or loader.** It breaks SSR.

| Layer | Use Router Context | Use React Context |
|-------|-------------------|-------------------|
| `beforeLoad` | ✅ Yes | ❌ No (breaks SSR) |
| `loader` | ✅ Yes | ❌ No (breaks SSR) |
| Components | ✅ Yes (`useRouteContext`) | ✅ Yes (`useAuth()`) |
| Server Functions | ✅ Via middleware | ❌ N/A |

**Router context** = isomorphic (works server + client).  
**React context** = client-only.

---

## 2. SSR-Safe Authentication Architecture

### Data Flow

```
SSR (First render):
  Request with Cookie → getRouterContext() → validate session → context = { user }
  → beforeLoad checks context.user → render HTML with auth state
  → dehydrate state for client

Client (After hydration):
  Rehydrate router context from server
  → React Context (AuthProvider) takes over for UI state
  → Route guards still use router context
  → On auth change: update router context + router.invalidate()
```

### Router with Typed Context

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  user: User | null
  queryClient: QueryClient
}

export function createRouter(context?: Partial<RouterContext>) {
  return createTanStackRouter({
    routeTree,
    context: { user: null, queryClient: new QueryClient(), ...context },
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

### Server Entry — Extract Auth from Request

```typescript
// app/ssr.tsx
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { getWebRequest, getCookie } from '@tanstack/react-start/server'
import { createRouter } from './router'

export default createStartHandler({ createRouter })(defaultStreamHandler)
```

The auth extraction happens in **getRouterContext** or **root beforeLoad**.

### Root Route — Isomorphic Auth Check

```typescript
// routes/__root.tsx
import { createRootRouteWithContext } from '@tanstack/react-router'
import { fetchUser } from '~/utils/auth.functions'

export const Route = createRootRouteWithContext<RouterContext>()({
  // Runs on BOTH server (SSR) and client
  beforeLoad: async () => {
    const user = await fetchUser()  // Forwards cookies automatically
    return { user }
  },
  component: RootComponent,
})

function RootComponent() {
  const { user } = Route.useRouteContext()
  
  return (
    <html>
      <head><HeadContent /></head>
      <body>
        <Navbar user={user} />
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
```

---

## 3. Protected Route (beforeLoad Pattern)

### Pathless Layout Guard

```typescript
// routes/_authenticated.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // context.user comes from root beforeLoad (SSR-safe)
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },  // Remember where they were going
      })
    }
    
    // Return user so children can access it
    return { user: context.user }
  },
})
```

### Login Page (Reverse Guard)

```typescript
// routes/login.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const loginSearchSchema = z.object({
  redirect: z.string().optional().default('/'),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  
  // Redirect already-authenticated users
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      throw redirect({ to: search.redirect })
    }
  },
  
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { login } = useAuth()  // Client-only, OK here

  const handleSubmit = async (credentials) => {
    await login(credentials)
    navigate({ to: redirect })
  }

  return <LoginForm onSubmit={handleSubmit} />
}
```

### Auth Server Functions

```typescript
// utils/auth.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders, setResponseHeaders } from '@tanstack/react-start/server'

// Fetch current user (forwards session cookie)
export const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getRequestHeaders().get('cookie') || ''
  
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Cookie': cookie },
  })
  
  if (!response.ok) return null
  return response.json() as Promise<User>
})

// Login (delegates to backend, forwards Set-Cookie)
export const login = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Invalid credentials')
    
    // Forward Set-Cookie header from backend
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) setResponseHeaders(new Headers({ 'Set-Cookie': setCookie }))
    
    return response.json()
  })

// Logout
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const cookie = getRequestHeaders().get('cookie') || ''
  
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Cookie': cookie },
  })
  
  return { success: true }
})
```

---

## 4. RBAC (Role-Based Access Control)

### Role Definitions

```typescript
// utils/auth.ts
export const roles = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const

export type Role = (typeof roles)[keyof typeof roles]

const roleHierarchy: Record<Role, number> = {
  [roles.USER]: 0,
  [roles.MODERATOR]: 1,
  [roles.ADMIN]: 2,
  [roles.OWNER]: 3,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function hasExactRole(userRole: Role, requiredRole: Role): boolean {
  return userRole === requiredRole
}

// Permission helpers
export const permissions = {
  canManageUsers: (role: Role) => hasRole(role, roles.ADMIN),
  canModerate: (role: Role) => hasRole(role, roles.MODERATOR),
  canAccessAdmin: (role: Role) => hasRole(role, roles.ADMIN),
  canDeleteOwn: (userId: string, ownerId: string, role: Role) =>
    userId === ownerId || hasRole(role, roles.ADMIN),
}
```

### Admin Layout (Role Guard)

```typescript
// routes/_authenticated/_admin.tsx
import { hasRole, roles } from '~/utils/auth'

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: ({ context }) => {
    if (!hasRole(context.user.role, roles.ADMIN)) {
      throw redirect({ to: '/unauthorized' })
    }
    
    return { 
      isAdmin: true,
      adminPerms: getAdminPermissions(context.user),
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main><Outlet /></main>
    </div>
  )
}
```

### Route-Level Permission Check

```typescript
// routes/_authenticated/_admin/users.tsx
export const Route = createFileRoute('/_authenticated/_admin/users')({
  beforeLoad: ({ context }) => {
    if (!context.adminPerms?.canManageUsers) {
      throw redirect({ to: '/unauthorized' })
    }
  },
  loader: async ({ context }) => {
    return context.queryClient.fetchQuery({
      queryKey: ['users'],
      queryFn: () => getAllUsers(),
    })
  },
})
```

### UI Role Components

```typescript
// components/RoleRequired.tsx
import { useRouteContext } from '@tanstack/react-router'
import { hasRole } from '~/utils/auth'
import type { Role } from '~/utils/auth'

interface RoleRequiredProps {
  role: Role
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleRequired({ role, fallback = null, children }: RoleRequiredProps) {
  const { user } = useRouteContext({ from: '__root__' })
  
  if (!user || !hasRole(user.role, role)) return fallback
  return children
}

// Usage
function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      
      <RoleRequired role="admin">
        <Link to="/admin">Admin Panel</Link>
      </RoleRequired>
      
      <RoleRequired role="moderator">
        <Link to="/moderate">Moderation</Link>
      </RoleRequired>
    </nav>
  )
}
```

### PermissionGate Component

```typescript
// components/PermissionGate.tsx
interface PermissionGateProps {
  permission: (user: User) => boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGate({ permission, fallback, children }: PermissionGateProps) {
  const { user } = useRouteContext({ from: '__root__' })
  
  if (!user || !permission(user)) return fallback || null
  return children
}

// Usage
function PostCard({ post }: { post: Post }) {
  const { user } = useRouteContext({ from: '__root__' })
  
  return (
    <div>
      <h3>{post.title}</h3>
      
      <PermissionGate permission={(u) => u.id === post.authorId || hasRole(u.role, 'moderator')}>
        <button onClick={() => editPost(post.id)}>Edit</button>
      </PermissionGate>
      
      <PermissionGate permission={(u) => hasRole(u.role, 'admin')}>
        <button onClick={() => deletePost(post.id)}>Delete</button>
      </PermissionGate>
    </div>
  )
}
```

---

## 5. Client-Side Auth Provider (Components Only!)

```typescript
// auth/AuthProvider.tsx — ONLY for components, NEVER in beforeLoad/loader

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Initial user from router context (SSR-safe)
  const user = router.options.context.user

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      // Update router context for next navigation
      router.options.context.user = user
      // Invalidate routes to re-run guards
      router.invalidate()
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.options.context.user = null
      queryClient.clear()
      router.invalidate()
    },
  })

  return (
    <AuthContext.Provider value={{
      user,
      login: loginMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Use ONLY in COMPONENTS
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be in AuthProvider')
  return ctx
}
```

---

## 6. Auth Change Handling

When auth state changes (login/logout), invalidate the router:

```typescript
// hooks/useAuthChange.ts
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export function useAuthChange() {
  const router = useRouter()
  
  useEffect(() => {
    const unsubscribe = authEmitter.on('change', () => {
      router.invalidate()  // Re-run all beforeLoad guards
    })
    return unsubscribe
  }, [router])
}
```

---

## 7. Complete Directory Structure

```
src/
├── auth/
│   ├── AuthProvider.tsx      # React context (components only)
│   ├── useAuth.ts            # Hook
│   └── types.ts              # User, Role types
├── routes/
│   ├── __root.tsx            # Root layout + context
│   ├── index.tsx             # Landing
│   ├── login.tsx             # Login (reverse guard)
│   ├── unauthorized.tsx      # 403 page
│   ├── _authenticated.tsx    # Auth guard
│   ├── _authenticated/
│   │   ├── dashboard.tsx
│   │   └── profile.tsx
│   └── _authenticated/
│       └── _admin.tsx        # Admin guard
│       └── _admin/
│           ├── users.tsx
│           └── settings.tsx
├── utils/
│   ├── auth.ts               # Role/permission helpers
│   └── auth.functions.ts     # Server functions
└── components/
    ├── RoleRequired.tsx
    └── PermissionGate.tsx
```

---

## Key Principles

1. **Router context for guards** — beforeLoad/loader use `context.user`
2. **React context for UI only** — useAuth() in components, never in loaders
3. **Pathless layouts for guards** — `_authenticated.tsx`, `_admin.tsx`
4. **throw redirect, not render** — Block before render, no content flash
5. **Save redirect location** — `search: { redirect: location.href }`
6. **Invalidate on auth change** — `router.invalidate()` re-runs all guards
7. **Server validates everything** — Client UI is cosmetic, server is source of truth