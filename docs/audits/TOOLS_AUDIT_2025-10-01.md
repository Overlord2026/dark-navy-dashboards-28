# Dark Navy — Tools Audit (2025-10-01)

**Executive Summary**  
We audited five core surfaces — SWAG™ Retirement, Legacy Planning, Team Hub, Pricing/Entitlements, and System Health — to optimize what's built rather than rebuild. Foundation is strong; primary gaps are wiring (persistence/workflows), entitlement enforcement, and a few investor-demo upgrades (PDF/reporting, Stripe, notifications).

> Confidence markers: each item is tagged **Verified:** yes/no to make further checks explicit.

---

## SWAG™ Retirement Analyzer

- **Status:** Working ✅  
- **Routes:** `/wealth/retirement` (full), `/wealth/retirement/minimal`, `/wealth/retirement/start` **Verified:** yes  
- **Engine:** Monte Carlo simulation (500 trials, client-side) **Verified:** yes  
- **UI Components:** `SwagScenarioBar`, `ResultCard`, `SwagAnalyzerPage`, `SwagMinimalPage` **Verified:** yes  
- **Persistence:** 
  - Tables: `retirement_scenarios`, `retirement_versions`, `retirement_runs`, `retirement_results` **Verified:** yes
  - RLS policies: Present on all tables **Verified:** yes
  - Hooks: `useRetirementPlans` (context-based) **Verified:** yes
- **Key RPCs:** Monte Carlo runs via edge function fallback ready **Verified:** yes  
- **Gaps:** 
  - PDF/JSON export functionality (ExplainPack integration needed)
  - Scenario sharing between users
  - Comparison visualization for multiple scenarios
- **Quick Wins (1–3 days):** 
  - PDF export: Add jsPDF integration to export results → 0.5d
  - Scenario comparison: Visual chart comparing 2+ scenarios → 1d
  - ExplainPack summary: Generate narrative summary of results → 0.5d
- **Risks:** 
  - Client-side MC may timeout on slower devices (add web worker if needed)
  - Need error boundaries around calculation components

---

## SWAG™ Legacy Planning (Estate Wizard + RON + Attorney Review)

- **Status:** Partial ⚠️  
- **Routes:** 
  - `/estate/planner` (wizard) **Verified:** yes
  - `/estate/workbench` **Verified:** yes
  - `/estate/review/new` (attorney request) **Verified:** yes
  - `/estate/ron` (RON scheduling) **Verified:** yes
- **Wizard:** Step navigation structure present **Verified:** yes  
- **Attorney Review:** Request flow UI present, backend integration incomplete **Verified:** partial  
- **RON Gating:** State/county configuration ready **Verified:** yes  
- **Persistence:** 
  - Tables: `estate_requests`, `estate_documents`, `estate_plan_items`, `attorney_requests` **Verified:** yes
  - RLS policies: Present on all tables **Verified:** yes
  - Hooks: Components exist but persistence calls not wired **Verified:** no
- **Gaps:** 
  - Save/resume functionality not fully wired in wizard
  - Attorney request submission → ProofSlip not connected
  - RON schedule button → ProofSlip integration missing
  - Notification system for attorney review status
- **Quick Wins (1–3 days):** 
  - Wire save/resume: Connect wizard state to `estate_requests` table → 1d
  - Attorney request flow: Insert to `attorney_requests` + emit ProofSlip → 0.5d
  - RON schedule: Connect schedule button to ProofSlip emission → 0.5d
- **Risks:** 
  - State-by-state RON variations need ongoing maintenance
  - Attorney review workflow needs stakeholder validation
  - Compliance requirements for document retention

---

## Team Coordination Hub (Projects/Handoffs)

- **Status:** Needs Wiring ⚠️  
- **Routes:** 
  - `/integration` (hub landing) **Verified:** yes
  - `/integration/projects` (list view) **Verified:** yes
  - Projects tab in various dashboards **Verified:** yes
