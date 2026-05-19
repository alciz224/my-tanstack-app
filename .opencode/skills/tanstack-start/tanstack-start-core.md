# Skill: TanStack Start — Core Framework

> Server functions, middleware, context flow, routing, layouts, and navigation. The foundational skill for all TanStack Start development.

---

## Table of Contents

1. [Router Setup & Configuration](#1-router-setup--configuration)
2. [Routes & File-Based Routing](#2-routes--file-based-routing)
3. [Layouts (Nested & Pathless)](#3-layouts-nested--pathless)
4. [beforeLoad & Route Guards](#4-beforeload--route-guards)
5. [Loaders & Data Fetching](#5-loaders--data-fetching)
6. [Context Flow (Router → Route → Component)](#6-context-flow)
7. [Navigation & Redirects](#7-navigation--redirects)
8. [Server Functions (createServerFn)](#8-server-functions)
9. [Middleware](#9-middleware)
10. [Anti-Patterns](#10-anti-patterns)

---

## 1. Router Setup & Configuration

### Root Route with Typed Context

```typescript
// routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

// Define your router context shape — used EVERYWHERE
export interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Outlet />
        <Scripts />
        <TanStackRouterDevtools />
      </body>
    </html>
  )
}
```

### Router Creation

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { RouterContext } from './routes/__root'

export function createRouter(context?: Partial<RouterContext>) {
  return createTanStackRouter({
    routeTree,
    context: {
      queryClient: new QueryClient(),
      user: null,
      ...context,
    },
  })
}

// Type registration for autocomplete
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

### App Component with Router + QueryClient

```typescript
// app.tsx
import { RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter } from './router'

const queryClient = new QueryClient()
const router = createRouter({ queryClient })

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

---

## 2. Routes & File-Based Routing

### Convention

TanStack Router uses **file-based routing**. The file path determines the URL.

```
src/routes/
├── __root.tsx              # Root layout (wraps everything)
├── index.tsx               # /
├── about.tsx               # /about
├── posts/
│   ├── route.tsx           # Layout for /posts/*
│   ├── index.tsx           # /posts
│   └── $postId.tsx         # /posts/:postId
├── _authenticated.tsx      # Pathless layout (no URL segment)
├── _authenticated/
│   ├── dashboard.tsx       # /dashboard (protected)
│   └── settings.tsx        # /settings (protected)
└── admin/
    └── route.tsx           # Layout for /admin/*
```

### Route Types

| Pattern      | File                 | URL               | Purpose             |
| ------------ | -------------------- | ----------------- | ------------------- |
| **Static**   | `about.tsx`          | `/about`          | Simple page         |
| **Dynamic**  | `$postId.tsx`        | `/posts/123`      | Parameterized       |
| **Index**    | `index.tsx`          | `/` (parent)      | Default child route |
| **Layout**   | `route.tsx`          | Same as parent    | Wrapper component   |
| **Pathless** | `_authenticated.tsx` | No URL segment    | Grouping/Guards     |
| **Splat**    | `$.tsx`              | `/files/any/path` | Catch-all           |

### Creating a Route

```typescript
// routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <h1>About</h1>
}
```

### Dynamic Route with Params

```typescript
// routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: PostDetailPage,
})

function PostDetailPage() {
  // Access route params
  const { postId } = Route.useParams()

  return <h1>Post {postId}</h1>
}
```

### Route with Search Params Validation

```typescript
// routes/search.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().optional().default(''),
  page: z.number().optional().default(1),
  category: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})

function SearchPage() {
  const { q, page, category } = Route.useSearch()

  return (
    <div>
      <p>Query: {q}</p>
      <p>Page: {page}</p>
    </div>
  )
}
```

---

## 3. Layouts (Nested & Pathless)

### Basic Layout (Nested Route)

A `route.tsx` file in a directory creates a layout that wraps all children.

```typescript
// routes/posts/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
  component: PostsLayout,
})

function PostsLayout() {
  return (
    <div>
      <h1>Posts Section</h1>
      <nav>
        <Link to="/posts">All Posts</Link>
        <Link to="/posts/new">New Post</Link>
      </nav>
      <main>
        <Outlet />  {/* Child routes render here */}
      </main>
    </div>
  )
}
```

Children are automatically nested:

```typescript
// routes/posts/index.tsx       → /posts
// routes/posts/$postId.tsx     → /posts/:postId
// routes/posts/new.tsx         → /posts/new
```

### Pathless Layout (Route Groups)

Use `_` prefix to create a layout **without** adding a URL segment:

```typescript
// routes/_authenticated.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
```

Children **don't include** the underscore in their paths:

```
routes/_authenticated/dashboard.tsx    → URL: /dashboard
routes/_authenticated/settings.tsx     → URL: /settings
routes/_authenticated/profile.tsx      → URL: /profile
```

### Multiple Pathless Layouts (Composition)

```typescript
// routes/_authenticated.tsx              # Auth check + app shell
// routes/_authenticated/_admin.tsx       # Admin role check
// routes/_authenticated/_admin/
//   ├── users.tsx                        → /users (auth + admin)
//   └── analytics.tsx                    → /analytics (auth + admin)
```

### Root Layout

```typescript
// routes/__root.tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <Navbar />
        <Outlet />  {/* All routes render here */}
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
```

---

## 4. beforeLoad & Route Guards

### What is beforeLoad?

`beforeLoad` runs **before** the route component renders and **before** the loader. It is the correct place for:

- Authentication checks
- Authorization checks
- Redirecting unauthenticated users
- Extending context for children

```
Navigation triggered
    ↓
beforeLoad runs (can extend context, redirect)
    ↓
loader runs (receives context from beforeLoad)
    ↓
Component renders (receives data from loader)
```

### Authentication Guard (Protected Route)

```typescript
// routes/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    // Check if user is authenticated
    if (!context.user) {
      // Redirect to login, save the intended destination
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Return user to context so children can access it
    return { user: context.user }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
```

### Reverse Guard (Login Page)

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
```

### Role-Based Guard

```typescript
// routes/_authenticated/_admin.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: ({ context }) => {
    if (context.user?.role !== 'admin') {
      throw redirect({ to: '/unauthorized' })
    }

    return { isAdmin: true }
  },
  component: AdminLayout,
})
```

### Extending Context in beforeLoad

```typescript
// routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    // Access parent context
    console.log(context.queryClient)

    // Fetch additional data
    const permissions = await fetchPermissions()

    // Return new context (merged with parent)
    return { permissions }
  },

  loader: async ({ context }) => {
    // context.permissions is available here
    return context.queryClient.fetchQuery({
      queryKey: ['dashboard'],
      queryFn: () => getDashboardData(),
    })
  },
})
```

### beforeLoad with Search Params

```typescript
export const Route = createFileRoute('/search')({
  validateSearch: z.object({
    q: z.string().optional(),
    page: z.number().optional().default(1),
  }),

  // deps tells beforeLoad to re-run when these change
  beforeLoad: async ({ search, deps }) => {
    return { searchQuery: search.q, page: search.page }
  },
})
```

---

## 5. Loaders & Data Fetching

### Basic Loader

```typescript
// routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await getPost({ data: { id: params.postId } })
    return { post }
  },
  component: PostDetailPage,
})

function PostDetailPage() {
  const { post } = Route.useLoaderData()
  return <PostContent post={post} />
}
```

### Loader with Context

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    // Access context from beforeLoad
    const { queryClient, user } = context

    return queryClient.fetchQuery({
      queryKey: ['dashboard', user.id],
      queryFn: () => getDashboardData(user.id),
    })
  },
})
```

### Loader with Prefetch (React Query Integration)

```typescript
export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    const { queryClient } = context

    await queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: () => getPosts(),
    })

    // No need to return — React Query manages the cache
  },
  component: PostsPage,
})

