# TanStack Start Cookie Helpers & Server Functions - Research Deliverables

**Date:** January 2025  
**Requested By:** User  
**Completed By:** TanStack Router & Server Functions Expert Agent

---

## 📋 Summary

Completed comprehensive research on TanStack Start built-in cookie helpers and server function patterns for calling external APIs (Django) with cookie forwarding and CSRF handling.

### Key Finding

**TanStack Start v1.157.16 does NOT provide built-in `getCookie`/`setCookie`/`deleteCookie` helpers.** Manual cookie forwarding is required when calling external APIs from server functions.

### Architecture Assessment

**✅ Current authentication implementation is CORRECT and should NOT be changed.**

The split between server functions (data fetching) and client functions (auth mutations) is architecturally necessary due to Django's httpOnly session cookie implementation.

---

## 📦 Deliverables

### 1. Documentation (4 files)

#### `docs/SERVER_FUNCTIONS_GUIDE.md` (Comprehensive - 500+ lines)

Complete implementation guide with:

- Cookie architecture explanation
- When to use server functions vs client functions
- Cookie forwarding patterns
- Server function patterns (GET, POST, PATCH, DELETE)
- Migration guide from client to server functions
- Helper function documentation
- Best practices
- Common pitfalls
- Testing strategies

#### `docs/COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md` (Deep-dive - 600+ lines)

Architecture analysis and reference with:

- TanStack Start cookie API research findings
- Why auth mutations MUST be client-side (visual diagrams)
- Current implementation analysis
- Recommended patterns
- Helper function documentation
- Migration examples
- Testing guidelines
- Summary and action items

#### `docs/TANSTACK_START_COOKIE_RESEARCH_SUMMARY.md` (Executive summary - 500+ lines)

Research findings and recommendations:

- Executive summary
- TanStack Start cookie API research
- Critical architecture decision explanation
- Pattern matrix and templates
- Migration checklist
- Testing guidelines
- Current architecture assessment
- Key takeaways
- Further reading

#### `docs/QUICK_REFERENCE_SERVER_FUNCTIONS.md` (Quick reference)

One-page cheat sheet with:

- When to use server vs client functions
- Cookie forwarding pattern
- CSRF token pattern
- Generic mutation factory usage
- File organization
- Quick tests
- Common pitfalls
- Decision tree

### 2. Helper Functions (3 files)

#### `src/server/csrf.ts`

Server-side CSRF token fetching with cookie forwarding:

```typescript
export async function getCsrfTokenServerSide(ctx: any): Promise<string>
```

**Features:**

- Extracts cookies from server function context
- Forwards to Django `/api/v2/auth/csrf/` endpoint
- Returns CSRF token for mutations
- Proper error handling

#### `src/server/mutation-helper.ts`

Generic mutation server function factory:

```typescript
export function createMutationFn<TInput, TOutput>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE',
): ServerFunction<MutationResult<TOutput>>

export function createParameterizedMutationFn<TInput, TOutput>(
  getEndpoint: (params: TInput) => string,
  method: 'POST' | 'PATCH' | 'DELETE',
): ServerFunction<MutationResult<TOutput>>
```

**Features:**

- Automatic cookie forwarding
- Automatic CSRF token handling
- Type-safe input validation
- Consistent error handling
- Parameterized endpoint support

#### `src/server/api/academic-mutations.ts`

Example server function mutations for academic years:

```typescript
export const createAcademicYearFn
export const updateAcademicYearFn
export const deleteAcademicYearFn
export const activateAcademicYearFn
export const archiveAcademicYearFn
export const setCurrentAcademicYearFn
```

**Features:**

- Real-world examples using helper functions
- Type-safe implementations
- Ready to use in routes/components
- Template for migrating other CRUD operations

---

## 🔍 Research Findings

### TanStack Start Cookie API

**Searched for:**

- Built-in `getCookie()`, `setCookie()`, `deleteCookie()` functions
- Cookie management utilities
- Official patterns for external API cookie forwarding

**Found:**

- ❌ No built-in cookie helpers
- ✅ Request context access: `ctx.request.headers.get('cookie')`
- ✅ Manual forwarding pattern (documented in examples)
- ✅ Framework expects developer implementation

**Conclusion:**
Manual cookie forwarding is the recommended approach. The existing `getCookieHeader()` helper in `src/lib/api-client.ts` is the correct implementation.

### Django Session Cookie Architecture

**Problem:**
Django uses httpOnly session cookies that:

- Cannot be read by JavaScript
- Cannot be set by JavaScript
- Must be set by browser receiving `Set-Cookie` header from Django

**Implication:**
Auth mutations (login/logout/register) **MUST run in browser** to allow Django to set cookies directly to the browser. Server functions cannot proxy this correctly.

**Visual:**

