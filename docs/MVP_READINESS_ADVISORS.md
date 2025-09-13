# MVP Readiness Checklist - Advisors

## Navigation (Sidebar Items Present & Working)
- [x] **Home**: `/advisors/home` - Working (src/pages/advisors/AdvisorsHome.tsx)
- [x] **Leads**: `/advisors/leads` - Working (src/pages/advisors/LeadsPage.tsx)
- [x] **Meetings**: `/advisors/meetings` - Working (src/pages/advisors/MeetingsPage.tsx)
- [x] **Campaigns**: `/advisors/campaigns` - Working (src/pages/advisors/CampaignsPage.tsx)
- [x] **Pipeline**: `/advisors/pipeline` - Working (src/pages/advisors/PipelinePage.tsx)
- [x] **Tools**: `/advisors/tools` - Working (src/pages/advisors/AdvisorTools.tsx)

**Navigation Structure**: Tab-based horizontal layout via `src/layouts/AdvisorsLayout.tsx`

## Tools Open & Render (Reports, Cash Flow, Transactions, Accounts, Goals)
- [ ] **Reports**: `/reports` - Stub only (src/pages/ReportsPage.tsx → src/components/reports/ReportsPage)
- [ ] **Cash Flow**: `/cashflow` - Feature complete (src/features/cashflow/pages/CashFlowPage.tsx)
- [ ] **Transactions**: `/transactions` - Feature complete (src/features/transactions/pages/TransactionsPage.tsx)
- [ ] **Accounts**: `/accounts` - Stub only ("Accounts - Coming Soon")
- [ ] **Goals**: `/goals` - Feature complete (src/pages/GoalsPage.tsx)

## Persona Context Handled
- [x] **Yes** - PersonaGuard implemented
  - File: `src/App.tsx` lines 457, 472
  - Logic: `allowedPersonas={['advisor']}` on advisor routes
  - Context: Uses `@/context/persona-context.tsx`

## Data Surface Wired (Mock/Live)
- **Live Data**: Supabase integration present
  - Goals: `user_goals` table (src/pages/GoalsPage.tsx:38-42)
  - Transactions: Mock API hooks (src/features/transactions/api/)
  - Cash Flow: Mock API hooks (src/features/cashflow/api/)
  - Leads: Mock data in components
- **Mock Data**: Most advisor-specific data is demo/mock

## Empty/Error States Present
- [x] **Transactions**: Yes - "No transactions found" (src/features/transactions/pages/TransactionsPage.tsx:236-244)
- [x] **Cash Flow**: Yes - "No cash flow data available" (src/features/cashflow/pages/CashFlowPage.tsx:240-248)
- [x] **Goals**: Yes - "Ready to dream bigger?" empty state (src/pages/GoalsPage.tsx:135-155)
- [ ] **Reports**: No empty states (stub page)
- [ ] **Accounts**: No empty states (stub page)

## Copy Polish Needed
- **AdvisorsLayout**: Professional tone is good
- **Goals**: "Experience Return is the new investment return" - needs advisor context
- **Transactions/Cash Flow**: Generic copy, needs advisor-specific messaging
- **Missing**: Advisor-specific value propositions in tool descriptions

## Blockers

### P0 Blockers (Must Fix for MVP)
1. **Accounts Tool Missing** - Currently stub, core functionality needed
   - File: `src/App.tsx:401, 483` 
   - Impact: Critical advisor workflow gap

2. **Reports Tool Incomplete** - Stub implementation
   - File: `src/pages/ReportsPage.tsx:2`
   - Impact: Essential for advisor client reporting

### P1 Blockers (Should Fix for MVP)
1. **Goals Context Mismatch** - Family-focused copy in advisor workflow
   - File: `src/pages/GoalsPage.tsx:120-122`
   - Impact: Poor advisor experience

2. **Data Integration Gaps** - Mock data for core advisor features
   - Files: `src/features/transactions/api/`, `src/features/cashflow/api/`
   - Impact: Demo-only functionality

3. **Navigation Inconsistency** - Tab layout vs sidebar pattern elsewhere
   - File: `src/layouts/AdvisorsLayout.tsx:124-146`
   - Impact: UX inconsistency across app

### P2 Blockers (Nice to Have)
1. **Tool-specific Empty States** - Generic messaging needs advisor context
2. **Advisor Persona Switching** - No clear way to switch between advisor types
3. **Mobile Navigation** - Tab layout may not scale well on mobile