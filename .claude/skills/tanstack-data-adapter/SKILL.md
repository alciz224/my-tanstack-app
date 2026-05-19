---
name: tanstack-data-adapter
description: Scalable local/real data adapter pattern for TanStack Start projects using createServerFn. Provides a factory-driven adapter architecture that toggles between local mock data and real backend APIs via the LOCAL_DATA environment variable, without modifying server function code. Use when building or refactoring TanStack Start applications that need (1) offline development with mock data, (2) seamless switching between local and real backends, (3) request-scoped adapters for httpOnly cookie session forwarding, or (4) type-safe data layer abstraction for server functions.
---

# TanStack Data Adapter Pattern

Apply a scalable adapter + factory pattern to TanStack Start projects so server functions work identically with local mock data or a real backend API.

## When to Use

- User wants to develop offline with mock data and switch to real API later
- User needs to toggle between staging and production backends without code changes
- User's backend API requires httpOnly session cookie forwarding from server functions
- User wants type-safe data layer abstraction for `createServerFn` functions
- User needs consistent error handling and request timing across data sources

## Workflow

Implementing the pattern involves these steps:

1. Scaffold the data layer directory (`app/server/data/`)
2. Create the type contract (`types.ts`)
3. Create the base adapter (`base.adapter.ts`) — optional but recommended
4. Implement the local mock adapter (`local.adapter.ts`)
5. Implement the real API adapter (`api.adapter.ts`)
6. Wire the factory (`factory.ts` or `index.ts`)
7. Write server functions (`*.fn.ts`) using `getDataService()`
8. Configure environment variables (`LOCAL_DATA`, `API_BASE_URL`, `API_KEY`)
9. Validate the setup by toggling `LOCAL_DATA` between `true` and `false`

## Step Details

### 1. Scaffold Directory

Create the data layer root:

```
app/server/data/
├── types.ts
├── base.adapter.ts
├── local.adapter.ts
├── api.adapter.ts
├── factory.ts
└── mocks/
    ├── users.mock.ts
    ├── products.mock.ts
    └── index.ts
```

Use the templates in `assets/templates/` as starting points. Copy them into the target project and adapt domain names.

### 2. Type Contract (`types.ts`)

Define:

- Domain interfaces (`User`, `Product`, etc.)
- Input interfaces (`CreateUserInput`, `UpdateProductInput`, etc.)
- The `DataAdapter` interface declaring every data operation

Server functions depend ONLY on `DataAdapter`. No adapter-specific types leak upward.

### 3. Base Adapter (`base.adapter.ts`)

Abstract class implementing `DataAdapter` with shared helpers:

- `wrapError(operation, error)` — consistent error wrapping
- `delay(ms)` — network simulation for local mode

Skip this step only if the project has trivial error handling needs.

### 4. Local Adapter (`local.adapter.ts`)

In-memory mock implementation:

- Spread mock arrays in constructor (`[...mockUsers]`) to prevent state leakage
- Use `this.delay()` to simulate realistic latency
- Return object copies (`{ ...user }`) to prevent caller mutation
- Generate deterministic or timestamp-based IDs

Reference `assets/templates/local.adapter.ts` for the boilerplate.

### 5. API Adapter (`api.adapter.ts`)

Server-to-server `fetch()` wrapper:

- Read `API_BASE_URL` and `API_KEY` from server-only env
- Wrap `fetch()` with error handling; return `null` on 404s for `getById` methods
- If the backend uses httpOnly session cookies, capture the incoming request cookie via `getWebRequest()` and forward it in the `cookie` header (see `references/cookie-auth.md`)

Reference `assets/templates/api.adapter.ts` for the boilerplate.

### 6. Factory (`factory.ts`)

Export `getDataService(): DataAdapter`:

```typescript
export function getDataService(): DataAdapter {
  if (process.env.LOCAL_DATA === 'true') return new LocalAdapter()
  return new ApiAdapter()
}
```

**Critical rule:** `getDataService()` must be called **inside** the server function handler, never at module top-level. This ensures:

- Correct request-scoped cookie capture
- Fresh state per invocation
- Safe SSR resolution

### 7. Server Functions (`*.fn.ts`)

Write `createServerFn` functions that call `getDataService()` inside the handler:

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getDataService } from '~/server/data'

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const dataService = getDataService()
  return dataService.getUsers()
})
```

Never branch on `LOCAL_DATA` inside a server function. Never import `LocalAdapter` or `ApiAdapter` directly.

### 8. Environment Variables

Development (`.env.local`):

```bash
LOCAL_DATA=true
API_BASE_URL=https://api.staging.example.com/v1
API_KEY=sk_staging_xxx
```

Production:

```bash
LOCAL_DATA=false
API_BASE_URL=https://api.example.com/v1
API_KEY=sk_prod_xxx
```

Validate with zod if the project already uses it.

### 9. Validation

Toggle `LOCAL_DATA` between `true` and `false`:

- Server functions must require zero code changes
- UI and loaders must behave identically in both modes
- Errors must have consistent shapes

## Bundled Resources

- **Templates** (`assets/templates/`): Copy-ready boilerplate for every file in the pattern.
  - `types.ts` — domain + adapter interface
  - `base.adapter.ts` — abstract base with shared helpers
  - `local.adapter.ts` — in-memory mock implementation
  - `api.adapter.ts` — real API fetch with optional cookie forwarding
  - `factory.ts` — `getDataService()` factory
  - `server.fn.ts` — example server functions consuming the factory
  - `env.ts` — zod env validation schema
  - `mocks/*.ts` — fixture data for users and products

- **References** (`references/`):
  - `adapter-pattern.md` — full implementation guide, advanced patterns, troubleshooting
  - `cookie-auth.md` — httpOnly session cookie forwarding, CSRF tokens, response cookie handling

## Important Guidelines

- Always call `getDataService()` inside the server function handler, never as a module-level singleton.
- If the backend requires authentication cookies, read `references/cookie-auth.md` before implementing `api.adapter.ts`.
- Spread mock data arrays in `LocalAdapter` constructor to prevent state leaking across hot reloads.
- Return object copies from `LocalAdapter` to prevent accidental mutations by callers.
- Use `getWebRequest()` from `@tanstack/react-start/server` only inside server contexts (i.e., inside `createServerFn` handlers or the factory function when called from them).
