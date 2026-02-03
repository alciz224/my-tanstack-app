# Cross-Tab Auth Sync - Testing Guide

## What Was Implemented

Cross-tab authentication synchronization allows tabs to communicate auth state changes (login/logout) so that:
- ✅ Logout in one tab forces other tabs on protected routes to redirect to `/login`
- ✅ Public routes (like `/`, `/login`) remain unaffected
- ✅ Login in one tab invalidates auth state in other tabs (optional refresh behavior)

## Architecture

### 1. Event Transport (`src/auth/authEvents.ts`)
- Uses `BroadcastChannel` (modern browsers) for fast cross-tab messaging
- Falls back to `localStorage` + `storage` event for older browsers
- Exports:
  - `emitAuthEvent(type)` - Send event to other tabs
  - `subscribeAuthEvents(callback)` - Listen for events

### 2. Event Emitters
- **Login** (`src/routes/login.tsx`): emits `'login'` after successful auth
- **Logout** (`src/routes/logout.tsx`): emits `'logout'` after successful logout

### 3. Global Listener (`src/routes/__root.tsx`)
- Subscribes to auth events in `RootDocument` component
- On `logout` event:
  - Invalidates router state (forces `beforeLoad` to re-run)
  - Redirects to `/login` **only if** current route is protected
- On `login` event:
  - Invalidates router state (optional: allows tabs to refresh user data)

### 4. Protected Route Detection (`src/auth/protectedRoutes.ts`)
- `isProtectedPath(pathname)` determines if a route requires auth
- Protected paths: `/dashboard`, `/admin`
- Public paths: `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`

---

## Manual Testing Steps

### Test 1: Logout from one tab redirects other authed tabs

1. **Open two browser tabs** (same window or different windows)
2. **Login** in tab A (if not already logged in)
3. **Navigate both tabs to `/dashboard`** (protected route)
4. **In tab A, click "Logout"**
5. **Expected result:**
   - ✅ Tab A: redirects to `/login` immediately
   - ✅ Tab B: receives logout event → invalidates auth → redirects to `/login`
   - ✅ Both tabs now show the login page

### Test 2: Logout from one tab does NOT redirect public tabs

1. **Open three tabs:**
   - Tab A: `/dashboard` (protected, logged in)
   - Tab B: `/` (public homepage)
   - Tab C: `/login` (public)
2. **In tab A, click "Logout"**
3. **Expected result:**
   - ✅ Tab A: redirects to `/login`
   - ✅ Tab B: remains on `/` (no redirect, but auth state invalidated)
   - ✅ Tab C: remains on `/login` (no change)

### Test 3: Login from one tab refreshes other tabs (optional)

1. **Open two tabs, both logged out:**
   - Tab A: `/login`
   - Tab B: `/` (public)
2. **In tab A, login successfully**
3. **Expected result:**
   - ✅ Tab A: redirects to `/dashboard`
   - ✅ Tab B: remains on `/`, but auth state is invalidated/refreshed
   - If tab B navigates to `/dashboard` manually, it should not redirect to login

### Test 4: Multiple tabs on different protected routes

1. **Open three tabs, all logged in:**
   - Tab A: `/dashboard`
   - Tab B: `/admin`
   - Tab C: `/` (public)
2. **In tab C, navigate to `/logout` or logout via any mechanism**
3. **Expected result:**
   - ✅ Tab A: redirects to `/login`
   - ✅ Tab B: redirects to `/login`
   - ✅ Tab C: shows logout success, then redirects to `/login`

### Test 5: Works across different browser windows

1. **Open one browser window at `/dashboard` (logged in)**
2. **Open a second browser window** (same browser, different window) at `/dashboard`
3. **In window 1, logout**
4. **Expected result:**
   - ✅ Window 2 also redirects to `/login`

---

## Browser Compatibility

| Feature | Browser Support | Fallback |
|---------|----------------|----------|
| BroadcastChannel | Chrome 54+, Firefox 38+, Safari 15.4+ | localStorage events |
| localStorage events | All modern browsers | N/A (universal) |

**Older browsers (IE11, Safari < 15.4):** use localStorage fallback automatically.

---

## Common Issues & Troubleshooting

### Issue: Other tabs don't redirect after logout
**Cause:** BroadcastChannel not initialized or event not emitted.

**Debug:**
1. Open browser console in tab B (the one that should receive the event)
2. Check for errors related to `BroadcastChannel` or `localStorage`
3. Manually test event emission:
   ```js
   import { emitAuthEvent } from './src/auth/authEvents'
   emitAuthEvent('logout')
   ```

### Issue: Public tabs redirect to login after logout
**Cause:** `isProtectedPath` incorrectly identifies a public route as protected.

**Fix:** Update `src/auth/protectedRoutes.ts` to include the public route in the exclusion list.

### Issue: Tabs redirect but immediately navigate back
**Cause:** Router invalidation + redirect may cause race condition if auth state isn't cleared properly.

**Fix:** Ensure Django `/api/v2/auth/status/` returns 401 after logout (cookie cleared).

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/auth/authEvents.ts` | Cross-tab event transport (BroadcastChannel + localStorage) |
| `src/auth/protectedRoutes.ts` | Determine if a path requires authentication |
| `src/routes/__root.tsx` | Global listener for auth events |
| `src/routes/login.tsx` | Emits `login` event after successful auth |
| `src/routes/logout.tsx` | Emits `logout` event after successful logout |

---

## Production Considerations

1. **Event Deduplication:** Events are idempotent (logout when already logged out has no effect)
2. **Race Conditions:** Router invalidation + navigation happens asynchronously; the redirect should still settle correctly
3. **Security:** Events are client-side only; backend auth validation is still required (Django sessions)
4. **Performance:** BroadcastChannel is lightweight; localStorage fallback adds minimal overhead

---

## Future Enhancements (Optional)

- Add toast notifications: "You were logged out in another tab"
- Track which tab initiated the logout (for analytics)
- Support session expiry detection (periodic polling + logout event)
- Add "stay logged in on this device" option that disables cross-tab logout

---

## Summary

✅ **Implemented:** Cross-tab logout sync with conditional redirect  
✅ **Protected routes:** `/dashboard`, `/admin`  
✅ **Public routes:** `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`  
✅ **Browser support:** Modern browsers (BroadcastChannel) + legacy fallback (localStorage)  

Test manually using the steps above to verify behavior in your environment.
