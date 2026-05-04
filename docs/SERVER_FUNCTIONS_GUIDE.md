# TanStack Start Server Functions - Implementation Guide

## Overview

This guide explains how to use server functions in the EduVault project, including cookie forwarding patterns, CSRF handling, and when to use server functions vs client-side fetch.

**Package Version:** `@tanstack/react-start@1.157.16`

---

## Table of Contents

1. [Cookie Architecture](#cookie-architecture)
2. [When to Use Server Functions](#when-to-use-server-functions)
3. [Cookie Forwarding Pattern](#cookie-forwarding-pattern)
4. [Server Function Patterns](#server-function-patterns)
5. [Migration Guide](#migration-guide)
6. [Helper Functions](#helper-functions)

---

## Cookie Architecture

### Django Session Cookies

Django uses **httpOnly session cookies** for authentication:

- **Set by Django** on login (`Set-Cookie` header)
- **Stored in browser** automatically
- **Auto-sent by browser** on requests to same domain
- **NOT accessible to JavaScript** (httpOnly security flag)

### SSR Cookie Forwarding Flow

```
User Browser
    ↓ (Request with Cookie header: sessionid=abc123)
TanStack Start Node.js Server
    ↓ (Forward Cookie header manually)
Django Backend
    ↓ (Validate session, return user data)
TanStack Start Server
    ↓ (Return rendered HTML with user data)
User Browser
```

### Client-Side Cookie Flow

```
User Browser
    ↓ (fetch with credentials: 'include')
Vite Proxy (/api/v2/...)
    ↓ (Forward to Django with cookies auto-attached)
Django Backend
    ↓ (Set-Cookie: sessionid=abc123)
Vite Proxy
    ↓ (Forward Set-Cookie header)
User Browser (stores cookie automatically)
```

---

## When to Use Server Functions

### ✅ Use Server Functions For:

| Use Case | Why |
|----------|-----|
| **Data fetching** in `beforeLoad`/`loader` | Needs SSR, requires cookie forwarding |
| **Non-auth mutations** (CRUD operations) | Type-safe, works in SSR, unified pattern |
| **Background tasks** triggered by user | Can run without browser context |
| **Sensitive operations** | Code hidden from browser, better security |

### ❌ Use Client Functions For:

| Use Case | Why |
|----------|-----|
| **Login** | Django must set session cookie in browser |
| **Logout** | Django must clear session cookie in browser |
| **Register** | Django must set session cookie in browser |
| **Role selection** | Modifies session state |
| **Any session-modifying operation** | Requires browser cookie storage |

### Why Auth Must Be Client-Side

**The Problem with Server Functions for Auth:**

```typescript
// ❌ BROKEN: Login as server function
export const loginServerFn = createServerFn({ method: 'POST' })
  .validator((data) => data)
  .handler(async ({ data }) => {
    const res = await fetch(`${BACKEND_URL}/api/v2/auth/login/`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Django sends: Set-Cookie: sessionid=abc123
    // But this goes to Node.js server, NOT the browser!
    // The browser never receives the session cookie
    // Result: Server thinks user is logged in, browser doesn't have cookie
  })
```

**The Solution (Client Function):**

```typescript
// ✅ CORRECT: Login as client function
export async function loginFn(data: LoginInput): Promise<AuthResult> {
  const res = await fetch('/api/v2/auth/login/', {
    method: 'POST',
    credentials: 'include', // Browser auto-sends AND receives cookies
    body: JSON.stringify(data),
  })
  
  // Django sends: Set-Cookie: sessionid=abc123
  // Browser receives and stores the cookie automatically
  // All future requests include the cookie
}
```

---

## Cookie Forwarding Pattern

### Current Implementation

**Helper Function:** `src/lib/api-client.ts`

```typescript
/**
 * Extract cookie header from server function context
 * Handles both handler patterns:
 * - Simple: handler(async (ctx) => ...)
 * - With validator: handler(async ({ data, context }) => ...)
 */
export function getCookieHeader(ctx: any): string | undefined {
  // Try multiple possible locations for the request object
  const req = ctx?.request || (ctx as any)?.context?.request || ctx
  
  if (!req?.headers?.get) {
    if (import.meta.env.DEV) {
      console.warn('[getCookieHeader] No headers.get method found')
    }
    return undefined
  }
  
  const cookie = req.headers.get('cookie') || undefined
  
  if (import.meta.env.DEV) {
    console.debug('[getCookieHeader] Cookie found:', cookie ? 'YES' : 'NO')
  }
  
  return cookie
}
```

### Usage Pattern

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'

export const getDataFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const cookieHeader = getCookieHeader(ctx)
    
    const res = await fetch(`${BACKEND_URL}/api/v2/endpoint/`, {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: 'include',
    })
    
    return await res.json()
  }
)
```

---

## Server Function Patterns

### Pattern 1: Simple Data Fetching (GET)

**Use for:** Loading data in `beforeLoad` or `loader`

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export const getAcademicYearsFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const cookieHeader = getCookieHeader(ctx)
    
    const res = await fetch(`${BACKEND_URL}/api/v1/academic/academic-years/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })
    
    if (!res.ok) {
      return null
    }
    
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return null
    }
    
    return await res.json()
  }
)
```

**Usage in Route:**

```typescript
export const Route = createFileRoute('/_authed/academic')({
  loader: async () => {
    const years = await getAcademicYearsFn()
    return { years }
  },
  component: AcademicPage,
})

