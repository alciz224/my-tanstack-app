# Cross-Tab Auth Sync & Security - Testing Guide

## What Was Implemented

Comprehensive authentication security and cross-tab synchronization:
- ✅ **Cross-tab logout:** Logout in one tab forces other tabs on protected routes to redirect to `/login`
- ✅ **Cross-tab login:** Login in one tab redirects other tabs away from `/login` page
- ✅ **Auth-protected login:** Authenticated users cannot access `/login` (auto-redirect to dashboard)
- ✅ **Safe redirects:** Prevents open-redirect attacks via sanitized `from` parameter
- ✅ **Session revalidation:** Auto-revalidates auth on tab focus/visibility change
- ✅ **Route-based protection:** Dynamic detection of protected routes (no hard-coded path lists)

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

### 4. Protected Route Detection (`src/auth/routeProtection.ts`)
- `isCurrentRouteProtected(router)` - Dynamic detection based on route tree (checks for `/_authed` layout)
- `isProtectedPath(pathname)` - Fallback path-based check
- Protected paths: Any route under `/_authed` layout (e.g., `/dashboard`, `/admin`)
- Public paths: `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`

### 5. Safe Redirect Utilities (`src/auth/redirects.ts`)
- `safeRedirectPath(path, fallback)` - Sanitizes redirect paths to prevent open-redirect attacks
  - Only allows internal paths starting with `/`
  - Rejects external URLs, protocol-relative URLs (`//evil.com`), and JavaScript schemes
- `buildFromParameter(location)` - Builds safe internal path from location (not full href)

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

### Test 3: Login from one tab redirects other tabs away from /login

1. **Open two tabs, both logged out:**
   - Tab A: `/login`
   - Tab B: `/login`
2. **In tab A, login successfully**
3. **Expected result:**
   - ✅ Tab A: redirects to `/dashboard`
   - ✅ Tab B: receives login event → invalidates auth → auto-redirects to `/dashboard`
   - ✅ Both tabs now show the dashboard

### Test 3b: Login redirect with "from" parameter

1. **Attempt to access `/admin` while logged out** (should redirect to `/login?from=/admin`)
2. **In tab A, complete the login**
3. **Expected result:**
   - ✅ Tab A: redirects back to `/admin` (the original destination)
   - ✅ URL is clean (no `from` parameter remaining)

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

### Test 6: Authenticated users cannot access /login

1. **Login successfully and navigate to `/dashboard`**
2. **Manually type `/login` in the URL bar**
3. **Expected result:**
   - ✅ Immediately redirected to `/dashboard` (cannot view login page when authenticated)

### Test 7: Session revalidation on tab focus

1. **Login and navigate to `/dashboard`**
2. **Minimize the browser or switch to another app for 30+ seconds**
3. **In another tab or via API, invalidate the session (logout)**
4. **Return to the original tab (focus/visibility change)**
5. **Expected result:**
   - ✅ Tab detects session is invalid and redirects to `/login`

### Test 8: Open redirect prevention

1. **Attempt to access:** `/login?from=https://evil.com`
2. **Login successfully**
3. **Expected result:**
   - ✅ Redirects to `/dashboard` (NOT to `https://evil.com`)
   - ✅ Malicious redirect is blocked

4. **Attempt to access:** `/login?from=//evil.com/steal-cookies`
5. **Login successfully**
6. **Expected result:**
   - ✅ Redirects to `/dashboard` (protocol-relative URL blocked)

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
**Cause:** `isCurrentRouteProtected` incorrectly identifies a public route as protected.

**Fix:** Verify the route is not under `/_authed` layout, or update `src/auth/routeProtection.ts` to include the public route in the exclusion list.

### Issue: Tabs redirect but immediately navigate back
**Cause:** Router invalidation + redirect may cause race condition if auth state isn't cleared properly.

**Fix:** Ensure Django `/api/v2/auth/status/` returns 401 after logout (cookie cleared).

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/auth/authEvents.ts` | Cross-tab event transport (BroadcastChannel + localStorage) |
| `src/auth/routeProtection.ts` | Dynamic route protection detection (route-tree based) |
| `src/auth/redirects.ts` | Safe redirect utilities (open-redirect prevention) |
| `src/routes/__root.tsx` | Global listener for auth events + session revalidation |
| `src/routes/login.tsx` | Login page with auth guard + safe redirects |
| `src/routes/logout.tsx` | Logout handler (emits logout event) |
| `src/routes/_authed.tsx` | Protected route layout with beforeLoad guard |

---

## Production Considerations

1. **Event Deduplication:** Events are idempotent (logout when already logged out has no effect)
2. **Race Conditions:** Router invalidation + navigation happens asynchronously; the redirect should still settle correctly
3. **Security:** 
   - Events are client-side only; backend auth validation is still required (Django sessions)
   - All redirects are sanitized to prevent open-redirect attacks
   - Session revalidation happens on tab focus to detect stale sessions
4. **Performance:** BroadcastChannel is lightweight; localStorage fallback adds minimal overhead
5. **SSR Compatibility:** Auth checks use server functions (`getCurrentUserFn`) that work in SSR context

---

## Security Features Implemented

### ✅ Open Redirect Prevention
- All redirect paths are sanitized via `safeRedirectPath()`
- Only internal paths (`/...`) are allowed
- External URLs, protocol-relative URLs, and JavaScript schemes are blocked

### ✅ Auth-Protected Login Page
- Authenticated users cannot access `/login`
- Automatically redirected to dashboard or original destination

### ✅ Session Revalidation
- Auth state revalidated on tab focus and visibility change
- Prevents stale sessions from remaining active after logout elsewhere

### ✅ Safe Post-Login Redirects
- Uses internal path only (not full href)
- Respects `from` parameter for UX (return to original destination)
- Falls back to `/dashboard` if redirect is unsafe

## Future Enhancements (Optional)

- Add toast notifications: \"You were logged out in another tab\"
- Track which tab initiated the logout (for analytics)
- Add \"stay logged in on this device\" option that disables cross-tab logout
- Global 401 interceptor to auto-logout on session expiry

---

## Summary

✅ **Cross-tab sync:** Login/logout events propagate across all tabs  
✅ **Auth-protected login:** Cannot access `/login` when authenticated  
✅ **Open redirect prevention:** All redirects are sanitized  
✅ **Session revalidation:** Auto-revalidates on tab focus/visibility  
✅ **Dynamic route protection:** Based on route tree (no hard-coded lists)  
✅ **Protected routes:** Any route under `/_authed` layout  
✅ **Public routes:** `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`  
✅ **Browser support:** Modern browsers (BroadcastChannel) + legacy fallback (localStorage)  

Test manually using the steps above to verify behavior in your environment.
