# Patch Log

## Latest Changes

### fix/react-singleton  
- **Status**: ✅ Complete  
- **Problem**: "Cannot read properties of null (reading 'useState')" in AuthProvider due to duplicate React instances/HMR issues
- **Solution**:
  - Package.json already has React 18.3.1 with overrides for singleton enforcement
  - Simplified vite.config.ts to single react() plugin with enhanced deduplication
  - Removed @tax and @advisor aliases to prevent import confusion
  - Applied hard dev graph reset with updated canonical build ID
  - Created cache-bust file for complete cache invalidation
  - Added ReactDiag page for verification
  - Created comprehensive sidebar.tsx component with all required exports
  - Fixed missing subscriptionTier props in tax calculator components
- **Files**:
  - `vite.config.ts` (simplified with enhanced React deduplication)
  - `src/lib/canonical.ts` (updated build ID to react-singleton-01)
  - `.chore/cache-bust-1737133200000.txt` (cache invalidation)
  - `src/pages/ReactDiag.tsx` (diagnostic page)
  - `src/components/ui/sidebar.tsx` (created comprehensive component)
  - `src/pages/tax/calculators/*` (added subscriptionTier props)

## feat/advisor-intake - Advisor Platform Integration

### 2025-09-15 - Finalize Advisor Platform Wiring
- **Aliases**: Added `@advisor/*` alias mapping to `src/features/advisors/platform/*`
- **Routes**: Added nested `/pros/advisors/platform/*` routes in App.tsx:
  - Index: Dashboard (existing component)
  - Prospects, Recordings, Questionnaires, Templates, ROI, Calendar: TODO pages
  - Settings: Platform settings page
- **Hub Integration**: Enhanced ProsHub to include "Access Platform" link for Financial Advisors
- **Shell**: Uses existing `AdvisorPlatformLayout` with sidebar navigation
- **Build**: Maintains React dedupe config, no Family routes touched

### Components Created/Modified:
- Modified: `vite.config.ts` - Added @advisor alias
- Modified: `src/pages/pros/ProsHub.tsx` - Added platform access link
- Modified: `src/App.tsx` - Added advisor platform routes
- Created: `docs/_lovable/patch-log.md` - This log file

### QA Checklist:
- [ ] `/pros/advisors/platform` loads shell + dashboard
- [ ] Sidebar navigation works (7 platform pages)
- [ ] ProsHub shows "Access Platform" for Financial Advisors
- [ ] Family routes remain unchanged
- [ ] Hard reload works, no React duplicate errors
- [ ] Typecheck and build pass