function PostsPage() {
  // Same queryKey = cache hit after SSR
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })
}
```

### Loader with notFound

```typescript
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await getPost({ data: { id: params.postId } })

    if (!post) {
      throw notFound() // Renders the notFoundRoute
    }

    return { post }
  },
})
```

### Parallel Loaders (Parent + Child)

Route loaders at the same level execute **in parallel**:

```typescript
// routes/_authenticated.tsx
// routes/_authenticated/dashboard.tsx
// Both loaders run at the same time when navigating to /dashboard
```

---

## 6. Context Flow

### Full Context Hierarchy

```
Router Context (createRouter({ context: {} }))
    ↓
Root Route (createRootRouteWithContext<T>())
    ↓
Parent Route beforeLoad (returns → merged into context)
    ↓
Child Route beforeLoad (returns → merged into context)
    ↓
Route loader (receives full merged context)
    ↓
Components (Route.useRouteContext() or useRouteContext())
```

### Router-Level Context

```typescript
// router.tsx
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    user: null,
  },
})
```

### Accessing Context in Components

```typescript
function AdminPage() {
  // Get this route's context
  const { user, isAdminRoute } = Route.useRouteContext()

  // Get parent route's context
  const { user: dashboardUser } = useRouteContext({ from: '/dashboard' })

  // Get router-level context
  const router = useRouter()
  const { queryClient } = router.options.context
}
```

### Context in Server Functions

Server functions receive context through **middleware**:

```typescript
const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSession()
  return next({
    context: { user: session?.user },
  })
})

