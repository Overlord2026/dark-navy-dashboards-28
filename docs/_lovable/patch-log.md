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
- `src/config/toolsHome.ts` - Created tools home path configuration  
- `src/pages/pros/ProsToolsRouter.tsx` - Created router for professional personas to tools
- `src/components/pros/PersonaOnboarding.tsx` - Created persona banner with role-specific checklists
- `src/features/cashflow/pages/CashFlowPage.tsx` - Added PersonaOnboarding banner
- `src/App.tsx` - Added routing for /pros/:role

### Changes:
- Service professionals from ProsHub now route to existing tools dashboard (/cashflow)
- Added persona-specific onboarding banners with "start here" checklists
- Each professional role gets tailored quick-start recommendations
- Seamless integration with existing tools without UI changes
- Query params preserve persona context for banner display

### Branch: feat/pros→tools