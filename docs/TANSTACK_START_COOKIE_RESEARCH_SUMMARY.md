# TanStack Start Cookie Helpers & Server Functions - Research Summary

**Date:** January 2025  
**Package Version:** `@tanstack/react-start@1.157.16`  
**Project:** EduVault School Management System

---

## 🎯 Executive Summary

### Key Findings

1. **TanStack Start does NOT provide built-in `getCookie`/`setCookie`/`deleteCookie` helpers**
   - Manual cookie forwarding is required when calling external APIs (Django)
   - Must access cookies from server function context (`ctx.request.headers.get('cookie')`)

2. **Current authentication architecture is CORRECT and should NOT be changed**
   - ✅ Server functions for data fetching (`getCurrentUserFn`)
   - ✅ Client functions for auth mutations (`loginFn`, `logoutFn`, `registerFn`)
   - This split is architecturally necessary due to httpOnly cookie limitations

3. **Non-auth mutations CAN be migrated to server functions** (optional)
   - Academic year CRUD operations
   - Any mutations that don't modify session state
   - Benefits: Type safety, SSR support, unified pattern

---

## 📚 Documentation Created

### 1. **SERVER_FUNCTIONS_GUIDE.md** (Comprehensive)

Complete implementation guide covering:

- Cookie forwarding patterns
- When to use server functions vs client functions
- Step-by-step migration examples
- Best practices and common pitfalls
- Testing strategies

### 2. **COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md** (This Document)

Executive summary with:

- Quick reference guide
- Visual flow diagrams
- Why auth must be client-side
- Current implementation analysis
- Helper function documentation

---

## 🛠️ Helper Functions Created

### 1. **`src/server/csrf.ts`**

Server-side CSRF token fetching with cookie forwarding:

```typescript
export async function getCsrfTokenServerSide(ctx: any): Promise<string>
```

**Use in:** Server function mutations that need CSRF protection

### 2. **`src/server/mutation-helper.ts`**

Generic mutation server function factory:

```typescript
export function createMutationFn<TInput, TOutput>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE',
)
```

**Use for:** Quick creation of type-safe mutation server functions

### 3. **`src/server/api/academic-mutations.ts`**

Example server function mutations for academic years:

- `createAcademicYearFn`
- `updateAcademicYearFn`
- `deleteAcademicYearFn`
- `activateAcademicYearFn`
- `archiveAcademicYearFn`
- `setCurrentAcademicYearFn`

**Use as:** Template for migrating other CRUD operations

---

## 🔍 TanStack Start Cookie API Research

### What We Looked For

- Built-in `getCookie()`, `setCookie()`, `deleteCookie()` functions
- Cookie management utilities similar to Next.js or Remix
- Official patterns for external API cookie forwarding

### What We Found

**TanStack Start v1.157.16 does NOT include built-in cookie helpers.**

Instead, the framework provides:

1. **Request context in server functions** (`ctx.request`)
2. **Access to request headers** (`ctx.request.headers.get('cookie')`)
3. **Manual forwarding is developer responsibility**

### Official Pattern (from docs/examples)

```typescript
createServerFn({ method: 'GET' }).handler(async (ctx) => {
  const request = ctx.request // or ctx?.context?.request
  const cookieHeader = request?.headers.get('cookie')

  // Forward to external API
  const res = await fetch(externalAPI, {
    headers: {
      Cookie: cookieHeader,
    },
  })
})
```

### Why No Built-in Helpers?

TanStack Start focuses on:

- **Server-side rendering** (not full-stack framework)
- **Minimal abstractions** (you control the fetch)
- **Framework agnostic** (works with any backend)

Cookie management is left to:

- The browser (client-side)
- Your backend (Django in our case)
- Developer implementation (manual forwarding)

---

## 🚨 Critical Architecture Decision: Why Auth Must Stay Client-Side

### The Problem: httpOnly Session Cookies

Django uses **httpOnly cookies** for authentication:

```
Set-Cookie: sessionid=abc123; HttpOnly; Secure; SameSite=Lax
```

These cookies:

- ✅ Are set by Django on login
- ✅ Are stored by browser automatically
- ✅ Are auto-sent by browser on requests
- ❌ **Cannot be modified by JavaScript** (httpOnly security flag)

### Why Server Functions Break Auth

```
┌─────────────────────────────────────────────────────────────┐
│ ❌ BROKEN: Login as Server Function                         │
└─────────────────────────────────────────────────────────────┘

Browser                    Node.js Server              Django
  │                              │                        │
  │──── loginServerFn() ────────▶│                        │
  │                              │                        │
  │                              │──── POST /login ──────▶│
  │                              │                        │
  │                              │                        │── Validate ✅
  │                              │                        │
  │                              │◀─── Set-Cookie ────────│
  │                              │   (sessionid=abc123)   │
  │                              │                        │
  │◀──── "Success" ──────────────│                        │
  │                                                        │
  │ ❌ Browser never got the cookie!                      │
  │                                                        │
  │──── Next request ──────────────────────────────────────▶│
  │                                                        │
  │◀─── 401 Unauthorized ──────────────────────────────────│
```

**What happens:**

1. Server function runs on Node.js server (not in browser)
2. Django sends `Set-Cookie` header to Node.js server
3. Node.js server receives the cookie
4. **Browser never receives the cookie**
5. User appears logged in server-side, but browser has no session
6. Next request: Browser has no cookie → 401 Unauthorized

### Why Client Functions Work

```
┌─────────────────────────────────────────────────────────────┐
│ ✅ CORRECT: Login as Client Function                        │
└─────────────────────────────────────────────────────────────┘

Browser                    Vite Proxy                  Django
  │                            │                          │
  │── fetch('/api/v2/auth/login/', {credentials: 'include'})
  │                            │                          │
  │───────────────────────────▶│──── POST /login ────────▶│
  │                            │                          │
  │                            │                          │── Validate ✅
  │                            │                          │
  │                            │◀─── Set-Cookie ──────────│
  │                            │   (sessionid=abc123)     │
  │◀─── Set-Cookie ────────────│                          │
  │   (sessionid=abc123)                                  │
  │                                                        │
  │ ✅ Browser stores cookie automatically                │
  │                                                        │
  │── Next request (auto includes cookie) ────────────────▶│
  │                                                        │
  │◀─── User data ─────────────────────────────────────────│
```

**What happens:**

1. `fetch()` runs in browser context
2. Request goes through Vite proxy to Django
3. Django validates and sends `Set-Cookie` header
4. **Browser receives and stores cookie automatically**
5. All future requests include the cookie
6. User stays authenticated ✅

### Conclusion

**Auth mutations (login/logout/register/role selection) MUST use client-side `fetch()`.**

This is not a limitation—it's the correct architecture for httpOnly cookie management.

---

## 🎨 Recommended Patterns

### Pattern Matrix

| Operation Type          | Use                        | Example                                        |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| **Data Fetching (GET)** | Server Function            | `getCurrentUserFn`, `getAcademicYearsFn`       |
| **Auth Mutations**      | Client Function            | `loginFn`, `logoutFn`, `registerFn`            |
| **Non-Auth Mutations**  | Server Function (optional) | `createAcademicYearFn`, `updateAcademicYearFn` |
| **Background Jobs**     | Server Function            | Email sending, report generation               |

### Quick Reference: Server Function Template

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getCookieHeader } from '@/lib/api-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// GET: Data fetching
export const getDataFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    const cookieHeader = getCookieHeader(ctx)

    const res = await fetch(`${BACKEND_URL}/api/v2/endpoint/`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: 'include',
    })

    if (!res.ok) return null
    return await res.json()
  },
)

// POST: Mutation with CSRF
import { getCsrfTokenServerSide } from '@/server/csrf'

