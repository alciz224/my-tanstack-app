# Skill: TanStack Start — React Query Integration

> Prefetch/hydration patterns, query/mutation best practices, cache invalidation strategies, and optimistic updates for TanStack Start.

---

## 1. The Core Pattern: Prefetch in Loader, Consume in Component

```typescript
// ═══ ROUTE (SSR) ═══
export const Route = createFileRoute('/posts')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: () => getPosts(),  // Server: forwards cookies
    })
  },
  component: PostsPage,
})

// ═══ COMPONENT (Client) ═══
function PostsPage() {
  const { data } = useQuery({
    queryKey: ['posts'],      // Same key = cache hit
    queryFn: () => getPosts(), // Client: uses dehydrated cache
  })
}
```

### How It Works

| Phase | What happens | Cookies forwarded? |
|-------|-------------|-------------------|
| SSR `loader` | `prefetchQuery` → server function → fetch to backend | ✅ Yes (via apiFetch) |
| HTML render | React Query has data → HTML includes content | N/A |
| Hydration | React Query finds dehydrated cache → no refetch | N/A |
| SPA navigation | `useQuery` checks cache → staleTime OK → no refetch | ❌ No (cache hit) |
| After staleTime | `useQuery` background refetch | ✅ Yes (if refetch) |

---

## 2. QueryClient Configuration

### Isomorphic QueryClient (SSR + Client)

```typescript
// utils/query-client.ts
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,        // 1 minute default
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Don't retry auth errors
          if (error?.status === 401 || error?.status === 403) return false
          return failureCount < 2
        },
      },
      dehydrate: {
        // Only dehydrate successful queries
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) && 
          query.state.status === 'success',
      },
    },
  })
}

// Singleton for browser
let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient()  // Server: always new
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient  // Client: singleton
}
```

### Router Integration

```typescript
// router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
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
  })
}
```

### App Component

```typescript
// app.tsx
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

## 3. Query Keys (Centralized)

### Key Factory Pattern

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

// Usage:
postsKeys.all           // ['posts']
postsKeys.lists()       // ['posts', 'list']
postsKeys.list({ page: 1 })  // ['posts', 'list', { page: 1 }]
postsKeys.detail('123') // ['posts', 'detail', '123']
```

---

## 4. Queries (Reading Data)

### SSR Route with Prefetch

```typescript
// routes/posts/index.tsx
import { postsKeys } from '~/utils/posts/posts.keys'
import { getPosts } from '~/utils/posts/posts.functions'
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: postsKeys.list({ search, page }),
    queryFn: () => getPosts({ data: { search, page } }),
  })

  return (
    <div>
      <SearchInput value={search} onChange={handleSearch} />
      {isFetching && <RefreshIndicator />}
      {isLoading ? <Skeleton /> : <PostList posts={data || []} />}
      <Pagination page={page} onChange={handlePageChange} />
    </div>
  )
}
```

### Detail Route with Params

```typescript
// routes/posts/$postId.tsx
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ context, params }) => {
    const { queryClient } = context
    
    await queryClient.prefetchQuery({
      queryKey: postsKeys.detail(params.postId),
      queryFn: () => getPost({ data: { id: params.postId } }),
    })
  },
  component: PostDetailPage,
})

function PostDetailPage() {
  const { postId } = Route.useParams()

  const { data: post, isLoading } = useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => getPost({ data: { id: postId } }),
  })

  if (isLoading) return <Skeleton />
  if (!post) return <NotFound />
  
  return <PostContent post={post} />
}
```

### Dependent Query (enabled)

```typescript
function UserPosts({ userId }: { userId: string | null }) {
  const { data: posts } = useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getUserPosts({ data: { userId: userId! } }),
    enabled: !!userId,  // Only runs when userId is defined
  })

  return posts?.map(post => <PostCard key={post.id} post={post} />)
}
```

---

## 5. Mutations (Writing Data)

### Basic Mutation + Invalidation

```typescript
// components/posts/CreatePostForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '~/utils/posts/posts.functions'
import { postsKeys } from '~/utils/posts/posts.keys'

export function CreatePostForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (data: CreatePostInput) => createPost({ data }),
    
    onSuccess: (newPost) => {
      // Invalidate the list → triggers refetch
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
      
      // Optionally add to cache directly
      queryClient.setQueryData(
        postsKeys.lists(),
        (old: Post[] = []) => [newPost, ...old]
      )
      
      navigate({ to: '/posts/$postId', params: { postId: newPost.id } })
    },
    
    onError: (error: APIError) => {
      if (error.status === 401) toast.error('Please log in')
      else if (error.status === 403) toast.error('Permission denied')
      else toast.error(error.message)
    },
  })

  const handleSubmit = (data: CreatePostInput) => {
    mutation.mutate(data)
  }

  return (
    <PostForm 
      onSubmit={handleSubmit} 
      isSubmitting={mutation.isPending}
      error={mutation.error}
    />
  )
}
```

### Optimistic Updates (Like, Toggle)

