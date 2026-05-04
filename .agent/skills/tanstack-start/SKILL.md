# TanStack Start — Skill Collection

> 5 composite skills covering the TanStack Start framework with best practices for SSR, authentication, backend integration, and data layer.

---

## Skill Overview

| Skill | File | Coverage |
|-------|------|----------|
| **Core Framework** | `tanstack-start-core.md` | Server functions, middleware, context, routing |
| **Authentication** | `tanstack-start-auth.md` | SSR-safe auth, RBAC, protected routes |
| **Backend Integration** | `tanstack-start-backend.md` | External API proxy, cookie forwarding, DI |
| **React Query** | `tanstack-start-query.md` | Query/Mutation patterns, hydration, cache |
| **Server Infrastructure** | `tanstack-start-server.md` | createStartHandler, SSR streaming, handlers |

---

## When to Use These Skills

- **New TanStack Start project** → Load all 5 skills
- **Adding auth** → Core + Auth + Server
- **Connecting to existing backend** → Core + Backend + Query
- **Migration from Next.js** → All skills (key paradigm shifts documented)
- **Team onboarding** → All skills as reference

## Key Paradigm Shifts (from Next.js/Remix)

| Next.js | TanStack Start |
|---------|----------------|
| `use server` directive | `createServerFn()` explicit RPC |
| `headers()` / `cookies()` | `getRequestHeaders()` / `getRequest()` |
| React Context for auth | Router context (isomorphic) |
| `redirect()` in component | `throw redirect()` in `beforeLoad` |
| Server Components default | Client-first, server functions explicit |
| `<Suspense>` boundaries | Router loaders with `useQuery` |

---

Load individual skills as needed. Each skill is self-contained with patterns, anti-patterns, and copy-paste examples.