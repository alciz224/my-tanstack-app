# Skill: TanStack Start — Backend Integration

> Connecting TanStack Start to external backends (Django, Node, etc.) via HTTP-only cookie sessions. Cookie forwarding, CSRF handling, and dynamic data sources.

---

## 1. The Problem: The "Double-Hop"

When your backend handles authentication (not TanStack), server functions must forward cookies:

```
Browser          TanStack Start          Backend API
   │                    │                     │
   │── Request ────────►│                     │
   │  Cookie: session   │                     │
   │                    │── Request ─────────►│
   │                    │  (No cookie!)       │
   │                    │◄──── 401 ───────────┤
   │◄── Redirect ───────│                     │
```

**The issue**: Server functions run on the TanStack server, not the browser. Cookies aren't automatically forwarded.

**The solution**: Manually forward cookies in every server function.

---

## 2. apiFetch Helper (The Foundation)

### Complete Implementation

```typescript
// utils/api.server.ts
import { getRequestHeaders, getRequest } from '@tanstack/react-start/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api'

// ─── Typed Error ───────────────────────────────────────────────────

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// ─── Extract CSRF from cookies ─────────────────────────────────────

function getCsrfToken(cookieHeader: string | null): string {
  if (!cookieHeader) return ''
  const match = cookieHeader.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

// ─── Main apiFetch ─────────────────────────────────────────────────

interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string>
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options
  const headers = getRequestHeaders()
  const cookieHeader = headers.get('cookie') || ''
  
  // Build URL with query params
  const url = new URL(`${API_BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }

  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    fetchOptions.method || 'GET',
  )

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 🔑 Forward session cookie
      'Cookie': cookieHeader,
      // 🔑 CSRF token for mutations
      ...(isMutation ? { 'X-CSRFToken': getCsrfToken(cookieHeader) } : {}),
      ...fetchOptions.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(
      errorData.detail || errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData,
    )
  }

  if (response.status === 204) return undefined as T
  return response.json()
}

// ─── HTTP method shortcuts ─────────────────────────────────────────

export const apiGet = <T>(path: string, params?: Record<string, string>) =>
  apiFetch<T>(path, { method: 'GET', params })

export const apiPost = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) })

export const apiPut = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'PUT', body: JSON.stringify(body) })

export const apiPatch = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) })

export const apiDelete = <T>(path: string) =>
  apiFetch<T>(path, { method: 'DELETE' })
```

### Usage in Server Functions

```typescript
// utils/posts.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { apiGet, apiPost, apiPut, apiDelete } from './api.server'

export const getPosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { page?: number } = {}) => data)
  .handler(async ({ data }) =>
    apiGet<Post[]>('/posts/', { page: String(data.page || 1) })
  )

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) =>
    apiGet<Post>(`/posts/${data.id}/`)
  )

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator((data: CreatePostInput) => data)
  .handler(async ({ data }) =>
    apiPost<Post>('/posts/', data)
  )

export const updatePost = createServerFn({ method: 'PUT' })
  .inputValidator((data: UpdatePostInput) => data)
  .handler(async ({ data }) => {
    const { id, ...body } = data
    return apiPut<Post>(`/posts/${id}/`, body)
  })

export const deletePost = createServerFn({ method: 'DELETE' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) =>
    apiDelete<void>(`/posts/${data.id}/`)
  )