export const getCurrentUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return context.user // Fully typed!
  })
```

### Context Access Summary

| Location            | How to access                          | How to set                            |
| ------------------- | -------------------------------------- | ------------------------------------- |
| **Router**          | `router.options.context`               | `createRouter({ context: {} })`       |
| **Root Route**      | `createRootRouteWithContext<T>()`      | Return from `beforeLoad`              |
| **Route**           | `Route.useRouteContext()`              | Return from `beforeLoad`              |
| **Parent Route**    | `useRouteContext({ from: '/parent' })` | Parent's `beforeLoad`                 |
| **Loader**          | `({ context })` param                  | Inherited from `beforeLoad`           |
| **Server Function** | `({ context })` param                  | `next({ context: {} })` in middleware |

---

## 7. Navigation & Redirects

### Link Component

```typescript
import { Link } from '@tanstack/react-router'

// Basic link
<Link to="/about">About</Link>

// With params
<Link to="/posts/$postId" params={{ postId: '123' }}>
  View Post
</Link>

// With search params
<Link to="/search" search={{ q: 'hello', page: 1 }}>
  Search
</Link>

// Active state
<Link
  to="/dashboard"
  activeProps={{ className: 'active' }}
>
  Dashboard
</Link>
```

### Programmatic Navigation

```typescript
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({ to: '/dashboard' })

    // With params
    navigate({ to: '/posts/$postId', params: { postId: '123' } })

    // With search
    navigate({ to: '/search', search: { q: 'test' } })
  }
}
```

### Redirects

```typescript
import { redirect } from '@tanstack/react-router'

// In beforeLoad
beforeLoad: ({ context }) => {
  if (!context.user) {
    throw redirect({ to: '/login' })
  }
}

// In loader
loader: async ({ params }) => {
  const post = await getPost(params.id)
  if (!post) {
    throw notFound()
  }
  return { post }
}
```

### Handling Redirects in Components

```typescript
import { isRedirect } from '@tanstack/react-router'

try {
  await someFunction()
} catch (error) {
  // Re-throw redirects (they are intentional)
  if (isRedirect(error)) throw error

  // Handle real errors
  console.error(error)
}
```

---

## 8. Server Functions

### Basic Syntax

```typescript
import { createServerFn } from '@tanstack/react-start'

// GET — data fetching
export const getUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return db.user.findUnique({ where: { id: data.id } })
  })

// POST — mutations
export const createUser = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateUserInput) => data)
  .handler(async ({ data }) => {
    return db.user.create({ data })
  })
