# Patch Log

## 2024-01-XX - feat(nav): persona-first header + pros hub + mobile switcher (accessible)

### Files Modified:
- `src/config/personas.ts` - Created persona configuration with PROS and FAMILIES arrays
- `src/pages/pros/ProsHub.tsx` - Created service professionals hub page with role cards
- `src/components/nav/HeaderNav.tsx` - Updated header with simplified persona-first navigation
- `src/components/nav/PersonaSwitcher.tsx` - Created mobile sticky persona switcher
- `src/components/Header.tsx` - Integrated PersonaSwitcher component
- `src/App.tsx` - Updated routing to use ProsHub route
- `docs/_lovable/patch-log.md` - Updated patch log

### Changes:
- Implemented persona-first navigation with clear "Service Professionals" and "Families" menus
- Created accessible desktop popovers and mobile hamburger menu
- Added "All Pros" hub page with professional role cards and clear value propositions
- Mobile sticky "I'm a..." switcher for quick persona selection
- Full A11y support: keyboard navigation, focus trapping, ESC to close, aria attributes
- Routes link to existing pages where available, TODO comments for missing routes

### Branch: feat/nav-personas

## 2024-01-XX - feat(pros→tools): route pros to existing tools dashboard + persona banner/checklist

### Files Modified:
- `src/config/toolsHome.ts` - Updated tools home path to budgets page with spending analysis
- `src/pages/pros/ProsToolsRouter.tsx` - Created router for professional personas to tools with improved logging
- `src/components/pros/PersonaOnboarding.tsx` - Created persona banner with role-specific checklists
- `src/pages/BudgetsPage.tsx` - Enhanced budgets page with spending analysis tab and persona integration
- `src/App.tsx` - Added routing for /pros/:role

### Changes:
- Service professionals from ProsHub now route to enhanced budgets page (/budgets) 
- Added persona-specific onboarding banners with "start here" checklists
- Each professional role gets tailored quick-start recommendations
- Budgets page now includes spending analysis tab with donut chart and category breakdown
- First tab shows comprehensive spending dashboard matching reference design
- Second tab maintains original budget management functionality
- Query params preserve persona context for banner display
- Added console logging for debugging navigation flow

### Branch: feat/pros→tools

## 2025-01-XX - feat(pro-workspace-v2): Monarch-style sidebar, polished top bar, persona quick actions; reuse existing tools

### Features Added
- Upgraded to Monarch-style workspace with fixed left sidebar
- Added Lucide React icons to navigation items
- Implemented clean top bar with persona chip and quick actions
- Enhanced focus states and accessibility
- Professional typography and spacing alignment

### Files Modified
- `src/config/toolNav.ts` - Added Lucide icons to navigation items, stored as components
- `src/components/layout/ProWorkspaceLayout.tsx` - Complete redesign with sidebar icons, persona chip, and improved layout
- `docs/_lovable/patch-log.md` - Updated documentation

### Technical Details
- Fixed left sidebar with icons and labels, active state highlighting
- Compact persona chip in top bar instead of large banner
- Quick actions integrated into top bar toolbar
- Consistent semantic design tokens and spacing
- Enhanced keyboard navigation and focus management
- Responsive grid layout with proper backdrop blur effects

### UI/UX Improvements
- Professional Monarch-style appearance
- Better visual hierarchy with icons and typography
- Cleaner quick actions presentation
- Improved accessibility with proper ARIA labels and focus states

### Branch: feat/pro-workspace-v2

## 2025-01-XX - feat(pro-tools): Tools Launcher as /pros/:role index (Monarch-style buttons) + layout polish

### Features Added
- Created professional Tools Launcher as landing page for service professionals
- Large, accessible tool cards with descriptions and icons
- Role-specific tool ordering and personalized copy
- Clean grid layout with semantic design tokens

### Files Modified
- `src/config/toolNav.ts` - Added TOOL_COPY descriptions for launcher cards
- `src/pages/pros/ToolsLauncher.tsx` - Created Tools Launcher component with professional grid layout
- `src/App.tsx` - Updated routing to use ToolsLauncher as index instead of redirecting to reports
- `docs/_lovable/patch-log.md` - Updated documentation

### Technical Details
- Professional grid of tool cards with hover states and focus management
- Role-aware tool ordering using existing PRO_RECOMMENDED_ORDER configuration
- Maintains left sidebar navigation while providing clear central tool selection
- Each card routes to existing tool pages (Reports, Cash Flow, Transactions, etc.)
- Uses semantic design tokens for consistent theming

### UI/UX Improvements
- Monarch-style launcher with big, clickable tool cards
- Clear descriptions help users understand each tool's purpose
- Professional spacing and typography
- Enhanced accessibility with proper focus states and semantic markup
- Removes immediate redirect to Reports, giving users choice and context

### Branch: feat/pro-tools-launcher

## 2025-01-XX - feat(pro-workspace-polish): move Shortcuts to sidebar; remove 'Switch persona'; strip foundational badges; spacing/typography polish

