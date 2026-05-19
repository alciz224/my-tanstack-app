# Quick Reference: Common Code Errors to Avoid

## 🔴 STOP doing this:

| ❌ Wrong                               | ✅ Correct                                          |
| -------------------------------------- | --------------------------------------------------- |
| `import type { X } from './mocks'`     | `import type { X } from './types'`                  |
| `const [state, setState] = useState()` | `const [state, setState] = useState<Type>(initial)` |
| `<Link to={'/path/${id}'}>` (dynamic)  | `<button onClick={() => navigate('/path/${id}')}>`  |
| Missing `useEffect` deps               | Add deps or `// eslint-disable-next-line`           |
| Unused imports                         | Remove them                                         |

## 🟢 DO this instead:

1. **Before coding**: Load the `typescript-best-practices` skill
2. **After coding**: Run `npx tsc --noEmit`
3. **Before commit**: Fix all TypeScript errors

## 📋 New Data Adapter Checklist:

```
├── types.ts     ← Define interfaces
├── mocks.ts     ← Mock data
├── local.adapter.ts  ← Local impl
├── api.adapter.ts    ← API impl
└── factory.ts  ← Returns correct adapter
```

## 🗂️ New Page Structure:

```
routes/_authed/school-admin/
├── index.tsx
├── $id.tsx        ← Dynamic route
└── $id/
    └── subpage.tsx
```

## 🚀 Commands:

```bash
npx tsc --noEmit          # Check TS errors
npm run check             # Full check (lint + format)
npm run dev               # Start dev server
```

---

> **Remember:** Import from `types.ts`, not `mocks.ts`!
