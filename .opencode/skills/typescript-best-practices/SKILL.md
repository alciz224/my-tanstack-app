# Skill: TypeScript & React Best Practices Guide

> Common errors and patterns to avoid in this codebase.

---

## 🚨 Common TypeScript Errors

### 1. Importing types from mocks instead of types file

**❌ WRONG:**

```typescript
import type { Assessment } from '@/server/data/assessments/mocks'
```

**✅ CORRECT:**

```typescript
import type { Assessment } from '@/server/data/assessments/types'
```

**Why:** Mock files may not export types. Always import from `types.ts`.

---

### 2. Unused imports (TS6133)

**❌ WRONG:**

```typescript
import { ChevronRight, FileText, MoreVertical, Filter } from 'lucide-react'
```

Some of these may not be used.

**✅ CORRECT:**

```typescript
import { FileText, Filter } from 'lucide-react'
```

**Fix:** Run `npx tsc --noEmit` and remove unused imports.

---

### 3. Link component with dynamic route (TS2322)

**❌ WRONG:**

```typescript
<Link to={`/school-admin/assessments/${assessment.id}/subjects`}>
```

**Error:** Type not assignable to known routes.

**✅ WORKAROUND:**

```typescript
// Option 1: Use a withRouter wrapper or cast (temporary fix)
<Link to={`/school-admin/assessments/${assessment.id}/subjects` as any}>

// Option 2: Use window.location or useNavigate
const navigate = useNavigate()
<button onClick={() => navigate(`/school-admin/assessments/${id}/subjects`)}>
```

**Note:** This is a TanStack Start router limitation with dynamic segment routes. Consider using `useNavigate` instead of `Link` for dynamic routes.

---

### 4. Implicit 'any' type (TS7006)

**❌ WRONG:**

```typescript
const filtered = items.filter((item) => ...)
```

**✅ CORRECT:**

```typescript
const filtered = items.filter((item: ItemType) => ...)
```

**Or add to tsconfig.json:**

```json
{
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

---

### 5. useEffect missing dependencies

**❌ WRONG:**

```typescript
useEffect(() => {
  fetchData()
}, []) // Missing deps
```

**✅ CORRECT:**

```typescript
useEffect(() => {
  fetchData()
}, [dep1, dep2]) // Include all used variables
```

**Or disable the warning with eslint-disable if intentional:**

```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
```

---

## 📁 Project Structure Patterns

### Creating a new data adapter

Follow this structure:

```
src/server/data/{domain}/
├── types.ts          # Interface definitions
├── mocks.ts          # Mock data (for local dev)
├── local.adapter.ts  # Local implementation
├── api.adapter.ts    # API implementation
└── factory.ts        # Returns correct adapter based on env
```

**Factory pattern:**

```typescript
// factory.ts
import { localAdapter } from './local.adapter'
import { apiAdapter } from './api.adapter'

const useLocalData =
  typeof window !== 'undefined'
    ? localStorage.getItem('VITE_LOCAL_DATA') === 'true'
    : process.env.VITE_LOCAL_DATA === 'true'

export function getService() {
  return useLocalData ? localAdapter : apiAdapter
}
```

### Creating a new route

Follow TanStack Start file-based routing:

```
src/routes/_authed/school-admin/
├── index.tsx           # /school-admin
├── teachers/
│   ├── index.tsx       # /school-admin/teachers
│   ├── $teacherId.tsx # /school-admin/teachers/:teacherId
│   └── assignments.tsx # /school-admin/teachers/assignments
```

---

## 🛠️ Pre-Coding Checklist

Before writing new code, verify:

1. **Types:** Import from `types.ts`, not `mocks.ts`
2. **Imports:** Remove unused imports before committing
3. **Router:** Use `useNavigate()` instead of `Link` for dynamic routes
4. **State:** Add proper TypeScript types to useState
5. **Effects:** Include dependencies in useEffect
6. **Adapters:** Follow factory pattern for data layer

---

## 🔧 Available Commands

```bash
# TypeScript check
npx tsc --noEmit

# Prettier + ESLint fix
npm run check

# Run dev server
npm run dev

# Run with local mock data
VITE_LOCAL_DATA=true npm run dev
```

---

## 📝 Common Patterns

### Server Function

```typescript
import { createServerFn } from '@tanstack/react-start'

export const getItemsFn = createServerFn({ method: 'GET' })
  .inputValidator((filter?: FilterType) => filter)
  .handler(async ({ data: filter }) => {
    return getService().getItems(filter)
  })
```

### Component with Modal

```typescript
function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open</button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}
```

### Status Badge

```typescript
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={styles[status] || ''}>
      {status}
    </span>
  )
}
```

---

## ⚠️ Things to Avoid

1. **Don't use `fetch` directly in server functions** - Use `serverFetch` from `@/lib/api-client`
2. **Don't use `useState` without types** - Always define the type
3. **Don't create files outside the proper structure** - Follow conventions
4. **Don't forget to add new routes to route tree** - Run `npm run dev` to auto-generate
5. **Don't commit with TypeScript errors** - Run `npx tsc --noEmit` first

---

## 📚 Related Skills

- `data-model-erd` - Entity definitions
- `form-validation-patterns` - Form handling
- `page-specs` - Page patterns
- `tanstack-data-adapter` - Data layer patterns
