# Demo-Safe QA Checklist

## Quick Verification Guide

---

## 🔗 Routing & Links

### Public Routes
- [ ] **/** - Home page loads without errors
- [ ] **/discover** - Public discovery page accessible
- [ ] **Footer links** - All footer navigation works (no 404s)

### Family Routes
- [ ] **/family** - Family dashboard loads
- [ ] **/family/tools/retirement** - Retirement calculator accessible
- [ ] **/family/tools/roth** - Roth IRA calculator accessible
- [ ] **/family/tools/estate** - Estate planning tools accessible
- [ ] **/family/receipts** - Receipts page shows proof slips
- [ ] **All family tool links** - No broken internal navigation

### Advisor Routes
- [ ] **/advisors/home** - Advisor dashboard loads
- [ ] **/advisors/leads** - Leads management page accessible
- [ ] **/advisors/meetings** - Meetings page accessible
- [ ] **/advisors/campaigns** - Email campaigns page accessible
- [ ] **/advisors/pipeline** - Pipeline board accessible
- [ ] **/advisors/tools** - Advisor tools accessible

### Navigation Integrity
- [ ] **No 404 errors** on any footer links
- [ ] **No 404 errors** on any tool navigation
- [ ] **Breadcrumbs working** where applicable
- [ ] **Back navigation** functions properly

---

## ⚡ Actions & Receipt Generation

### Lead Capture Flow
- [ ] **Lead capture form** opens and submits successfully
- [ ] **Consent-RDS generated** after lead submission
- [ ] **Receipt visible** in /family/receipts or /advisors/receipts
- [ ] **Consent badge** shows on captured lead

### Meeting Flow
- [ ] **"Start Meeting" button** accessible and functional
- [ ] **Meeting transcript upload** or paste functionality works
- [ ] **AI summary generation** completes successfully
- [ ] **Decision-RDS recorded** for meeting
- [ ] **Vault-RDS generated** for file storage
- [ ] **Anchor reference** included in receipt
- [ ] **Proof slip visible** with all components ✓

### Email Campaign Flow
- [ ] **Playbook email templates** available
- [ ] **Send email** button functional
- [ ] **Comms-RDS generated** for each send
- [ ] **Compliance tracking** visible
- [ ] **Email status updates** reflected in dashboard

### Calculator Actions
- [ ] **Retirement calculator** form submits
- [ ] **Roth calculator** form submits
- [ ] **Estate planning** tools submit
- [ ] **Decision-RDS generated** for each calculation
- [ ] **Proof strip visible** after submission
- [ ] **Results displayed** with receipt reference

### Pipeline Management
- [ ] **Lead stage changes** via drag-and-drop
- [ ] **Decision-RDS generated** for stage moves
- [ ] **Audit trail** visible for pipeline changes
- [ ] **Status updates** reflect immediately

### Admin Verification
- [ ] **Receipts filter** by origin=advisor works
- [ ] **Admin audit page** accessible
- [ ] **"All pass" status** visible in audits
- [ ] **Receipt details** expandable and readable

---

## ♿ Accessibility Verification

### Keyboard Navigation
- [ ] **Tab navigation** reaches all action buttons
- [ ] **Enter key** activates buttons and links
- [ ] **Escape key** closes modals and dialogs
- [ ] **Arrow keys** navigate dropdown menus
- [ ] **Focus order** logical and intuitive

### Focus Indicators
- [ ] **Focus rings visible** on all interactive elements
- [ ] **High contrast** focus indicators
- [ ] **Focus not lost** during dynamic content updates
- [ ] **Skip links** available for main content

### Screen Reader Support
- [ ] **Button labels** descriptive and clear
- [ ] **Form labels** properly associated
- [ ] **Error messages** announced
- [ ] **Status updates** communicated
- [ ] **Modal titles** announced when opened

### Visual Accessibility
- [ ] **Color contrast** meets WCAG standards
- [ ] **Text readable** at 200% zoom
- [ ] **No information** conveyed by color alone
- [ ] **Icons have** text alternatives

### Component-Specific Checks
- [ ] **PublicFlagsBadge** shows tooltip on hover/focus
- [ ] **PublicFlagsBadge** routes to /admin/publish when clicked
- [ ] **Modal dialogs** properly announced
- [ ] **Form validation** messages accessible
- [ ] **Loading states** communicated to screen readers

---

## 🎯 Demo-Critical Flows

### 30-Second Happy Path (Families)
1. [ ] Navigate to /family
2. [ ] Click "Start Meeting" 
3. [ ] Upload transcript or paste text
4. [ ] Verify summary appears
5. [ ] Check proof slip in receipts
6. [ ] Confirm vault storage

### 30-Second Happy Path (Advisors)
1. [ ] Navigate to /advisors/leads
2. [ ] Capture new lead (consent recorded)
3. [ ] Move lead through pipeline stages
4. [ ] Send drip email (Comms-RDS)
5. [ ] Check admin audit trail
6. [ ] Verify "All pass" status

### Critical Error States
- [ ] **Network errors** handled gracefully
- [ ] **Form validation** messages clear
- [ ] **Loading states** visible
- [ ] **Empty states** informative
- [ ] **Error recovery** possible

---

## 📋 Pre-Demo Final Check

### Data Integrity
- [ ] **Test data** populated appropriately
- [ ] **Receipt timestamps** recent and accurate
- [ ] **Demo accounts** properly configured
- [ ] **No sensitive data** visible

### Performance
- [ ] **Page load times** under 3 seconds
- [ ] **Action responses** immediate feedback
- [ ] **No console errors** in browser dev tools
- [ ] **No network failures** in dev tools

### Visual Polish
- [ ] **Loading spinners** appropriate duration
- [ ] **Success animations** smooth
- [ ] **Error states** non-alarming
- [ ] **Typography** consistent throughout

---

## ✅ Sign-Off Checklist

- [ ] **All routing tests passed**
- [ ] **All action flows generate correct receipts**
- [ ] **All accessibility requirements met**
- [ ] **Demo flows rehearsed and timed**
- [ ] **Backup demo data prepared**
- [ ] **Error recovery procedures known**

**Demo Ready:** _____ (Initials & Date)

---

*Last Updated: Check before every demo*  
*Critical Issues: Stop demo if any ❌ found*  
*Minor Issues: Note for post-demo fixes*