```

### File Organization Convention

```
src/utils/
├── users.functions.ts    # createServerFn wrappers (client-safe import)
├── users.server.ts       # Server-only logic (DB, APIs)
└── schemas.ts            # Shared validation schemas
```

| Extension       | Role                           | Client import? |
| --------------- | ------------------------------ | -------------- |
| `.functions.ts` | `createServerFn` wrappers      | ✅ Yes         |
| `.server.ts`    | Server-only (DB queries, APIs) | ❌ No          |
| `.ts`           | Shared types, schemas          | ✅ Yes         |

### Calling Server Functions

```typescript
// In route loader
export const Route = createFileRoute('/profile')({
  loader: async () => {
    const user = await getUser({ data: { id: '123' } })
    return { user }
  },
})

// In component with useServerFn
import { useServerFn } from '@tanstack/react-start'

function Profile() {
  const getUserServer = useServerFn(getUser)
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserServer({ data: { id: '123' } }),
  })
}
```

---

## 9. Middleware

### Types

| Type               | Scope               | Use for                          |
| ------------------ | ------------------- | -------------------------------- |
| `type: 'function'` | Per server function | Validation, logging, auth checks |
| Global             | All requests        | CORS, tracing, monitoring        |

### Basic Middleware

```typescript
import { createMiddleware } from '@tanstack/react-start'

const loggingMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next, context }) => {
    console.log('Before handler')
    const result = await next()
    console.log('After handler')
    return result
  },
)
```

### Bidirectional (Client → Server → Client)

```typescript
const traceMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const startTime = Date.now()
    const result = await next({ sendContext: { startTime } })
    console.log(`Duration: ${Date.now() - startTime}ms`)
    return result
  })
  .server(async ({ next, context }) => {
    // context.startTime available here
    return next()
  })
```

### Execution Order (Dependency-First)

```
globalMiddleware1
  → globalMiddleware2
    → middlewareA
      → middlewareB (depends on A)
        → middlewareC
          → serverFunction
```

### Middleware Factory (Parameterized)

```typescript
function authorizationMiddleware(permissions: Record<string, string[]>) {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      const granted = await auth.hasPermission(context.session, permissions)
      if (!granted) throw new Error('Forbidden')
      return next()
    })
}
```

---

## 10. Anti-Patterns

### ❌ React Context in beforeLoad/loader

```typescript
// WRONG
beforeLoad: async () => {
  const auth = useAuth() // ❌ React Context doesn't exist on server
}

// CORRECT
beforeLoad: ({ context }) => {
  const { user } = context // ✅ Router context (isomorphic)
}
```

### ❌ Import .server.ts in client code

```typescript
// WRONG
import { db } from './db.server' // ❌ Server-only file in client code

// CORRECT
// .functions.ts: only createServerFn wrappers
// .server.ts: DB logic, called ONLY inside handler
```

### ❌ Missing return next() in middleware

```typescript
// WRONG
.server(async ({ next }) => {
  await next()  // ❌ Missing return
})

// CORRECT
.server(async ({ next }) => {
  const result = await next()
  return result  // ✅ Propagate result
})
```

### ❌ Component guards instead of beforeLoad

```typescript
// WRONG (Next.js pattern — causes content flash)
function ProtectedPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
}

// CORRECT (TanStack pattern — blocks before render)
beforeLoad: ({ context }) => {
  if (!context.user) throw redirect({ to: '/login' })
}
```

### ❌ Using loaders without React Query for SSR

```typescript
// WRONG — data not dehydrated for client
loader: async () => {
  return { posts: await fetchPosts() }
}

// CORRECT — prefetched into React Query cache
loader: async ({ context }) => {
  await context.queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })
}
// Then use useQuery({ queryKey: ['posts'] }) in component
```

---

## Key Principles

1. **Router context is isomorphic** — Use it in `beforeLoad`, `loader`, NOT React Context
2. **beforeLoad blocks rendering** — Guards go here, not in components
3. **File-based routing** — File path = URL, `_` = pathless layout, `$` = param
4. **Layout nesting via Outlet** — Parent layouts wrap children
5. **Context flows down** — Return values from `beforeLoad` merge into child context
6. **Server functions are explicit RPCs** — No `use server`, use `createServerFn`
7. **Middleware must return next()** — `return next()`, not just `await next()`
8. **Prefetch in loader, consume in component** — SSR + client cache continuity
