# Lovable Patch Log

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