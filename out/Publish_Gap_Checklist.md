# Financial Advisor Persona - Publish Gap Checklist

## Critical Issues (Pre-Launch)

| Item | Persona | Route/File | Severity | Owner | Suggested Patch | Status |
|------|---------|------------|----------|-------|----------------|--------|
| Missing advisor profile detail page | Advisor | `/marketplace/advisors/:id` | Critical | HQ | [Create AdvisorProfile.tsx](#advisor-profile-stub) | Fixed |
| Inconsistent brand card usage | Advisor | `src/pages/advisors/AdvisorsHome.tsx` | Critical | HQ | [Convert to bfo-card](#brand-consistency-fix) | Open |
| Missing inquiry persistence backend | Advisor | Backend tables/functions | Critical | HQ | [Add pro_inquiries table](#inquiry-backend) | Open |

## Demo-Ready Issues

| Item | Persona | Route/File | Severity | Owner | Suggested Patch | Status |
|------|---------|------------|----------|-------|----------------|--------|
| No CE/Learning hub for advisors | Advisor | `/advisors/learn` (missing) | Medium | HQ | [Create learning hub](#learning-hub) | Open |
| Limited tool catalog presentation | Advisor | `src/pages/advisors/AdvisorTools.tsx` | Medium | HQ | [Enhance tools page](#tools-enhancement) | Open |
| Missing voice assistant integration | Advisor | Various advisor pages | Low | HQ | [Voice integration](#voice-assistant) | Open |

## Backlog Items

| Item | Persona | Route/File | Severity | Owner | Suggested Patch | Status |
|------|---------|------------|----------|-------|----------------|--------|
| Unified workspace entry concept | Advisor | `/advisors` redirect logic | Low | HQ | [Workspace launcher](#workspace-launcher) | Open |
| Mobile touch optimization | Advisor | All advisor pages | Low | HQ | [Mobile optimization](#mobile-fixes) | Open |
| Analytics dashboard integration | Advisor | Performance metrics display | Low | HQ | [Analytics widgets](#analytics-integration) | Open |

---

## Patch Details

### <a id="advisor-profile-stub"></a>Create AdvisorProfile.tsx
**File:** `src/pages/marketplace/AdvisorProfile.tsx`
**Status:** ✅ Fixed
```tsx
// Minimal advisor profile page created with:
// - Hero section with advisor info
// - Contact button (placeholder)
// - Navigation back to marketplace
// - Uses bfo-card styling
```

### <a id="brand-consistency-fix"></a>Convert AdvisorsHome to bfo-card
**File:** `src/pages/advisors/AdvisorsHome.tsx`
**Lines:** 137-186 (Quick Actions and Stats sections)
```tsx
// Replace Card components with bfo-card sections
<section className="bfo-card p-5">
  <h2 className="text-[var(--bfo-gold)] font-semibold mb-4">Quick Actions</h2>
  {/* Convert card grid to styled divs */}
</section>

<section className="bfo-card p-5">
  <h2 className="text-[var(--bfo-gold)] font-semibold mb-4">Key Metrics</h2>
  {/* Convert stats cards */}
</section>
```

### <a id="inquiry-backend"></a>Add Inquiry Backend
**Tables:** `pro_inquiries`, `v_public_pros`
**Edge Function:** `send-pro-inquiry`
```sql
-- Create inquiry tracking table
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

-- RLS policies for security
ALTER TABLE public.pro_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert inquiries" ON public.pro_inquiries 
  FOR INSERT WITH CHECK (true);
```

### <a id="learning-hub"></a>Create Learning Hub
**File:** `src/pages/advisors/LearnPage.tsx` (new)
**Route:** Add to AdvisorsLayout
```tsx
// CE tracking dashboard for advisors
// Requirements display
// Course catalog integration
// Progress tracking
```

### <a id="tools-enhancement"></a>Enhance Tools Page
**File:** `src/pages/advisors/AdvisorTools.tsx`
```tsx
// Convert to bfo-card layout
// Add tool categories
// Include search/filter functionality
// Link to tool-specific pages
```

### <a id="voice-assistant"></a>Voice Integration
**Concept:** Expand `/k401/advisor/assist` functionality
```tsx
// Voice commands for:
// - Note taking during meetings
// - Quick client lookups
// - Schedule management
// - Report generation
```

### <a id="workspace-launcher"></a>Workspace Launcher
**File:** `src/pages/advisors/WorkspaceLauncher.tsx` (new)
```tsx
// Smart routing based on:
// - Advisor experience level
// - Current active clients
// - Time of day
// - Recent activity
```

### <a id="mobile-fixes"></a>Mobile Optimization
**Files:** Various advisor pages
```css
/* Touch-friendly button sizes */
.bfo-card button {
  min-height: 44px;
  min-width: 44px;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .advisor-grid {
    grid-template-columns: 1fr;
  }
}
```

### <a id="analytics-integration"></a>Analytics Integration
**Files:** Dashboard components
```tsx
// Performance widgets
// Client engagement metrics
// Revenue tracking
// Goal progress indicators
```

---

## Next Steps

1. **Fix critical 404 issue** ✅ Done
2. **Standardize brand implementation** (AdvisorsHome.tsx)
3. **Implement inquiry backend** (Database + Edge Function)
4. **Create learning hub** (CE tracking for advisors)
5. **Enhance mobile experience** (Touch optimization)

## Summary

- **Routes audited:** 13 advisor-related routes
- **Critical fixes:** 3 items
- **Demo-ready items:** 3 items  
- **Backlog items:** 3 items
- **Files created:** 2 (AdvisorProfile.tsx + route)
- **Brand consistency:** 60% (needs improvement in AdvisorsHome)