# Cookie Forwarding & Server Functions - Complete Guide

## Executive Summary

This document provides comprehensive guidance on TanStack Start server functions, cookie forwarding patterns, and when to use server functions vs client-side fetch in the EduVault project.

**Key Finding:** The current authentication architecture is **CORRECT** and should **NOT** be changed.

---

## Quick Reference

### ✅ Use Server Functions For:

- Data fetching in `beforeLoad`/`loader`
- Non-auth CRUD operations (academic years, etc.)
- Operations that need SSR support

### ❌ Use Client Functions For:

- **Login** (sets session cookie in browser)
- **Logout** (clears session cookie in browser)
- **Register** (sets session cookie in browser)
- **Role selection** (modifies session state)
- Any session-modifying operation

---

## Table of Contents

1. [TanStack Start Built-in Cookie Helpers](#tanstack-start-built-in-cookie-helpers)
2. [Why Auth Must Be Client-Side](#why-auth-must-be-client-side)
3. [Current Implementation Analysis](#current-implementation-analysis)
4. [Recommended Patterns](#recommended-patterns)
5. [Helper Functions](#helper-functions)
6. [Migration Examples](#migration-examples)
7. [Testing Your Implementation](#testing-your-implementation)

---

## TanStack Start Built-in Cookie Helpers

### Current State (v1.157.16)

TanStack Start **does not** provide built-in `getCookie`/`setCookie`/`deleteCookie` helpers like some other frameworks. Instead, you must:

1. **Access cookies from request context**
2. **Manually forward them to external APIs** (Django)

### Request Context Pattern

Server functions receive context with the incoming request:

```typescript
// Pattern 1: Simple handler
createServerFn({ method: 'GET' }).handler(async (ctx) => {
  const request = ctx.request // or (ctx as any)?.request
  const cookieHeader = request?.headers.get('cookie')
})

// Pattern 2: With validator
createServerFn({ method: 'POST' })
  .validator((data) => data)
  .handler(async ({ data, context }) => {
    const request = context.request // or (context as any)?.request
    const cookieHeader = request?.headers.get('cookie')
  })
```

### Our Custom Helper (Recommended)

Located in `src/lib/api-client.ts`:

```typescript
export function getCookieHeader(ctx: any): string | undefined {
  // Try multiple possible locations for the request object
  const req = ctx?.request || (ctx as any)?.context?.request || ctx

  if (!req?.headers?.get) {
    return undefined
  }

  return req.headers.get('cookie') || undefined
}
```

**Why this helper exists:**

- Handles both handler patterns (simple and validator)
- Provides consistent error handling
- Works across TanStack Start version changes

---

## Why Auth Must Be Client-Side

### The Session Cookie Problem

Django uses **httpOnly session cookies** for authentication:

```
Set-Cookie: sessionid=abc123xyz; HttpOnly; Secure; SameSite=Lax
```

**Key characteristics:**

- Set by Django on successful login
- Stored by browser automatically
- **NOT accessible to JavaScript** (httpOnly flag)
- Auto-sent by browser on same-origin requests

### What Happens with Server Functions (❌ BROKEN)

```
1. Browser calls loginServerFn()
2. TanStack Start Node.js server receives call
3. Server forwards to Django: POST /api/v2/auth/login/
4. Django validates credentials ✅
5. Django responds: Set-Cookie: sessionid=abc123
6. ❌ Cookie goes to Node.js server, NOT the browser!
7. ❌ Browser has no session cookie
8. ❌ User appears logged out despite "successful" login
```

**Visual Flow:**

```
Browser                 Node.js Server              Django
   |                          |                        |
   |-- loginServerFn() ------>|                        |
   |                          |---- POST /login ------>|
   |                          |                        |-- Validate
   |                          |<--- Set-Cookie --------|
   |                          |   (sessionid=abc)      |
   |                          |                        |
   |<--- "Success" -----------|                        |
   |                                                    |
   | ❌ No cookie stored!                              |
   |                                                    |
   |-- Next request ---------------------------------->|
   |                                                    |-- No session!
   |<--- 401 Unauthorized ----------------------------|
```

### What Happens with Client Functions (✅ CORRECT)

```
1. Browser calls loginFn() with fetch()
2. Browser → Vite Proxy → Django: POST /api/v2/auth/login/
3. Django validates credentials ✅
4. Django responds: Set-Cookie: sessionid=abc123
5. ✅ Browser receives and stores cookie automatically
6. ✅ All future requests include cookie
7. ✅ User is authenticated
```

**Visual Flow:**

```
Browser                 Vite Proxy                  Django
   |                        |                          |
   |-- fetch('/api/v2/auth/login/', {credentials: 'include'})
   |                        |                          |
   |----------------------->|---- POST /login -------->|
   |                        |                          |-- Validate
   |                        |<--- Set-Cookie ----------|
   |                        |   (sessionid=abc)        |
   |<--- Set-Cookie --------|                          |
   |   (sessionid=abc)                                 |
   |                                                    |
   | ✅ Browser stores cookie                          |
   |                                                    |
   |-- Next request (auto includes cookie) ----------->|
   |                                                    |-- Session valid!
   |<--- User data ------------------------------------|
```

### Why Response Header Forwarding Is Fragile

You _could_ try to forward `Set-Cookie` headers from Django → Node.js → Browser:

```typescript
// ❌ DON'T DO THIS - Fragile and error-prone
export const loginServerFn = createServerFn({ method: 'POST' }).handler(
  async ({ data, context }) => {
    const res = await fetch(`${BACKEND_URL}/api/v2/auth/login/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    // Try to forward Set-Cookie header
    const setCookie = res.headers.get('set-cookie')
    if (setCookie && (context as any).responseHeaders) {
      ;(context as any).responseHeaders.set('set-cookie', setCookie)
    }

    return await res.json()
  },
)
```

**Problems:**

1. `context.responseHeaders` API is undocumented and may change
2. Multiple `Set-Cookie` headers may not forward correctly
3. Cookie attributes (Secure, HttpOnly, Domain) may break
4. CORS issues with cross-origin cookies
5. More code, more complexity, more bugs

**Solution:** Just use client-side fetch and let the browser handle it! 🎯

---

## Current Implementation Analysis

### What We Have (✅ Good)

#### Server Functions for Data Fetching

```typescript
// src/server/auth.ts
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const req = (ctx as any)?.request
    const cookieHeader = req?.headers.get('cookie') || ''

    const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })

    if (!res.ok) return null
    return await res.json()
  },
)
```

**Why this works:**

- Runs during SSR (initial page load)
- Forwards browser cookies to Django
- Returns user state for server-rendered pages
- No session modification

#### Client Functions for Auth Mutations

```typescript
// src/server/auth.ts
export async function loginFn(data: LoginInput): Promise<AuthResult> {
  // Get CSRF token
  const csrfRes = await fetch('/api/v2/auth/csrf/', {
    credentials: 'include',
  })
  const csrfData = await csrfRes.json()
  const csrfToken = csrfData?.data?.csrf_token

  // Login
  const res = await fetch('/api/v2/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  // Browser automatically handles Set-Cookie from Django
  return await res.json()
}
```

**Why this works:**

- Runs in browser context
- Browser automatically sends/receives cookies
- Django can set session cookie
- No manual cookie manipulation

### What Needs Migration (Optional Improvement)

#### Client Mutations → Server Functions

Files to migrate:

- `src/lib/api-mutations.ts` - Academic year CRUD operations

**These are safe to migrate because they DON'T modify session state.**

---

## Recommended Patterns

### Pattern 1: Data Fetching (GET)

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export const getResourcesFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const cookieHeader = getCookieHeader(ctx)

    const res = await fetch(`${BACKEND_URL}/api/v2/resources/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })

    if (!res.ok) return null

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) return null

    return await res.json()
  },
)
```

### Pattern 2: Parameterized Fetching

```typescript
export const getResourceFn = createServerFn({ method: 'GET' })
  .validator((id: unknown) => {
    if (typeof id !== 'string' || !id) {
      throw new Error('Invalid ID')
    }
    return id
  })
  .handler(async ({ data: id, context }) => {
    const cookieHeader = getCookieHeader(context)

    const res = await fetch(`${BACKEND_URL}/api/v2/resources/${id}/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })

    if (!res.ok) return null
    return await res.json()
  })
```

### Pattern 3: Non-Auth Mutations (POST/PATCH/DELETE)

```typescript
import { getCsrfTokenServerSide } from '@/server/csrf'

export const createResourceFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    const data = input as ResourceInput
    if (!data.name) throw new Error('Name required')
    return data
  })
  .handler(async ({ data, context }) => {
    const cookieHeader = getCookieHeader(context)

    // Get CSRF token
    const csrfToken = await getCsrfTokenServerSide(context)

    // Make mutation
    const res = await fetch(`${BACKEND_URL}/api/v2/resources/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: responseData?.message || `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: responseData,
    }
  })
```

### Pattern 4: Auth Mutations (Client-Side)

```typescript
export async function authMutationFn(data: InputData): Promise<AuthResult> {
  // Step 1: Get CSRF token
  const csrfRes = await fetch('/api/v2/auth/csrf/', {
    credentials: 'include',
  })

  if (!csrfRes.ok) {
    throw new Error('Failed to get CSRF token')
  }

  const csrfData = await csrfRes.json()
  const csrfToken = csrfData?.data?.csrf_token

  // Step 2: Make auth mutation
  const res = await fetch('/api/v2/auth/endpoint/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  // Browser automatically handles Set-Cookie
  const responseData = await res.json()

  if (!res.ok) {
    return {
      success: false,
      error: responseData?.message || `Request failed (${res.status})`,
    }
  }

  return {
    success: true,
    user: responseData?.data?.user,
  }
}
```

---

## Helper Functions

### New Helper: CSRF Token (Server-Side)

**File:** `src/server/csrf.ts` (newly created)

```typescript
import { getCookieHeader } from '@/lib/api-client'

export async function getCsrfTokenServerSide(ctx: any): Promise<string> {
  const cookieHeader = getCookieHeader(ctx)

  const res = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to get CSRF token (${res.status})`)
  }

  const data = await res.json()
  const token = data?.data?.csrf_token

  if (!token) {
    throw new Error('CSRF token not found in response')
  }

  return token
}
```

### New Helper: Generic Mutation Factory

**File:** `src/server/mutation-helper.ts` (newly created)

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'
import { getCsrfTokenServerSide } from './csrf'

export function createMutationFn<TInput, TOutput>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST',
) {
  return createServerFn({ method: 'POST' })
    .validator((input: unknown) => input as TInput)
    .handler(async ({ data, context }) => {
      const cookieHeader = getCookieHeader(context)
      const csrfToken = await getCsrfTokenServerSide(context)

      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        credentials: 'include',
        body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
      })

      const responseData = await res.json()

      if (!res.ok) {
        return {
          success: false,
          error: responseData?.message || `Request failed (${res.status})`,
        }
      }

      return {
        success: true,
        data: responseData,
      }
    })
}
```