- **UI Components:** 
  - `ProjectsList`, `ProjectBoard`, `ProjectCard` **Verified:** yes
  - `NewHandoffModal`, `TaskStatusBadge` **Verified:** yes
- **Persistence:** 
  - Tables: `projects`, `project_tasks`, `project_members`, `task_assignments` **Verified:** yes
  - RLS policies: Present on all tables **Verified:** yes
  - Hooks: `useProjects` implemented **Verified:** yes
- **Key RPCs:** None required for MVP (direct table access sufficient) **Verified:** n/a  
- **Gaps:** 
  - Create project action not wired to `useProjects.createProject`
  - Task template generation not implemented
  - Task status updates not persisted
  - ProofSlip emission on handoff creation missing
  - Real-time task updates not enabled
- **Quick Wins (1–3 days):** 
  - Wire create project: Connect NewProjectModal to persistence → 0.5d
  - Task templates: Implement template-based task generation → 1d
  - Status updates: Wire TaskCard status changes to backend → 0.5d
  - ProofSlip integration: Emit on handoff creation → 0.25d
- **Risks:** 
  - Task notification system needs design
  - Real-time collaboration features may require Supabase realtime setup
  - Multi-tenant task visibility needs careful testing

---

## Pricing & Entitlements (Families / Advisor / RIA)