function AcademicPage() {
  const { years } = Route.useLoaderData()
  // ...
}
```

### Pattern 2: Parameterized Data Fetching

**Use for:** Loading single resource by ID

```typescript
export const getAcademicYearFn = createServerFn({ method: 'GET' })
  .validator((id: unknown) => {
    if (typeof id !== 'string' || !id) {
      throw new Error('Invalid ID')
    }
    return id
  })
  .handler(async ({ data: id, context }) => {
    const cookieHeader = getCookieHeader(context)
    
    const res = await fetch(
      `${BACKEND_URL}/api/v1/academic/academic-years/${id}/`,
      {
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
        credentials: 'include',
      }
    )
    
    if (!res.ok) return null
    return await res.json()
  })
```

**Usage:**

```typescript
// In route loader
loader: async ({ params }) => {
  const year = await getAcademicYearFn({ data: params.yearId })
  return { year }
}

// In component
const year = await getAcademicYearFn({ data: '123' })
```

### Pattern 3: Mutation with Validation (POST/PATCH/DELETE)

**Use for:** Non-auth CRUD operations

```typescript
import { z } from 'zod'

const AcademicYearInputSchema = z.object({
  name: z.string().min(1),
  start_date: z.string(),
  end_date: z.string(),
  is_current: z.boolean().optional(),
})

type AcademicYearInput = z.infer<typeof AcademicYearInputSchema>

