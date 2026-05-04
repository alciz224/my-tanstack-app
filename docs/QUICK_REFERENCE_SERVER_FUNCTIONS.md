# Server Functions - Quick Reference Card

> **TL;DR:** Use server functions for data fetching. Keep auth as client-side. Cookie forwarding is manual.

---

## ✅ Use Server Functions For

```typescript
// ✅ Data fetching in beforeLoad/loader
export const getDataFn = createServerFn({ method: 'GET' }).handler(async (ctx) => {
  const cookieHeader = getCookieHeader(ctx)
  const res = await fetch(`${BACKEND_URL}/api/...`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  })
  return await res.json()
})

// ✅ Non-auth CRUD operations
export const createItemFn = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input as ItemInput)
  .handler(async ({ data, context }) => {
    const cookieHeader = getCookieHeader(context)
    const csrfToken = await getCsrfTokenServerSide(context)
    // ... make mutation
  })
```

---

## ❌ Use Client Functions For

```typescript
// ❌ Auth mutations - MUST be client-side
export async function loginFn(data: LoginInput) {
  const csrfRes = await fetch('/api/v2/auth/csrf/', { credentials: 'include' })
  const csrfToken = (await csrfRes.json()).data.csrf_token
  
  const res = await fetch('/api/v2/auth/login/', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrfToken },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  
  return await res.json()
}

// Same for: logoutFn, registerFn, selectRoleFn
```

---

## 🍪 Cookie Forwarding Pattern

```typescript
import { getCookieHeader } from '@/lib/api-client'

// Simple handler
createServerFn({ method: 'GET' }).handler(async (ctx) => {
  const cookieHeader = getCookieHeader(ctx)
  // Use in fetch headers
})

// With validator
createServerFn({ method: 'POST' })
  .validator((data) => data)
  .handler(async ({ data, context }) => {
    const cookieHeader = getCookieHeader(context)
    // Use in fetch headers
  })
```

---

## 🔐 CSRF Token (Server-Side)

```typescript
import { getCsrfTokenServerSide } from '@/server/csrf'

const csrfToken = await getCsrfTokenServerSide(context)

const res = await fetch(`${BACKEND_URL}/api/...`, {
  method: 'POST',
  headers: {
    'X-CSRFToken': csrfToken,
    // ... other headers
  },
})
```

---

## 🏭 Generic Mutation Factory

```typescript
import { createMutationFn } from '@/server/mutation-helper'

export const createItemFn = createMutationFn<ItemInput, Item>(
  '/api/v1/items/',
  'POST'
)

export const updateItemFn = (id: string) =>
  createMutationFn<Partial<ItemInput>, Item>(
    `/api/v1/items/${id}/`,
    'PATCH'
  )

// Usage
const result = await createItemFn({ data: { name: 'Test' } })
if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error)
}
```

---

## 📁 File Organization

```
src/
├── server/
│   ├── csrf.ts                    # getCsrfTokenServerSide()
│   ├── mutation-helper.ts         # createMutationFn()
│   ├── auth.ts                    # getCurrentUserFn, loginFn, etc.
│   └── api/
│       ├── academic.ts            # GET functions
│       └── academic-mutations.ts  # POST/PATCH/DELETE functions
├── lib/
│   ├── api-client.ts              # getCookieHeader()
│   └── api-mutations.ts           # Legacy client mutations (being phased out)
└── routes/
    └── _authed/
        └── academic.tsx           # Uses server functions in loader
```

---

## 🧪 Quick Test

```bash
# Test SSR cookie forwarding
# 1. Hard refresh page (Ctrl+Shift+R)
# 2. Check Network tab → initial HTML should have user data
# 3. Server logs should show "Cookie forwarding: yes"

# Test client auth
# 1. Login
# 2. Check Network → /api/v2/auth/login/ → Response Headers → Set-Cookie
# 3. Check Application → Cookies → sessionid should exist

# Test server function mutation
# 1. Create item via server function
# 2. Check server logs for CSRF token fetch + cookie forwarding
# 3. Hard refresh → item should appear (loaded via SSR)
```

---

## 🚨 Common Pitfalls

| Problem | Cause | Solution |
|---------|-------|----------|
| 401 during SSR | No cookie forwarding | Add `getCookieHeader(ctx)` |
| Login "succeeds" but logged out on refresh | Auth as server function | Use client-side `fetch()` |
| CSRF 403 error | Missing CSRF token | Add `getCsrfTokenServerSide(context)` |
| `getCookieHeader` returns undefined | Wrong context access | Try both `ctx.request` and `ctx.context.request` |

---

## 📚 Full Documentation

- **`SERVER_FUNCTIONS_GUIDE.md`** - Complete implementation guide
- **`COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md`** - Architecture deep-dive
- **`TANSTACK_START_COOKIE_RESEARCH_SUMMARY.md`** - Research findings

---

## 🎯 Decision Tree

```
Need to make an API call?
│
├─ Is it auth-related (login/logout/register)?
│  └─ YES → Use client-side fetch() ✅
│
├─ Is it data fetching (GET)?
│  └─ YES → Use server function with getCookieHeader() ✅
│
└─ Is it a mutation (POST/PATCH/DELETE)?
   │
   ├─ Does it modify session state?
   │  └─ YES → Use client-side fetch() ✅
   │
   └─ Does it modify data (CRUD)?
      └─ YES → Use server function with CSRF + cookies ✅
         (or keep as client function, both work)
```

---

**Remember:** The current architecture is correct. Auth MUST be client-side due to httpOnly cookies. 🔐