```
Server Function Auth (❌ Broken):
Browser → Node.js Server → Django → Set-Cookie → Node.js Server (❌ cookie stuck here)

Client Function Auth (✅ Correct):
Browser → Vite Proxy → Django → Set-Cookie → Browser (✅ cookie stored)
```

---

## ✅ Recommendations

### 1. Keep Current Auth Architecture (Critical)

**Do NOT change:**

- ✅ `loginFn` - client function
- ✅ `logoutFn` - client function
- ✅ `registerFn` - client function
- ✅ `selectRoleFn` - client function
- ✅ `getCurrentUserFn` - server function

**Reason:** This architecture is correct for httpOnly cookie management.

### 2. Optional: Migrate Non-Auth Mutations

**Can migrate to server functions:**

- Academic year CRUD operations (`src/lib/api-mutations.ts`)
- Any mutations that don't modify session state

**Benefits:**

- Type-safe input validation
- Works in SSR context (route actions)
- Unified pattern with data fetching
- Better security (code hidden from browser)

**Trade-offs:**

- More boilerplate (CSRF fetching, cookie forwarding)
- Slightly more complex

**Recommendation:** Optional. Use helper functions if you decide to migrate.

### 3. Use Provided Helper Functions

**For new mutations:**

- Use `createMutationFn<Input, Output>()` for simple endpoints
- Use `createParameterizedMutationFn<Input, Output>()` for parameterized endpoints
- Use `getCsrfTokenServerSide(ctx)` for manual implementations

**For new data fetching:**

- Use existing `getCookieHeader(ctx)` pattern
- Follow examples in `src/server/api/academic.ts`

---

## 📊 Current State vs Proposed State

### Current State (All ✅ Correct)

| Function             | Type             | Location                   | Status         |
| -------------------- | ---------------- | -------------------------- | -------------- |
| `getCurrentUserFn`   | Server Function  | `src/server/auth.ts`       | ✅ Correct     |
| `loginFn`            | Client Function  | `src/server/auth.ts`       | ✅ Correct     |
| `logoutFn`           | Client Function  | `src/server/auth.ts`       | ✅ Correct     |
| `registerFn`         | Client Function  | `src/server/auth.ts`       | ✅ Correct     |
| `selectRoleFn`       | Client Function  | `src/server/auth.ts`       | ✅ Correct     |
| `createAcademicYear` | Client Function  | `src/lib/api-mutations.ts` | 💡 Can migrate |
| `updateAcademicYear` | Client Function  | `src/lib/api-mutations.ts` | 💡 Can migrate |
| Other CRUD           | Client Functions | `src/lib/api-mutations.ts` | 💡 Can migrate |

### Proposed State (Optional Migration)

| Function               | Type             | Location                               | Change       |
| ---------------------- | ---------------- | -------------------------------------- | ------------ |
| Auth functions         | Client Functions | `src/server/auth.ts`                   | ⛔ No change |
| `createAcademicYearFn` | Server Function  | `src/server/api/academic-mutations.ts` | ✅ Created   |
| `updateAcademicYearFn` | Server Function  | `src/server/api/academic-mutations.ts` | ✅ Created   |
| Other CRUD mutations   | Server Functions | `src/server/api/*-mutations.ts`        | 💡 Optional  |

---

## 🧪 Testing Checklist

### Before Migration

- [ ] Current auth flow works (login → protected route → hard refresh → still logged in)
- [ ] SSR user fetching works (hard refresh shows user data immediately)
- [ ] Client mutations work (academic year CRUD)

### After Migration (if you migrate)

- [ ] Auth still works exactly the same
- [ ] SSR data fetching still works
- [ ] New server function mutations work from client
- [ ] New server function mutations work from route actions
- [ ] Hard refresh after mutation shows updated data (SSR)
- [ ] CSRF tokens are properly fetched
- [ ] Cookies are properly forwarded
- [ ] Error handling works correctly

---

## 📚 How to Use These Deliverables

### For Understanding

1. **Start with:** `docs/QUICK_REFERENCE_SERVER_FUNCTIONS.md`
   - Quick overview and decision tree
2. **Deep dive:** `docs/COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md`
   - Understand why auth is client-side
   - See visual flow diagrams
3. **Research details:** `docs/TANSTACK_START_COOKIE_RESEARCH_SUMMARY.md`
   - Full research findings
   - Architecture assessment

### For Implementation

1. **Read:** `docs/SERVER_FUNCTIONS_GUIDE.md`
   - Complete patterns and examples
   - Migration guide
   - Best practices

2. **Use helpers:**
   - Import `getCsrfTokenServerSide` from `@/server/csrf`
   - Import `createMutationFn` from `@/server/mutation-helper`
3. **Follow examples:**
   - Study `src/server/api/academic-mutations.ts`
   - Copy pattern for new modules

### For Quick Reference

