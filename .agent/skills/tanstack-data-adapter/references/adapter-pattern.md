# Data Adapter Pattern Reference

Complete implementation guide for the scalable local/real data pattern in TanStack Start.

## Table of Contents

1. Architecture Overview
2. File-by-File Implementation
3. Environment Configuration
4. Testing Patterns
5. Advanced Patterns
6. Troubleshooting

---

## 1. Architecture Overview

The pattern separates data access into three layers:

- **Contract layer** (`types.ts`): TypeScript interface all adapters implement.
- **Adapter layer** (`local.adapter.ts`, `api.adapter.ts`, `base.adapter.ts`): Concrete implementations.
- **Factory layer** (`factory.ts` or `index.ts`): Resolves which adapter to use based on `LOCAL_DATA` env.

Server functions (`createServerFn`) call `getDataService()` inside their handler. They never know which adapter is active.

Directory structure:

```
app/server/data/
├── types.ts              # DataAdapter interface + domain types
├── base.adapter.ts       # Shared utilities (optional)
├── local.adapter.ts      # Mock implementation
├── api.adapter.ts        # Real backend implementation
├── factory.ts            # getDataService() factory
└── mocks/
    ├── users.mock.ts
    ├── products.mock.ts
    └── index.ts

app/server/functions/
├── users.fn.ts           # createServerFn callers
└── products.fn.ts
```

---

## 2. File-by-File Implementation

### types.ts

Define the `DataAdapter` interface. Every adapter must satisfy this contract. Add domain types (`User`, `Product`) and input types (`CreateUserInput`).

Key rule: server functions import ONLY from `types.ts` (for types) and `factory.ts` (for the service instance).

### base.adapter.ts

Abstract class with shared helpers:
- `wrapError(operation, error)` — consistent error shapes
- `delay(ms)` — simulate network latency in local mode

Optional but recommended. Keeps error handling DRY across adapters.

### local.adapter.ts

In-memory mock implementation:
- Spread mock arrays (`[...mockUsers]`) so mutations don't leak across server restarts.
- Use `this.delay()` to simulate realistic latency.
- Generate IDs with `local_${Date.now()}` or UUID.
- Return object copies (`{ ...user }`) to prevent mutation by callers.

### api.adapter.ts

Server-to-server fetch implementation:
- Read `API_BASE_URL` and `API_KEY` from server-only env.
- Wrap `fetch()` with consistent error handling.
- Return `null` for 404s on `getById` methods instead of throwing.
- Parse query strings with `URLSearchParams` for filters.

### factory.ts

The resolution logic:

```typescript
export function getDataService(): DataAdapter {
  if (process.env.LOCAL_DATA === 'true') {
    return new LocalAdapter();
  }
  return new ApiAdapter();
}
```

Critical: call `getDataService()` **inside** the server function handler, not at module load time. This ensures:
- Request-scoped behavior (for cookie forwarding)
- Fresh state per invocation
- Correct env resolution in SSR contexts

### server.fn.ts

Server functions stay completely agnostic:

```typescript
export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const dataService = getDataService();
  return dataService.getUsers();
});
```

Import `getDataService` from `~/server/data` (or relative path). Never branch on `LOCAL_DATA` inside a server function.

---

## 3. Environment Configuration

### .env.local (development)

```bash
LOCAL_DATA=true
API_BASE_URL=https://api.staging.example.com/v1
API_KEY=sk_staging_xxx
```

### .env.production

```bash
LOCAL_DATA=false
API_BASE_URL=https://api.example.com/v1
API_KEY=sk_prod_xxx
```

Validation with zod is recommended (see `env.ts` template).

---

## 4. Testing Patterns

### Unit Tests with Fresh Adapter

Use `getDataService()` directly in tests when `LOCAL_DATA=true`, or instantiate `LocalAdapter` directly for isolated state:

```typescript
import { LocalAdapter } from './local.adapter';

const adapter = new LocalAdapter();
const user = await adapter.createUser({ email: 'test@test.com', name: 'Test' });
```

### Mock Override for Edge Cases

Create specialized adapters (`FlakyAdapter`, `EmptyAdapter`) that implement `DataAdapter` for testing error boundaries, loading states, and empty states.

---

## 5. Advanced Patterns

### Per-Route Migration

If you need some domains on real API and others on local data during a migration, create a composite adapter or add domain checks in the factory.

### Response Cookie Forwarding

If your backend refreshes session cookies (rolling JWT), capture `response.headers.get('set-cookie')` in `ApiAdapter` and forward it to the browser via TanStack Start's `setHeaders()` in the server function.

### Logging Middleware

Wrap adapters with a Proxy or decorator to log timing and errors without modifying adapter code.

---

## 6. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Mock mutations persist across reloads | Module-level cache or missing spread | Ensure `LocalAdapter` does `[...mockUsers]` in constructor |
| `process.env.LOCAL_DATA` undefined | Env not loaded at module resolution | Use lazy resolution inside factory function |
| 401 from backend API | Cookie not forwarded | Ensure `ApiAdapter` captures `getWebRequest().headers.get('cookie')` |
| Real adapter tries to connect in local mode | Factory resolution at module load | Move `new ApiAdapter()` inside `getDataService()`, not top-level |
