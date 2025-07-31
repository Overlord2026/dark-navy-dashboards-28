# Error Handling & Permissions QA Guide

## Overview
This guide covers testing error scenarios, unauthorized access, and edge cases to ensure robust application behavior.

## Test User Credentials

Use these credentials for permission testing:

| Persona | Email | Password | Role | Expected Access |
|---------|-------|----------|------|-----------------|
| Client | `client@test.com` | `TestClient2024!` | client | Client dashboard, wealth tools |
| Advisor | `advisor@test.com` | `TestAdvisor2024!` | advisor | Advisor dashboard, client management |
| Accountant | `accountant@test.com` | `TestAccountant2024!` | accountant | Accounting tools, tax features |
| Consultant | `consultant@test.com` | `TestConsultant2024!` | consultant | Consulting tools, assessments |
| Attorney | `attorney@test.com` | `TestAttorney2024!` | attorney | Legal tools, document management |
| Admin | `admin@test.com` | `TestAdmin2024!` | admin | Admin portal, user management |
| System Admin | `sysadmin@test.com` | `TestSysAdmin2024!` | system_administrator | Full system access, diagnostics |

## 1. Unauthorized Access Testing

### Test Procedure
For each persona, attempt to access routes they shouldn't have permission for:

#### Client Testing
**Should be BLOCKED from:**
- [ ] `/admin-dashboard` → Should redirect to client dashboard
- [ ] `/admin-portal` → Should show access denied
- [ ] `/navigation-diagnostics` → Should redirect or deny
- [ ] `/advisor-dashboard` → Should redirect to client dashboard
- [ ] `/accountant-dashboard` → Should redirect to client dashboard

**Expected behavior:** Redirect to appropriate dashboard with error message

#### Advisor Testing  
**Should be BLOCKED from:**
- [ ] `/admin-dashboard` → Should redirect to advisor dashboard
- [ ] `/admin-portal` → Should show access denied
- [ ] `/navigation-diagnostics` → Should redirect or deny
- [ ] `/client-dashboard` → Should redirect to advisor dashboard

#### Non-Admin Testing (Client, Advisor, Accountant, Consultant, Attorney)
**Should be BLOCKED from:**
- [ ] `/admin-portal/*` → Any admin routes
- [ ] `/navigation-diagnostics` → Admin diagnostic tools
- [ ] `/admin/system-diagnostics` → System admin tools

### Expected Results
- **Proper redirects**: Users sent to their appropriate dashboard
- **Clear error messages**: "You don't have permission to access this page"
- **No blank screens**: Always show meaningful content
- **Consistent behavior**: Same error handling across all unauthorized routes

## 2. Broken Routes & 404 Testing

### Test URLs
Visit these intentionally broken URLs and verify proper 404 handling:

- [ ] `/non-existent-page`
- [ ] `/admin/fake-page`
- [ ] `/client-dashboard/invalid-sub-page`
- [ ] `/advisor/missing-route`
- [ ] `/api/non-existent-endpoint`
- [ ] `/dashboard/typo-in-url`
- [ ] `/wealth/invalid-section`

### Expected 404 Page Features
- [ ] **User-friendly message**: "Page Not Found" with helpful text
- [ ] **Navigation options**: "Go Home" and "Go Back" buttons
- [ ] **Consistent styling**: Matches app design system
- [ ] **Search suggestion**: Option to search or browse
- [ ] **Contact info**: Way to report if this seems like an error

## 3. Form Validation Testing

### Login Form Errors
Test invalid login attempts:

#### Invalid Email Formats
- [ ] `invalid-email` → Should show "Invalid email format"
- [ ] `@example.com` → Should show "Invalid email format"  
- [ ] `test@` → Should show "Invalid email format"
- [ ] `test.com` → Should show "Invalid email format"

#### Invalid Passwords
- [ ] `123` → Should show "Password too short"
- [ ] `abc` → Should show "Password requirements not met"
- [ ] `password` → Should show "Password too weak"
- [ ] Empty password → Should show "Password required"

#### Account Issues
- [ ] `nonexistent@test.com` → Should show "Invalid credentials"
- [ ] Correct email + wrong password → Should show "Invalid credentials"
- [ ] Too many failed attempts → Should show rate limiting

### Registration Form Errors
Test user registration with invalid data:

#### Email Validation
- [ ] Existing email → "Email already registered"
- [ ] Invalid format → "Invalid email format"
- [ ] Empty email → "Email required"

