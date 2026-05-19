# Cookie Authentication Variant

When your backend API uses httpOnly session cookies, the `ApiAdapter` must forward the browser's `Cookie` header on every server-to-server request.

## The Problem

`fetch()` inside `createServerFn` is server-to-server. It does NOT automatically carry the browser's cookies. Without forwarding, the backend sees no session and returns `401 Unauthorized`.

## The Fix

Use `getWebRequest()` from `@tanstack/react-start/server` to capture the incoming request's cookies, then attach them to the outbound `fetch()`.

### ApiAdapter with Cookie Forwarding

```typescript
import { getWebRequest } from '@tanstack/react-start/server'

export class ApiAdapter extends BaseAdapter implements DataAdapter {
  private readonly cookieHeader: string | null

  constructor() {
    super()
    this.baseUrl = process.env.API_BASE_URL!
    this.apiKey = process.env.API_KEY!

    const request = getWebRequest()
    this.cookieHeader = request?.headers.get('cookie') ?? null
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...(this.cookieHeader ? { cookie: this.cookieHeader } : {}),
        ...options?.headers,
      },
    })
    // ... error handling
  }
}
```

### Factory Must Be Request-Scoped

Do NOT use a singleton exported adapter. Create a fresh adapter inside each server function handler:

```typescript
// factory.ts
export function getDataService(): DataAdapter {
  if (process.env.LOCAL_DATA === 'true') return new LocalAdapter()
  return new ApiAdapter() // captures current request cookies
}
```

```typescript
// server.fn.ts
export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const dataService = getDataService() // fresh per request
  return dataService.getUsers()
})
```

## CSRF / XSRF Token Forwarding

If your backend validates CSRF tokens:

```typescript
const request = getWebRequest();
this.cookieHeader = request?.headers.get('cookie') ?? null;
this.csrfToken = request?.headers.get('x-csrf-token')
               ?? request?.headers.get('x-xsrf-token')
               ?? null;

// in fetch():
...(this.csrfToken ? { 'x-csrf-token': this.csrfToken } : {}),
```

## Response Cookie Forwarding

If your backend refreshes the session cookie (rolling JWT), forward `Set-Cookie` back to the browser:

```typescript
// In ApiAdapter.fetch(), capture:
const setCookie = response.headers.get('set-cookie')

// In server function:
import { setHeaders } from '@tanstack/react-start/server'
export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const dataService = getDataService()
  const users = await dataService.getUsers()
  // If adapter exposes set-cookie, forward it:
  if ((dataService as any).setCookieHeader) {
    setHeaders({ 'set-cookie': (dataService as any).setCookieHeader })
  }
  return users
})
```

## When LOCAL_DATA=true

The `LocalAdapter` needs no cookies. It either bypasses auth or simulates an authenticated user:

```typescript
async getUsers(): Promise<User[]> {
  // Always returns data as if user is logged in
  return [...this.users];
}
```

## Checklist

- [ ] `ApiAdapter` captures `getWebRequest().headers.get('cookie')`
- [ ] Factory returns `new ApiAdapter()` per call, not a singleton
- [ ] Server functions call `getDataService()` inside the handler
- [ ] CSRF token forwarded if backend requires it
- [ ] `Set-Cookie` forwarded back to browser if session refreshes
