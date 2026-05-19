# Skill: TanStack Start — Server Infrastructure

> createStartHandler, SSR streaming, custom handlers, dehydrate/hydrate, and deployment patterns.

---

## 1. createStartHandler — The Server Entry Point

### What It Is

`createStartHandler` is the **main HTTP handler** that orchestrates the request pipeline. It processes every incoming request through 3 sequential phases.

### The 3 Phases

```
Request incoming
    │
    ├──► Phase 1: Server Function Dispatch
    │         URL: /_serverFn/{functionId}
    │         → Deserialize payload
    │         → Execute global middleware
    │         → Execute server function handler
    │         → Serialize and return result
    │         → SKIP Phase 2 & 3
    │
    ├──► Phase 2: Server Route Handler
    │         Match URL against routes with server.handler
    │         → Execute route middleware
    │         → Call HTTP handler (GET/POST)
    │         → Can call next() to proceed to Phase 3
    │
    └──► Phase 3: App Router SSR
              → Load all route loaders (parallel)
              → Dehydrate state for client
              → Call handler (streaming)
              → Render HTML with React
              → Stream to browser
```

### Basic Setup

```typescript
// src/server.ts (or ssr.tsx)
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
})(defaultStreamHandler)
```

### With Router Manifest (required for production)

```typescript
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'
import { getRouterManifest } from '@tanstack/react-start/server'

export default createStartHandler({
  createRouter,
  getRouterManifest: () => getRouterManifest(),
})(defaultStreamHandler)
```

---

## 2. Custom Handlers (Observability)

### Instrumentation Pattern

```typescript
import { defineHandlerCallback } from '@tanstack/react-start/server'
import * as Sentry from '@sentry/node'

const instrumentedHandler = defineHandlerCallback(async (ctx) => {
  // ctx contains: router, request, response, etc.

  // Extract route ID for grouping
  const matches = ctx.router?.state?.matches ?? []
  const leaf = matches[matches.length - 1]
  const routeId = leaf?.routeId ?? new URL(ctx.request.url).pathname

  // Add to Sentry scope
  Sentry.setTag('route', routeId)
  Sentry.setContext('route', {
    id: leaf?.routeId,
    path: leaf?.pathname,
  })

  return Sentry.startSpan({ op: 'tanstack.render', name: routeId }, () =>
    defaultStreamHandler(ctx),
  )
})

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(instrumentedHandler)
```

### Request Timing

```typescript
const timedHandler = defineHandlerCallback(async (ctx) => {
  const start = performance.now()
  const url = new URL(ctx.request.url)

  try {
    const response = await defaultStreamHandler(ctx)

    const duration = performance.now() - start
    console.log(
      `${ctx.request.method} ${url.pathname} - ${duration.toFixed(2)}ms`,
    )

    return response
  } catch (error) {
    console.error(`Error ${url.pathname}:`, error)
    throw error
  }
})
```

---

## 3. SSR with Router Context

### Providing Context for SSR

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  user: User | null
  queryClient: QueryClient
}

export function createRouter(context?: Partial<RouterContext>) {
  const queryClient = context?.queryClient ?? getQueryClient()

  return createTanStackRouter({
    routeTree,
    context: { user: null, queryClient, ...context },
    // Dehydrate React Query state
    dehydrate: () => ({
      queryClientState: queryClient
        .getQueryCache()
        .getAll()
        .map((q) => ({
          queryKey: q.queryKey,
          state: q.state,
        })),
    }),
  })
}
```

### Server Entry with Auth

```typescript
// server.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { createRouter } from './router'
import { validateSession } from './utils/auth'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler)
```

The auth extraction happens in the **root route's `beforeLoad`** or via a **server function** called from `beforeLoad`:

```typescript
// routes/__root.tsx
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    // This runs server-side during SSR
    // Server functions automatically forward cookies
    const user = await fetchUser()
    return { user }
  },
  component: RootComponent,
})
```

---

## 4. Streaming SSR

### How Streaming Works

```
1. Server starts streaming HTML immediately
2. Route loaders execute (with cookies forwarded)
3. React Query prefetches data
4. Suspense boundaries resolve progressively
5. Client receives HTML chunks as they're ready
6. Inline scripts hydrate state
7. React takes over interactivity
```

### Configuring Streaming

```typescript
// server.ts
import { defaultStreamHandler } from '@tanstack/react-start/server'

