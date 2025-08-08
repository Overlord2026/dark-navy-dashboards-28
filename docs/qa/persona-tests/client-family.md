# Client/Family QA Test Script

## Test Environment
- **Target URL**: my.bfocfo.com
- **Device**: Desktop + Mobile
- **Browser**: Chrome, Safari, Firefox

## Authentication Path
1. Navigate to `/login`
2. Use test credentials: family@test.com / TestPass123
3. Verify redirect to `/client-dashboard`

## Core User Journey

### 1. Dashboard Overview
- [ ] Client dashboard loads successfully
- [ ] Profile information displays correctly
- [ ] Navigation menu shows family-specific options
- [ ] Quick actions are visible and clickable

### 2. SWAG™ Retirement Roadmap
- [ ] Navigate to `/retirement-analyzer`
- [ ] Enter household profile (2 spouses, 2 children)
- [ ] Input current assets ($500K taxable, $200K 401k)
- [ ] Set retirement goals (age 65, $80K annual income)
- [ ] Verify 4-phase buckets display correctly
- [ ] Run Monte Carlo simulation
- [ ] Check SWAG Score™ calculation
- [ ] Export PDF report

### 3. Goal Setting & Tracking
- [ ] Navigate to `/goals`
- [ ] Create new retirement goal
- [ ] Set target amount and timeline
- [ ] Track progress visualization
- [ ] Save and verify persistence

### 4. Education Center
- [ ] Access education materials
- [ ] Browse retirement planning articles
- [ ] Test video/document playback
- [ ] Bookmark favorite resources

### 5. Collaboration Tools
- [ ] Invite advisor (if feature enabled)
- [ ] Share scenarios with family members
- [ ] Schedule consultation
- [ ] Access secure document vault

## Expected Outcomes
- All calculations render without errors
- PDF exports generate successfully
- Mobile navigation works smoothly
- Data persists between sessions
- Confetti animation triggers on goal achievement

## Screenshots to Capture
1. Client dashboard landing page
2. Retirement roadmap results
3. SWAG Score™ display
4. Goal tracking interface
5. Mobile responsive views

## Success Criteria
- Zero JavaScript errors in console
- Page load times under 3 seconds
- All CTAs functional
- Responsive design on mobile
- Data sync across devices