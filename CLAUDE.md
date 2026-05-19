# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Starts the Vite development server on port 3000 with API proxy configured to forward `/api` requests to the Django backend.

### Production Build

```bash
npm run build
```

Creates a production-optimized build.

### Preview Production Build

```bash
npm run preview
```

Locally previews the production build.

### Testing

```bash
npm run test
```

Runs Vitest tests in headless mode.

### Linting & Formatting

```bash
npm run lint        # Run ESLint
npm run format      # Run Prettier
npm run check       # Run Prettier then ESLint --fix
```

### Data Mode Switching

Set `VITE_LOCAL_DATA=true` environment variable to use local mock data instead of making real API calls:

```bash
# For local mock data (offline development)
VITE_LOCAL_DATA=true npm run dev

# For real API calls (default)
npm run dev
```

## Architecture Overview

### Core Technology Stack

- **Framework**: TanStack Start (React-based full-stack framework)
- **Routing**: TanStack Router (file-based routing convention)
- **State Management**: TanStack Query (server state) + TanStack Store (client state)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Type Safety**: TypeScript

### Key Architectural Patterns

#### 1. Data Adapter Pattern (Scalable Local/Real Data)

Located in `src/server/data/*/factory.ts`, this pattern allows seamless switching between:

- **LocalMockAdapter**: Returns static mock data (development/testing)
- **ApiAdapter**: Makes real HTTP requests to Django backend (production)
- Selection based on `VITE_LOCAL_DATA` environment variable or non-production `NODE_ENV`

**Current implementations:**

- Academic data (`src/server/data/academic/`) - cycles, levels, subjects, etc.
- Geography data (`src/server/data/geography/`) - countries, regions, localities
- Users data (`src/server/data/users/`) - user profiles and authentication data
- **Theme data** (`src/server/data/theme/`) - light/dark/system theme management ← _Newly implemented_

#### 2. Authentication System

- **Server Functions** (`src/server/auth.ts`): Handle SSR auth checks, forward cookies to Django
- **Client Functions** (`src/auth/*`): Handle login/logout/registration in browser to manage httpOnly cookies
- **Route Protection**: Uses `src/auth/routeProtection.ts` to detect protected routes via `_authed` layout marker
- **Roles**: Six roles defined in `src/types/roles.ts` with corresponding portal routes

#### 3. API Layer

- **Endpoint Constants**: Centralized in `src/lib/api-endpoints.ts` organized by domain (v1/v2)
- **API Client**: `src/lib/api-client.ts` provides `serverFetch` utility for SSR with cookie forwarding
- **Mutations**: Generic factories in `src/server/mutation-helper.ts` handle CSRF, cookies, error handling

#### 4. Route Structure

- **Public Routes**: `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`
- **Protected Routes**: All routes under layouts that include `/_authed` in their route ID
- **Role-Based Portals**: Mapped in `src/types/roles.ts` (`PORTAL_ROUTES`)
- **Root Layout**: `src/routes/__root.tsx` handles auth checking and layout

#### 5. Server Functions

Two types defined by TanStack Start:

- **Data Fetching** (`createServerFn` with GET): Used in route loaders, forwards cookies via `serverFetch`
- **Mutations** (`createServerFn` with POST/PATCH/DELETE): Handle state changes with CSRF protection

### Important Files & Directories

```
src/
├── routes/                 # File-based routing (pages & layouts)
│   ├── __root.tsx          # Root layout - auth checking
│   ├── _authed.tsx         # Authenticated layout wrapper
│   ├── _auth/              # Login/register routes
│   └── _authed/*           # Role-specific portals (admin, teacher, etc.)
├── server/                 # Server-only code (API routes, data adapters)
│   ├── api/                # Server functions (endpoints)
│   ├── data/               # Data adapter implementations
│   │   ├── academic/       # Academic data (cycles, levels, subjects)
│   │   ├── geography/      # Geography data (countries, regions)
│   │   └── users/          # User data
│   ├── auth.ts             # Auth server functions
│   ├── csrf.ts             # CSRF token handling
│   └── mutation-helper.ts  # Generic mutation factories
├── lib/                    # Shared utilities
│   ├── api-client.ts       # serverFetch with cookie forwarding
│   ├── api-endpoints.ts    # Centralized endpoint constants
│   ├── api-mutations.ts    # Academic-specific mutations
│   ├── query-client.ts     # TanStack Query client setup
│   ├── i18n.ts             # Internationalization
│   └── validation.ts       # Form validation helpers
├── stores/                 # TanStack Store implementations
│   ├── themeStore.ts       # Dark/light theme
│   ├── languageStore.ts    # UI language
│   └── toastStore.ts       # Toast notifications
├── components/             # Shared UI components
│   ├── auth/               # Auth-related components
│   ├── layout/             # Header, sidebar, nav
│   └── ui/                 # Reusable UI elements
└── types/                  # TypeScript type definitions
    ├── api.ts              # API response types
    ├── academic.ts         # Academic domain types
    ├── geography.ts        # Geography domain types
    ├── roles.ts            # User roles & portal config
    └── router.ts           # Router-specific types
```

### Common Development Tasks

#### Adding a New Route

1. Create file in `src/routes/` (e.g., `src/routes/new-page.tsx`)
2. For protected routes, place under `_authed` layout or create new auth-layout route
3. Use file-based routing conventions:
   - `index.tsx` = index route
   - `[param].tsx` = dynamic route parameter
   - `__root.tsx` = layout boundary

#### Adding API Endpoints

1. Add constants to `src/lib/api-endpoints.ts` under appropriate domain
2. Create server function in `src/server/api/[domain].ts`:
   - Use `createServerFn` for GET (data fetching)
   - Import from `mutation-helper.ts` for POST/PATCH/DELETE
3. Use `serverFetch` from `src/lib/api-client.ts` for cookie forwarding in SSR

#### Implementing Data Adapters

For new data domains:

1. Create types in `src/types/[domain].ts`
2. Create adapter implementations in `src/server/data/[domain]/`:
   - `local.adapter.ts` (mock data)
   - `api.adapter.ts` (real API calls)
   - `factory.ts` (environment-based selection)
3. Export service function in `src/server/data/[domain]/factory.ts`
4. Create server functions in `src/server/api/[domain].ts` using the service

#### State Management

- **Server State** (API data): Use TanStack Query with `useQuery`/`useMutation`
- **Client State** (UI state): Use TanStack Store with `useStore` hook
- See existing implementations in `src/stores/` for reference

### Environment Variables

- `VITE_LOCAL_DATA`: Set to `true` to use mock data instead of real API
- `BACKEND_URL`: Django backend URL (defaults to `http://localhost:8000`)
- Standard Vite env vars: `MODE`, `DEV`, `PROD`

### Code Conventions

- **File Naming**: PascalCase for components, camelCase for functions/types
- **Imports**: Use `@/` alias for `src/` directory
- **TypeScript**: Strict mode enabled, prefer interfaces over types for objects
- **Server Functions**: Always handle cookie forwarding for SSR auth
- **Error Handling**: Return structured error objects from mutations, not thrown exceptions
- **Comments**: Use JSDoc for public functions and complex logic

### Testing Guidelines

- Place tests alongside source files with `.test.ts` or `.test.tsx` suffix
- Use Vitest as test runner
- Mock API calls using `vi.mock()` or MSW
- Test both server functions (SSR behavior) and client components
