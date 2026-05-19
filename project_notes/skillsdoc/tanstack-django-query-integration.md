# TanStack Query + Django Backend — Intégration Complète

> **Stack** : TanStack Start + React Query + Django REST Framework  
> **Auth** : Django Sessions (HttpOnly cookies)  
> **Date** : Avril 2026

---

## Table des matieres

1. [Architecture Overview](#1-architecture-overview)
2. [Configuration QueryClient](#2-configuration-queryclient)
3. [apiFetch avec QueryClient](#3-apifetch-avec-queryclient)
4. [Pattern SSR + Client (Hydration)](#4-pattern-ssr--client-hydration)
5. [Les Queries (Lecture)](#5-les-queries-lecture)
6. [Les Mutations (Écriture)](#6-les-mutations-écriture)
7. [Gestion des Erreurs Django](#7-gestion-des-erreurs-django)
8. [CSRF Token (Django)](#8-csrf-token-django)
9. [Exemple Complet — CRUD](#9-exemple-complet--crud)
10. [Récapitulatif des Patterns](#10-récapitulatif-des-patterns)

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  BROWSER                                                             │
│  ──────                                                              │
│  React Query (cache)                                                 │
│   ├── Query: useQuery({ queryKey: ['posts'], queryFn: getPosts })   │
│   ├── Mutation: useMutation({ mutationFn: createPost })             │
│   └── Invalidate: queryClient.invalidateQueries({ queryKey })       │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (fetch API avec credentials: 'include')
┌──────────────────────────────────────────────────────────────────────┐
│  TANSTACK START SERVER                                               │
│  ─────────────────────                                               │
│  createServerFn                                                      │
│   ├── apiFetch('/posts')                                             │
│   │     └── getRequestHeaders() → Cookie: sessionid=xxx             │
│   │     └── fetch('https://django.api/posts', { headers })          │
│   └── return data → sérialisé → client                              │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (HTTP avec Cookie forwardé)
┌──────────────────────────────────────────────────────────────────────┐
│  DJANGO BACKEND                                                      │
│  ──────────────                                                      │
│  django.contrib.sessions                                             │
│   ├── sessionid cookie → SessionMiddleware → request.user           │
│   ├── @login_required → 401 si anonyme                              │
│   └── @permission_required → 403 si pas les droits                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Configuration QueryClient

### QueryClient isomorphe (SSR + Client)

```typescript
// utils/query-client.ts
import { QueryClient, QueryFunction } from '@tanstack/react-query'
import { defaultShouldDehydrateQuery } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute par défaut
        refetchOnWindowFocus: false, // Optionnel selon ton besoin
        retry: (failureCount, error: any) => {
          // Ne pas retry sur 401/403
          if (error?.status === 401 || error?.status === 403) return false
          return failureCount < 2
        },
      },
      dehydrate: {
        // N'hydrate que les queries en succès (pas les erreurs)
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) &&
          query.state.status === 'success',
      },
    },
  })
}

// Singleton pour le client (évite les recréations en HMR)
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Serveur : toujours un nouveau
    return makeQueryClient()
  }
  // Client : singleton
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}
```

### Router avec QueryClient intégré

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getQueryClient } from './utils/query-client'

export interface RouterContext {
  queryClient: QueryClient
  user: User | null
}

export function createRouter(context?: Partial<RouterContext>) {
  const queryClient = context?.queryClient ?? getQueryClient()

  return createTanStackRouter({
    routeTree,
    context: { queryClient, user: null, ...context },
    // 🔑 CRUCIAL : Déshydrater/Rehydrater React Query
    dehydrate: () => ({
      queryClientState: queryClient
        .getQueryCache()
        .getAll()
        .map((q) => ({
          queryKey: q.queryKey,
          state: q.state,
        })),
    }),
  })
}
```

### App Component

```typescript
// app.tsx
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from './utils/query-client'
import { createRouter } from './router'

export default function App() {
  const queryClient = getQueryClient()
  const router = createRouter({ queryClient })

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

---

## 3. apiFetch avec QueryClient

### apiFetch version complète (Django-aware)

```typescript
// utils/api.server.ts
import { getRequestHeaders, getRequest } from '@tanstack/react-start/server'

const API_BASE_URL = process.env.DJANGO_API_URL || 'http://localhost:8000/api'

// ─── Erreur API typée ──────────────────────────────────────────────

export class DjangoAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = 'DjangoAPIError'
  }
}

// ─── Helper : extraire le CSRF token des cookies ───────────────────

function getCsrfToken(cookieHeader: string | null): string {
  if (!cookieHeader) return ''
  const match = cookieHeader.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

// ─── apiFetch principal ─────────────────────────────────────────────

interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string> // Query params
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options
  const headers = getRequestHeaders()
  const cookieHeader = headers.get('cookie') || ''

  // Construire l'URL avec query params
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
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Forward le cookie de session Django
      Cookie: cookieHeader,
      // CSRF token pour les mutations
      ...(isMutation ? { 'X-CSRFToken': getCsrfToken(cookieHeader) } : {}),
      // Merge les headers custom
      ...fetchOptions.headers,
    },
  })

  // Gestion des erreurs Django
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    throw new DjangoAPIError(
      errorData.detail || errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData,
    )
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// ─── Helpers spécifiques Django ────────────────────────────────────

export function apiGet<T>(path: string, params?: Record<string, string>) {
  return apiFetch<T>(path, { method: 'GET', params })
}

export function apiPost<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function apiPut<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function apiPatch<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function apiDelete<T>(path: string) {
  return apiFetch<T>(path, { method: 'DELETE' })
}
```

---

## 4. Pattern SSR + Client (Hydration)

### Le Pattern "Prefetch in Loader, Consume in Component"

```typescript
// routes/posts/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '~/utils/posts.functions'

// Clé de query centralisée
export const postsQueryKey = ['posts', 'list'] as const

export const Route = createFileRoute('/posts/')({
  // ─── SSR : Précharge la query ──────────────────────────────────
  loader: async ({ context }) => {
    const { queryClient } = context

    // Prefetch côté serveur → forward les cookies automatiquement
    await queryClient.prefetchQuery({
      queryKey: postsQueryKey,
      queryFn: () => getPosts(),
    })

    // Pas besoin de return data — React Query gère le cache
  },

  component: PostsPage,
})

function PostsPage() {
  // ─── Client : Lit depuis le cache (ou fetch si pas en cache) ───
  const { data: posts, isLoading } = useQuery({
    queryKey: postsQueryKey,
    queryFn: () => getPosts(),
    // Pas besoin de staleTime ici — hérité du QueryClient
  })

  if (isLoading) return <Skeleton />

  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### Avantage de ce pattern

| Scénario                | Comportement                                                |
| ----------------------- | ----------------------------------------------------------- |
| **Premier rendu (SSR)** | `loader` prefetch → HTML rendu avec données                 |
| **Hydratation**         | React Query trouve les données en cache → pas de refetch    |
| **Navigation SPA**      | `useQuery` vérifie le cache → staleTime OK → pas de refetch |
| **Après staleTime**     | `useQuery` refetch automatiquement en arrière-plan          |
| **Invalidation**        | `queryClient.invalidateQueries` force le refetch            |

---

## 5. Les Queries (Lecture)

### Server Functions (couche API)

```typescript
// utils/posts.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { apiGet, apiFetch } from './api.server'

// ─── Liste des posts ───────────────────────────────────────────────

export const getPosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { page?: number; search?: string } = {}) => data)
  .handler(async ({ data }) => {
    return apiGet<Post[]>('/posts/', {
      page: String(data.page || 1),
      search: data.search || '',
    })
  })

// ─── Détail d'un post ──────────────────────────────────────────────

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiGet<Post>(`/posts/${data.id}/`)
  })

// ─── Posts de l'utilisateur connecté ───────────────────────────────

export const getMyPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    return apiGet<Post[]>('/posts/my/')
  },
)
```

### Composants avec useQuery

```typescript
// components/posts/PostList.tsx
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '~/utils/posts.functions'
import { postsQueryKey } from '~/routes/posts'

interface PostListProps {
  search?: string
}

export function PostList({ search }: PostListProps) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: [...postsQueryKey, { search }],  // Clé dépendante des params
    queryFn: () => getPosts({ data: { search } }),
  })

  if (isLoading) return <PostsSkeleton />

  if (error) {
    if (error.message.includes('401')) {
      return <LoginRedirect />
    }
    return <ErrorMessage error={error} />
  }

  return (
    <div>
      {isFetching && <RefreshIndicator />}
      {data?.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
```

### Query avec paramètres dynamiques

```typescript
// routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPost } from '~/utils/posts.functions'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ context, params }) => {
    const { queryClient } = context

    await queryClient.prefetchQuery({
      queryKey: ['posts', 'detail', params.postId],
      queryFn: () => getPost({ data: { id: params.postId } }),
    })
  },
  component: PostDetailPage,
})

function PostDetailPage() {
  const { postId } = Route.useParams()

  const { data: post } = useQuery({
    queryKey: ['posts', 'detail', postId],
    queryFn: () => getPost({ data: { id: postId } }),
  })

  return post ? <PostContent post={post} /> : <NotFound />
}
```

### Query dépendante (enabled)

```typescript
// Query qui dépend d'une autre query
function UserPosts({ userId }: { userId: string | null }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getUserPosts({ data: { userId: userId! } }),
    enabled: !!userId,  // Ne s'exécute que si userId est défini
  })

  return posts?.map(post => <PostCard key={post.id} post={post} />)
}
```

---

## 6. Les Mutations (Écriture)

### Pattern Mutation + Invalidation

```typescript
// utils/posts.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { apiPost, apiPut, apiPatch, apiDelete } from './api.server'

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator((data: { title: string; content: string }) => data)
  .handler(async ({ data }) => {
    return apiPost<Post>('/posts/', data)
  })

