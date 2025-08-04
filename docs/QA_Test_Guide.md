# Professional Onboarding QA Test Guide

## Complete End-to-End Testing Flow

### 1. **LinkedIn OAuth Flow Test**

#### Test Steps:
1. Navigate to `/join-pros` landing page
2. Click "Sign in with LinkedIn" button
3. **GDPR Consent Modal should appear**
   - ✅ Modal displays privacy information
   - ✅ User must consent before proceeding
   - ✅ "I consent" button enables LinkedIn auth
4. **LinkedIn Authorization**
   - ✅ Redirected to LinkedIn OAuth page
   - ✅ User grants permissions
   - ✅ Redirected back to `/pro-onboarding`
5. **Profile Import**
   - ✅ Success message appears
   - ✅ Form fields pre-filled with LinkedIn data
   - ✅ Profile photo imported (if available)
   - ✅ Work experience imported
   - ✅ Education imported

#### Expected Results:
- All LinkedIn data properly imported
- No console errors
- Smooth redirect flow
- GDPR compliance modal works

---

### 2. **Profile Creation Flow Test**

#### Step 1: Basic Information
- ✅ Name field pre-filled from LinkedIn
- ✅ Email field pre-filled from LinkedIn  
- ✅ Professional title pre-filled
- ✅ Professional type selector works
- ✅ Company field pre-filled
- ✅ Location field works
- ✅ Required field validation works
- ✅ Cannot proceed without required fields

#### Step 2: Professional Details
- ✅ Bio field pre-filled from LinkedIn summary
- ✅ Phone number field validation
- ✅ Website field validation
- ✅ Add/remove specialties works
- ✅ Add/remove certifications works
- ✅ LinkedIn experience displays correctly
- ✅ LinkedIn education displays correctly

#### Step 3: Review & Complete
- ✅ Profile summary displays all data
- ✅ Terms acceptance checkbox required
- ✅ Marketing consent checkbox optional
- ✅ Cannot submit without terms acceptance
- ✅ "Complete Registration" button works

---

### 3. **Success Page & Referral Flow Test**

#### After Profile Completion:
1. **Confetti Animation**
   - ✅ Gold and blue confetti bursts appear
   - ✅ Animation lasts ~3 seconds
   - ✅ Celebration feels engaging

2. **Welcome Toast**
   - ✅ "Welcome, [FirstName]!" toast appears
   - ✅ Toast includes welcome message
   - ✅ Toast auto-dismisses after 5 seconds

3. **Colleague Invite Modal**
   - ✅ Modal opens automatically on success page
   - ✅ Unique referral link generated
   - ✅ Social sharing buttons work (LinkedIn, X, Facebook, Email)
   - ✅ Copy link functionality works
   - ✅ Referral stats display (if available)

---

### 4. **Mobile Responsiveness Test**

#### Test on multiple screen sizes:
- **iPhone SE (375px)**
- **iPhone 12 (390px)**
- **iPad (768px)**
- **Desktop (1024px+)**

#### Mobile-specific checks:
- ✅ Colleague invite modal responsive
- ✅ Text and buttons appropriately sized
- ✅ Modal scrollable on small screens
- ✅ Touch targets minimum 44px
- ✅ Social share buttons stack on mobile
- ✅ Form fields appropriately sized
- ✅ Landing page hero text readable

---

### 5. **Accessibility (WCAG AA) Test**

#### Color Contrast:
- ✅ Primary text: 4.5:1 contrast ratio minimum
- ✅ Button text: 4.5:1 contrast ratio minimum
- ✅ Secondary text: 3:1 contrast ratio minimum
- ✅ Link colors distinguishable from text
- ✅ Focus states visible with 3:1 contrast

#### Keyboard Navigation:
- ✅ All interactive elements focusable
- ✅ Tab order logical
- ✅ Modal can be closed with Escape key
- ✅ Form submission with Enter key
- ✅ Skip links for screen readers

#### Screen Reader:
- ✅ Alt text for images
- ✅ ARIA labels for buttons
- ✅ Form labels properly associated
- ✅ Modal announces when opened
- ✅ Success messages announced

---

### 6. **Referral Tracking Test**

#### Test Referral Link Flow:
1. **Generate Referral Link**
   - ✅ Professional creates account
   - ✅ Unique referral code generated
   - ✅ Link format: `/join-pros?ref=ABC123XY`

2. **Test Referral Click**
   - ✅ Click referral link (logged out)
   - ✅ Referral code stored in localStorage
   - ✅ URL parameter removed cleanly
   - ✅ User proceeds through normal signup

3. **Complete Referral**
   - ✅ After signup completion, referral attributed
   - ✅ Referrer's stats updated
   - ✅ Database updated with referee_id

---

### 7. **Error Handling Test**

#### LinkedIn OAuth Errors:
- ✅ Network error handled gracefully
- ✅ User can continue with manual entry
- ✅ Clear error messages displayed
- ✅ No application crashes

#### Form Validation:
- ✅ Email format validation
- ✅ Required field validation
- ✅ Phone number format validation
- ✅ Terms acceptance validation

#### Database Errors:
- ✅ Profile creation failure handled
- ✅ Duplicate email detection
- ✅ User redirected appropriately
- ✅ Error messages user-friendly

---

### 8. **Performance Test**

#### Page Load Times:
- ✅ Landing page loads < 2 seconds
- ✅ Onboarding page loads < 2 seconds
- ✅ LinkedIn import < 5 seconds
- ✅ Profile creation < 3 seconds

#### Image Loading:
- ✅ LinkedIn profile photos load properly
- ✅ Placeholder shown while loading
- ✅ Graceful fallback for missing images

---

### 9. **Cross-Browser Test**

#### Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

---

### 10. **Data Validation Test**

#### Database Integrity:
- ✅ All profile data saved correctly
- ✅ Referral relationships created
- ✅ LinkedIn import data structured properly
- ✅ No data corruption or loss
- ✅ GDPR consent recorded
- ✅ Audit trail created

---

## Test with Different LinkedIn Accounts

### Account Type 1: Full Professional Profile
- Complete work history
- Education information
- Professional headshot
- Detailed summary

### Account Type 2: Minimal Profile
- Basic name and title only
- No work history
- No profile photo
- Minimal information

### Account Type 3: Privacy-Restricted Profile
- Limited public information
- Some fields blocked
- Partial data availability

---

## Automated Testing Checklist

### Performance Monitoring:
- [ ] Page load speed tests
- [ ] API response time monitoring
- [ ] Database query optimization
- [ ] Image loading optimization

### Security Testing:
- [ ] HTTPS enforcement
- [ ] GDPR compliance validation
- [ ] Data encryption verification
- [ ] Input sanitization testing

### Analytics Tracking:
- [ ] Conversion funnel tracking
- [ ] User behavior analytics
- [ ] Error rate monitoring
- [ ] Referral attribution tracking

---

## Success Criteria

### Functional Requirements:
- 95%+ successful LinkedIn imports
- 100% mobile responsiveness
- WCAG AA compliance
- <2 second page loads
- 0 critical errors

### User Experience:
- Smooth, intuitive flow
- Clear progress indicators
- Helpful error messages
- Celebratory completion experience
- Easy referral sharing

### Business Requirements:
- Accurate referral tracking
- Complete profile data capture
- GDPR compliance
- Conversion optimization
- Professional presentation