**Usage:**

```typescript
import { createMutationFn } from '@/server/mutation-helper'

export const createAcademicYearFn = createMutationFn<
  AcademicYearInput,
  AcademicYear
>('/api/v1/academic/academic-years/', 'POST')

export const updateAcademicYearFn = (id: string) =>
  createMutationFn<Partial<AcademicYearInput>, AcademicYear>(
    `/api/v1/academic/academic-years/${id}/`,
    'PATCH',
  )
```

---

## Migration Examples

### Example: Academic Year Mutations

**New file:** `src/server/api/academic-mutations.ts` (newly created)

See the file for complete implementation using the helper functions.

**Usage in components:**

```typescript
// Before (client function)
import { createAcademicYear } from '@/lib/api-mutations'

const result = await createAcademicYear({
  name: '2024-2025',
  start_date: '2024-09-01',
  end_date: '2025-06-30',
})

// After (server function)
import { createAcademicYearFn } from '@/server/api/academic-mutations'

const result = await createAcademicYearFn({
  data: {
    name: '2024-2025',
    start_date: '2024-09-01',
    end_date: '2025-06-30',
  },
})
```

**Benefits:**

- Works in SSR context (route actions, loaders)
- Type-safe input validation
- Consistent error handling
- Automatic cookie forwarding
- Automatic CSRF token handling

