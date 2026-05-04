# Portal-Based Pages Implementation Pattern

> For listing pages with **business-logic service actions** (activate, archive, set_current, etc.)
> instead of traditional CRUD forms.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│  Route Component (academic-years.tsx)                     │
│  ┌─────────┐  ┌───────────┐  ┌──────────────────────┐   │
│  │  Loader  │→ │  useQuery  │→ │   Table + Actions    │   │
│  │  (SSR)   │  │ (hydrate)  │  │   (confirm dialog)   │   │
│  └─────────┘  └───────────┘  └──────────────────────┘   │
│                                         │                 │
│                                   useMutation             │
│                                         │                 │
│                                ┌────────▼────────┐       │
│                                │  Server Function │       │
│                                │  { data: { id } }│       │
│                                └────────┬────────┘       │
└─────────────────────────────────────────┼────────────────┘
                                          │
                    ┌─────────────────────▼─────────────────┐
                    │  Server (mutation-helper.ts)           │
                    │  - Cookie forwarding                   │
                    │  - CSRF token                          │
                    │  - Endpoint builder (params → URL)     │
                    │  - Django backend call                  │
                    └───────────────────────────────────────┘
```

## File Structure

```
src/
├── routes/_authed/super-admin/
│   └── academic-years.tsx        # Route component (page + sub-components)
├── server/
│   ├── mutation-helper.ts        # Generic mutation factories
│   └── api/
│       ├── academic.ts           # GET server functions (SSR)
│       └── academic-mutations.ts # POST/PATCH/DELETE server functions
├── lib/
│   ├── api-endpoints.ts          # Centralized URL constants
│   └── query-client.ts           # Query key factories
├── types/
│   └── academic.ts               # TypeScript interfaces
└── stores/
    └── toastStore.ts             # Notification system
```

---

## 1. Define Types (`types/academic.ts`)

```typescript
export interface AcademicYear {
  id: string | number
  name: string
  start_year: number
  end_year: number
  status: 'active' | 'inactive' | 'archived'
  is_current: boolean
  created_at: string
  updated_at: string
}
```

## 2. Create Server Functions

### GET — Data Fetching (`server/api/academic.ts`)

```typescript
import { createServerFn } from '@tanstack/react-start'
import { serverFetch } from '@/lib/api-client'
import { ACADEMIC_ENDPOINTS } from '@/lib/api-endpoints'

// List — used in loader (SSR) and client-side useQuery
export const getAcademicYearsFn = createServerFn({ method: 'GET' })
  .handler(async (ctx) => {
    return serverFetch<PaginatedResponse<AcademicYear>>(
      ACADEMIC_ENDPOINTS.ACADEMIC_YEARS,
      ctx
    )
  })
```

### Service Actions — Mutations (`server/api/academic-mutations.ts`)

For **business-logic actions** (not CRUD), use `createParameterizedMutationFn`:

```typescript
import { createParameterizedMutationFn } from '@/server/mutation-helper'

// Action mutation: only needs an ID, no request body
export const activateAcademicYearFn = createParameterizedMutationFn<
  { id: string },         // Input type: just the resource ID
  AcademicYear             // Output type: the updated resource
>(
  (params) => {
    if (!params.id) throw new Error('Missing ID for activate')
    return `/api/v1/academic/academic-years/${params.id}/activate/`
  },
  'POST'
)

// Action mutation with body: needs ID + payload
export const updateAcademicYearFn = createParameterizedMutationFn<
  { id: string; body: Partial<AcademicYearInput> },
  AcademicYear
