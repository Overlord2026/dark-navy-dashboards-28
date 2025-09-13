# MVP Plan Summary

## Current State

The application has a solid foundation with working authentication, persona-based routing, and several complete features (Goals, Transactions, Cash Flow). However, there are critical gaps preventing a coherent MVP experience. Navigation is fragmented across multiple patterns - advisors use a tab-based layout while families lack unified navigation entirely. Core financial management functionality (Accounts) is completely missing as stub pages, and the Reports tool exists only as a shell. The codebase shows signs of rapid iteration with 3+ different persona switcher implementations and conflicting navigation systems consuming 216px of vertical space.

Technical debt includes service worker caching risks, 3,156+ console statements in production builds, and route conflicts where `/reports` is accessible via multiple paths. While individual features like Goals demonstrate excellent UX (family-focused copy, proper empty states), the overall experience lacks consistency between advisor and family workflows.

## Advisors: What Works / What's Missing

### ✅ What Works Now
- Complete navigation structure via AdvisorsLayout (tab-based)
- All 6 main sections accessible (Home, Leads, Meetings, Campaigns, Pipeline, Tools)
- Persona context protection with PersonaGuard
- Professional branding and consistent styling
- Working Transactions and Cash Flow tools
- Goals tool with proper data integration

### ❌ What's Missing
- **Accounts tool** - Currently stub page, core workflow blocker
- **Reports tool** - Shell implementation only, critical for client reporting
- **Real data integration** - Most advisor data is mock/demo
- **Advisor-specific copy** - Goals shows family messaging in advisor context
- **Empty states** - Reports and Accounts have no empty state handling
- **Mobile optimization** - Tab layout may not scale on mobile devices

## Families: What Works / What's Missing

### ✅ What Works Now
- Multiple family segment pages (Aspiring, Retirees, etc.)
- Excellent Goals implementation with family-focused UX
- Working Tools Hub with family-appropriate tools
- Complete Transactions and Cash Flow functionality
- Family-specific empty states and messaging
- Assets management pages

### ❌ What's Missing
- **Unified navigation** - No consistent sidebar/navigation pattern
- **Accounts tool** - Same stub page blocker as advisors
- **Navigation fragmentation** - Multiple competing navigation systems
- **Persona context gaps** - Inconsistent family segment protection
- **Dashboard data** - Family dashboard shows mostly mock metrics
- **Multi-user support** - No clear spouse/partner access patterns

## P0 Changes (Critical for MVP)

1. **Implement Accounts Tool** 
   - Files: `src/App.tsx:401,483`, create `src/features/accounts/pages/AccountsPage.tsx`
   - Replace stub with functional account management interface

2. **Complete Reports Tool**
   - Files: `src/pages/ReportsPage.tsx`, `src/components/reports/ReportsPage.tsx` 
   - Build out report generation and display functionality

3. **Fix Navigation Fragmentation**
   - Files: `src/App.tsx:372-373`, `src/components/layout/SecondaryNav.tsx`
   - Remove SecondaryNav, implement unified sidebar for families

4. **Resolve Route Conflicts**
   - Files: `src/App.tsx:396,482` (duplicate /reports routes)
   - Remove global `/reports` route, enforce persona-scoped access

5. **Service Worker Production Safety**
   - Files: `src/main.tsx:32`, `src/lib/pwa.ts:4`
   - Add NODE_ENV check before service worker registration

## P1 Changes (Important for Quality)

1. **Consolidate Persona Switchers**
   - Files: `src/components/nav/PersonaSwitcher.tsx`, `src/components/consent/PersonaSwitcher.tsx`, `src/components/p5/PersonaSwitcher.tsx`
   - Create single authoritative persona switching component

2. **Fix Context Mismatches**
   - Files: `src/pages/GoalsPage.tsx:120-122`
   - Add advisor-specific copy variants for shared tools

3. **Implement Active Route Highlighting**
   - Files: `src/components/persona/PersonaSideNav.tsx:12-16`
   - Systematic NavLink with useLocation across all navigation

4. **Add Missing Empty States**
   - Files: Reports and Accounts pages
   - Implement consistent empty state patterns

5. **Production Log Cleanup**
   - Files: 1,071 files with console statements
   - Implement build-time log stripping for production

## Suggested Order of Operations (Next 1-2 Sprints)

### Sprint 1: Core Functionality
- [ ] **Week 1**: Implement Accounts Tool (P0 #1)
  - Create accounts feature structure
  - Build account management interface
  - Add empty states and error handling
- [ ] **Week 2**: Complete Reports Tool (P0 #2)
  - Build report generation logic
  - Create report display components
  - Add export functionality

### Sprint 2: Navigation & UX Consistency  
- [ ] **Week 3**: Fix Navigation Fragmentation (P0 #3)
  - Remove SecondaryNav system
  - Implement unified family sidebar
  - Test navigation consistency
- [ ] **Week 4**: Route & Service Worker Fixes (P0 #4, #5)
  - Resolve route conflicts
  - Add service worker safety checks
  - Clean up redirect chains

### Post-MVP (Optional)
- [ ] Consolidate persona switchers (P1 #1)
- [ ] Fix advisor context in shared tools (P1 #2)
- [ ] Implement active route highlighting (P1 #3)
- [ ] Add comprehensive empty states (P1 #4)
- [ ] Production logging cleanup (P1 #5)

## Success Criteria
- ✅ Both advisor and family personas can access core tools (Accounts, Reports, Goals, Transactions, Cash Flow)
- ✅ Navigation is consistent and intuitive for each persona
- ✅ No critical route conflicts or caching issues
- ✅ Empty states provide clear next actions
- ✅ Service worker doesn't break development workflow