#### Password Requirements
- [ ] Less than 8 characters → "Password must be at least 8 characters"
- [ ] No uppercase → "Password must contain uppercase letter"
- [ ] No numbers → "Password must contain numbers"
- [ ] No special characters → "Password must contain special characters"

#### Other Fields
- [ ] Empty required fields → Specific field validation messages
- [ ] Invalid phone numbers → "Invalid phone format"
- [ ] Invalid postal codes → "Invalid postal code format"

### Financial Form Errors
Test forms with financial data:

#### Amount Validation
- [ ] Negative amounts → "Amount must be positive"
- [ ] Zero amounts → "Amount must be greater than zero"
- [ ] Text in number field → "Invalid number format"
- [ ] Excessive precision → "Maximum 2 decimal places"
- [ ] Extremely large amounts → "Amount exceeds maximum"

#### Date Validation
- [ ] Past dates (when future required) → "Date must be in the future"
- [ ] Invalid date formats → "Invalid date format"
- [ ] Empty required dates → "Date required"

## 4. Network & Server Error Testing

### Simulating Network Issues
Use browser dev tools to simulate:

#### Offline Testing
1. Open Developer Tools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Test application behavior

**Expected Results:**
- [ ] Graceful offline message
- [ ] Cached content still accessible
- [ ] Queue actions for when online
- [ ] Clear indication of offline status

#### Slow Network Testing
1. Open Developer Tools (F12)
2. Go to Network tab  
3. Set throttling to "Slow 3G"
4. Test form submissions and page loads

**Expected Results:**
- [ ] Loading indicators shown
- [ ] Timeouts handled gracefully  
- [ ] User feedback during slow operations
- [ ] No broken states from incomplete loads

### Server Error Simulation
If possible, test server error responses:

- [ ] 500 Internal Server Error → User-friendly error message
- [ ] 503 Service Unavailable → Maintenance message
- [ ] 429 Rate Limited → "Too many requests" message
- [ ] Network timeout → "Connection timeout" message

## 5. Mobile-Specific Error Testing

### Touch & Gesture Errors
- [ ] **Accidental touches**: Buttons too close together
- [ ] **Gesture conflicts**: Swipe gestures interfering with browser
- [ ] **Keyboard issues**: Virtual keyboard covering important elements
- [ ] **Orientation changes**: Layout breaks when rotating device

### Mobile Form Issues
- [ ] **Input validation on mobile keyboards**: Number inputs, email validation
- [ ] **Touch target size**: Buttons smaller than 44px
- [ ] **Scroll issues**: Form validation errors not visible when keyboard open
- [ ] **Modal problems**: Modals too large for mobile screen

## 6. Edge Case Testing

### Session & Authentication Edge Cases
- [ ] **Expired session**: User action after session expires
- [ ] **Multiple tabs**: Login in one tab affects others
- [ ] **Browser refresh**: State preservation during refresh
- [ ] **Direct URL access**: Accessing protected URLs directly

### Data Edge Cases
- [ ] **Empty data states**: No bank accounts, no transactions
- [ ] **Large data sets**: Many accounts, long transaction lists
- [ ] **Special characters**: Unicode in names, descriptions
- [ ] **Extreme values**: Very large or very small amounts

### Browser Compatibility
Test on different browsers and versions:
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (if Mac available)
- [ ] **Edge** (latest)
- [ ] **Mobile browsers** (Chrome Mobile, Safari Mobile)

## Error Handling Best Practices Checklist

### User Experience
- [ ] **Clear error messages**: Specific, actionable feedback
- [ ] **Consistent styling**: Errors look cohesive with design
- [ ] **Appropriate tone**: Professional but friendly
- [ ] **Recovery options**: Always provide next steps

### Technical Implementation
- [ ] **Error boundaries**: Catch React component errors
- [ ] **Fallback UI**: Something always renders
- [ ] **Error logging**: Errors captured for debugging
- [ ] **Progressive enhancement**: Works even if JavaScript fails

### Security Considerations
- [ ] **No sensitive data in errors**: Don't expose system details
- [ ] **Rate limiting**: Prevent brute force attacks
- [ ] **Input sanitization**: Prevent XSS attacks
- [ ] **CSRF protection**: Secure form submissions

## Reporting Issues

When you find errors or issues, document:

1. **Steps to reproduce**: Exact sequence that caused the error
2. **Expected vs actual**: What should happen vs what happened
3. **Environment**: Browser, device, screen size
4. **User persona**: Which test account was being used
5. **Screenshots**: Visual evidence of the issue
6. **Console logs**: Any JavaScript errors in browser console

Use the Error Handling Test Suite in the Navigation QA page for automated testing of many of these scenarios.