export const updatePost = createServerFn({ method: 'PUT' })
  .inputValidator(
    (data: { id: string; title: string; content: string }) => data,
  )
  .handler(async ({ data }) => {
    const { id, ...body } = data
    return apiPut<Post>(`/posts/${id}/`, body)
  })

export const deletePost = createServerFn({ method: 'DELETE' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiDelete<void>(`/posts/${data.id}/`)
  })
```

### Composant avec useMutation

```typescript
// components/posts/CreatePostForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '~/utils/posts.functions'
import { postsQueryKey } from '~/routes/posts'

export function CreatePostForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      createPost({ data }),

    onSuccess: (newPost) => {
      // ─── Invalidation ──────────────────────────────────────────
      // Invalide la liste des posts → refetch automatique
      queryClient.invalidateQueries({ queryKey: postsQueryKey })

      // Optionnel : Ajoute le nouveau post dans le cache
      queryClient.setQueryData(
        [...postsQueryKey],
        (old: Post[] = []) => [newPost, ...old],
      )

      // Redirige vers le nouveau post
      navigate({ to: '/posts/$postId', params: { postId: newPost.id } })
    },

    onError: (error: DjangoAPIError) => {
      if (error.status === 401) {
        toast.error('Veuillez vous connecter')
      } else if (error.status === 403) {
        toast.error('Permission insuffisante')
      } else {
        toast.error(error.message)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    mutation.mutate({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Création...' : 'Créer'}
      </button>
    </form>
  )
}
```

### Optimistic Updates

```typescript
// components/posts/LikeButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost } from '~/utils/posts.functions'

export function LikeButton({ post }: { post: Post }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => likePost({ data: { id: post.id } }),

    // ─── Optimistic Update ──────────────────────────────────────
    onMutate: async () => {
      // Annule les refetches en cours
      await queryClient.cancelQueries({
        queryKey: ['posts', 'detail', post.id],
      })

      // Snapshot de l'ancienne valeur
      const previousPost = queryClient.getQueryData<Post>(
        ['posts', 'detail', post.id],
      )

      // Met à jour le cache immédiatement
      queryClient.setQueryData(
        ['posts', 'detail', post.id],
        (old: Post | undefined) =>
          old ? { ...old, likes: old.likes + 1, liked: true } : old,
      )

      // Retourne le contexte pour onError
      return { previousPost }
    },

    onError: (err, variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousPost) {
        queryClient.setQueryData(
          ['posts', 'detail', post.id],
          context.previousPost,
        )
      }
      toast.error('Erreur lors du like')
    },

    onSettled: () => {
      // Refetch pour synchroniser
      queryClient.invalidateQueries({
        queryKey: ['posts', 'detail', post.id],
      })
    },
  })

  return (
    <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {post.liked ? '❤️' : '🤍'} {post.likes}
    </button>
  )
}
```

---

## 7. Gestion des Erreurs Django

### Error Boundary + Query

```typescript
// components/QueryErrorBoundary.tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <DjangoErrorDisplay
              error={error}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Affichage spécifique aux erreurs Django
