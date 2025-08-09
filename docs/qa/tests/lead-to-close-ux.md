# Lead-to-Close UX Testing Guide

## Test Overview
This document provides comprehensive testing procedures for the Lead-to-Sales Closure module UX improvements.

## Test Environment Setup
- **Desktop**: Chrome/Safari, 1920x1080
- **Mobile**: Chrome/Safari, 375x667 (iPhone SE), 414x896 (iPhone 11)
- **Test Data**: Use existing demo leads or create new test leads

## Desktop Testing (15 steps)

### 1. Lead Card Quick Actions
**Test ID**: LTC-D001
**Objective**: Verify quick action bar functionality on lead cards
**Steps**:
1. Navigate to `/crm` 
2. Locate a lead card in any pipeline stage
3. Verify quick action bar displays: Call, SMS, Email, Book, Note, Task
4. Click each action button
5. Verify appropriate modals/handlers trigger
**Expected**: All actions respond correctly, no errors in console

### 2. Post-Meeting Outcome Modal
**Test ID**: LTC-D002
**Objective**: Test post-meeting outcome selection
**Steps**:
1. Trigger `meeting_completed` analytics event
2. Verify PostMeetingOutcomeModal opens automatically
3. Test all outcome options: Qualified, Not Now, Needs Proposal, Disqualified
4. Select outcome and submit
5. Verify analytics event `lead_outcome_set` fires
6. Confirm lead stage advances and next task creates
**Expected**: Modal functions properly, events fire, pipeline updates

### 3. AI Objection Tracker
**Test ID**: LTC-D003
**Objective**: Validate objection detection and display
**Steps**:
1. Navigate to lead detail with meeting summaries
2. Open ObjectionTracker component
3. Verify it reads from meeting_summaries API
4. Check for highlighted objections: price, timing, authority, need
5. Verify confidence scores display
**Expected**: Objections detected and displayed with confidence metrics

### 4. Smart Cadence Panel
**Test ID**: LTC-D004
**Objective**: Test automated cadence triggers
**Steps**:
1. Open SmartCadencePanel in settings
2. Configure preset: "48h no-reply → propose time"
3. Configure: "price objection → include /value-calculator link"
4. Configure: "thinking → send SWAG roadmap preview"
5. Test trigger conditions
6. Verify analytics event `smart_cadence_triggered` fires
**Expected**: Cadences configure and trigger properly

### 5. Compliance Flag Overlay
**Test ID**: LTC-D005
**Objective**: Test transcript compliance checking
**Steps**:
1. Open transcript with potential compliance issues
2. Verify TranscriptComplianceFlags runs keyword checks
3. Check for non-blocking badge display on flagged lines
4. Click "Request Review" button
5. Verify `compliance_review_requested` analytics event
**Expected**: Flags appear, review request works, no blocking behavior

### 6. Win/Loss Learning Loop
**Test ID**: LTC-D006
**Objective**: Validate win/loss reason tracking
**Steps**:
1. Change lead stage to "closed_won" or "closed_lost"
2. Verify WinLossPicker modal appears
3. Select reason from predefined options
4. Submit selection
5. Verify `win_loss_reason_selected` analytics event fires
6. Check storage as analytics event only
**Expected**: Picker appears, reasons tracked via analytics

### 7. A/B Testing Hooks
**Test ID**: LTC-D007
**Objective**: Test A/B experiment framework
**Steps**:
1. Test `ab('leadEmailCTA_v1')` on Lead Intake submit
2. Test A/B on Proposal follow-up CTA
3. Test A/B on Value calculator link
4. Verify experiment assignment consistency
5. Check analytics tracking of variant exposure
**Expected**: A/B tests work, variants assigned consistently

### 8. ROI Dashboard Enhancements
**Test ID**: LTC-D008
**Objective**: Test agency KPI additions
**Steps**:
1. Navigate to enhanced ROI dashboard
2. Verify Time-to-First-Contact metric displays
3. Check First-Response SLA% metric
4. Validate Advisor Responsiveness score
5. Test cohort charts by campaign
6. Click "Export Slides" button
7. Verify PNG/PDF generation for deck hub
**Expected**: All KPIs display, export works

### 9. Settings Integration
**Test ID**: LTC-D009
**Objective**: Test settings page integration
**Steps**:
1. Navigate to `/settings/automation`
2. Verify automation toggles display
3. Test smart cadence configuration
4. Navigate to `/settings/compliance`
5. Test compliance flag configuration
**Expected**: Settings pages accessible and functional

### 10. Win-Loss Insights Page
**Test ID**: LTC-D010
**Objective**: Test admin insights page
**Steps**:
1. Navigate to `/admin/insights/win-loss` (admin only)
2. Verify weekly digest summary displays
3. Check win/loss themes aggregation
4. Test filtering by date range
5. Verify coaching recommendations appear
**Expected**: Insights page loads, data displays correctly

### 11. Feature Flag Compliance
**Test ID**: LTC-D011
**Objective**: Verify feature flags work properly
**Steps**:
1. Test with `advisorPro` flag enabled/disabled
2. Test with `advisorPremium` flag enabled/disabled  
3. Verify quick actions respect feature flags
4. Check premium features are gated correctly
**Expected**: Features show/hide based on flags

### 12. Analytics Event Validation
**Test ID**: LTC-D012
**Objective**: Confirm all new analytics events fire
**Steps**:
1. Open browser dev tools, monitor network
2. Trigger: `lead_quick_action_clicked`
3. Trigger: `lead_outcome_set`
4. Trigger: `ai_objection_detected`
5. Trigger: `smart_cadence_triggered`
6. Trigger: `compliance_review_requested`
7. Trigger: `win_loss_reason_selected`
**Expected**: All events fire with correct payload structure

