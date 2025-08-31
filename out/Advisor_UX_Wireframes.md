# Financial Advisor Persona - UX Analysis & Wireframes

## Persona Home Analysis

### Current Implementation
- **Primary Home:** `/advisors/home` (AdvisorsHome.tsx) - Modern tabbed interface
- **Legacy Home:** `/advisor/home` (AdvisorHome.tsx) - Brand-compliant with bfo-cards
- **Persona Hub:** `/pros/advisors` - Three-column layout

### Sections Present

#### `/advisors/home` (Primary)
- ✅ Welcome Section ("Good morning, Alex!")
- ✅ Quick Actions (4-grid: Add Lead, Schedule, Pipeline, Campaign)
- ✅ Key Metrics (4 stats: Leads, Meetings, Pipeline Value, Conversion)
- ✅ Recent Activity (activity feed with status badges)
- ❌ Learning/CE Section (missing)
- ❌ Receipts/Audit Trail (missing)
- ❌ Automations/Workflows (missing)

#### `/advisor/home` (Legacy - Better Brand Implementation)
- ✅ Quick Actions (bfo-card with gold headers)
- ✅ Recent Client Activity (bfo-card with receipt viewing)
- ✅ Share functionality
- ✅ Demo integration
- ❌ Key metrics dashboard
- ❌ Learning section

## Primary Tasks Assessment

### 1. Start Workspace ⭐ Critical
**Current:** Multiple entry points cause confusion
- `/advisors/home` - Modern but no brand consistency
- `/advisor/home` - Brand-compliant but feature-limited
- `/pros/advisors` - Persona dashboard

**Gap:** No unified "workspace launcher" that onboards new advisors

### 2. Book Demo ✅ Working
**Current:** Available via header navigation and embedded components
- RunNILDemo component in header
- AdvisorE2EDemo component in AdvisorHome

### 3. Explore Catalog ❌ Missing
**Current:** No dedicated advisor tool catalog
**Needed:** `/advisors/tools` exists but needs enhancement

### 4. Voice Assistant ❌ Missing
**Current:** No voice interface for advisors
**Note:** Assist console exists at `/k401/advisor/assist` but limited scope

## Gaps Analysis

### Publish-Critical Gaps

#### 1. Missing Advisor Profile Detail (404)
**Route:** `/marketplace/advisors/:id`
**Impact:** Broken user flow from marketplace listing
**Fix Required:** Create AdvisorProfile.tsx with contact inquiry form

```tsx
// src/pages/marketplace/AdvisorProfile.tsx
// TODO: flesh out per /out/Advisor_UX_Wireframes.md
import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdvisorProfile() {
  const { id } = useParams();
  
  return (
    <div className="px-6 md:px-10 py-10 text-white">
      <div className="bfo-card p-6 max-w-3xl">
        {/* Hero section with advisor info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-[#2b3b4e]"></div>
          <div>
            <h1 className="text-2xl font-semibold">Advisor Name</h1>
            <p className="text-gray-400">Senior Financial Advisor</p>
          </div>
          <div className="ml-auto text-[var(--bfo-gold)]">★ 4.9</div>
        </div>
        
        {/* Contact form */}
        <div className="mt-6">
          <button className="px-4 py-2 border border-[var(--bfo-gold)] text-[var(--bfo-gold)] rounded hover:bg-[var(--bfo-gold)] hover:text-black">
            Contact This Advisor
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 2. Inconsistent Brand Implementation
**Issue:** `/advisors/home` uses standard shadcn cards instead of bfo-card
**Impact:** Brand inconsistency across advisor interfaces

```tsx
// Fix for src/pages/advisors/AdvisorsHome.tsx (lines 141-163)
// Replace Card components with bfo-card sections:

<section className="bfo-card p-5">
  <h2 className="text-[var(--bfo-gold)] font-semibold mb-4">Quick Actions</h2>
  <div className="grid md:grid-cols-4 gap-4">
    {quickActions.map((action, index) => (
      <div 
        key={index}
        className="cursor-pointer hover:bg-white/5 transition-colors group p-4 rounded-lg border border-white/10"
        onClick={() => handleQuickAction(action)}
      >
        {/* Action content */}
      </div>
    ))}
  </div>
</section>
```

### Demo-Ready Gaps

#### 3. Missing Inquiry Persistence
**Issue:** No backend for advisor contact forms
**Tables Needed:** 
- `pro_inquiries` (prospect inquiries to advisors)
- `v_public_pros` (public advisor directory view)

```sql
-- Migration needed
CREATE TABLE public.pro_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pro_id uuid NOT NULL,
  persona text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  message text,
  consent_tos boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  receipt_hash text
);

CREATE VIEW public.v_public_pros AS
SELECT id, name, title, rating, tags, location, years_exp, avatar_url
FROM public.profiles 
WHERE role = 'advisor' AND is_public = true;
```

#### 4. Missing CE/Learning Hub
**Route:** `/advisors/learn` or `/advisors/ce`
**Purpose:** Continuing education tracking for advisors

```tsx
// src/pages/advisors/LearnPage.tsx (NEW)
export default function AdvisorLearnPage() {
  return (
    <div className="space-y-6">
      <section className="bfo-card p-5">
        <h2 className="text-[var(--bfo-gold)] font-semibold mb-3">CE Requirements</h2>
        {/* CE tracking dashboard */}
      </section>
      
      <section className="bfo-card p-5">
        <h2 className="text-[var(--bfo-gold)] font-semibold mb-3">Available Courses</h2>
        {/* Course catalog */}
      </section>
    </div>
  );
}
```

### Backlog Gaps

#### 5. Unified Workspace Entry
**Concept:** Single landing page that routes advisors to appropriate workspace
**Route:** `/advisors` (currently redirects)

#### 6. Voice Assistant Integration
**Concept:** Voice-activated tools for advisors during client meetings
**Integration:** Enhance existing `/k401/advisor/assist` for broader use

## Data Sources Referenced

### Supabase Tables
- `profiles` - Advisor profile data and role management
- `advisor_client_links` - Advisor-client relationships  
- `prospect_invitations` - Lead invitation tracking
- `pro_inquiries` - **MISSING** - Advisor contact requests
- `advisor_availability` - Meeting scheduling
- `accounting_clients` - Client management for accounting advisors

### Views Needed
- `v_public_pros` - **MISSING** - Public advisor directory
- `v_advisor_metrics` - **MISSING** - Performance dashboards

### Functions Referenced
- `send-pro-inquiry` - **MISSING** - Handle advisor contact forms
- `calculate_advisor_performance_metrics` - ✅ EXISTS - Performance tracking

## Suggested Implementation Priority

1. **Critical (Pre-launch):** Fix 404 advisor profile page
2. **Critical (Pre-launch):** Standardize bfo-card usage across advisor pages
3. **Demo-ready:** Implement advisor inquiry backend
4. **Demo-ready:** Create CE/learning hub
5. **Backlog:** Unified workspace concept
6. **Backlog:** Voice assistant expansion

## Mobile Considerations

- ✅ AdvisorsLayout uses responsive tabs
- ✅ BrandHeader is mobile-friendly
- ❌ bfo-cards need mobile optimization testing
- ❌ Touch targets for advisor selection in marketplace