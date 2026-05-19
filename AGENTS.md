# AGENTS.md

Quick reference for working in this repo. See CLAUDE.md for full documentation.

## Critical Commands

| Task            | Command                                                      |
| --------------- | ------------------------------------------------------------ |
| Dev server      | `npm run dev` (port 3000, not Vite default)                  |
| Local mock data | `VITE_LOCAL_DATA=true npm run dev`                           |
| Typecheck       | Run via `npm run check` (Prettier + ESLint)                  |
| Single test     | `npx vitest run --reporter=verbose src/path/to/test.test.ts` |

## Key Environment Variables

- `VITE_LOCAL_DATA=true` - Use local mock data instead of real Django API
- `BACKEND_URL` - Django backend URL (defaults to `http://localhost:8000`)

## Architecture Quirks

- **TanStack Start**: Uses `createServerFn` for both data fetching (GET) and mutations (POST/PATCH/DELETE). Server functions MUST forward cookies via `serverFetch` from `src/lib/api-client.ts` for SSR auth to work.
- **Auth**: httpOnly cookies. Server-side auth in `src/server/auth.ts`, client-side in `src/auth/*`. Route protection via `_authed` layout marker.
- **Data Adapters**: Pattern in `src/server/data/*/factory.ts` - toggles between local mock and API based on `VITE_LOCAL_DATA`.
- **Routing**: File-based. Protected routes live under `_authed` layouts.

## Common Mistakes to Avoid

- Don't use `fetch` directly in server functions - use `serverFetch` to forward cookies
- Don't throw errors in mutations - return structured error objects instead
- Don't assume API exists - use `VITE_LOCAL_DATA=true` for offline development

## Code Quality Resources

**Before coding:** Load the `typescript-best-practices` skill for common errors to avoid.

**Quick Reference:** See `QUICK_REF_CODE_QUALITY.md`

**New Data Adapter Pattern:**

```
src/server/data/{domain}/
├── types.ts          # Interfaces (import from here!)
├── mocks.ts          # Mock data
├── local.adapter.ts  # Local dev
├── api.adapter.ts    # Production
└── factory.ts        # Returns correct adapter
```

**Key Rules:**

- Import types from `types.ts`, NOT `mocks.ts`
- Always add type to `useState<Type>()`
- Use `useNavigate()` for dynamic routes (not `<Link>`)
- Run `npx tsc --noEmit` before committing
- Don't forget `@/` import alias for `src/` directory

## Domain Knowledge

This is a School Management System with skills in `.opencode/skills/`:

- `data-model-erd` - 29 entities, 5 domain layers
- `form-validation-patterns` - All form specs
- `page-specs` - All page UX flows
- `tanstack-data-adapter` - Adapter pattern reference

Load relevant skill when working on business domain features.
