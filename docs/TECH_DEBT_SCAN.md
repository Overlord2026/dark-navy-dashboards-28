# Technical Debt Scan Report

## Critical Issues Found

### 1. Service Worker Development Cache Risk
**File:** `public/sw.js`, `src/lib/pwa.ts:4`, `src/main.tsx:32`
**Issue:** Service worker registers `/sw.js` without environment checks
**Risk:** Development bundles may be cached, causing stale code in dev mode
**Remediation:** Disable SW registration in development or add cache invalidation

### 2. React Duplication Prevention (Vite Config)
**File:** `vite.config.ts:19`, `vite.config.ts:22`
**Issue:** React dedupe and optimization configured but potential runtime conflicts
**Risk:** Multiple React instances if dependencies bypass deduplication
**Remediation:** Add bundle analyzer to verify single React instance

### 3. Lovable Tagger Development Contamination
**File:** `vite.config.ts:4`, `vite.config.ts:13`
**Issue:** `lovable-tagger` import present but conditionally loaded
**Risk:** Development dependency leaking into production builds
**Remediation:** Move to devDependencies and add production build check

### 4. Route Conflicts - Reports Path Duplication
**File:** `src/App.tsx:396` (pros route), `src/App.tsx:482` (global route)
**Issue:** `/reports` accessible via both `/pros/:role/reports` and `/reports`
**Risk:** Persona context confusion when accessing `/reports` directly
**Remediation:** Remove global `/reports` route, force persona-scoped access

### 5. Navigation Redirect Chains
**File:** `src/App.tsx:490-493`, `src/App.tsx:501-504`, `src/App.tsx:549-550`
**Issue:** Multiple redirect chains create complex routing logic
**Risk:** Navigation loops, poor UX, SEO issues with redirect chains
**Remediation:** Consolidate redirects, use canonical routes in app navigation

## Detailed Analysis

### Duplicate React Risk Assessment
```typescript
// vite.config.ts - Lines 19,22
resolve: {
  dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "react-dom/client"],
},
optimizeDeps: {
  include: ["react", "react-dom", "react-dom/client"],
  force: true
}
```
**Status:** Properly configured deduplication
**Recommendation:** Add bundle analyzer to verify

### Canonical Import Risk Assessment
**Searched for:** Absolute paths and risky imports
**Result:** No problematic canonical imports found
**Status:** ✅ Clean - all imports use proper `@/lib/canonical` alias

### Service Worker Cache Analysis
```typescript
// src/lib/pwa.ts:4
navigator.serviceWorker.register('/sw.js')
```
**Issue:** No environment discrimination
**Cache Risk:** Development builds cached, requiring manual SW unregistration
**Remediation:** Add `NODE_ENV` check before registration

### Legacy Route Conflicts
```typescript
// src/App.tsx - Duplicate route patterns
<Route path="/reports" element={<ReportsPage />} />          // Line 482
<Route path="/pros/:role/reports" element={<ReportsPage />} /> // Line 396
```
**Conflict:** Reports accessible via multiple paths
**Persona Risk:** Direct `/reports` access bypasses persona context
**Remediation:** Remove global route, enforce persona scoping

### Service Worker File Location
**Location:** `public/sw.js` (correct location)
**Registration:** `src/lib/pwa.ts` and `src/main.tsx:32`
**Cache Risk:** Caches dev bundles without environment checks
**Remediation:** Environment-aware registration

## Development Error Patterns

### Console Log Contamination
**Found:** 1,500+ console.log statements across codebase
**Risk:** Performance impact, information disclosure in production
**Files:** Widespread across components, no systematic removal
**Remediation:** Implement production log stripping

### Import Path Inconsistencies
**Pattern:** Mixed use of relative and alias imports
**Risk:** Bundle optimization issues, dependency resolution problems
**Remediation:** Enforce consistent alias usage via ESLint rule

### Route Definition Sprawl
**Issue:** Routes defined across multiple files without centralization
**Files:** `src/App.tsx` (800+ lines), component-level route logic
**Risk:** Route conflicts, maintenance complexity
**Remediation:** Extract route configuration to separate files

## Immediate Actions Required

1. **Service Worker Fix:** Add environment check in `src/lib/pwa.ts`
2. **Route Deduplication:** Remove duplicate `/reports` route in `src/App.tsx:482`
3. **Console Cleanup:** Implement production log removal
4. **Bundle Analysis:** Add webpack-bundle-analyzer to detect React duplication
5. **Redirect Simplification:** Consolidate redirect chains in `src/App.tsx`

## Production Build Risks

**High Risk:**
- Service worker caching development assets
- Route conflicts causing persona confusion
- Console logs in production build

**Medium Risk:**  
- Potential React duplication if dedupe fails
- Complex redirect chains affecting SEO
- Development dependencies in production

**Low Risk:**
- Canonical imports (clean implementation found)
- Lovable tagger (properly conditionally loaded)