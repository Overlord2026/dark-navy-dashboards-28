# Financial Advisor QA Test Script

## Test Environment
- **Target URL**: my.bfocfo.com
- **Device**: Desktop + Tablet
- **Browser**: Chrome, Edge

## Authentication Path
1. Navigate to `/login`
2. Use test credentials: advisor@test.com / TestPass123
3. Verify redirect to `/advisor-dashboard`

## Core User Journey

### 1. Advisor Dashboard
- [ ] Dashboard loads with client overview
- [ ] Active client list displays
- [ ] Revenue metrics visible
- [ ] Quick action buttons functional

### 2. Client Management
- [ ] Navigate to client list
- [ ] Search and filter clients
- [ ] Open individual client profile
- [ ] Review client's SWAG Score™
- [ ] Update client notes

### 3. Prospect Invitation Flow
- [ ] Click "Invite Prospect" button
- [ ] Enter prospect email
- [ ] Customize invitation message
- [ ] Send magic link invitation
- [ ] Verify email delivery (check logs)
- [ ] Track invitation status

### 4. Retirement Planning Tools
- [ ] Access client's retirement analyzer
- [ ] Modify scenario parameters
- [ ] Compare multiple scenarios
- [ ] Generate side-by-side comparisons
- [ ] Export advisor-branded PDF

### 5. ROI Dashboard
- [ ] Navigate to `/advisor-roi`
- [ ] Review conversion metrics
- [ ] Analyze client acquisition cost
- [ ] Check retention rates
- [ ] Export business reports

### 6. Sales Assets
- [ ] Access presentation materials
- [ ] Download advisor-specific decks
- [ ] Customize client proposals
- [ ] Share materials with prospects

## Expected Outcomes
- Client data displays accurately
- Invitation system works end-to-end
- PDF exports include advisor branding
- Metrics calculations are correct
- Mobile interface remains functional

## Screenshots to Capture
1. Advisor dashboard overview
2. Client invitation modal
3. ROI metrics display
4. Comparative scenario analysis
5. Branded PDF export

## Success Criteria
- Prospect invitation email delivers
- Client scenarios save correctly
- Advisor branding appears on exports
- Performance metrics accurate
- Responsive on tablet devices