>(
  (params) => {
    if (!params.id) throw new Error('Missing ID for update')
    return `/api/v1/academic/academic-years/${params.id}/`
  },
  'PATCH'
)
```

> [!CAUTION]
> **TanStack Start calling convention:** Always call server functions with `{ data: { ... } }`.
> The top-level `data` property is reserved by TanStack Start.
> Never use `data` as a field name inside your input types — use `body` instead.

## 3. Query Key Factory (`lib/query-client.ts`)

```typescript
export const academicKeys = {
  all: ['academic'] as const,
  academicYears: () => [...academicKeys.all, 'academic-years'] as const,
  academicYearsList: (filters?: Record<string, any>) =>
    [...academicKeys.academicYears(), 'list', filters] as const,
  academicYear: (id: string) =>
    [...academicKeys.academicYears(), id] as const,
}
```

## 4. Page Component Pattern

### Loader (SSR prefetch)

```typescript
export const Route = createFileRoute('/_authed/super-admin/academic-years')({
  loader: async () => {
    const data = await getAcademicYearsFn()
    const results = Array.isArray(data) ? data : data?.results ?? []
    return { academicYears: results }
  },
  component: AcademicYearsPage,
})
```

### ID Helper — Essential for Robustness

```typescript
// Safely extract ID from any object shape.
// Backend may return id, pk, or uuid as the identifier.
const getItemId = (item: Partial<AcademicYear> | null | undefined): string => {
  const raw = (item as any)?.id ?? (item as any)?.pk ?? (item as any)?.uuid
  if (raw == null) return ''
  return String(raw)
}
```

> [!WARNING]
> Never use `String(value ?? '')` — if `value` is `undefined`, `String(undefined)` returns `"undefined"` (a truthy string!).
> Always check `raw == null` before calling `String()`.

### Mutation Setup — The Correct Calling Convention

Server functions should be wrapped with the `useServerFn` hook when used inside components.

```typescript
// Define wrappers at the top of your component
const activateItem = useServerFn(activateItemFn)

// ✅ CORRECT — wraps input in { data: ... }
const activateMutation = useMutation({
  mutationFn: async (id: string) => {
    const result = await activateItem({ data: { id } })
    if (!result.success) throw new Error(result.error)
    return result.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: academicKeys.academicYears() })
  },
})

// ❌ WRONG — TanStack Start interprets `data: {}` as input, losing id
const activateMutation = useMutation({
  mutationFn: async (id: string) => {
    // WRONG: result = await activateItemFn({ id, data: {} }) 
    // WARNING: handler receives {} instead of { id }, id is LOST!
  },
})
```

### Confirmation Dialog Pattern

For destructive or significant actions, use a confirmation flow:

```typescript
type ConfirmAction = {
  type: 'activate' | 'set-current' | 'archive' | 'delete'
  item: AcademicYear
} | null

const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

const handleConfirm = () => {
  if (!confirmAction) return
  const id = getItemId(confirmAction.item)

  // Guard: reject empty/undefined IDs before calling mutation
  if (!id || id === 'undefined' || id === 'null') {
    toast.error("Cannot execute action: missing item ID")
    setConfirmAction(null)
    return
  }

  // Dispatch to correct mutation
  switch (confirmAction.type) {
    case 'activate': activateMutation.mutate(id); break
    case 'set-current': setCurrentMutation.mutate(id); break
    case 'archive': archiveMutation.mutate(id); break
    case 'delete': deleteMutation.mutate(id); break
  }
}
```

### Cache Invalidation

```typescript
const invalidate = () =>
  queryClient.invalidateQueries({ queryKey: academicKeys.academicYears() })
```

---

## 5. Service Action vs. CRUD Comparison

| Aspect | Traditional CRUD | Portal Service Actions |
|--------|-----------------|----------------------|
| **Endpoints** | `POST /items/`, `PATCH /items/:id/` | `POST /items/:id/activate/` |
| **Request body** | Full resource payload | Usually empty or minimal |
| **Input type** | `{ id: string; body: Partial<T> }` | `{ id: string }` |
| **UI trigger** | Edit form submit | Action button → confirm dialog |
| **State change** | Raw field updates | Business state transitions |
| **Examples** | Create, Update, Delete | Activate, Archive, Set Current |

---

## 6. Checklist for New Portal Pages

- [ ] Define TypeScript interfaces in `types/`
- [ ] Add endpoint constants in `lib/api-endpoints.ts`
- [ ] Create GET server function in `server/api/{domain}.ts`
- [ ] Create action mutation server functions in `server/api/{domain}-mutations.ts`
- [ ] Add query key factory in `lib/query-client.ts`
- [ ] Build loader with SSR prefetch + `useQuery` hydration
- [ ] Implement `getItemId()` helper (handle `id`/`pk`/`uuid`)
- [ ] Use `{ data: { id } }` wrapping for all server function calls
- [ ] Add confirmation dialog for destructive/significant actions
- [ ] Add toast notifications for success/error
- [ ] Implement status normalization if backend uses varied formats
- [ ] Add filter tabs and sorting by status/importance