// defaultStreamHandler handles streaming automatically
// It uses React's renderToPipeableStream or renderToReadableStream

export default createStartHandler({
  createRouter,
})(defaultStreamHandler)
```

### Loading States (Route Level)

```typescript
// routes/posts.tsx
export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    const { queryClient } = context

    // This triggers during streaming
    // React will show pendingComponent until resolved
    await queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: () => getPosts(),
    })
  },
  pendingComponent: () => <PostsSkeleton />,
  component: PostsPage,
})
```

---

## 5. CDN / Asset Transform

### Transform Asset URLs for CDN

```typescript
export default createStartHandler({
  createRouter,
  getRouterManifest,
  transformAssetUrls: 'https://cdn.example.com',
})(defaultStreamHandler)
```

This rewrites all static asset URLs in the HTML to point to your CDN.

---

## 6. Deployment Patterns

### Node.js (Traditional Server)

```typescript
// server.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
})(defaultStreamHandler)
```

```javascript
// entry-node.js
import handler from './dist/server'
import { createServer } from 'node:http'

const server = createServer(handler)
server.listen(3000, () => console.log('Server: http://localhost:3000'))
```

### Vercel (Serverless)

```typescript
// vercel.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'

const handler = createStartHandler({
  createRouter,
})(defaultStreamHandler)

export default handler
```

### Cloudflare Workers

```typescript
// worker.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const handler = createStartHandler({
      createRouter: () => createRouter({ env }),
    })(defaultStreamHandler)

    return handler(request)
  },
}
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "./dist/server/entry-node.js"]
```

---

## 7. Environment Variables

### Server-Side Only

```typescript
// These are available in server functions and server entry
const API_URL = process.env.API_BASE_URL
const DATABASE_URL = process.env.DATABASE_URL
const SESSION_SECRET = process.env.SESSION_SECRET
```

### Client-Side (Vite convention)

```typescript
// Must be prefixed with VITE_
const PUBLIC_API_URL = import.meta.env.VITE_API_URL
```

### Isomorphic Access

```typescript
// utils/env.ts
export const env = {
  // Server-only
  apiUrl:
    typeof window === 'undefined'
      ? process.env.API_BASE_URL
      : import.meta.env.VITE_API_URL,

  // Client-exposed
  publicUrl: import.meta.env.VITE_PUBLIC_URL,
}
```

---

## 8. Error Handling at Server Level

### Global Error Boundary

```typescript
const errorHandler = defineHandlerCallback(async (ctx) => {
  try {
    return await defaultStreamHandler(ctx)
  } catch (error) {
    // Log to error service
    Sentry.captureException(error)

    // Return custom error page
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Something went wrong</h1>
          ${
            process.env.NODE_ENV === 'development'
              ? `<pre>${error.stack}</pre>`
              : '<p>Please try again later</p>'
          }
        </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } },
    )
  }
})
```

---

## 9. Complete Server File Structure

```
src/
├── server.ts                 # Server entry (createStartHandler)
├── router.tsx                # Router with context
├── app.tsx                   # App component (QueryClientProvider)
├── utils/
│   ├── query-client.ts       # QueryClient configuration
│   └── api.server.ts         # apiFetch helper
└── routes/
    └── __root.tsx            # Root route (beforeLoad for auth)
```

---

## Key Principles

1. **3-phase dispatch** — Server function → Route handler → SSR rendering
2. **Server functions skip SSR** — Phase 1 returns directly, no HTML rendering
3. **Custom handlers for observability** — `defineHandlerCallback` wraps `defaultStreamHandler`
4. **Router context drives SSR** — Auth state, QueryClient provided via context
5. **Streaming by default** — `defaultStreamHandler` streams progressively
6. **Dehydrate state** — React Query cache, router state sent to client
7. **Transform assets for CDN** — `transformAssetUrls` rewrites URLs
8. **Universal deployment** — Same code for Node, Vercel, Cloudflare, Docker
