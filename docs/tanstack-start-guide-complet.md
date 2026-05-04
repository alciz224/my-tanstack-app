# TanStack Start - Guide Complet & Bonnes Pratiques

> **Date** : Avril 2026  
> **Version** : TanStack Start v1.167+ (RC)  
> **Framework** : React + TypeScript + Vite

---

## Table des matieres

1. [Introduction](#1-introduction)
2. [Server Functions](#2-server-functions)
3. [Architecture & Patterns Avances](#3-architecture--patterns-avances)
4. [Middleware](#4-middleware)
5. [Context (Router, Route, Server Function)](#5-context)
6. [Routes & Layouts](#6-routes--layouts)
7. [Authentification & Autorisation](#7-authentification--autorisation)
8. [Anti-Patterns & Erreurs Courantes](#8-anti-patterns--erreurs-courantes)
9. [Bonnes Pratiques - Checklist](#9-bonnes-pratiques---checklist)

---

## 1. Introduction

### Philosophie TanStack Start

TanStack Start adopte une approche **client-first avec capacites serveur** :

- **Pas de `use server`** : Les server functions sont des RPC explicites via `createServerFn`
- **SSR natif** : Le rendu serveur est integre, pas force
- **Vite-first** : Pas de coupling avec un bundler specifique
- **Type-safe de bout en bout** : Du client au serveur, tout est type

### Architecture d'execution

```
SSR (Premier rendu) :
  Request → Server → Route Loader → Server Function (in-process, pas HTTP)

Client (Navigation SPA) :
  Click → Route Loader → Server Function (HTTP request auto)
```

---

## 2. Server Functions

### 2.1 Syntaxe de base

```typescript
import { createServerFn } from '@tanstack/react-start'

// GET (par defaut) - pour la lecture de donnees
export const getUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    // Ce code s'execute UNIQUEMENT sur le serveur
    return db.user.findUnique({ where: { id: data.id } })
  })

// POST - pour les mutations
export const createUser = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateUserInput) => data)
  .handler(async ({ data }) => {
    return db.user.create({ data })
  })
```

### 2.2 Appel des server functions

```typescript
// Dans un loader de route
export const Route = createFileRoute('/profile')({
  loader: async () => {
    const user = await getUser({ data: { id: '123' } })
    return { user }
  },
})

// Dans un composant avec useServerFn
import { useServerFn } from '@tanstack/react-start'

function Profile() {
  const getUserServer = useServerFn(getUser)
  
  const { data } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUserServer({ data: { id: '123' } }),
  })
}
```

### 2.3 Validation d'entree

```typescript
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const login = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(schema))
  .handler(async ({ data }) => {
    // data est type automatiquement : { email: string, password: string }
    return authenticateUser(data)
  })
```

### 2.4 Organisation des fichiers (Convention 2026)

```
src/utils/
├── users.functions.ts    # Wrappers createServerFn (importables partout)
├── users.server.ts       # Logique serveur uniquement (DB, API internes)
└── schemas.ts            # Schemas de validation partages (client-safe)
```

| Extension | Role | Importable cote client ? |
|-----------|------|-------------------------|
| `.functions.ts` | Exporte les `createServerFn` | Oui (wrappers securises) |
| `.server.ts` | Logique serveur pure | Non (risque d'import accidentel) |
| `.ts` | Code partage (types, schemas) | Oui |

---

## 3. Architecture & Patterns Avances

### 3.1 API Object avec Data Source Dynamique

**Pattern recommande** pour switcher entre mock et reel :

```typescript
// utils/api-factory.ts
interface UserDataSource {
  getUser(id: string): Promise<User | null>
  updateUser(id: string, data: Partial<User>): Promise<User>
}

// Implementation Mock
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

// Implementation Database
class DatabaseDataSource implements UserDataSource {
  async getUser(id: string) {
    return db.user.findUnique({ where: { id } })
  }
  
  async updateUser(id: string, data: Partial<User>) {
    return db.user.update({ where: { id }, data })
  }
}

// Factory avec injection de dependance
export function createUserAPI(source: UserDataSource) {
  return {
    getUser: createServerFn({ method: 'GET' })
      .inputValidator((data: { id: string }) => data)
      .handler(async ({ data }) => source.getUser(data.id)),
    
    updateUser: createServerFn({ method: 'POST' })
      .inputValidator((data: { id: string; updates: Partial<User> }) => data)
      .handler(async ({ data }) => source.updateUser(data.id, data.updates)),
  }
}

// Selection dynamique
const dataSource = import.meta.env.VITE_USE_MOCK === 'true'
  ? new MockDataSource()
  : new DatabaseDataSource()

export const userAPI = createUserAPI(dataSource)
```

### 3.2 Request/Response Control

```typescript
import { getRequest, setResponseHeaders, setResponseStatus } from '@tanstack/react-start/server'

const getCachedData = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const authHeader = getRequestHeader('Authorization')
  
  setResponseHeaders(new Headers({
    'Cache-Control': 'public, max-age=300',
    'CDN-Cache-Control': 'max-age=3600, stale-while-revalidate=600',
  }))
  setResponseStatus(200)
  
  return fetchData()
})
```

---

## 4. Middleware

### 4.1 Types de middleware

| Type | Portee | Usage |
|------|--------|-------|
| `type: 'function'` | Par fonction | Validation, logging, auth |
| Global | Toutes les requetes | CORS, tracing, monitoring |

### 4.2 Creation de middleware

```typescript
import { createMiddleware } from '@tanstack/react-start'

// Middleware basique
const loggingMiddleware = createMiddleware({ type: 'function' })
  .server(async ({ next, context }) => {
    console.log('Avant handler')
    const result = await next()
    console.log('Apres handler')
    return result
  })

// Middleware client + serveur (bidirectionnel)
const traceMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const startTime = Date.now()
    const traceId = crypto.randomUUID()
    
    const result = await next({
      sendContext: { traceId, startTime }
    })
    
    console.log(`Requete duree: ${Date.now() - startTime}ms`)
    return result
  })
  .server(async ({ next, context }) => {
    // context.traceId et context.startTime disponibles ici
    console.log(`[${context.traceId}] Traitement...`)
    return next()
  })
```

### 4.3 Ordre d'execution

Les middleware s'executent **par ordre de dependance** :

```
globalMiddleware1
  → globalMiddleware2
    → middlewareA
      → middlewareB (depend de A)
        → middlewareC
          → middlewareD (depend de B & C)
            → serverFunction
```

```typescript
const a = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  console.log('a')
  return next()
})

const b = createMiddleware({ type: 'function' })
  .middleware([a])  // B depend de A
  .server(async ({ next }) => {
    console.log('b')  // Execute apres a
    return next()
  })

const fn = createServerFn()
  .middleware([b])
  .server(async () => {
    console.log('fn')
  })
```

### 4.4 Middleware avec validation

```typescript
const workspaceMiddleware = createMiddleware({ type: 'function' })
  .inputValidator(zodValidator(z.object({ workspaceId: z.string() })))
  .server(({ next, data }) => {
    console.log('Workspace ID:', data.workspaceId)
    return next()
  })
```

### 4.5 Factory de middleware (parametrable)

```typescript
function authorizationMiddleware(permissions: Record<string, string[]>) {
  return createMiddleware({ type: 'function' })
    .middleware([authMiddleware])
    .server(async ({ next, context }) => {
      const granted = await auth.hasPermission(context.session, permissions)
      if (!granted) throw new Error('Forbidden')
      return next()
    })
}

// Usage
const getClients = createServerFn()
  .middleware([authorizationMiddleware({ client: ['read'] })])
  .handler(async () => {
    return { message: 'Acces autorise' }
  })
```

### 4.6 Modification des headers

```typescript
const headerMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    return next({
      headers: { 'X-Custom-Header': 'value' },
    })
  })
  .server(async ({ next }) => {
    const authHeader = getRequestHeader('Authorization')
    setResponseHeaders(new Headers({ 'Cache-Control': 'max-age=300' }))
    return next()
  })
```

### 4.7 Custom Fetch (priorite)

La priorite pour les overrides de fetch (plus haute → plus basse) :

1. Appel direct : `serverFn({ fetch: customFetch })`
2. Middleware plus tardif dans la chaine
3. Middleware plus totif dans la chaine
4. `createStart({ serverFns: { fetch: customFetch } })`
5. `fetch` global par defaut

---

## 5. Context

### 5.1 Flux du contexte

```
Router Context (createRootRouteWithContext)
    ↓
Route beforeLoad (peut etendre le contexte)
    ↓
Context Route Parent (fusionne vers les enfants)
    ↓
Route enfant beforeLoad (peut ajouter plus)
    ↓
Route loader (recoit le contexte fusionne)
    ↓
Composants (via useRouteContext, Route.useRouteContext)
```

### 5.2 Router Context (typage global)

```typescript
// router.tsx
import { createRootRouteWithContext } from '@tanstack/react-router'

interface MyRouterContext {
  queryClient: QueryClient
  user: User | null
}

const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: App,
})

const router = createRouter({
  routeTree,
  context: { queryClient, user: null },
})
```

### 5.3 Route Context (beforeLoad)

```typescript
// routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    // Acces au contexte parent
    console.log(context.queryClient)
    
    // Retourne un nouveau contexte (fusionne avec le parent)
    const user = await fetchUser()
    return { user }
  },
  
  loader: async ({ context }) => {
    // context.user disponible ici
    return context.queryClient.fetchQuery({
      queryKey: ['dashboard', context.user.id],
      queryFn: () => getDashboardData(context.user.id),
    })
  },
})
```

### 5.4 Acces au contexte dans les composants

```typescript
function AdminPage() {
  // Contexte de cette route
  const { user, isAdminRoute } = Route.useRouteContext()
  
  // Contexte d'une route parente
  const { user: dashboardUser } = useRouteContext({ from: '/dashboard' })
  
  // Contexte router-level
  const router = useRouter()
  const { queryClient } = router.options.context
}
```

### 5.5 Context dans les Server Functions (via middleware)

```typescript
// middleware/auth-middleware.ts
export const authMiddleware = createMiddleware()
  .server(async ({ next }) => {
    const session = await getSession({ headers: getHeaders() })
    
    return next({
      context: {
        user: session?.user,
        sessionId: session?.id,
      },
    })
  })

// utils/users.functions.ts
export const getCurrentUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.user est type automatiquement
    return context.user
  })
```

### 5.6 Context bidirectionnel (client ↔ serveur)

```typescript
const bidirectionalMiddleware = createMiddleware({ type: 'function' })
  .client(async ({ next }) => {
    const clientData = { timestamp: Date.now() }
    
    const result = await next({
      sendContext: clientData  // Envoie au serveur
    })
    
    // Recoit du serveur via result.context
    console.log('Serveur a envoye:', result.context.serverData)
    return result
  })
  .server(async ({ next, context }) => {
    // context.timestamp disponible (du client)
    
    return next({
      sendContext: { serverData: 'reponse' }  // Renvoie au client
    })
  })
```

### 5.7 AsyncLocalStorage (contexte cross-function)

```typescript
import { AsyncLocalStorage } from 'node:async_hooks'

const asyncLocalStorage = new AsyncLocalStorage()

function getTraceId() {
  const store = asyncLocalStorage.getStore() as any
  return store?.traceId
}

const tracingMiddleware = createMiddleware({ type: 'function' })
  .server(async ({ next }) => {
    const traceId = getTraceId() ?? crypto.randomUUID()
    
    return asyncLocalStorage.run({ traceId }, async () => {
      return next({ sendContext: { traceId } })
    })
  })
```

### 5.8 Tableau recapitulatif du contexte

| Emplacement | Comment acceder | Comment definir |
|-------------|-----------------|-----------------|
| **Router** | `router.options.context` | `createRouter({ context: {} })` |
| **Root Route** | `createRootRouteWithContext<T>()` | Retour de `beforeLoad` |
| **Route** | `Route.useRouteContext()` | Retour de `beforeLoad` |
| **Route Parent** | `useRouteContext({ from: '/parent' })` | `beforeLoad` du parent |
| **Loader** | `({ context })` param | Herite de `beforeLoad` |
| **Server Function** | `({ context })` param | `next({ context: {} })` du middleware |
| **Server Fn imbriquee** | `AsyncLocalStorage` | Middleware parent |

---

## 6. Routes & Layouts

### 6.1 Convention de routage (file-based)

```
src/routes/
├── __root.tsx              # Layout racine (englobe tout)
├── index.tsx               # /
├── about.tsx               # /about
├── posts/
│   ├── route.tsx           # Layout pour /posts/*
│   ├── index.tsx           # /posts
│   └── $postId.tsx         # /posts/:postId
├── _authenticated.tsx      # Layout sans segment URL
├── _authenticated/
│   ├── dashboard.tsx       # /dashboard (protégé)
│   └── settings.tsx        # /settings (protégé)
└── admin/
    └── route.tsx           # Layout pour /admin/*
```

### 6.2 Types de routes

| Pattern | Fichier | URL | Usage |
|---------|---------|-----|-------|
| **Statique** | `about.tsx` | `/about` | Page simple |
| **Dynamique** | `$postId.tsx` | `/posts/123` | Parametrise |
| **Index** | `index.tsx` | `/` (parent) | Enfant par defaut |
| **Layout** | `route.tsx` | Meme que parent | Composant wrapper |
| **Sans chemin** | `_authenticated.tsx` | Pas de segment URL | Groupe/Guard |
| **Splat** | `$.tsx` | `/files/...` | Catch-all |

### 6.3 Layout de base (routes imbriquees)

```typescript
// routes/posts/route.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/posts')({
  component: PostsLayout,
})

function PostsLayout() {
  return (
    <div>
      <h1>Section Posts</h1>
      <nav>
        <Link to="/posts">Tous les posts</Link>
        <Link to="/posts/new">Nouveau</Link>
      </nav>
      <main>
        <Outlet />  {/* Les routes enfants se rendent ici */}
      </main>
    </div>
  )
}
```

### 6.4 Layout sans chemin (Route Groups)

Le prefixe underscore `_` cree un layout **sans** ajouter de segment URL :

```typescript
// routes/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main><Outlet /></main>
    </div>
  )
}
```

Les enfants **n'incluent pas** le prefixe dans leur chemin :

```typescript
// routes/_authenticated/dashboard.tsx    → /dashboard
// routes/_authenticated/settings.tsx     → /settings
```

### 6.5 Layouts multiples composables

```typescript
// routes/_authenticated.tsx           # Verification auth + shell app
// routes/_authenticated/_admin.tsx    # Verification role admin
// routes/_authenticated/_admin/
//   └── users.tsx                     → /users (auth + admin requis)
```

---

## 7. Authentification & Autorisation

### 7.1 Principe fondamental : Router Context, pas React Context

**ERREUR CLASSIQUE** (casse le SSR) :

```typescript
// ❌ FAUX - useAuth() est un hook React, il n'existe pas sur le serveur
beforeLoad: async () => {
  const auth = useAuth()  // ❌ Crash en SSR!
  if (!auth.user) throw redirect({ to: '/login' })
}
```

**SOLUTION** (SSR-safe) :

```typescript
// ✅ CORRECT - Utilise le router context (isomorphe)
beforeLoad: ({ context }) => {
  if (!context.user) throw redirect({ to: '/login' })
}
```

### 7.2 Architecture SSR-safe complete

```
┌─────────────────────────────────────────────────────────────┐
│  SERVEUR (SSR)                                              │
│  ────────────────                                           │
│  1. Requete avec cookie                                     │
│  2. getUserFromRequest(cookie) → user                       │
│  3. Creation router avec context = { user }                 │
│  4. beforeLoad verifie context.user (sync, pas de fetch)    │
│  5. Rendu HTML avec etat auth                               │
│  6. Dehydratation etat pour client                          │
└─────────────────────────────────────────────────────────────┘
                              ↓ Hydratation
┌─────────────────────────────────────────────────────────────┐
│  CLIENT (Apres Hydratation)                                 │
│  ──────────────────────────                                 │
│  1. Rehydratation context router depuis serveur             │
│  2. React Context (AuthProvider) prend le relais pour UI    │
│  3. Composants utilisent useAuth() pour UI (boutons, menus) │
│  4. Guards routes utilisent toujours router context         │
│  5. Sur changement auth: maj router context + invalidate()  │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Point d'entree serveur (SSR)

```typescript
// app/ssr.tsx
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { getWebRequest, getCookie } from '@tanstack/react-start/server'
import { createRouter } from './router'
import { validateSession } from './utils/auth'

export default createStartHandler(defaultStreamHandler)({
  createRouter,
  
  // Appele pour CHAQUE requete en SSR
  getRouterContext: async () => {
    const request = getWebRequest()
    const sessionToken = getCookie('session_token')
    
    // Validation cote serveur - pas d'appel API!
    const user = sessionToken 
      ? await validateSession(sessionToken)
      : null
    
    return {
      user,
      queryClient: new QueryClient(),
    }
  },
})
```

### 7.4 Router avec context type

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  user: User | null
  queryClient: QueryClient
}

export function createRouter(context?: RouterContext) {
  return createTanStackRouter({
    routeTree,
    context: context ?? {
      user: null,
      queryClient: new QueryClient(),
    },
    dehydrate: () => ({ user: context?.user }),
    hydrate: (dehydrated) => ({ user: dehydrated.user }),
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

### 7.5 Route protegee (beforeLoad)

```typescript
// routes/_authenticated.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    // context.user vient de getRouterContext() en SSR
    // ou de l'etat dehydrate sur le client
    
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    
    // Retourne l'utilisateur pour les enfants
    return { user: context.user }
  },
})
```

### 7.6 Page de login (guard inverse)

```typescript
// routes/login.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const loginSearchSchema = z.object({
  redirect: z.string().optional().default('/'),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  
  // Redirige les utilisateurs deja authentifies
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()
  const navigate = Route.useNavigate()

  const handleLogin = async (credentials) => {
    await auth.login(credentials)
    navigate({ to: redirect })
  }

  return <LoginForm onSubmit={handleLogin} />
}
```

### 7.7 RBAC - Role-Based Access Control

```typescript
// utils/auth.ts
export const roles = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const

export type Role = (typeof roles)[keyof typeof roles]

const roleHierarchy: Record<Role, number> = {
  [roles.USER]: 0,
  [roles.MODERATOR]: 1,
  [roles.ADMIN]: 2,
  [roles.OWNER]: 3,
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
```

### 7.8 Layout Admin (role guard)

```typescript
// routes/_authenticated/_admin.tsx
import { hasRole, roles } from '~/utils/auth'

export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: async ({ context }) => {
    const { user } = context
    
    if (!hasRole(user.role, roles.ADMIN)) {
      throw redirect({ to: '/unauthorized' })
    }
    
    return { isAdmin: true, adminPerms: getAdminPermissions(user) }
  },
  component: AdminLayout,
})
```

### 7.9 Composants RoleRequired (UI uniquement)

```typescript
// components/RoleRequired.tsx
import { useRouteContext } from '@tanstack/react-router'
import { hasRole } from '~/utils/auth'

interface RoleRequiredProps {
  role: Role
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function RoleRequired({ role, fallback = null, children }: RoleRequiredProps) {
  const { user } = useRouteContext({ from: '__root__' })
  
  if (!user || !hasRole(user.role, role)) {
    return fallback
  }
  
  return children
}

// Usage
function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      
      <RoleRequired role="admin">
        <Link to="/admin">Admin Panel</Link>
      </RoleRequired>
    </nav>
  )
}
```

### 7.10 AuthProvider cote client (composants UNIQUEMENT)

```typescript
// auth/AuthProvider.tsx - UNIQUEMENT pour les composants, jamais dans beforeLoad!
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // Utilisateur initial depuis le contexte router (SSR-safe)
  const user = router.options.context.user

  const login = useMutation({
    mutationFn: async (credentials) => {
      const user = await loginApi(credentials)
      
      // Met a jour le contexte router (pour la prochaine navigation)
      router.options.context.user = user
      
      // Invalide pour re-executer les guards
      router.invalidate()
      
      return user
    },
  })

  const logout = useMutation({
    mutationFn: async () => {
      await logoutApi()
      router.options.context.user = null
      queryClient.clear()
      router.invalidate()
    },
  })

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 7.11 Regles d'or - Contexte Router vs React

| Emplacement | Router Context | React Context |
|-------------|----------------|---------------|
| `beforeLoad` | ✅ Oui | ❌ Non (casse SSR) |
| `loader` | ✅ Oui | ❌ Non (casse SSR) |
| Composants | ✅ Oui (via `useRouteContext`) | ✅ Oui (via `useAuth()`) |
| Server Functions | ✅ Via middleware | ❌ N/A |

---

## 8. Anti-Patterns & Erreurs Courantes

### ❌ Erreur 1 : React Context dans beforeLoad/loader

```typescript
// FAUX
beforeLoad: async () => {
  const auth = useAuth()  // ❌ Hook React dans du code isomorphe
}

// CORRECT
beforeLoad: ({ context }) => {
  const { user } = context  // ✅ Router context
}
```

### ❌ Erreur 2 : Appel API dans beforeLoad (client-side)

```typescript
// FAUX
beforeLoad: async () => {
  const user = await fetchUser()  // ❌ Fetch manuel
}

// CORRECT
beforeLoad: async ({ context }) => {
  const user = await context.queryClient.fetchQuery({
    queryKey: ['auth'],
    queryFn: () => getCurrentUser(),  // ✅ Server function
  })
}
```

### ❌ Erreur 3 : Import depuis .server.ts cote client

```typescript
// FAUX (dans un fichier .functions.ts)
import { db } from './db.server'  // ❌ db.server.ts est serveur-only

// CORRECT
// .functions.ts : uniquement les wrappers createServerFn
// .server.ts : logique DB, appelee UNIQUEMENT dans le handler
```

### ❌ Erreur 4 : Oublier de retourner next() dans middleware

```typescript
// FAUX
.server(async ({ next }) => {
  console.log('avant')
  await next()  // ❌ Pas de return
  console.log('apres')
})

// CORRECT
.server(async ({ next }) => {
  console.log('avant')
  const result = await next()
  console.log('apres')
  return result  // ✅ Propagation du resultat
})
```

### ❌ Erreur 5 : Utiliser des composants de guard au lieu de beforeLoad

```typescript
// FAUX (Next.js pattern)
function ProtectedPage() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />  // ❌ Flash de contenu
}

// CORRECT (TanStack pattern)
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })  // ✅ Bloque avant render
  },
})
```

---

## 9. Bonnes Pratiques - Checklist

### Architecture

- [ ] Utiliser `.functions.ts` pour les wrappers `createServerFn`
- [ ] Utiliser `.server.ts` pour la logique serveur pure (DB, APIs)
- [ ] Utiliser `.ts` pour le code partage (types, schemas)
- [ ] Injecter les dependances via des factories (mock/reel)
- [ ] Typer le router context avec `createRootRouteWithContext<>`

### Server Functions

- [ ] Toujours utiliser `inputValidator` pour valider les entrees
- [ ] Preferer les adapters officiels (`@tanstack/zod-adapter`)
- [ ] Utiliser `useServerFn()` dans les composants pour le cache
- [ ] Ne jamais importer de `.server.ts` dans du code client

### Middleware

- [ ] Garder les middleware focalises (SRP)
- [ ] Toujours `return next()` (pas juste `await`)
- [ ] Utiliser `sendContext` pour passer des donnees
- [ ] Composer les middleware via `.middleware([...])`
- [ ] Utiliser des factories pour les middleware parametres

### Routes & Layouts

- [ ] Utiliser les layouts sans chemin (`_authenticated`) pour les guards
- [ ] Placer les guards au niveau le plus haut possible
- [ ] Utiliser `Outlet` pour les layouts imbriques
- [ ] Sauvegarder `location.href` dans les redirects pour retour post-login

### Authentification

- [ ] **JAMAIS** de React Context dans `beforeLoad` ou `loader`
- [ ] Utiliser `getRouterContext` pour injecter l'utilisateur en SSR
- [ ] Utiliser `router.options.context.user` pour les guards
- [ ] Synchroniser le contexte router sur login/logout + `invalidate()`
- [ ] Utiliser `useAuth()` UNIQUEMENT dans les composants (UI)

### Performance

- [ ] Utiliser `queryClient.fetchQuery` dans les loaders pour le parallelisme
- [ ] Mettre en cache les resultats de server functions avec React Query
- [ ] Utiliser `staleTime` approprie pour eviter les re-fetchs
- [ ] Dehydrater/rehydrater l'etat entre serveur et client

### Securite

- [ ] Toujours valider les entrees cote serveur (inputValidator)
- [ ] Ne jamais faire confiance aux donnees client
- [ ] Verifier les roles/permissions dans les middleware serveur
- [ ] Utiliser HTTPS pour les cookies de session
- [ ] Implementer le CSRF protection pour les mutations

---

## Ressources

- **Documentation officielle** : https://tanstack.com/start/latest
- **TanStack Router** : https://tanstack.com/router/latest
- **GitHub** : https://github.com/TanStack/router
- **Discussions** : https://github.com/TanStack/router/discussions

---

*Document genere le 17 avril 2026 - TanStack Start v1.167+*