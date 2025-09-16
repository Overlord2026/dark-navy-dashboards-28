# Patch Log

## Latest Changes

### feat/advisor-intake  
- **Status**: ✅ Complete
- **Problem**: Finalize advisor platform wiring and routing integration
- **Solution**: 
  - Added @advisor alias to tsconfig.json and vite.config.ts pointing to src/features/advisors/platform/*
  - Updated App.tsx to import and use actual advisor platform page components instead of TODO stubs
  - Maintained existing /pros/advisors/platform route structure and ProsHub linking
  - Applied cache busting for clean rebuild
- **Files**:
  - `tsconfig.json` (added @advisor alias)
  - `vite.config.ts` (added @advisor alias with React dedupe)
  - `src/App.tsx` (imported platform components and updated routes)
  - `.chore/cache-bust-1737135340000.txt` (cache invalidation)

### fix/sidebar-shim  
- **Status**: ✅ Complete
- **Problem**: TaxShell imports from non-existent "@/components/ui/sidebar", conflicting with existing sidebar-new.tsx
- **Solution**: 
  - Renamed sidebar-new.tsx to sidebar-shadcn.tsx to avoid import conflicts
  - Updated BuildWorkspacePage to import from renamed sidebar-shadcn.tsx
  - Maintained existing simple sidebar.tsx for TaxShell compatibility
  - Applied cache busting for clean rebuild
- **Files**:
  - `src/components/ui/sidebar-new.tsx` → `src/components/ui/sidebar-shadcn.tsx` (renamed)
  - `src/pages/onboarding/BuildWorkspacePage.tsx` (updated import path)
  - `.chore/cache-bust-1737135123000.txt` (cache invalidation)

### fix/personas-exports
- **Status**: ✅ Complete
- **Problem**: "does not provide an export named 'FAMILIES'" due to missing canonical named exports
- **Solution**: 
  - Created src/config/personas.ts with canonical named exports (PROS, FAMILIES)
  - Added ReactDiag route to src/App.tsx for React singleton verification
  - Updated package.json in swag-analyzer subpackage with React peer dependencies
  - Applied safe edit mode with cache busting
- **Files**:
  - `src/config/personas.ts` (created with named exports)
  - `src/App.tsx` (added ReactDiag route)
  - `packages/swag-analyzer/package.json` (React as peer dependency)
  - `src/lib/canonical.ts` (updated build IDs)
  - `.chore/cache-bust-1737134745000.txt` (cache invalidation)

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