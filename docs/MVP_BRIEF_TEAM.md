# My.BFOCFO MVP Brief

**Date:** 2025-09-14  
**Environment:** Dev/Preview  
**Contact:** (owner)

## Document Sources
✅ Found: PROJECT_CANON.md, PROJECT_INDEX.json, PERSONA_ADVISORS.md, PERSONA_FAMILIES.md, DATA_CANON.md, NAV_UX_GAPS.md, TECH_DEBT_SCAN.md, MVP_READINESS_ADVISORS.md, MVP_READINESS_FAMILIES.md, MVP_PLAN_SUMMARY.md  
❌ Missing: TOOLS_INDEX.json, TOOLS_AUDIT.md

---

## Executive Summary

• **Current Product**: 31 routes, 8 core tools, 6 personas (advisors, accountants, attorneys, insurance, families) with working authentication and onboarding flows
• **MVP Scope**: Advisor → Invite Families → Shared Financial Tools workflow with persona-scoped access control and unified navigation experience
• **Core Tools Status**: Goals (✅), Transactions (✅), Cash Flow (✅), Reports (🚧 stub), Accounts (❌ missing), Budget (✅), Investments (✅), Advice (✅)
• **Navigation State**: Multiple conflicting systems (SecondaryNav, PersonaSideNav, MegaMenu) consuming 216px vertical space with no unified sidebar
• **Data Foundation**: Supabase with 75+ tables, RLS policies, Edge Functions, audit logging, and receipt system for compliance
• **P0 Blockers**: Missing Accounts tool, incomplete Reports tool, navigation fragmentation, route conflicts, service worker cache risks
• **Technical Debt**: 3,156+ console statements, route conflicts, React duplication risks, multiple persona switcher implementations
• **MVP Outcome**: Enables advisors to invite families into shared financial workspace with unified tool access, audit trails, and secure document management

---

## Current Product Map

### Key Routes → Components → Purpose

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `src/pages/LandingPage.tsx` | Main landing with hero and features |
| `/auth` | `src/pages/AuthPage.tsx` | Unified authentication (OAuth, magic links) |
| `/onboarding/advisor` | `src/pages/AdvisorOnboardingPage.tsx` | Advisor credential verification |
| `/onboarding/family` | `src/pages/FamilyOnboardingPage.tsx` | Family financial profile creation |
| `/invite/:token` | `src/pages/InvitePage.tsx` | Magic link invitation handling |
| `/pros/advisors` | `src/pages/AdvisorsPage.tsx` | Financial advisors hub |
| `/families` | `src/pages/FamiliesPage.tsx` | Family overview and segments |
| `/goals` | `src/pages/GoalsPage.tsx` | Financial goals management |
| `/transactions` | `src/features/transactions/pages/TransactionsPage.tsx` | Transaction categorization |
| `/cashflow` | `src/features/cashflow/pages/CashFlowPage.tsx` | Cash flow analysis |
| `/reports` | `src/pages/ReportsPage.tsx` | Financial reporting (stub) |
| `/accounts` | `src/pages/AccountsPage.tsx` | Account management (stub) |

### Personas → Hub Pages

| Persona | Hub Path | Hub File | Features |
|---------|----------|----------|----------|
| Financial Advisors | `/pros/advisors` | `src/pages/AdvisorsPage.tsx` | Client management, prospect invitations |
| CPAs/Accountants | `/pros/accountants` | `src/pages/AccountantsPage.tsx` | Tax planning, client coordination |
| Attorneys | `/pros/attorneys` | `src/pages/AttorneysPage.tsx` | Estate planning, legal documents |
| Insurance (Life) | `/pros/insurance/life` | `src/pages/LifeInsurancePage.tsx` | Policy management, needs analysis |
| Insurance (Other) | `/pros/insurance/other` | `src/pages/OtherInsurancePage.tsx` | P&C, Medicare, LTC insurance |
| Families | `/families` | `src/pages/FamiliesPage.tsx` | Wealth management, advisor coordination |

---

## Tools & Calculators Overview

### Core Financial Tools

| Tool | Route | Primary Personas | Data Source | Status & Notes |
|------|-------|-----------------|-------------|----------------|
| Reports | `/reports` | All | Mock | ❌ Stub implementation only |
| Cash Flow | `/cashflow` | All | Mock API hooks | ✅ Feature complete with projections |
| Transactions | `/transactions` | All | Mock API hooks | ✅ Feature complete with categorization |
| Accounts | `/accounts` | All | None | ❌ Stub only - critical workflow blocker |
| Goals | `/goals` | All | Live (Supabase) | ✅ Feature complete with family focus |
| Budget | `/budgets` | All | Mock | ✅ Budget creation and variance analysis |
| Investments | `/investments` | All | Mock | ✅ Portfolio management interface |
| Advice | `/advice` | All | Mock | ✅ Advisory recommendations interface |