export const createDataFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input as DataInput)
  .handler(async ({ data, context }) => {
    const cookieHeader = getCookieHeader(context)
    const csrfToken = await getCsrfTokenServerSide(context)

    const res = await fetch(`${BACKEND_URL}/api/v2/endpoint/`, {
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
      return { success: false, error: responseData?.message }
    }

    return { success: true, data: responseData }
  })
```

### Quick Reference: Client Function Template

```typescript
// Auth mutations ONLY
export async function authMutationFn(data: InputData): Promise<AuthResult> {
  // Step 1: Get CSRF token
  const csrfRes = await fetch('/api/v2/auth/csrf/', {
    credentials: 'include',
  })
  const csrfData = await csrfRes.json()
  const csrfToken = csrfData?.data?.csrf_token

  // Step 2: Make mutation
  const res = await fetch('/api/v2/auth/endpoint/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  // Browser handles Set-Cookie automatically
  const responseData = await res.json()

  if (!res.ok) {
    return { success: false, error: responseData?.message }
  }

  return { success: true, user: responseData?.data?.user }
}
```

---

## 📋 Migration Checklist

### If You Want to Migrate Non-Auth Mutations to Server Functions:

- [ ] **Review current implementation** (`src/lib/api-mutations.ts`)
- [ ] **Identify non-auth mutations** (academic years, etc.)
- [ ] **Create server function file** (e.g., `src/server/api/academic-mutations.ts`)
- [ ] **Use helper functions** (`createMutationFn` or write custom)
- [ ] **Add input validation** with `.validator()`
- [ ] **Test in SSR context** (route loaders/actions)
- [ ] **Test in client context** (button clicks)
- [ ] **Update component imports**
- [ ] **Remove old client functions**
- [ ] **Update documentation**

### What NOT to Migrate:

- ❌ `loginFn` - Must stay client-side
- ❌ `logoutFn` - Must stay client-side
- ❌ `registerFn` - Must stay client-side
- ❌ `selectRoleFn` - Must stay client-side
- ❌ Any function that modifies session state

---

## 🧪 Testing Guidelines

### Test 1: SSR Cookie Forwarding

**What to test:** Server function data fetching during initial page load

```typescript
export const Route = createFileRoute('/_authed/test')({
  loader: async () => {
    const data = await getDataFn()
    return { data }
  },
})
```

**How to verify:**

1. Clear browser cache
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser DevTools → Network tab
4. Look at the initial HTML document request
5. Response should contain server-rendered user data
6. Server logs should show: `[getDataFn] Cookie forwarding: yes`

### Test 2: Client Auth Mutation

**What to test:** Login sets session cookie in browser

```typescript
const result = await loginFn({
  identifier: 'test@example.com',
  password: 'password123',
})
```

**How to verify:**

1. Open DevTools → Network tab
2. Submit login form
3. Find `/api/v2/auth/login/` request
4. Check Response Headers → should have `Set-Cookie: sessionid=...`
5. Check Application tab → Cookies → should see `sessionid`
6. Navigate to protected route → should stay authenticated
7. Hard refresh → should still be authenticated

### Test 3: Server Function Mutation

**What to test:** Non-auth mutation with CSRF and cookie forwarding

```typescript
const result = await createAcademicYearFn({
  data: { name: 'Test Year', start_date: '2024-01-01', end_date: '2024-12-31' },
})
```

**How to verify:**

1. Check DevTools → Network tab
2. Look for server function request
3. Server logs should show CSRF token fetch
4. Server logs should show cookie forwarding
5. Mutation should succeed
6. Hard refresh page → new item should appear (loaded via SSR)

---

## 📊 Current Architecture Assessment

### Strengths ✅

| Aspect            | Implementation                       | Status     |
| ----------------- | ------------------------------------ | ---------- |
| SSR data fetching | `getCurrentUserFn` (server function) | ✅ Correct |
| Cookie forwarding | Manual via `getCookieHeader()`       | ✅ Working |
| Auth mutations    | Client-side `fetch()`                | ✅ Correct |
| CSRF handling     | Per-request fetch                    | ✅ Secure  |
| Type safety       | TypeScript interfaces                | ✅ Good    |
| Error handling    | Consistent patterns                  | ✅ Good    |

### Opportunities 💡

| Area               | Current               | Possible Improvement                   |
| ------------------ | --------------------- | -------------------------------------- |
| Non-auth mutations | Client functions      | Migrate to server functions (optional) |
| CSRF fetching      | Duplicate code        | Centralized helper (✅ created)        |
| Mutation pattern   | Manual implementation | Generic factory (✅ created)           |
| Documentation      | Scattered             | Comprehensive guides (✅ created)      |

### Must NOT Change ⛔

- Auth mutations (login/logout/register) MUST stay client-side
- Cookie forwarding pattern (no built-in helpers available)
- Manual CSRF fetching (Django requirement)

---

## 🎓 Key Takeaways

### For This Project

1. **Current auth architecture is correct** - don't change it
2. **Cookie forwarding helper exists** - use `getCookieHeader(ctx)`
3. **New helpers available** - use for new mutations
4. **Migration is optional** - non-auth mutations can become server functions
5. **Documentation is comprehensive** - refer to guides when implementing

### For TanStack Start in General

1. **No built-in cookie helpers** - manual forwarding required
2. **Server functions are for SSR** - not a replacement for all API calls
3. **Browser APIs still needed** - for session management
4. **Framework is minimal** - you control the implementation
5. **Patterns are consistent** - once learned, easy to replicate

### For Django Integration

1. **Session cookies are httpOnly** - can't be managed by JavaScript
2. **CSRF protection is active** - must fetch and include tokens
3. **Vite proxy works well** - use `/api/v2/...` in client code
4. **Direct backend URLs** - use `BACKEND_URL` in server functions
5. **Cookie forwarding is critical** - SSR won't work without it

---

## 📚 Further Reading

### Created Documentation

- **`docs/SERVER_FUNCTIONS_GUIDE.md`** - Complete implementation guide
- **`docs/COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md`** - Architecture deep-dive
- **`src/server/csrf.ts`** - CSRF helper implementation
- **`src/server/mutation-helper.ts`** - Generic mutation factory
- **`src/server/api/academic-mutations.ts`** - Real-world examples

### Existing Documentation

- **`docs/ARCHITECTURE.md`** - Overall system architecture
- **`src/lib/api-client.ts`** - Cookie forwarding helper
- **`src/server/auth.ts`** - Current auth implementation

### External Resources

- [TanStack Start Docs](https://tanstack.com/start/latest/docs/overview)
- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/server-functions)
- [TanStack Router Auth Guide](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [Django CSRF Protection](https://docs.djangoproject.com/en/stable/ref/csrf/)
- [MDN: HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)

---

## ✅ Conclusion

### Summary

**TanStack Start does not provide built-in cookie helpers.** Manual cookie forwarding is required when calling external APIs from server functions.

**The current EduVault authentication architecture is correct:**

- Server functions for data fetching (with cookie forwarding)
- Client functions for auth mutations (browser handles cookies)

**Optional improvements available:**

- Migrate non-auth mutations to server functions
- Use new helper functions for consistency
- Follow documented patterns for new features

### Recommendation

**Keep the current architecture** for authentication. Optionally migrate non-auth mutations to server functions using the provided helpers if you want better SSR support and type safety.

### Questions to Consider

1. **Do you want to migrate non-auth mutations to server functions?**
   - Pros: Type safety, SSR support, unified pattern
   - Cons: More boilerplate, complexity
2. **Do you want to use the helper functions?**
   - `getCsrfTokenServerSide(ctx)` - simplifies CSRF handling
   - `createMutationFn<Input, Output>()` - reduces boilerplate

3. **Do you need more examples?**
   - Academic mutations example is ready to use
   - Can create more templates for other modules

**What would you like to do next?**

- Review the helper functions and examples?
- Start migrating specific mutations?
- Keep current implementation as-is?
- Something else?