- **Status:** Working (Display) ✅ / Partial (Enforcement) ⚠️  
- **Routes:** 
  - `/pricing` with hash anchors (#families, #advisor, #ria) **Verified:** yes
  - `/pricing/checkout` (stub) **Verified:** yes
- **UI Components:** 
  - Pricing page with tier cards **Verified:** yes
  - Feature comparison matrix **Verified:** yes
  - CTA buttons configured **Verified:** yes
- **Entitlements:** 
  - Badge logic visible in components **Verified:** yes
  - Central enforcement utility **Verified:** no
  - Plan gating scattered across components **Verified:** yes (needs consolidation)
- **Persistence:** 
  - Tables: `user_subscriptions`, `subscription_plans` present **Verified:** yes
  - RLS policies: Present **Verified:** yes
- **Gaps:** 
  - Centralized entitlement utility (hasFeature, requiresPlan)
  - Stripe checkout flow integration
  - RIA tier "Talk to Sales" form submission
  - Plan upgrade/downgrade workflows
  - Usage tracking for tier limits
- **Quick Wins (1–3 days):** 
  - Entitlement utility: Create `src/lib/entitlements.ts` with feature gating → 0.5d
  - Advisor checkout: Wire up checkout flow (mock Stripe initially) → 0.5d
  - RIA form: Implement "Talk to Sales" submission → 0.25d
  - Badge consistency: Update all feature badges to use central utility → 0.5d
- **Risks:** 
  - Payment compliance needs legal review post-MVP
  - Stripe webhook handling needs production testing
  - Plan migration logic needs careful design

---

## System Health (/_smoke, /healthz, NonProd banner)

- **Status:** Working ✅  
- **Routes:** 
  - `/_smoke` (comprehensive system check) **Verified:** yes
  - `/healthz` (basic health endpoint) **Verified:** yes
- **UI Components:** 
  - `SmokeCheck` component with status indicators **Verified:** yes
  - NonProd banner with health dot **Verified:** yes
  - Health status in footer **Verified:** yes
- **RPCs:** 
  - `rpc_database_health` **Verified:** yes
  - `rpc_backup_status` **Verified:** yes (function exists)
  - `vault_is_configured` **Verified:** yes (via graphql check)
- **Features:** 
  - Database connectivity check **Verified:** yes
  - Auth service check **Verified:** yes
  - Storage bucket check **Verified:** yes
  - Environment indicator **Verified:** yes
- **Gaps:** 
  - Limited end-to-end workflow tests in `/_smoke`
  - No alerting system for health degradation
  - Manual verification required (no automated monitoring)
- **Quick Wins (1–3 days):** 
  - Add scenario save/load check to `/_smoke` → 0.25d
  - Add project creation check to `/_smoke` → 0.25d
  - Optional: Set up basic alerting (post-MVP) → 2d
- **Risks:** 
  - Manual smoke testing prone to human error
  - No production health monitoring dashboard
  - Need runbook for common failure scenarios

---

## Top 10 Fixes for Investor Demo

Prioritized by impact and feasibility:

1. **SWAG — Save/List Scenarios** — _1d_ → Demonstrate data persistence
   - Wire scenario save to `retirement_scenarios` table
   - Add scenario list/load functionality
   - Show version history

2. **SWAG — PDF/Export Stub (ExplainPack)** — _0.5d_ → Leave-behind report capability
   - Integrate jsPDF for results export
   - Create formatted PDF template with branding
   - Add download button to results view

3. **SWAG — Compare Chart (Two Scenarios)** — _1d_ → Visual differentiation punch
   - Create comparison visualization component
   - Side-by-side success rate comparison
   - Highlight key differences

4. **Legacy — Save/Resume + ProofSlip** — _1d_ → Complete wizard flow
   - Wire wizard state to `estate_requests` table
   - Implement resume from saved state
   - Emit ProofSlip on plan creation

5. **Legacy — Attorney Request + ProofSlip** — _0.5d_ → Professional handoff demo
   - Connect request form to `attorney_requests` table
   - Emit ProofSlip on submission
   - Show confirmation with tracking

6. **Legacy — RON Schedule Button + ProofSlip** — _0.5d_ → Compliance differentiator
   - Wire schedule button to backend
   - Emit ProofSlip on RON booking
   - Show booking confirmation

7. **Team Hub — Persist Tasks + Handoff ProofSlip** — _1d_ → Collaboration demo
   - Wire task creation to persistence
   - Connect handoff modal to backend
   - Emit ProofSlip on handoff creation

8. **Pricing — Entitlement Utility** — _0.5d_ → Consistent feature gating
   - Create `src/lib/entitlements.ts`
   - Implement hasFeature, requiresPlan functions
   - Update all feature checks to use utility

9. **Checkout — Advisor Checkout Stub** — _0.5d_ → Conversion path demo
   - Create checkout flow UI (no Stripe yet)
   - Mock payment confirmation
   - Show subscription activation

10. **/_smoke — Scenario Save Check** — _0.25d_ → Faster release confidence
    - Add SWAG scenario save/load test
    - Add project creation test
    - Display results in health dashboard

**Total Estimated Effort:** 6.5 days  
**Impact:** High — covers all five core tool areas with visible, demo-ready features

---

## Verification Methodology

This audit used the following verification methods:

1. **Code Analysis**: Direct examination of source files using file system tools
2. **Database Queries**: Actual SQL queries against Supabase to verify tables and RLS policies
3. **Route Configuration**: Review of router setup and lazy-loaded modules
4. **Component Testing**: Manual inspection of UI components and their props/state management
5. **Search Patterns**: Grep-style searches for hook usage, imports, and function calls

All "Verified: yes" flags indicate actual code/database confirmation, not assumptions.

---

## Next Steps

**Immediate (This Week)**:
1. Execute Top 10 fixes in priority order
2. Create PR for each fix with isolated changes
3. Update `/_smoke` tests as features are completed

**Short-term (Next 2 Weeks)**:
1. Complete entitlement enforcement across all features
2. Wire remaining persistence gaps in Team Hub
3. Implement notification system for attorney/task workflows

**Medium-term (Next Month)**:
1. Production Stripe integration
2. Advanced SWAG features (scenario sharing, advanced analytics)
3. Automated monitoring and alerting

---

**Report Owner:** Development Team  
**Report Date:** 2025-10-01  
**Next Review:** 2025-10-15 (post-Top 10 completion)

**Patch Log:** See `ops/release/PATCHLOG.md` for detailed change history.
