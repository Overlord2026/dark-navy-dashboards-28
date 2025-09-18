# Patch Log

## 2024-12-XX - Bidirectional Invite Flow Implementation

### Summary
Implemented complete bidirectional invite functionality: advisor→family and family→advisor flows with lifecycle management.

### Files Changed
- **NEW**: `src/pages/invite/InviteAdvisor.tsx` - Family-initiated advisor invitation page
- **NEW**: `src/pages/invite/InviteRedemption.tsx` - Universal invite redemption handler  
- **MODIFIED**: `src/routes.tsx` - Added `/invite/advisor` and `/invite/:token` routes
- **MODIFIED**: `src/features/advisors/platform/pages/InvitePage.tsx` - Enhanced with copy/re-send/revoke actions

### Features
1. **Family→Advisor** (`/invite/advisor`) - Form submission inserts pending row in prospect_invitations
2. **Redemption** (`/invite/:token`) - Validates tokens, updates status to accepted, redirects appropriately  
3. **Management** - Copy link, re-send, revoke with toast feedback
4. **Schema** - Uses existing prospect_invitations table, compatible with leads-invite edge function

### Commit: `feat(invites): bidirectional invites + row actions`

---

## Latest Changes

### feat/advisors-invite - Enhanced Advisor Family Invite Integration with Supabase
- **Status**: ✅ Complete  
- **Solution**: Enhanced `/pros/advisors/platform/invite` route with advanced invite service, Supabase integration, and invitation history tracking
- **Features**: 
  - Advanced form schema: firstName, lastName, clientSegment, paymentResponsibility, personalNote
  - Supabase integration: connects to `leads-invite` edge function and `prospect_invitations` table
  - Invitation history: "Recent Invitations" section with status tracking and visual indicators
  - Payment responsibility: advisor-paid vs client-paid tracking with UI badges
  - Enhanced UX: status badges (pending, activated, expired), form validation, success toasts
- **Files**: InviteFamily.tsx (enhanced), invite.mock.ts (uses advanced service from features/advisors/platform), patch-log.md

### feat/advisor-intake - ROI Tracker Scaffold with Charts/Tables
- **Status**: ✅ Complete
- **Solution**: Implemented ROI Tracker with KPI strip (Spend, Conversion Rate, New Prospects, New AUM), bar/line charts using recharts, sortable channel performance table (Facebook, LinkedIn, Google, Webinars, Seminars), mocked data selectors
- **Files**: ROITrackerPage.tsx, roi.mock.ts (new mock state with ROI metrics, channel performance, chart data)

### feat/advisor-intake - Calendar Month/Week/Day Views
- **Status**: ✅ Complete
- **Solution**: Implemented styled Calendar page with month/week/day views, mocked events (10 events), "New Event" modal form, URL query params (?view=month|week|day), date navigation, themed grid layouts using design tokens
- **Files**: CalendarPage.tsx, calendar.mock.ts (new mock state with calendar events)

### feat/advisor-intake - Prospects Table + Filters + Row Actions
- **Status**: ✅ Complete
- **Solution**: Enhanced Prospects page with data table (Name, Email, Status, Source, HNW Score, Next Meeting), search input, dropdown filters (Status/Source), row actions (View/Edit/Delete), client-side pagination (8 items/page), mocked data selectors
- **Files**: ProspectsPage.tsx, prospects.mock.ts (new mock state with 10 prospects)

### feat/advisor-intake - Dashboard KPIs + Recent Activity + Quick Actions
- **Status**: ✅ Complete
- **Solution**: Enhanced Dashboard with 4 KPI cards (total prospects, active prospects, meetings, conversions), Recent Activity list (5 mocked items), Quick Action buttons (Add Prospect, Schedule Meeting, Send Questionnaire), responsive grid layout using theme tokens
- **Files**: AdvisorPlatformDashboard.tsx, dashboardSelectors.ts (new mock state)

### feat/advisor-intake - Advisor Platform Navigation Wired
- **Status**: ✅ Complete
- **Solution**: Fixed AdvisorPlatformLayout to use Outlet for nested routes, enabling functional navigation for Dashboard, Prospects, Recordings, Questionnaires, Templates, ROI Tracker, Calendar
- **Files**: AdvisorPlatformLayout.tsx, App.tsx

### feat/advisor-intake - React Deps Alignment
- **Status**: ✅ Complete
- **Solution**: Aligned React deps/overrides, removed nested lockfiles, finalized alias/routes
- **Files**: packages/swag-analyzer/package.json, package.json, tsconfig.json, tsconfig.app.json

### docs/repo-map
- **Status**: ✅ Complete
- **Problem**: Need external module mapping documentation
- **Solution**: 
  - Created docs/REPO_MAP.md with external repos to internal prefixes mapping
  - Documents advisor-platform, tax-tools, and marketplace modules
  - Maps GitHub repos to canonical subtree prefixes
- **Files**:
  - `docs/REPO_MAP.md` (created module mapping table)

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