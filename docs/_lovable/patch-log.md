# Patch Log

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