```

---

## 3. Where to Forward Cookies

| Location | Forward cookies? | How |
|----------|------------------|-----|
| `getRouterContext` | ✅ Yes | `getRequestHeaders()` → fetch to backend |
| `beforeLoad` | ❌ No | Use `context.user` (already fetched) |
| `createServerFn` | ✅ Yes | `getRequestHeaders()` → forward in fetch |
| `loader` | ❌ No | Use `context.user` |
| Client components | ✅ Auto | `fetch(..., { credentials: 'include' })` |

---

## 4. Django-Specific Integration

### Django Settings

```python
# settings.py
INSTALLED_APPS = [
    'corsheaders',
    'rest_framework',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_HTTPONLY = False  # JS needs to read token
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

### Django Views

```python
# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({
        'id': request.user.id,
        'email': request.user.email,
        'role': request.user.profile.role,
    })

@api_view(['POST'])
def login_view(request):
    # Django handles session cookie automatically
    ...
```

### CSRF Token Handling

The `apiFetch` helper automatically extracts and forwards `csrftoken` from cookies for mutations. No client-side code needed.

```
Browser → TanStack Start → Django
           │                    │
           │ Cookie: csrftoken  │
           │ X-CSRFToken: xxx   │ ← Extracted from cookie header
           │                    │
```

---

## 5. Dynamic Data Sources (Mock/Real)

### Interface + Implementations

```typescript
// utils/data-source.ts
interface UserDataSource {
  getUser(id: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
}

// Mock
class MockDataSource implements UserDataSource {
  private users = new Map<string, User>()
  
  async getUser(id: string) {
    return this.users.get(id) || { id, name: 'Mock User' }
  }
  
  async updateUser(id: string, data: Partial<User>) {
    const user = await this.getUser(id)
    const updated = { ...user, ...data }
    this.users.set(id, updated)
    return updated
  }
}

// Real (uses apiFetch)
class ApiDataSource implements UserDataSource {
  async getUser(id: string) {
    return apiGet<User>(`/users/${id}/`)
  }
  
  async updateUser(id: string, data: Partial<User>) {
    return apiPatch<User>(`/users/${id}/`, data)
  }
}
```

### Factory + Selection

```typescript
// utils/api-factory.ts
export function createUserAPI(source: UserDataSource) {
  return {
    getUser: createServerFn({ method: 'GET' })
      .inputValidator((data: { id: string }) => data)
      .handler(async ({ data }) => source.getUser(data.id)),
    
    updateUser: createServerFn({ method: 'PATCH' })
      .inputValidator((data: { id: string; updates: Partial<User> }) => data)
      .handler(async ({ data }) => source.updateUser(data.id, data.updates)),
  }
}

// Dynamic selection
const dataSource = import.meta.env.VITE_USE_MOCK === 'true'
  ? new MockDataSource()
  : new ApiDataSource()

export const userAPI = createUserAPI(dataSource)
```

---

## 6. Request/Response Control

```typescript
import { 
  getRequest, 
  getRequestHeader, 
  setResponseHeaders, 
  setResponseStatus 
} from '@tanstack/react-start/server'

const getCachedData = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const authHeader = getRequestHeader('Authorization')
  
  setResponseHeaders(new Headers({
    'Cache-Control': 'public, max-age=300',
  }))
  setResponseStatus(200)
  
  return fetchData()
})
```

---

## 7. Complete Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  BROWSER                                                      │
│  ──────                                                       │
│  • Auth state from router context (SSR'd)                     │
│  • UI state from React Context (AuthProvider)                 │
│  • Client fetch: credentials: 'include'                       │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  TANSTACK START SERVER                                        │
│  ─────────────────────                                        │
│  getRouterContext:                                            │
│   → getRequestHeaders() → Cookie: sessionid=xxx              │
│   → Forward to backend /me → { user }                        │
│   → context = { user }                                       │
│                                                                │
│  createServerFn:                                              │
│   → apiFetch → forward Cookie header                         │
│   → Backend receives session cookie                          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  BACKEND (Django/Node/etc.)                                   │
│  ──────────────────────────                                   │
│  • Validates session cookie                                   │
│  • Returns data or 401/403                                    │
│  • Sets Set-Cookie on login                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Principles

1. **Forward cookies in EVERY server function** — `getRequestHeaders().get('cookie')`
2. **The backend is the source of truth** — TanStack doesn't store auth state
3. **Never touch HttpOnly cookies client-side** — Use server functions as proxy
4. **CSR token for mutations** — Extract from cookie, forward as header
5. **DI for mock/real switching** — Factory pattern with data sources
6. **401/403 handling** — Check response status, throw typed errors
7. **API shortcuts** — `apiGet`, `apiPost`, etc. for DRY code