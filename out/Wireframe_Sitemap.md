# Financial Advisor Persona - Wireframe & Sitemap

## Global Navigation Map

### Header (BrandHeader.tsx)
- **Class:** `bfo-header` (solid black with gold border)
- **Logo:** BFO logo (left)
- **Navigation:** 
  - Run NIL Demo
  - Marketplace → `/marketplace`
  - Advisors → `/marketplace/advisors`
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
| GET | `/marketplace/advisors/:id` | Missing | Public | ❌ 404 | **NEEDS STUB** |
| GET | `/pros/advisors` | AdvisorDashboardWithSideNav | Public | ✅ 200 | Advisor Persona Dashboard |

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

### 3. `/advisor/home` - AdvisorHome (Legacy, different from /advisors/home)
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (bfo-header): [Logo] [Nav items]                    │
├─────────────────────────────────────────────────────────────┤
│ MAIN CONTENT:                                               │
│ ┌─ Persona Hero ────────────────────────────────────────┐   │
│ │ "Advisor Dashboard" with segment display             │   │
│ │ [60-sec Demo] [Share] buttons                       │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ bfo-card: Quick Actions ─────────────────────────────┐   │
│ │ H2: "Quick Actions" (gold text)                      │   │
│ │ Grid of tool cards with icons                       │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌─ bfo-card: Recent Client Activity ────────────────────┐   │
│ │ H2: "Recent Client Activity" (gold text)            │   │
│ │ List of recent proof slips/receipts                 │   │
│ │ [View All Receipts] button                          │   │
│ └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Classes: Uses bfo-card for main sections
```

## Missing Components & Routes

### 1. Advisor Profile Detail Page
- **Route:** `/marketplace/advisors/:id`
- **Status:** 404 - Missing
- **Required:** Individual advisor profile with contact form

### 2. Advisor Inquiry Flow
- **Table:** `pro_inquiries` (check if exists)
- **Edge Function:** `send-pro-inquiry` (check if exists)
- **Status:** Needs verification

### 3. Advisor CE/Learning Hub
- **Route:** `/advisors/learn` or `/ce/advisors`
- **Status:** Not found
- **Purpose:** Continuing education for advisors

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
- ❌ Other advisor pages need audit

### Buttons
- ⚠️ Mix of brand gold buttons and standard shadcn buttons
- ⚠️ Contact/CTA buttons need standardization