### Features Added
- Moved quick action shortcuts to left sidebar as dedicated "Shortcuts" section
- Removed "Switch persona" button entirely for cleaner interface
- Stripped "foundational" tier badges from reports for professional appearance
- Enhanced typography and focus states throughout

### Files Modified
- `src/config/toolNav.ts` - Added DEFAULT_QUICK_ACTIONS for universal shortcuts
- `src/components/layout/ProWorkspaceLayout.tsx` - Moved shortcuts to sidebar, removed persona switcher, improved focus states
- `src/components/reports/ReportsPage.tsx` - Removed tier badge from header and foundational badges from cards
- `docs/_lovable/patch-log.md` - Updated documentation

### Technical Details
- Universal shortcuts section in sidebar with proper navigation states
- Simplified top bar with only persona indicator
- Enhanced accessibility with proper focus ring styling
- Clean separation between tools navigation and quick shortcuts
- Professional typography with consistent text sizing

### UI/UX Improvements
- Monarch-style sidebar with clear sections and visual hierarchy
- Cleaner interface without unnecessary tier indicators
- Better focus management and keyboard navigation
- Professional spacing and color usage throughout workspace
- Streamlined user experience with contextual shortcuts

### Branch: feat/pro-workspace-polish

## 2025-01-11 - feat(pro-advisors-route): connect Financial Advisors hub to existing Advisors page

### Features Added
- Connected Service Professionals hub "Financial Advisors" link to existing Advisors page
- Simplified routing by reusing the pre-built Financial Advisors component
- Maintains existing page functionality and design while integrating with pro hub

### Files Modified
- `src/App.tsx` - Updated /pros/advisors route to use existing Advisors component instead of AdvisorDashboardWithSideNav
- `docs/_lovable/patch-log.md` - Updated documentation

### Technical Details
- Detected existing Advisors component at src/pages/personas/Advisors.tsx
- Updated route mapping to use existing component with established design
- Preserved existing navigation and functionality while connecting to hub flow
- Removed unnecessary PersonaGuard wrapper for cleaner routing

### UI/UX Improvements
- Seamless navigation from Service Professionals hub to dedicated Advisors page
- Maintains existing page design and user experience
- Consistent routing pattern for professional personas

### Branch: feat/pro-advisors-route

## 2025-09-12 - fix(canonical): receiptsEmitter alias+namespace; explicit named export; remove absolute path; cache-bust

### Files Modified:
- `src/lib/receiptsEmitter.ts`
- `src/lib/canonical.ts`
- `.chore/cache-bust-1757702400000.txt`

### Changes:
- Enforced namespace alias import in receiptsEmitter and removed trailing comment.
- Ensured `inputsHash` is explicit named export and bumped `__CANONICAL_BUILD_ID` to force HMR.
- Repo sweep: no absolute "/src/lib/canonical.ts" imports remained.
- Added cache-bust chore file to force clean rebuild.

### Branch: fix/canonical-final
### Commit: fix(canonical): receiptsEmitter alias+namespace; explicit named export; remove absolute path; cache-bust
### SHA: N/A (web editor)

## 2025-01-12 - fix(personas): add named PROS & FAMILIES exports; normalize imports; cache-bust

### Files Modified:
- `src/config/personas.ts` - Added canonical PersonaLink type and ensured proper named exports
- `.chore/cache-bust-1757702500001.txt` - Cache bust to refresh module graph

### Changes:
- Fixed missing named export error for FAMILIES by normalizing personas config  
- Updated PersonaLink type with optional blurb field for consistency
- Ensured both PROS and FAMILIES are properly exported as named exports
- Added cache-bust to force rebuild and refresh module graph
- No route changes, only export/import normalization

### Branch: fix/personas-exports

## 2025-01-12 - fix(personas): normalize imports; cache-bust for module graph refresh

### Files Modified:
- `.chore/cache-bust-1757702600001.txt` - Cache bust to refresh module graph

### Changes:
- Verified all persona imports already use proper named exports from @/config/personas alias
- ProsHub, HeaderNav, and PersonaSwitcher already use correct `import { PROS, FAMILIES } from "@/config/personas"`
- Added cache-bust to force rebuild and refresh module graph for ESM import consistency
- No import normalization needed - all files already follow correct pattern

### Branch: fix/personas-exports

## 2025-09-14 - docs: MVP Brief (team & investor) + one-pager

### Files Created:
- `docs/MVP_BRIEF_TEAM.md` - Comprehensive MVP brief (31 routes, 8 tools, 6 personas)
- `docs/MVP_BRIEF_TEAM.onepager.md` - Executive summary (400 words)

### Changes:
- Synthesized 10 documentation sources into investor-ready briefing
- Documented current product map with 31 routes and 8 financial tools
- Identified P0 blockers: missing Accounts tool, incomplete Reports, navigation fragmentation
- Created actionable 2-sprint plan with file paths and acceptance criteria
- Established MVP KPIs: invites sent, families onboarded, DAU on reports, linking completion
- Professional briefing suitable for team alignment and investor presentations

### Branch: docs/brief