function DjangoErrorDisplay({
  error,
  onRetry,
}: {
  error: any
  onRetry: () => void
}) {
  // Erreur API Django
  if (error instanceof DjangoAPIError) {
    switch (error.status) {
      case 401:
        return (
          <div>
            <p>Session expirée</p>
            <Link to="/login">Se reconnecter</Link>
          </div>
        )
      case 403:
        return (
          <div>
            <p>Accès interdit</p>
            {error.data?.detail && <p>{error.data.detail}</p>}
          </div>
        )
      case 404:
        return <p>Ressource non trouvée</p>
      case 400:
        return (
          <div>
            <p>Données invalides</p>
            {error.data && (
              <ul>
                {Object.entries(error.data).map(([field, errors]) => (
                  <li key={field}>
                    {field}: {Array.isArray(errors) ? errors.join(', ') : errors}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      default:
        return (
          <div>
            <p>Erreur serveur ({error.status})</p>
            <button onClick={onRetry}>Réessayer</button>
          </div>
        )
    }
  }

  // Erreur réseau
  if (error instanceof TypeError && error.message === 'fetch failed') {
    return (
      <div>
        <p>Impossible de contacter le serveur</p>
        <button onClick={onRetry}>Réessayer</button>
      </div>
    )
  }

  // Erreur inconnue
  return (
    <div>
      <p>Une erreur est survenue</p>
      <button onClick={onRetry}>Réessayer</button>
    </div>
  )
}
```

---

## 8. CSRF Token (Django)

### Configuration Django

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_HTTPONLY = False  # Nécessaire pour que JS lise le token
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
]
```

### Récupération du CSRF Token côté client

```typescript
// utils/csrf.client.ts
// Uniquement côté client — le serveur forward via apiFetch

export function getCsrfToken(): string {
  if (typeof document === 'undefined') return ''

  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match ? match[1] : ''
}

// Fetch client avec CSRF
export async function clientFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    options.method || 'GET',
  )

  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'include', // 🔑 Envoie les cookies
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(isMutation ? { 'X-CSRFToken': getCsrfToken() } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}
```

### Alternative : Server-Only (pas de CSRF côté client)

Si toutes les mutations passent par `createServerFn` (recommandé), le CSRF est géré automatiquement par `apiFetch` côté serveur. Le client n'a jamais besoin de connaître le CSRF token.

```
Browser                    TanStack Start              Django
  │                              │                        │
  │── POST /posts (serverFn) ───►│                        │
  │                              │── POST /api/posts ─────►│
  │                              │   Cookie: sessionid=xxx │
  │                              │   X-CSRFToken=xxx       │
  │                              │◄── 201 Created ─────────┤
  │◄── { post } ─────────────────│                        │
```

---

## 9. Exemple Complet — CRUD

### Structure des fichiers

```
src/
├── utils/
│   ├── api.server.ts        # apiFetch + helpers
│   ├── query-client.ts      # QueryClient config
│   └── posts/
│       ├── posts.functions.ts   # Server functions
│       └── posts.keys.ts        # Query keys centralisés
├── routes/
│   ├── __root.tsx
│   └── posts/
│       ├── route.tsx        # Layout
│       ├── index.tsx        # Liste (SSR + Query)
│       ├── new.tsx          # Création (Mutation)
│       └── $postId/
│           ├── index.tsx    # Détail (Query)
│           └── edit.tsx     # Modification (Mutation)
└── components/
    └── posts/
        ├── PostList.tsx
        ├── PostForm.tsx
        └── PostCard.tsx
```

### Query Keys Centralisés

```typescript
// utils/posts/posts.keys.ts
export const postsKeys = {
  all: ['posts'] as const,
  lists: () => [...postsKeys.all, 'list'] as const,
  list: (filters: { search?: string; page?: number }) =>
    [...postsKeys.lists(), filters] as const,
  details: () => [...postsKeys.all, 'detail'] as const,
  detail: (id: string) => [...postsKeys.details(), id] as const,
}
```

### Server Functions

```typescript
// utils/posts/posts.functions.ts
import { createServerFn } from '@tanstack/react-start'
import { apiGet, apiPost, apiPut, apiDelete } from '../api.server'
import type { Post, CreatePostInput, UpdatePostInput } from './posts.types'

export const getPosts = createServerFn({ method: 'GET' })
  .inputValidator((data: { search?: string; page?: number } = {}) => data)
  .handler(async ({ data }) => {
    return apiGet<Post[]>('/posts/', {
      page: String(data.page || 1),
      search: data.search || '',
    })
  })

export const getPost = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiGet<Post>(`/posts/${data.id}/`)
  })

export const createPost = createServerFn({ method: 'POST' })
  .inputValidator((data: CreatePostInput) => data)
  .handler(async ({ data }) => {
    return apiPost<Post>('/posts/', data)
  })

export const updatePost = createServerFn({ method: 'PUT' })
  .inputValidator((data: UpdatePostInput) => data)
  .handler(async ({ data }) => {
    const { id, ...body } = data
    return apiPut<Post>(`/posts/${id}/`, body)
  })

export const deletePost = createServerFn({ method: 'DELETE' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return apiDelete<void>(`/posts/${data.id}/`)
  })
```

### Route Liste (SSR + Query)

```typescript
// routes/posts/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from '~/utils/posts/posts.functions'
import { postsKeys } from '~/utils/posts/posts.keys'
import { PostList } from '~/components/posts/PostList'

export const Route = createFileRoute('/posts/')({
  validateSearch: (search: Record<string, unknown>) => ({
    search: (search.search as string) || '',
    page: Number(search.page) || 1,
  }),

  loader: async ({ context, deps }) => {
    const { queryClient } = context

    await queryClient.prefetchQuery({
      queryKey: postsKeys.list({ search: deps.search, page: deps.page }),
      queryFn: () => getPosts({ data: { search: deps.search, page: deps.page } }),
    })
  },

  component: PostsPage,
})

function PostsPage() {
  const { search, page } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: postsKeys.list({ search, page }),
    queryFn: () => getPosts({ data: { search, page } }),
  })

  return (
    <div>
      <input
        value={search}
        onChange={(e) =>
          navigate({ search: { search: e.target.value, page: 1 } })
        }
        placeholder="Rechercher..."
      />

      {isLoading ? <Skeleton /> : <PostList posts={data || []} />}

      <Pagination
        page={page}
        onChange={(p) => navigate({ search: { search, page: p } })}
      />
    </div>
  )
}
```

### Route Création (Mutation)

```typescript
// routes/posts/new.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '~/utils/posts/posts.functions'
import { postsKeys } from '~/utils/posts/posts.keys'

export const Route = createFileRoute('/posts/new')({
  component: NewPostPage,
})

function NewPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
      navigate({ to: '/posts/$postId', params: { postId: newPost.id } })
    },
  })

  return (
    <PostForm
      onSubmit={(data) => mutation.mutate({ data })}
      isSubmitting={mutation.isPending}
      error={mutation.error}
    />
  )
}
```

### Route Édition (Mutation + Query)

```typescript
// routes/posts/$postId/edit.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPost, updatePost } from '~/utils/posts/posts.functions'
import { postsKeys } from '~/utils/posts/posts.keys'

export const Route = createFileRoute('/posts/$postId/edit')({
  loader: async ({ context, params }) => {
    const { queryClient } = context

    await queryClient.prefetchQuery({
      queryKey: postsKeys.detail(params.postId),
      queryFn: () => getPost({ data: { id: params.postId } }),
    })
  },
  component: EditPostPage,
})

function EditPostPage() {
  const { postId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: post } = useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => getPost({ data: { id: postId } }),
  })

  const mutation = useMutation({
    mutationFn: (data: UpdatePostInput) =>
      updatePost({ data: { ...data, id: postId } }),
    onSuccess: (updatedPost) => {
      // Update le cache directement
      queryClient.setQueryData(
        postsKeys.detail(postId),
        updatedPost,
      )
      // Invalide les listes
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })

      navigate({ to: '/posts/$postId', params: { postId } })
    },
  })

  if (!post) return <NotFound />

  return (
    <PostForm
      initialData={post}
      onSubmit={(data) => mutation.mutate(data)}
      isSubmitting={mutation.isPending}
      error={mutation.error}
    />
  )
}
```

---

## 10. Récapitulatif des Patterns

| Pattern                      | Quand l'utiliser            | Code                                                             |
| ---------------------------- | --------------------------- | ---------------------------------------------------------------- |
| **Prefetch in loader**       | SSR initial                 | `queryClient.prefetchQuery({ queryKey, queryFn })` dans `loader` |
| **useQuery in component**    | Lecture de données          | `useQuery({ queryKey, queryFn })`                                |
| **useMutation + invalidate** | Création/Suppression        | `useMutation({ onSuccess: () => invalidateQueries() })`          |
| **Optimistic update**        | Like, toggle rapide         | `onMutate: setQueryData + onError: rollback`                     |
| **Query key dépendante**     | Filtres, pagination         | `queryKey: ['posts', { search, page }]`                          |
| **Enabled query**            | Query conditionnelle        | `enabled: !!userId`                                              |
| **apiFetch server**          | Toutes les requêtes backend | Forward `Cookie` header automatiquement                          |

### Checklist Django + TanStack Query

- [ ] `apiFetch` forward le `Cookie` header dans chaque server function
- [ ] `QueryClient` configuré avec `staleTime` et `retry` intelligent
- [ ] `loader` fait `prefetchQuery` pour le SSR
- [ ] `useQuery` utilise la même `queryKey` que le `prefetchQuery`
- [ ] Mutations invalident les queries concernées
- [ ] CSRF token forwardé pour les mutations (`X-CSRFToken`)
- [ ] Erreurs 401/403 gérées (redirection login / message)
- [ ] `credentials: 'include'` sur les fetch côté client (si pas serverFn)

---

_Document généré le 17 avril 2026 — TanStack Start v1.167+ avec Django REST Framework_