### Wealth Management Sub-Tools

| Tool | Route | Description |
|------|-------|-------------|
| Cash Management | `/wealth/cash/management` | Cash optimization tools |
| Transfers | `/wealth/cash/transfers` | Account transfer management |
| Properties | `/wealth/properties` | Real estate portfolio |
| Documents & Vault | `/wealth/docs` | Secure document storage |
| Social Security | `/wealth/social-security` | SSA benefit optimization |
| Business Filings | `/wealth/business-filings` | Business entity management |
| Bill Pay | `/wealth/bill-pay` | Payment processing |

### Notable Gaps
- **Reports Tool**: Shell implementation only, critical for advisor client reporting
- **Accounts Tool**: Complete stub, core financial management missing
- **Tool Context**: Some tools show family-focused copy in advisor workflows

---

## Advisors & Families — MVP Readiness Snapshot

### Advisor Tools Readiness

| Tool | Navigation | Render | Empty States | Data | Status |
|------|-----------|--------|--------------|------|--------|
| Reports | ✅ | ❌ | ❌ | Mock | 🚧 Stub only |
| Cash Flow | ✅ | ✅ | ✅ | Mock | ✅ Complete |
| Transactions | ✅ | ✅ | ✅ | Mock | ✅ Complete |
| Accounts | ✅ | ❌ | ❌ | None | ❌ Missing |
| Goals | ✅ | ✅ | ✅ | Live | ✅ Complete |

### Family Tools Readiness

| Tool | Navigation | Render | Empty States | Data | Status |
|------|-----------|--------|--------------|------|--------|
| Reports | ❌ | ❌ | ❌ | Mock | 🚧 Generic only |
| Cash Flow | ✅ | ✅ | ✅ | Mock | ✅ Complete |
| Transactions | ✅ | ✅ | ✅ | Mock | ✅ Complete |
| Accounts | ✅ | ❌ | ❌ | None | ❌ Missing |
| Goals | ✅ | ✅ | ✅ | Live | ✅ Excellent |

### P0 Blockers

1. **Accounts Tool Missing** - `src/App.tsx:401,483` → core workflow blocker
2. **Reports Tool Incomplete** - `src/pages/ReportsPage.tsx` → essential for advisor reporting  
3. **Navigation Fragmentation** - `src/App.tsx:372-373` → no unified family sidebar
4. **Route Conflicts** - `src/App.tsx:396,482` → duplicate `/reports` routes

---

## Navigation & UX

### Current vs MVP Navigation

| Current | Issues | MVP Target |
|---------|--------|------------|
| TopBanner + BrandHeader + SecondaryNav | 216px vertical space consumed | Single unified sidebar |
| Multiple PersonaSwitcher implementations | No single source of truth | Consistent persona switching |
| PersonaSideNav context-specific | No active route highlighting | Monarch-style workspace sidebar |
| Route fragmentation | `/families/*` vs `/family/*` patterns | Consistent route structure |

### A11y & Typography (P0/P1 Only)

**P0 Issues:**
- No systematic font scaling (mixed Tailwind/inline styles)
- Missing ARIA labeling on interactive elements
- No unified design system implementation

**P1 Issues:**
- Limited keyboard navigation support
- Inconsistent focus management
- Mixed color systems (text-bfo-gold, inline colors)

---

## Data & Security

### Supabase Objects Used

**Core Tables:** profiles, user_events, user_onboarding, user_tenants, personas, persona_sessions

**Financial Data:** portfolio_positions, portfolio_targets, rebalancing_events, fund_returns_unsmoothed, risk_metrics

**Professional Services:** accounting_clients, accounting_entities, attorney_documents, cpa_staff, accountant_ce_records

**Compliance:** receipts, anchors, aies_receipts, audit_logs, admin_audit_logs, evidence_packages

**CRM & Analytics:** leads, lead_routing_decisions, vip_invites, prospect_invitations, analytics_events

### Auth Flows

**OAuth/PKCE:** `supabase.auth.signInWithOAuth({ provider: 'google' })`

**Session Handling:** `supabase.auth.getSession()`, `supabase.auth.getUser()`

**Magic Links:** `supabase.auth.signInWithOtp({ email })`

### RLS/Security Notes