---

## Testing Your Implementation

### Test 1: SSR Cookie Forwarding

```typescript
// In route loader
export const Route = createFileRoute('/_authed/test')({
  loader: async () => {
    const data = await getDataFn()
    return { data }
  },
})
```

**Verification:**

1. Hard refresh the page (full SSR)
2. Check browser Network tab → initial HTML request
3. Look at response → should contain user data
4. Check server logs for "Cookie forwarding: yes"

### Test 2: Client-Side Auth Mutation

```typescript
const result = await loginFn({
  identifier: 'test@example.com',
  password: 'password123',
})
```

**Verification:**

1. Check browser Network tab → /api/v2/auth/login/ request
2. Check Response Headers → should have `Set-Cookie: sessionid=...`
3. Check Application tab → Cookies → should see sessionid
4. Navigate to protected route → should stay authenticated

### Test 3: Server Function Mutation

```typescript
const result = await createAcademicYearFn({
  data: { name: 'Test Year', start_date: '2024-01-01', end_date: '2024-12-31' },
})
```

**Verification:**

1. Check browser Network tab → should see server function request
2. Check server logs for CSRF token fetch
3. Check server logs for cookie forwarding
4. Verify mutation succeeded
5. Refresh page → new item should appear (from SSR loader)

---

## Summary & Action Items

### Current State: ✅ CORRECT

The existing authentication architecture is sound:

- Server functions for data fetching ✅
- Client functions for auth mutations ✅
- Manual cookie forwarding pattern ✅

### Recommended Actions

1. **Keep auth as client-side** (login, logout, register, role selection)
2. **Optional:** Migrate non-auth mutations to server functions using helpers
3. **Use new helpers** (`getCsrfTokenServerSide`, `createMutationFn`)
4. **Document patterns** in component examples

### Files Created

- ✅ `docs/SERVER_FUNCTIONS_GUIDE.md` - Comprehensive implementation guide
- ✅ `docs/COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md` - This document
- ✅ `src/server/csrf.ts` - CSRF token helper
- ✅ `src/server/mutation-helper.ts` - Generic mutation factory
- ✅ `src/server/api/academic-mutations.ts` - Example server function mutations

### Next Steps

1. Review the helper functions
2. Decide if you want to migrate client mutations to server functions
3. If yes, use `src/server/api/academic-mutations.ts` as a template
4. Update components to use new server functions
5. Test thoroughly in both SSR and client contexts

---

## References

- [TanStack Start Docs](https://tanstack.com/start/latest/docs/overview)
- [TanStack Router Auth Guide](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [Django CSRF Protection](https://docs.djangoproject.com/en/stable/ref/csrf/)
- Project Architecture: `docs/ARCHITECTURE.md`
- Server Functions Guide: `docs/SERVER_FUNCTIONS_GUIDE.md`
