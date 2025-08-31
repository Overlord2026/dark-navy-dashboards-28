# Financial Advisor & CPA Persona - Wireframe & Sitemap

## Global Navigation Map

### Header (BrandHeader.tsx)
- **Class:** `bfo-header` (solid black with gold border)
- **Logo:** BFO logo (left)
- **Navigation:** 
  - Run NIL Demo
  - Marketplace → `/marketplace`
  - Advisors → `/marketplace/advisors`
  - CPAs → `/marketplace/cpas`
  - HQ · IP Filings → `/admin/ip`
  - Book Demo (external)
  - Log In (external)

### Subheader (PersonaSubHeader.tsx)
- **Class:** `bfo-subheader` (black with gold top/bottom borders)
- **Purpose:** Persona-specific navigation tabs
- **Used by:** Three-column layouts, advisor workspaces

## Route Tree - Financial Advisors

| Method | Path | Component | Guard/Public | Page Status | SEO Title |
|--------|------|-----------|--------------|-------------|-----------|
| GET | `/advisors` | Navigate redirect | Public | ✅ 200 | → /advisors/home |
| GET | `/advisors/home` | AdvisorsHome | Public | ✅ 200 | Advisor Dashboard |
| GET | `/advisors/leads` | LeadsPage | Public | ✅ 200 | Leads Management |
| GET | `/advisors/meetings` | MeetingsPage | Public | ✅ 200 | Meetings Schedule |
| GET | `/advisors/campaigns` | CampaignsPage | Public | ✅ 200 | Marketing Campaigns |
| GET | `/advisors/pipeline` | PipelinePage | Public | ✅ 200 | Sales Pipeline |
| GET | `/advisors/tools` | AdvisorTools | Public | ✅ 200 | Advisor Tools |
| GET | `/advisor/home` | Navigate redirect | Public | ✅ 200 | → /advisors/home |
| GET | `/marketplace/advisors` | MarketplaceAdvisors | Public | ✅ 200 | Find Expert Advisors |
| GET | `/marketplace/advisors/:id` | AdvisorProfile | Public | ✅ 200 | Advisor Profile |
| GET | `/pros/advisors` | AdvisorDashboardWithSideNav | Public | ✅ 200 | Advisor Persona Dashboard |

## Route Tree - CPAs/Accountants

| Method | Path | Component | Guard/Public | Page Status | SEO Title |
|--------|------|-----------|--------------|-------------|-----------|
| GET | `/cpas` | CPAAccountantIntroPage | Public | ✅ 200 | CPAs & Accountants Platform |
| GET | `/cpas/home` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/marketplace/cpas` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/marketplace/cpas/:id` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/personas/cpa` | AccountantPersonaDashboard | Public | ✅ 200 | CPA Persona Dashboard |
| GET | `/tools/tax-hub` | TaxHubPreview | Public | ✅ 200 | Tax Planning Hub |
| GET | `/tools/tax-projection` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/learn/ce` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/pros/cpas` | AccountantDashboard | Public | ✅ 200 | CPA Professional Dashboard |
| GET | `/accountant/dashboard` | AccountantDashboardPage | Public | ✅ 200 | CPA Dashboard |
| GET | `/accountant/onboarding` | AccountantOnboardingPage | Public | ✅ 200 | CPA Onboarding |

## Page Wireframes

### 1. `/advisors/home` - AdvisorsHome
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (bfo-header): [Logo] [Nav items] [Settings]         │
├─────────────────────────────────────────────────────────────┤
│ SUBHEADER (bfo-subheader): [Home][Leads][Meetings]...      │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT:                                               │
│ ┌─ Welcome Section ─────────────────────────────────────┐   │
│ │ "Good morning, Alex!"                               │   │
│ │ Badge: "Last updated: Now"                         │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Quick Actions (Grid) ────────────────────────────────┐   │
│ │ [+ Add Lead] [📅 Schedule] [📊 Pipeline] [🎯 Campaign]│   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Key Metrics (4-col grid) ────────────────────────────┐   │
│ │ [Active Leads: 24] [Meetings: 5] [Pipeline: $485K]  │   │
│ │ [Conversion: 18.5%]                                 │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Recent Activity ─────────────────────────────────────┐   │
│ │ • Client consultation completed (2h ago)            │   │
│ │ • New lead: Michael Chen (4h ago)                   │   │
│ │ • Proposal sent (1d ago)                           │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Classes: Standard shadcn Cards (NOT bfo-card)
```

