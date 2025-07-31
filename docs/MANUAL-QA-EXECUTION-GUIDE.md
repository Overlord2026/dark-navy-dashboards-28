# MANUAL END-TO-END QA EXECUTION GUIDE

## 🎯 OBJECTIVE
Execute comprehensive manual testing across all 7 personas to validate production readiness.

## 📋 PRE-TESTING SETUP

### 1. Ensure Test Users Are Created
Visit: `https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/setup-qa-users`
This creates all 7 test personas with sample data.

### 2. Open Testing Tools
Navigate to: `/navigation-qa-test` 
Use the **End-to-End QA Runner** for guided testing.

---

## 🔐 TEST CREDENTIALS

| Persona | Email | Password | Expected Dashboard |
|---------|-------|----------|-------------------|
| Client (Basic) | `client@test.com` | `TestClient2024!` | `/client-dashboard` |
| Advisor | `advisor@test.com` | `TestAdvisor2024!` | `/advisor-dashboard` |
| Accountant | `accountant@test.com` | `TestAccountant2024!` | `/accountant-dashboard` |
| Consultant | `consultant@test.com` | `TestConsultant2024!` | `/consultant-dashboard` |
| Attorney | `attorney@test.com` | `TestAttorney2024!` | `/attorney-dashboard` |
| Admin | `admin@test.com` | `TestAdmin2024!` | `/admin-dashboard` |
| System Admin | `sysadmin@test.com` | `TestSysAdmin2024!` | `/system-administrator-dashboard` |

---

## 📝 STEP-BY-STEP TESTING PROTOCOL

### 🔑 STEP 1: AUTHENTICATION TESTING (Per Persona)

**For Each Persona:**
1. **Logout** (if currently logged in)
2. **Navigate to** `/auth`
3. **Enter credentials** from table above
4. **Click Login**
5. **Verify redirect** to expected dashboard
6. **Check for errors** in console (F12)

**✅ PASS CRITERIA:**
- Login successful without errors
- Redirected to correct dashboard
- No console errors
- Session persists on page refresh

**❌ FAIL INDICATORS:**
- Login errors or validation failures
- Wrong dashboard redirect
- Console errors
- Session not persisting

---

### 🧭 STEP 2: NAVIGATION TESTING (Per Persona)

**For Each Logged-In Persona:**

#### Main Navigation Menu
1. **Click each main navigation item** in sidebar
2. **Expand all collapsible menus**
3. **Test all sub-navigation items**
4. **Verify role-appropriate items are visible**
5. **Check premium features show badges/restrictions**

#### Quick Actions & Buttons
1. **Click all dashboard quick action buttons**
2. **Test any "Try It" or "Get Started" buttons**
3. **Click card action buttons**
4. **Test modal dialogs and close properly**

#### Links & External Routes
1. **Test all in-page links**
2. **Verify external links open in new tabs**
3. **Check help/documentation links**

**✅ PASS CRITERIA:**
- All navigation items work or show appropriate restrictions
- No 404 errors
- Modal dialogs function properly
- Role-based navigation is correct

**❌ FAIL INDICATORS:**
- 404 or blank pages
- Broken links
- Inappropriate access permissions
- Navigation menu errors

---

### 📊 STEP 3: DASHBOARD DATA VALIDATION (Per Persona)

**For Each Dashboard:**

#### Widget Population
1. **Check account balance cards** show sample data
2. **Verify charts and graphs** display correctly
3. **Validate table data** is populated
4. **Test interactive elements** (hover, click)

#### Expected Sample Data by Persona:
- **Client**: $15,000 checking, $50,000 savings accounts
- **Advisor**: $25,000 business account + client list
- **Others**: Role-appropriate sample data

#### Responsive Design
1. **Open dev tools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Test iPhone 13 viewport** (375×812)
4. **Test iPad viewport** (768×1024)
5. **Verify no horizontal scrolling**
6. **Check touch targets** are 44px minimum

**✅ PASS CRITERIA:**
- All widgets show appropriate sample data
- Charts/graphs render correctly
- Mobile layout works without horizontal scroll
- Touch targets are appropriately sized

**❌ FAIL INDICATORS:**
- Empty or missing data
- Broken charts/visualizations
- Mobile layout issues
- Tiny touch targets

---

### 🔗 STEP 4: INTEGRATION TESTING

#### A. Stripe Payment Integration
1. **Navigate to subscription/billing page**
2. **Click upgrade/payment button**
3. **Verify Stripe checkout loads**
4. **Use test card**: `4242 4242 4242 4242`
5. **Complete test payment flow**
6. **Check subscription status updates**