- Standard user access: `auth.uid() = user_id`
- Tenant isolation: `tenant_id = get_current_user_tenant_id()`
- Admin override: `auth.uid() = user_id OR has_role(auth.uid(), 'admin')`
- Service role bypass: `auth.role() = 'service_role'`
- Complex relationship patterns for hierarchical access control

---

## Tech Debt & Risk

### Top 5 Risks

1. **Service Worker Development Cache** → Add `NODE_ENV` check before SW registration (`src/main.tsx:32`)
2. **Route Conflicts** → Remove global `/reports` route, force persona-scoped access (`src/App.tsx:396,482`)
3. **Console Log Production** → Implement build-time log stripping (3,156+ statements across 1,071 files)
4. **Navigation Redirect Chains** → Consolidate redirects, use canonical routes (`src/App.tsx:490-493`)
5. **React Duplication Risk** → Add bundle analyzer to verify single React instance (`vite.config.ts:19,22`)

---

## MVP Plan

### P0 Changes (≤5 items)

1. **Implement Accounts Tool** - `src/App.tsx:401,483`, create `src/features/accounts/pages/AccountsPage.tsx`
   - **Acceptance:** Account management interface replaces stub

2. **Complete Reports Tool** - `src/pages/ReportsPage.tsx`, `src/components/reports/ReportsPage.tsx`
   - **Acceptance:** Report generation and display functionality

3. **Fix Navigation Fragmentation** - `src/App.tsx:372-373`, `src/components/layout/SecondaryNav.tsx`
   - **Acceptance:** Unified sidebar for families, remove SecondaryNav

4. **Resolve Route Conflicts** - `src/App.tsx:396,482`
   - **Acceptance:** Single `/reports` route with persona scoping

5. **Service Worker Production Safety** - `src/main.tsx:32`, `src/lib/pwa.ts:4`
   - **Acceptance:** SW only registers in production with environment check

### P1 Changes (≤5 items)

1. **Consolidate Persona Switchers** - `src/components/nav/PersonaSwitcher.tsx`, `src/components/consent/PersonaSwitcher.tsx`, `src/components/p5/PersonaSwitcher.tsx`
2. **Fix Context Mismatches** - `src/pages/GoalsPage.tsx:120-122`
3. **Implement Active Route Highlighting** - `src/components/persona/PersonaSideNav.tsx:12-16`
4. **Add Missing Empty States** - Reports and Accounts pages
5. **Production Log Cleanup** - 1,071 files with console statements

### Sprint Sequence (1-2 Sprints)

**Sprint 1: Core Functionality**
- [ ] Week 1: Implement Accounts Tool (P0 #1)
- [ ] Week 2: Complete Reports Tool (P0 #2)

**Sprint 2: Navigation & UX Consistency**
- [ ] Week 3: Fix Navigation Fragmentation (P0 #3)
- [ ] Week 4: Route & Service Worker Fixes (P0 #4, #5)

---

## KPI & Beta Plan

### Suggested MVP KPIs
- **#invites sent** - Advisor → Family invitation volume
- **#families onboarded** - Successful family account creation rate
- **DAU on /reports** - Daily active users accessing reporting tools
- **Completion of linking flow** - End-to-end advisor-family connection rate

### Beta Channels
- **Existing clients (advisors)** - Leverage current advisor user base
- **Feedback loop** - (feedback mechanism not documented)

---

## Appendix

### Source Documentation
- `docs/PROJECT_CANON.md` - Application structure and routing
- `docs/PROJECT_INDEX.json` - Machine-readable project index
- `docs/PERSONA_ADVISORS.md` - Advisor tool mapping
- `docs/PERSONA_FAMILIES.md` - Family tool mapping
- `docs/DATA_CANON.md` - Database and auth patterns
- `docs/NAV_UX_GAPS.md` - Navigation consistency analysis
- `docs/TECH_DEBT_SCAN.md` - Technical debt and risks
- `docs/MVP_READINESS_ADVISORS.md` - Advisor readiness checklist
- `docs/MVP_READINESS_FAMILIES.md` - Family readiness checklist
- `docs/MVP_PLAN_SUMMARY.md` - Prioritized planning document

### Machine Index Excerpt
```json
{
  "stats": {
    "totalRoutes": 31,
    "totalTools": 8,
    "totalPersonas": 6,
    "totalWealthTools": 7,
    "headerComponents": 2,
    "sidebarComponents": 3,
    "configFiles": 8
  }
}
```

**Sample Routes:** `/` → LandingPage, `/pros/advisors` → AdvisorsPage, `/families` → FamiliesPage, `/goals` → GoalsPage, `/transactions` → TransactionsPage, `/cashflow` → CashFlowPage