- **Decision tree:** `docs/QUICK_REFERENCE_SERVER_FUNCTIONS.md`
- **Pattern templates:** Copy from any guide
- **File organization:** See quick reference

---

## 🎯 Action Items

### Immediate (Recommended)

- [ ] **Review documentation** - Read quick reference and summary
- [ ] **Understand architecture** - Review why auth is client-side
- [ ] **Test current implementation** - Verify everything works
- [ ] **Bookmark guides** - Keep references handy

### Short-term (Optional)

- [ ] **Try helper functions** - Test with one mutation
- [ ] **Migrate one module** - Use academic mutations as template
- [ ] **Update team documentation** - Share findings
- [ ] **Create coding standards** - Document which pattern to use when

### Long-term (Optional)

- [ ] **Migrate all non-auth mutations** - If benefits outweigh costs
- [ ] **Create more helpers** - For common patterns
- [ ] **Add unit tests** - For server functions
- [ ] **Monitor performance** - SSR vs client mutations

---

## 🤔 Questions Answered

### Q: Does TanStack Start have built-in cookie helpers?

**A:** No. Manual cookie forwarding using `ctx.request.headers.get('cookie')` is required.

### Q: Should we convert auth mutations to server functions?

**A:** **No.** Auth mutations MUST stay client-side due to httpOnly cookie limitations.

### Q: Should we convert non-auth mutations to server functions?

**A:** Optional. Benefits: type safety, SSR support. Trade-offs: more boilerplate. Helper functions reduce complexity.

### Q: Is the current implementation correct?

**A:** **Yes.** The split between server functions (data fetching) and client functions (auth) is architecturally correct.

### Q: How do we handle CSRF tokens in server functions?

**A:** Use the new `getCsrfTokenServerSide(ctx)` helper or the `createMutationFn()` factory (handles it automatically).

### Q: How do we forward cookies in server functions?

**A:** Use the existing `getCookieHeader(ctx)` helper from `src/lib/api-client.ts`.

### Q: Can server functions modify session cookies?

**A:** No. Only the browser can receive and store `Set-Cookie` headers from Django. This is why auth must be client-side.

---

## 📞 Support & Next Steps

### If You Need Help

1. **Check documentation** - All patterns are documented with examples
2. **Review examples** - `src/server/api/academic-mutations.ts` is ready to use
3. **Test incrementally** - Start with one mutation, verify it works
4. **Ask specific questions** - Reference the documentation section

### Suggested Next Steps

**Option 1: Keep Current Architecture (Safest)**

- No changes needed
- Everything works correctly
- Use new helpers for future features

**Option 2: Incremental Migration (Recommended if migrating)**

- Migrate one module (academic years already done)
- Test thoroughly
- Evaluate benefits vs complexity
- Decide whether to continue

**Option 3: Full Migration (Most work)**

- Migrate all non-auth mutations
- Update all components
- Comprehensive testing
- Team training on new patterns

---

## ✅ Checklist: Deliverables Completed

- [x] Research TanStack Start cookie API
- [x] Analyze current authentication architecture
- [x] Document findings (4 comprehensive guides)
- [x] Create helper functions (3 files)
- [x] Provide migration examples (academic mutations)
- [x] Create quick reference card
- [x] Explain why auth must be client-side
- [x] Provide testing guidelines
- [x] Answer key questions
- [x] Make recommendations

---

## 📄 File Summary

### Documentation Created

1. `docs/SERVER_FUNCTIONS_GUIDE.md` (500+ lines)
2. `docs/COOKIE_FORWARDING_AND_SERVER_FUNCTIONS.md` (600+ lines)
3. `docs/TANSTACK_START_COOKIE_RESEARCH_SUMMARY.md` (500+ lines)
4. `docs/QUICK_REFERENCE_SERVER_FUNCTIONS.md` (150+ lines)

### Code Created

5. `src/server/csrf.ts` (60 lines)
6. `src/server/mutation-helper.ts` (200+ lines)
7. `src/server/api/academic-mutations.ts` (120 lines)

### Meta

8. `RESEARCH_DELIVERABLES.md` (this file)

**Total:** 8 files, ~2500+ lines of documentation and code

---

## 🎓 Key Learnings

1. **TanStack Start is minimal** - No built-in cookie helpers, manual forwarding required
2. **httpOnly cookies require browser context** - Auth MUST be client-side
3. **Current architecture is correct** - Server functions for data, client for auth
4. **Helper functions reduce boilerplate** - Generic factories make patterns reusable
5. **Migration is optional** - Trade-offs exist, evaluate per project

---

**Research completed successfully. All documentation and code ready to use.** ✅

---

**What would you like to do next?**

- Review specific documentation files?
- Test the helper functions?
- Migrate a specific module?
- Ask follow-up questions?
- Something else?