### 13. Performance Testing
**Test ID**: LTC-D013
**Objective**: Validate performance with large datasets
**Steps**:
1. Load pipeline with 100+ leads
2. Test scrolling performance
3. Test filter/search responsiveness
4. Verify lazy loading works for modals
5. Check memory usage stays reasonable
**Expected**: Smooth performance, no lag or memory leaks

### 14. Error Handling
**Test ID**: LTC-D014
**Objective**: Test error scenarios
**Steps**:
1. Test with network disconnected
2. Test with invalid data responses
3. Test edge function failures
4. Verify graceful degradation
5. Check error messages are user-friendly
**Expected**: Graceful error handling, helpful messages

### 15. Integration Testing
**Test ID**: LTC-D015
**Objective**: Test end-to-end workflows
**Steps**:
1. Complete full lead-to-close workflow
2. Use all new features in sequence
3. Verify data consistency across components
4. Test feature interactions
5. Validate final outcomes
**Expected**: Complete workflow works seamlessly

## Mobile Testing (10 steps)

### 16. Mobile Lead Card Layout
**Test ID**: LTC-M001
**Objective**: Test mobile-optimized lead cards
**Steps**:
1. View pipeline on 375px width
2. Verify condensed card variant activates
3. Test touch targets (min 44px)
4. Check quick action bar adapts to mobile
5. Verify horizontal scrolling if needed
**Expected**: Cards adapt properly, touch targets adequate

### 17. Mobile Quick Actions
**Test ID**: LTC-M002
**Objective**: Test quick actions on mobile
**Steps**:
1. Test quick action bar on mobile
2. Verify sticky positioning works
3. Test touch interactions for all actions
4. Check modal behavior on small screens
5. Verify swipe gestures work
**Expected**: Actions work smoothly on mobile

### 18. Mobile Modal Behavior
**Test ID**: LTC-M003
**Objective**: Test modals on mobile devices
**Steps**:
1. Test PostMeetingOutcomeModal on mobile
2. Verify lazy loading for mobile modals
3. Test keyboard behavior and focus
4. Check viewport adjustment
5. Test modal dismissal methods
**Expected**: Modals are mobile-friendly and accessible

### 19. Mobile Navigation
**Test ID**: LTC-M004
**Objective**: Test mobile navigation enhancements
**Steps**:
1. Test settings navigation on mobile
2. Verify responsive menu behavior
3. Test deep linking to new routes
4. Check breadcrumb behavior
5. Test back button functionality
**Expected**: Navigation works smoothly on mobile

### 20. Mobile Performance
**Test ID**: LTC-M005
**Objective**: Validate mobile performance
**Steps**:
1. Test loading times on 3G network
2. Check image optimization
3. Test bundle size impact
4. Verify smooth animations
5. Check battery usage patterns
**Expected**: Good performance on mobile devices

### 21. Mobile Compliance Features
**Test ID**: LTC-M006
**Objective**: Test compliance features on mobile
**Steps**:
1. Test transcript compliance flags on mobile
2. Verify "Request Review" button accessibility
3. Test flag overlay on small screens
4. Check text readability
5. Verify gesture interactions
**Expected**: Compliance features work well on mobile

### 22. Mobile A/B Testing
**Test ID**: LTC-M007
**Objective**: Test A/B framework on mobile
**Steps**:
1. Test A/B variants on mobile layouts
2. Verify consistent assignment across sessions
3. Test CTA variations on mobile
4. Check analytics tracking on mobile
5. Verify no layout breaking
**Expected**: A/B tests work consistently on mobile

### 23. Mobile Settings Access
**Test ID**: LTC-M008
**Objective**: Test settings pages on mobile
**Steps**:
1. Access `/settings/automation` on mobile
2. Test toggle interactions with touch
3. Verify form usability on small screens
4. Test save/cancel behavior
5. Check error states on mobile
**Expected**: Settings are fully functional on mobile

### 24. Mobile ROI Dashboard
**Test ID**: LTC-M009
**Objective**: Test ROI dashboard mobile experience
**Steps**:
1. View enhanced ROI dashboard on mobile
2. Test chart responsiveness
3. Verify KPI card layout
4. Test export functionality on mobile
5. Check data table horizontal scrolling
**Expected**: Dashboard is mobile-optimized and functional

### 25. Mobile End-to-End
**Test ID**: LTC-M010
**Objective**: Complete mobile workflow testing
**Steps**:
1. Complete full lead management workflow on mobile
2. Test all new features in mobile context
3. Verify cross-device consistency
4. Test offline behavior if applicable
5. Validate final user experience
**Expected**: Complete mobile experience is smooth and functional

## Success Criteria
- All 25 tests pass without critical issues
- Performance remains within acceptable bounds
- Mobile experience is fully functional
- Analytics events fire correctly
- Feature flags work as intended
- Error handling is graceful
- Accessibility standards met

## Test Data Requirements
- Minimum 10 test leads across different stages
- Sample meeting summaries with objections
- Test transcripts with compliance keywords
- Various campaign data for ROI testing
- User accounts with different feature flag settings

## Reporting
Document all test results, including:
- Pass/fail status for each test
- Performance metrics
- Browser compatibility notes
- Mobile device testing results
- Identified bugs or issues
- Recommendations for improvements