# GEMINI.md

This file provides foundational mandates and guidance for Gemini CLI when working in this repository.

## Critical Commands

| Task            | Command                                                        |
| --------------- | -------------------------------------------------------------- |
| Dev server      | `npm run dev` (Runs on port 3000)                              |
| Local mock data | `VITE_LOCAL_DATA=true npm run dev`                             |
| Build           | `npm run build`                                                |
| Typecheck       | `npm run check` (Runs Prettier + ESLint) or `npx tsc --noEmit` |
| Linting         | `npm run lint`                                                 |
| Formatting      | `npm run format`                                               |
| All tests       | `npm run test`                                                 |
| Single test     | `npx vitest run --reporter=verbose src/path/to/test.test.ts`   |

## Key Environment Variables

- `VITE_LOCAL_DATA=true` - Use local mock data instead of real Django API (essential for offline/isolated dev).
- `BACKEND_URL` - Django backend URL (defaults to `http://localhost:8000`).

## Architecture & Foundational Mandates

### 1. TanStack Start & Server Functions

- **Pattern**: Uses `createServerFn` for both data fetching (GET) and mutations (POST/PATCH/DELETE).
- **Mandate**: Server functions MUST forward cookies via `serverFetch` from `src/lib/api-client.ts` for SSR authentication to work. NEVER use standard `fetch` directly in server functions.

### 2. Data Adapter Pattern

- **Location**: `src/server/data/*/factory.ts`.
- **Logic**: Toggles between `LocalMockAdapter` and `ApiAdapter` based on `VITE_LOCAL_DATA`.
- **Mandate**: When adding new domains, follow the established structure:
  ```
  src/server/data/{domain}/
  ├── types.ts          # Interfaces
  ├── mocks.ts          # Mock data
  ├── local.adapter.ts  # Local dev implementation
  ├── api.adapter.ts    # Production/API implementation
  └── factory.ts        # Selection logic
  ```

### 3. Authentication & Route Protection

- **Auth**: Uses httpOnly cookies.
- **Server-side**: Handled in `src/server/auth.ts`.
- **Client-side**: Handled in `src/auth/*`.
- **Routing**: File-based (TanStack Router). Protected routes live under layouts with the `_authed` marker.

### 4. API Layer & Mutations

- **Endpoints**: Centralized in `src/lib/api-endpoints.ts`.
- **Mutations**: Use generic factories in `src/server/mutation-helper.ts`.
- **Mandate**: DO NOT throw errors in mutations; return structured error objects instead.

## Coding Standards & Conventions

- **Imports**: Use `@/` alias for `src/` directory.
- **TypeScript**: Use strict mode. Prefer interfaces over types for object definitions. Always provide types for `useState<Type>()`.
- **Navigation**: Use `useNavigate()` for dynamic routes instead of `<Link>` where programmatic control is needed.
- **File Naming**: PascalCase for components, camelCase for functions/types.
- **Safety**: Run `npm run check` or `npx tsc --noEmit` before considering a task complete.

## Common Mistakes to Avoid

- **Direct Fetch**: Forgetting to use `serverFetch` in server functions, breaking SSR auth.
- **Type Imports**: Importing types from `mocks.ts` instead of `types.ts`.
- **Error Handling**: Throwing raw exceptions in server functions/mutations.

## Specialized Skills

Load relevant skills from `.opencode/skills/` or `.agent/skills/` when working on specific domains:

- `data-model-erd`: 29 entities, 5 domain layers.
- `form-validation-patterns`: Standardized form specifications.
- `page-specs`: UX flows for specific portals.
- `tanstack-data-adapter`: Detailed reference for the adapter pattern.