export const createAcademicYearFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    // Validate with zod
    return AcademicYearInputSchema.parse(input)
  })
  .handler(async ({ data, context }) => {
    const cookieHeader = getCookieHeader(context)
    
    // Step 1: Get CSRF token
    const csrfRes = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })
    
    if (!csrfRes.ok) {
      throw new Error('Failed to get CSRF token')
    }
    
    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token
    
    if (!csrfToken) {
      throw new Error('CSRF token not found')
    }
    
    // Step 2: Make mutation request
    const res = await fetch(`${BACKEND_URL}/api/v1/academic/academic-years/`, {
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

**Usage:**

```typescript
const result = await createAcademicYearFn({
  data: {
    name: '2024-2025',
    start_date: '2024-09-01',
    end_date: '2025-06-30',
  }
})

if (result.success) {
  // Success
  console.log('Created:', result.data)
} else {
  // Error
  console.error('Error:', result.error)
}
```

---

## Migration Guide

### Migrating Client Mutations to Server Functions

#### Before: Client Function

```typescript
// src/lib/api-mutations.ts
export async function createAcademicYear(
  input: AcademicYearInput
): Promise<MutationResult<AcademicYear>> {
  try {
    // Get CSRF from browser cookies
    const csrfToken = getCsrfTokenFromCookie()
    
    // Call via Vite proxy
    const res = await fetch('/api/v1/academic/academic-years/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return {
        success: false,
        error: data?.message || `Request failed (${res.status})`,
      }
    }
    
    return {
      success: true,
      data,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}
```

**Usage:**

```typescript
import { createAcademicYear } from '@/lib/api-mutations'

const result = await createAcademicYear(formData)
```

#### After: Server Function

```typescript
// src/server/api/academic-mutations.ts
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'
import type { AcademicYear, AcademicYearInput } from '@/types/academic'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

interface MutationResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

async function getCsrfToken(cookieHeader?: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    credentials: 'include',
  })
  
  if (!res.ok) {
    throw new Error(`Failed to get CSRF token (${res.status})`)
  }
  
  const data = await res.json()
  return data?.data?.csrf_token
}

export const createAcademicYearFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    const data = input as AcademicYearInput
    if (!data.name || !data.start_date || !data.end_date) {
      throw new Error('Missing required fields')
    }
    return data
  })
  .handler(async ({ data, context }): Promise<MutationResult<AcademicYear>> => {
    try {
      const cookieHeader = getCookieHeader(context)
      const csrfToken = await getCsrfToken(cookieHeader)
      
      const res = await fetch(`${BACKEND_URL}/api/v1/academic/academic-years/`, {
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
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      }
    }
  })
```

**Usage:**

```typescript
import { createAcademicYearFn } from '@/server/api/academic-mutations'

const result = await createAcademicYearFn({ data: formData })
```

### Migration Checklist

- [ ] Create new file in `src/server/api/` (e.g., `academic-mutations.ts`)
- [ ] Import `createServerFn` and `getCookieHeader`
- [ ] Add input validation with `.validator()`
- [ ] Implement CSRF token fetching
- [ ] Forward cookie header to Django
- [ ] Update component imports
- [ ] Update function calls (add `{ data: ... }` wrapper)
- [ ] Test in both SSR and client-side contexts
- [ ] Remove old client function from `src/lib/api-mutations.ts`

---

## Helper Functions

### CSRF Token Helper (Server-Side)

```typescript
// src/server/csrf.ts
import { getCookieHeader } from '@/lib/api-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

/**
 * Get CSRF token from Django (server-side)
 * @param ctx - Server function context
 * @returns CSRF token string
 */
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

### Generic Mutation Helper

```typescript
// src/server/mutation-helper.ts
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'
import { getCsrfTokenServerSide } from './csrf'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

interface MutationResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Create a mutation server function with automatic CSRF and cookie handling
 * @param endpoint - API endpoint (e.g., '/api/v1/academic/academic-years/')
 * @param method - HTTP method
 */
export function createMutationFn<TInput, TOutput>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST'
) {
  return createServerFn({ method: 'POST' })
    .validator((input: unknown) => input as TInput)
    .handler(async ({ data, context }): Promise<MutationResult<TOutput>> => {
      try {
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
        
        const responseData = method !== 'DELETE' && res.ok 
          ? await res.json() 
          : null
        
        if (!res.ok) {
          const errorData = responseData || await res.json().catch(() => ({}))
          return {
            success: false,
            error: errorData?.message || `Request failed (${res.status})`,
          }
        }
        
        return {
          success: true,
          data: responseData,
        }
      } catch (err: any) {
        return {
          success: false,
          error: err?.message || 'Network error',
        }
      }
    })
}
```

**Usage:**

```typescript
import { createMutationFn } from '@/server/mutation-helper'
import type { AcademicYear, AcademicYearInput } from '@/types/academic'

export const createAcademicYearFn = createMutationFn<AcademicYearInput, AcademicYear>(
  '/api/v1/academic/academic-years/',
  'POST'
)

export const updateAcademicYearFn = (id: string) => 
  createMutationFn<Partial<AcademicYearInput>, AcademicYear>(
    `/api/v1/academic/academic-years/${id}/`,
    'PATCH'
  )

export const deleteAcademicYearFn = (id: string) =>
  createMutationFn<void, void>(
    `/api/v1/academic/academic-years/${id}/`,
    'DELETE'
  )
```

---

## Best Practices

### 1. Always Forward Cookies for Authenticated Endpoints

```typescript
// ✅ GOOD
const cookieHeader = getCookieHeader(ctx)
const res = await fetch(url, {
  headers: cookieHeader ? { Cookie: cookieHeader } : {},
})

// ❌ BAD - No cookie forwarding
const res = await fetch(url)
```

### 2. Use `.validator()` for Type Safety

```typescript
// ✅ GOOD - Runtime validation
export const createItemFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => {
    const data = input as ItemInput
    if (!data.name) throw new Error('Name required')
    return data
  })

