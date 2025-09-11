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