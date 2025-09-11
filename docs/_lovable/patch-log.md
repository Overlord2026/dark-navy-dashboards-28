# Lovable Patch Log

## 2025-09-11-11: Responsive Persona Navigation Header (feat/nav-personas)

**Files Modified:**
- `src/components/nav/HeaderNav.tsx` - Created responsive, accessible header with hamburger menu
- `src/components/Header.tsx` - Integrated new HeaderNav component, moved admin nav to secondary header

**Branch:** feat/nav-personas

**Commit:** feat(nav): add responsive persona navigation with a11y hamburger menu

**Routes Added:**
- Service Professionals: /pros/{advisors,accountants,attorneys,insurance,realtors,consultants,medicare}
- Families: /families/{aspiring,retirees}

**Features:**
- Desktop: hover/click popovers for "Service Professionals" and "Families"
- Mobile: slide-over hamburger menu with focus trapping and ESC/backdrop close
- A11y: full keyboard navigation, aria-expanded/controls, screen reader support
- Responsive design with semantic tokens from design system

## 2025-09-11-10: Canonical Namespace Import Codemod (Complete)

**Files Modified:**
- Converted 31 remaining files from named imports to `import * as Canonical from "@/lib/canonical"`
- Updated all function calls to use `Canonical.*` pattern across entire codebase
- ESLint rule already in place to prevent future named imports
- Created cache-bust file to force rebuild

**Commit:** refactor(canonical): complete namespace import codemod; cache-bust

**Summary:** Completed canonical imports standardization - all 64+ files now use consistent namespace pattern for better HMR and build reliability.

## 2025-09-11-08: Latest Lovable Version Update

**Files Modified:**
- `vite.config.ts` - Added componentTagger plugin for development mode while maintaining React deduplication
- `package.json` - Added lovable-tagger dependency

**Commit:** feat: update to latest Lovable version with componentTagger

**Summary:** Updated project template to latest Lovable version by adding componentTagger plugin in development mode while preserving React deduplication fixes.

## 2025-09-11-07: Canonical Namespace Import Fix

**Files Modified:**
- `src/components/testing/CanonTest.tsx` - Converted named imports to namespace import for canonical functions
- `.chore/cache-bust-1736618400000.txt` - Updated to force dev server reload

**Commit:** fix(canonical): CanonTest namespace import + alias sweep; cache-bust

**Summary:** Fixed remaining named import usage in CanonTest.tsx causing 'inputsHash' export error by converting to consistent namespace import pattern (Canonical.inputsHash, Canonical.canonicalize).

## 2025-09-11-06: Single React Enforcement

**Files Modified:**
- `vite.config.ts` - Removed lovable-tagger import/plugin; expanded React deduplication aliases
- `package.json` - Removed lovable-tagger and @vitejs/plugin-react-swc from devDependencies
- `.chore/reinstall-trigger-1736618400000.txt` - Created to force dependency reinstall

**Commit:** build: enforce single React (remove lovable-tagger; alias+dedupe; pin versions; peerDeps); force reinstall

**Summary:** Eliminated duplicate React sources by removing lovable-tagger development plugin, expanding Vite React deduplication, and forcing clean dependency reinstall to resolve "Cannot read properties of null (reading 'useState')" crashes.

## 2025-09-11-05: GlobalErrorBoundary Export Fix

**Files Modified:**
- `src/components/monitoring/GlobalErrorBoundary.tsx` - Added both named and default exports

**Commit:** fix(error-boundary): provide default + named export for GlobalErrorBoundary

**Summary:** Modified GlobalErrorBoundary to export both named `GlobalErrorBoundary` and default exports, enabling flexible import patterns while maintaining backward compatibility.

## 2025-09-11: Canonical Imports Refactor

**Commit:** "refactor(canonical): alias path + named imports; add stableStringify and build id"

**Files modified:**
- `src/lib/canonical.ts` - Added stableStringify alias and __CANONICAL_BUILD_ID export
- `src/lib/receiptsEmitter.ts` - Fixed relative imports to use @/lib/canonical alias  
- `vite.config.ts` - Added server port 8080 configuration
- `docs/_lovable/patch-log.md` - Created patch log documentation

**Changes:**
- Normalized all canonical imports to use @/lib/canonical alias path
- Added cache-busting build ID to force Vite recompilation
- Consolidated duplicate imports in receiptsEmitter.ts
- Configured required server port for preview

## 2025-09-11: Fix Canonical Imports Export Error

**Commit:** "fix(canonical): normalize imports; add build id; disable SW during debug"

**Files modified:**
- `src/lib/canonical.ts` - Bumped __CANONICAL_BUILD_ID to force rebuild
- `src/pwa/registerSW.ts` - Temporarily disabled service worker to avoid cache during debug
- `.chore/cache-bust-1736618400000.txt` - Created cache-bust file to force fresh rebuild
- `docs/_lovable/patch-log.md` - Updated patch log

**Changes:**
- Fixed "does not provide an export named 'inputsHash'" error
- All imports already using correct @/lib/canonical alias path
- Temporarily disabled service worker to prevent cached modules during debugging
- Created cache-bust file to ensure fresh rebuild

## 2025-09-11: Fix Canonical Imports with Namespace Imports and Diagnostics

**Commit:** "fix(canonical): namespace import in receiptsEmitter + diag page + build id"

**Files modified:**
- `src/lib/receiptsEmitter.ts` - Switched to namespace imports (`import * as Canonical`)
- `src/lib/canonical.ts` - Bumped __CANONICAL_BUILD_ID to "canonical-2025-09-11-04"
- `src/diag/CanonicalExports.tsx` - Created diagnostics page to display canonical exports
- `src/App.tsx` - Added route `/diag/canonical` for diagnostics page
- `docs/_lovable/patch-log.md` - Updated patch log

**Changes:**
- Fixed import error by switching from named imports to namespace imports in receiptsEmitter.ts
- Added runtime diagnostics page at /diag/canonical to verify exports are working
- Updated all usage patterns from `inputsHash()` to `Canonical.inputsHash()`
- Cache busting via build ID increment