### 2. `/marketplace/advisors` - MarketplaceAdvisors
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (bfo-header): [Logo] [Marketplace] [Advisors]...    │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT:                                               │
│ ┌─ Hero Section ────────────────────────────────────────┐   │
│ │ "Meet Our Expert Advisors"                           │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Filter Tags ─────────────────────────────────────────┐   │
│ │ [All] [Retirement] [Estate] [Investment] [Tax]...    │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Advisor Grid (3-col) ────────────────────────────────┐   │
│ │ ┌─ bfo-card ─┐ ┌─ bfo-card ─┐ ┌─ bfo-card ─┐         │   │
│ │ │[Avatar]    │ │[Avatar]    │ │[Avatar]    │         │   │
│ │ │Sarah J.    │ │Michael C.  │ │Olivia R.   │         │   │
│ │ │Sr Advisor  │ │Wealth Mgr  │ │Family Adv  │         │   │
│ │ │★ 4.9       │ │★ 4.8       │ │★ 4.7       │         │   │
│ │ │[Tags]      │ │[Tags]      │ │[Tags]      │         │   │
│ │ │[View Prof] │ │[View Prof] │ │[View Prof] │         │   │
│ │ └────────────┘ └────────────┘ └────────────┘         │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Classes: Uses bfo-card for advisor cards
```

### 3. `/cpas` - CPAAccountantIntroPage
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (bfo-header): [Logo] [CPAs] [Nav items]             │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT:                                               │
│ ┌─ Hero Section ────────────────────────────────────────┐   │
│ │ "CPAs & Accountants"                                 │   │
│ │ "Streamline your workflows, maximize client value"   │   │
│ │ [Get Started as a CPA] [Book Demo]                   │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Features Grid (3x2) ─────────────────────────────────┐   │
│ │ [Tax Optimization] [Entity Planning] [Client Portals] │   │
│ │ [Workflow Auto]    [Compliance]     [Revenue Tools]   │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Testimonials ────────────────────────────────────────┐   │
│ │ "Join 1,200+ CPAs Growing Their Practices"           │   │
│ │ Customer stories and stats                           │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ Pricing Tiers ───────────────────────────────────────┐   │
│ │ [Starter] [Professional] [Elite]                     │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Classes: Standard shadcn Cards (NOT bfo-card)
```

### 4. `/personas/cpa` - AccountantPersonaDashboard
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (bfo-header): [Logo] [Nav items]                    │
├─────────────────────────────────────────────────────────────┤
│ SUBHEADER (bfo-subheader): [Dashboard][Clients][Tools]...  │
├─────────────────────────────────────────────────────────────┤
│ THREE-COLUMN LAYOUT:                                        │
│ ┌─ Left ─┐ ┌─────── Main Content ──────┐ ┌─ Right ─┐      │
│ │ Nav    │ │ ┌─ CPA Overview ─────────┐ │ │ Recent │       │
│ │ Menu   │ │ │ • Active Clients: 42  │ │ │ Activity│       │
│ │        │ │ │ • Tax Season Progress │ │ │         │       │
│ │ • Home │ │ │ • CE Requirements     │ │ │ • New   │       │
│ │ • Tools│ │ └─────────────────────┘ │ │   client │       │
│ │ • CE   │ │                        │ │ • Filed  │       │
│ │ • Docs │ │ ┌─ Client Management ───┐ │ │   return│       │
│ │        │ │ │ Quick access to      │ │ │         │       │
│ │        │ │ │ client tools         │ │ │         │       │
│ │        │ │ └─────────────────────┘ │ │         │       │
│ └────────┘ └─────────────────────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────────┘

Classes: Standard layouts with persona dashboard
```

## Missing Components & Routes

### CPA Routes Needing Stubs
1. **Route:** `/cpas/home` - CPA workspace dashboard
2. **Route:** `/marketplace/cpas` - Find CPA professionals
3. **Route:** `/marketplace/cpas/:id` - Individual CPA profile
4. **Route:** `/tools/tax-projection` - Multi-year tax projector
5. **Route:** `/learn/ce` - Continuing education center

### Required Infrastructure
1. **Table:** `pro_inquiries` (for contact forms)
2. **Edge Function:** `pro-inquiry-email` (for inquiry handling)
3. **ProInquiryForm** component integration

## Brand Implementation Status

### Headers
- ✅ `bfo-header` properly implemented in BrandHeader.tsx
- ✅ `bfo-subheader` properly implemented in PersonaSubHeader.tsx
- ✅ Solid black background with gold borders
- ✅ No translucency issues

### Cards
- ✅ AdvisorCard.tsx uses `bfo-card`
- ✅ AdvisorHome.tsx converted to `bfo-card`
- ❌ AdvisorsHome.tsx still uses standard shadcn Cards
- ❌ CPAAccountantIntroPage.tsx uses standard Cards
- ❌ Other CPA pages need audit

### Buttons
- ⚠️ Mix of brand gold buttons and standard shadcn buttons
- ⚠️ Contact/CTA buttons need standardization