// ❌ BAD - No validation, unsafe
export const createItemFn = createServerFn({ method: 'POST' })
  .handler(async ({ data }) => {
    // data is any, no validation
  })
```

### 3. Handle Errors Gracefully

```typescript
// ✅ GOOD - Detailed error handling
if (!res.ok) {
  const errorData = await res.json().catch(() => ({}))
  return {
    success: false,
    error: errorData?.message || `Request failed (${res.status})`,
    errorCode: errorData?.error?.code,
  }
}

// ❌ BAD - Generic error
if (!res.ok) {
  throw new Error('Failed')
}
```

### 4. Use Consistent Return Types

```typescript
// ✅ GOOD - Consistent MutationResult
interface MutationResult<T> {
  success: boolean
  data?: T
  error?: string
}

// All mutations return this type
export const createFn = (): Promise<MutationResult<Item>> => {...}
export const updateFn = (): Promise<MutationResult<Item>> => {...}

// ❌ BAD - Inconsistent returns
export const createFn = () => Item // throws on error
export const updateFn = () => { success: boolean } // different shape
```

### 5. Dev Mode Logging

```typescript
if (import.meta.env.DEV) {
  console.debug('[functionName] Cookie forwarding:', cookieHeader ? 'yes' : 'no')
  console.debug('[functionName] Response status:', res.status)
}
```

---

## Common Pitfalls

### 1. Forgetting Cookie Forwarding

**Symptom:** Server functions return 401 Unauthorized during SSR, but work in browser

**Fix:** Add cookie forwarding

```typescript
const cookieHeader = getCookieHeader(ctx)
const res = await fetch(url, {
  headers: cookieHeader ? { Cookie: cookieHeader } : {},
})
```

### 2. Using Server Functions for Auth

**Symptom:** Login "succeeds" but user appears logged out on refresh

**Fix:** Use client-side fetch for auth mutations

```typescript
// ❌ Don't do this
export const loginFn = createServerFn({ method: 'POST' })...

// ✅ Do this
export async function loginFn(data: LoginInput) {
  const res = await fetch('/api/v2/auth/login/', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
  })
}
```

### 3. Incorrect Context Access

**Symptom:** `getCookieHeader` returns undefined

**Fix:** Handle both context patterns

```typescript
// ✅ Handles both patterns
const req = ctx?.request || ctx?.context?.request

// ❌ Only works for one pattern
const req = ctx.request
```

### 4. Missing CSRF Token

**Symptom:** 403 Forbidden on mutations

**Fix:** Fetch and include CSRF token

```typescript
const csrfToken = await getCsrfTokenServerSide(context)
const res = await fetch(url, {
  headers: {
    'X-CSRFToken': csrfToken,
  },
})
```

---

## Summary

### Current Architecture (Correct ✅)

- **Server Functions:** Data fetching (`getCurrentUserFn`, `getAcademicYearsFn`)
- **Client Functions:** Auth mutations (`loginFn`, `registerFn`, `logoutFn`)

### Migration Path

1. Keep auth mutations as client functions
2. Migrate non-auth CRUD to server functions
3. Use helper functions for common patterns
4. Maintain consistent error handling

### Key Takeaways

- Always forward cookies for authenticated endpoints
- Use server functions for data fetching and non-auth mutations
- Keep auth mutations client-side (session cookie management)
- Validate inputs with `.validator()`
- Handle errors consistently with `MutationResult` type

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture patterns
- [TanStack Router Auth Guide](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/server-functions)
