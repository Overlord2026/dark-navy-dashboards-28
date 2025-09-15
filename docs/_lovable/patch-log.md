# Patch Log

## Latest Changes

### fix/react-singleton  
- **Status**: ✅ Complete
- **Problem**: "Cannot read properties of null (reading 'useState')" in AuthProvider due to duplicate React instances/HMR issues
- **Solution**:
  - Pinned React to exact versions (18.3.1) using dependency tools
  - Simplified vite.config.ts to single react() plugin, removed componentTagger
  - Enhanced React deduplication in resolve.dedupe
  - Removed mode-based plugin logic to ensure consistent behavior
  - Created comprehensive sidebar.tsx component with all required exports
  - Fixed missing subscriptionTier props in tax calculator components
- **Files**:
  - `vite.config.ts` (simplified)
  - `src/components/ui/sidebar.tsx` (created comprehensive component)
  - `src/pages/tax/calculators/bracket-manager.tsx` (added subscriptionTier)
  - `src/pages/tax/calculators/nua.tsx` (added subscriptionTier) 
  - `src/pages/tax/calculators/roth-conversion.tsx` (added subscriptionTier)

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