#### B. Plaid Bank Integration  
1. **Navigate to accounts/bank linking**
2. **Click "Add Bank Account"**
3. **Use Plaid test credentials**:
   - Institution: Chase
   - Username: `user_good`
   - Password: `pass_good`
4. **Verify account data appears**

#### C. PostHog Analytics
1. **Open browser dev tools** → Network tab
2. **Navigate through various pages**
3. **Look for PostHog events** in network requests
4. **Verify page view tracking**

**✅ PASS CRITERIA:**
- Stripe checkout loads and processes test payments
- Plaid successfully links test accounts
- PostHog events appear in network tab

**❌ FAIL INDICATORS:**
- Payment integration errors
- Bank linking failures
- Missing analytics events

---

### 🛡️ STEP 5: SECURITY & ACCESS CONTROL TESTING

**Test Unauthorized Access:**

#### As Client (Basic), Try to Access:
- `/admin-dashboard` → Should redirect/deny
- `/admin-portal` → Should show access denied
- `/navigation-diagnostics` → Should be blocked

#### As Advisor, Try to Access:
- `/admin-portal` → Should show access denied
- `/client-dashboard` → Should redirect to advisor dashboard

#### As Non-Admin, Try to Access:
- Any `/admin/*` routes → Should be properly blocked

**✅ PASS CRITERIA:**
- Unauthorized routes properly blocked
- Clear error messages shown
- Proper redirects to appropriate dashboards

**❌ FAIL INDICATORS:**
- Unauthorized access allowed
- No error messages
- Security bypass possible

---

### 📝 STEP 6: FORM VALIDATION TESTING

**Test Invalid Data Entry:**

#### Login Form
- Invalid email formats → Should show validation
- Wrong passwords → Should show error message
- Empty fields → Should require completion

#### Other Forms (Profile, Settings, etc.)
- Submit empty required fields
- Enter invalid email formats
- Use weak passwords
- Enter invalid numbers/amounts

**✅ PASS CRITERIA:**
- Clear validation error messages
- Form prevents submission with invalid data
- User-friendly error descriptions

**❌ FAIL INDICATORS:**
- Forms submit with invalid data
- No validation messages
- Confusing error messages

---

### 📸 STEP 7: SCREENSHOT CAPTURE

**For Documentation:**
1. **Capture each persona's dashboard** (logged in state)
2. **Screenshot main navigation** (expanded)
3. **Document any error pages** encountered
4. **Save mobile viewport screenshots**

---

## 📋 CRITICAL PASS/FAIL ASSESSMENT

### 🔴 CRITICAL (MUST PASS FOR GO-LIVE):
- [ ] All 7 personas can log in successfully
- [ ] Dashboard data populates correctly for each role
- [ ] No 404 errors on primary navigation
- [ ] Role-based access control working
- [ ] Mobile responsiveness functional

### 🟡 HIGH PRIORITY (SHOULD PASS):
- [ ] All form validation working
- [ ] Integration tests pass in test mode
- [ ] Security access control proper
- [ ] Error handling graceful

### 🟢 MEDIUM PRIORITY (NICE TO HAVE):
- [ ] All secondary features functional
- [ ] Performance acceptable
- [ ] UI/UX polished

---

## 📊 FINAL REPORT TEMPLATE

### OVERALL STATUS: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

### PERSONA RESULTS:
- Client (Basic): ✅/⚠️/❌ - [Issues if any]
- Advisor: ✅/⚠️/❌ - [Issues if any]
- Accountant: ✅/⚠️/❌ - [Issues if any]
- Consultant: ✅/⚠️/❌ - [Issues if any]
- Attorney: ✅/⚠️/❌ - [Issues if any]
- Admin: ✅/⚠️/❌ - [Issues if any]
- System Admin: ✅/⚠️/❌ - [Issues if any]

### INTEGRATION STATUS:
- Stripe: ✅/⚠️/❌ - [Notes]
- Plaid: ✅/⚠️/❌ - [Notes]
- PostHog: ✅/⚠️/❌ - [Notes]

### CRITICAL ISSUES FOUND:
[List any blocking issues]

### RECOMMENDATIONS:
[Go-live decision and next steps]

---

## 🔧 AUTOMATED TESTING SUPPORT

The **End-to-End QA Runner** at `/navigation-qa-test` provides:
- ✅ Automated test simulation
- 📋 Step-by-step guidance
- 📊 Progress tracking
- 📝 Report generation

Use this tool alongside manual testing for comprehensive validation.

---

**TIME ESTIMATE: 2-3 hours for complete testing**
**TEAM REQUIRED: 1-2 QA testers**
**TOOLS NEEDED: Browser with dev tools, test credentials**