```typescript
// components/posts/LikeButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost } from '~/utils/posts/posts.functions'

export function LikeButton({ post }: { post: Post }) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => likePost({ data: { id: post.id } }),
    
    // 1. Optimistically update UI
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: postsKeys.detail(post.id),
      })
      
      const previousPost = queryClient.getQueryData<Post>(
        postsKeys.detail(post.id)
      )
      
      queryClient.setQueryData(
        postsKeys.detail(post.id),
        (old: Post | undefined) =>
          old ? { ...old, likes: old.likes + 1, liked: true } : old
      )
      
      return { previousPost }  // Context for rollback
    },
    
    // 2. Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(
          postsKeys.detail(post.id),
          context.previousPost
        )
      }
      toast.error('Failed to like')
    },
    
    // 3. Refetch to sync
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postsKeys.detail(post.id),
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

### Update Mutation with Cache Direct Update

```typescript
// routes/posts/$postId/edit.tsx
function EditPostPage() {
  const { postId } = Route.useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: post } = useQuery({
    queryKey: postsKeys.detail(postId),
    queryFn: () => getPost({ data: { id: postId } }),
  })

  const mutation = useMutation({
    mutationFn: (data: UpdatePostInput) =>
      updatePost({ data: { ...data, id: postId } }),
    
    onSuccess: (updatedPost) => {
      // Direct cache update (no refetch needed)
      queryClient.setQueryData(
        postsKeys.detail(postId),
        updatedPost
      )
      // Invalidate lists (they need the updated title, etc.)
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
      
      navigate({ to: '/posts/$postId', params: { postId } })
    },
  })

  return post ? (
    <PostForm
      initialData={post}
      onSubmit={mutation.mutate}
      isSubmitting={mutation.isPending}
    />
  ) : <NotFound />
}
```

### Delete Mutation with List Cache Update

```typescript
const deleteMutation = useMutation({
  mutationFn: (id: string) => deletePost({ data: { id } }),
  
  onSuccess: (_, deletedId) => {
    // Remove from list cache directly
    queryClient.setQueryData(
      postsKeys.lists(),
      (old: Post[] = []) => old.filter(p => p.id !== deletedId)
    )
    // Remove from detail cache
    queryClient.removeQueries({ queryKey: postsKeys.detail(deletedId) })
    
    navigate({ to: '/posts' })
  },
})
```

---

## 6. Query Invalidation Strategies

### Strategy Matrix

| Action | Strategy | Code |
|--------|----------|------|
| Create item | Invalidate list + optimistic append | `invalidateQueries({ queryKey: lists() })` + `setQueryData` |
| Update item | Direct cache update + invalidate lists | `setQueryData(detailKey, data)` + `invalidateQueries(lists())` |
| Delete item | Filter from cache + remove detail | `setQueryData(lists(), filter)` + `removeQueries(detailKey)` |
| Like/toggle | Optimistic update | `onMutate: setQueryData`, `onError: rollback` |
| Bulk operation | Broad invalidation | `invalidateQueries({ queryKey: ['posts'] })` |

### Invalidation Helpers

```typescript
// utils/query-utils.ts
export function invalidatePostQueries(queryClient: QueryClient, postId?: string) {
  // Always invalidate lists
  queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
  
  // Invalidate specific post if provided
  if (postId) {
    queryClient.invalidateQueries({
      queryKey: postsKeys.detail(postId),
    })
  }
  
  // Invalidate related data
  queryClient.invalidateQueries({ queryKey: ['stats'] })
}

// Usage in mutation
const mutation = useMutation({
  mutationFn: updatePost,
  onSuccess: (data) => {
    invalidatePostQueries(queryClient, data.id)
  },
})
```

---

## 7. Error Handling with Query

### Error Boundary

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
            <div>
              <p>Error: {error.message}</p>
              <button onClick={resetErrorBoundary}>Retry</button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

### Query Error Handling

```typescript
function PostsPage() {
  const { data, error, isError } = useQuery({
    queryKey: postsKeys.lists(),
    queryFn: () => getPosts(),
  })

  if (isError) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 401: return <LoginRedirect />
        case 403: return <ForbiddenMessage />
        case 404: return <NotFound />
        default: return <ErrorDisplay error={error} />
      }
    }
    return <NetworkError />
  }

  return <PostList posts={data || []} />
}
```

---

## Key Principles

1. **Prefetch in loader, consume in component** — Same query key = seamless SSR-to-client
2. **Centralized query keys** — Factory pattern for consistency
3. **Invalidate after mutation** — Keep cache in sync with server
4. **Optimistic updates for fast UI** — Like, toggle, star operations
5. **Direct cache updates for edits** — No unnecessary refetch
6. **Remove queries on delete** — Clean up deleted item's detail cache
7. **staleTime > 0** — Avoid excessive refetches
8. **Don't retry 401/403** — Auth errors need user action
9. **Cancel queries on mutate** — Prevent race conditions in optimistic updates
10. **Error boundaries for queries** — Graceful error handling with retry