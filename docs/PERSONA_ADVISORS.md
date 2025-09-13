# Financial Advisors Tool Map

## Landing Paths Used

From hubs → where user actually lands:

- **Hub**: `/pros` → `/pros/advisors` (AdvisorPersonaPage)
- **Direct**: `/pros/advisor` → AdvisorPersonaDashboard 
- **Legacy**: `/advisors` → redirects to `/pros/advisors`
- **Persona Guard**: Routes protected by `allowedPersonas={['advisor']}`

## Tool Coverage Table

| Tool | Path | Component File | Data Source | Notable Props/Flags |
|------|------|---------------|-------------|-------------------|
| Fee Compare Demo | `/pros/advisors` | `src/pages/pros/advisors.tsx` | Mock (callEdgeJSON) | action: '401k_fee_comparison' |
| Retirement Roadmap | `/family/tools/retirement` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Planning' |
| Roth Conversion Analyzer | `/family/tools/roth-ladder` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Tax Planning' |
| Estate Workbench | `/estate/workbench` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Estate Planning' |
| Tax Projector | `/family/tools/taxhub-preview` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Tax Planning' |
| 401(k) Control Plane | `/family/tools/rmd-check` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Retirement' |
| Client Vault | `/family/vault` | `src/pages/personas/AdvisorPersonaDashboard.tsx` | Live | category: 'Management' |
| Advisor Home | `/advisors/home` | `src/pages/advisors/AdvisorsHome.tsx` | Live | AdvisorsLayout wrapper |
| Leads Management | `/advisors/leads` | `src/pages/advisors/LeadsPage.tsx` | Live | AdvisorsLayout wrapper |
| Meetings | `/advisors/meetings` | `src/pages/advisors/MeetingsPage.tsx` | Live | AdvisorsLayout wrapper |
| Campaigns | `/advisors/campaigns` | `src/pages/advisors/CampaignsPage.tsx` | Live | AdvisorsLayout wrapper |
| Pipeline | `/advisors/pipeline` | `src/pages/advisors/PipelinePage.tsx` | Live | AdvisorsLayout wrapper |
| Advisor Tools | `/advisors/tools` | `src/pages/advisors/AdvisorTools.tsx` | Live | AdvisorsLayout wrapper |

## Entry Points

**Buttons/Links that reach each tool:**

1. **Main Hub Card**: `/pros` → "Financial Advisors" card → `/pros/advisors`
   - File: `src/pages/pros/ProsHub.tsx`
   - Component: PROS array mapping

2. **Navigation Menu**: MegaMenu → "Financial Advisors" 
   - File: `src/components/nav/MegaMenu.tsx`
   - Path: `/pros/advisors`

3. **Persona Dashboard**: Tool cards with categories
   - File: `src/pages/personas/AdvisorPersonaDashboard.tsx`
   - Grid of tool cards with icons and descriptions

4. **Advisor App Navigation**: Left sidebar navigation
   - File: `src/layouts/AdvisorsLayout.tsx` (inferred)
   - Routes: home, leads, meetings, campaigns, pipeline, tools

## Working Assumptions

**What the page expects:**

- **Query params**: None explicitly required
- **Auth state**: 
  - PersonaGuard requires `allowedPersonas={['advisor']}`
  - User profile role should include 'advisor'
- **Context**: 
  - User profile available via `useUser()` hook
  - Persona context for navigation state
- **Routing**: React Router with lazy loading for most components

## Gaps / 404s / TODOs

**Evidence found:**

1. **Missing AdvisorsLayout component**
   - Referenced: `src/App.tsx:241` - `import { AdvisorsLayout } from '@/layouts/AdvisorsLayout';`
   - Status: Import exists but component file not verified in search

2. **Redirect inconsistencies**
   - `/advisors` → `/pros/advisors` (App.tsx:498)
   - `/advisor/home` → `/advisors/home` (App.tsx:782)
   - Multiple redirect paths may cause confusion

3. **Demo vs Live Tools**
   - `/pros/advisors` shows demo fee comparison with mock data
   - Other tools in AdvisorPersonaDashboard link to live family routes
   - Inconsistent user experience between demo and live tools

4. **Edge Function Dependencies**
   - `callEdgeJSON('decision-rds')` called for fee demo
   - Path: `src/pages/pros/advisors.tsx:17`
   - No verification of edge function availability

5. **Component Path Mismatches**
   - AdvisorPersonaDashboard tools link to `/family/tools/*` paths
   - May not be appropriate for advisor-specific workflows
   - Cross-persona navigation without clear boundaries

6. **Legacy Route Cleanup Needed**
   - Multiple `/advisor/*` vs `/advisors/*` patterns
   - Inconsistent persona routing conventions