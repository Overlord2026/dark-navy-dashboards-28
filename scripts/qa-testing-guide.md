# End-to-End QA Testing Guide

## Test Personas (Use these credentials)

1. **Client User**: `client@test.com` / password: `testpassword123`
2. **Advisor User**: `advisor@test.com` / password: `testpassword123`
3. **Accountant User**: `accountant@test.com` / password: `testpassword123`
4. **Consultant User**: `consultant@test.com` / password: `testpassword123`
5. **Attorney User**: `attorney@test.com` / password: `testpassword123`
6. **Admin User**: `admin@test.com` / password: `testpassword123`
7. **System Admin**: `sysadmin@test.com` / password: `testpassword123`

## Testing Checklist

### 1. Authentication Tests
- [ ] Login as each persona above
- [ ] Verify successful authentication and profile loading
- [ ] Check role-based dashboard redirection
- [ ] Test logout functionality

### 2. Dashboard Navigation Tests

#### Client Dashboard (`/client-dashboard`)
- [ ] Login as `client@test.com`
- [ ] Verify navigation items specific to client role
- [ ] Check all dashboard widgets load correctly
- [ ] Test portfolio sections, goals, wealth overview
- [ ] Verify bank accounts show up (should see Test Checking & Savings accounts)

#### Advisor Dashboard (`/advisor-dashboard`)
- [ ] Login as `advisor@test.com`
- [ ] Check advisor-specific navigation (Clients, Prospects, Portfolio, Performance)
- [ ] Verify client management features
- [ ] Test proposal creation and client invite flows
- [ ] Check advisor business account appears

#### Accountant Dashboard (`/accountant-dashboard`)
- [ ] Login as `accountant@test.com`
- [ ] Verify tax preparation tools
- [ ] Check ledger and statements access
- [ ] Test tax planning features

#### Consultant Dashboard (`/consultant-dashboard`)
- [ ] Login as `consultant@test.com`
- [ ] Check projects and assessments
- [ ] Verify methodologies and best practices sections

#### Attorney Dashboard (`/attorney-dashboard`)
- [ ] Login as `attorney@test.com`
- [ ] Test estate planning tools
- [ ] Check business law and contracts sections
- [ ] Verify legal research features

#### Admin Dashboard (`/admin-dashboard`)
- [ ] Login as `admin@test.com` or `sysadmin@test.com`
- [ ] Check user management features
- [ ] Verify system monitoring tools
- [ ] Test admin settings and configurations

### 3. Data Population Verification
- [ ] Bank accounts appear in financial sections
- [ ] Analytics events are tracked (check browser dev tools for network calls)
- [ ] Test data profiles load correctly
- [ ] Navigation tracking works properly

### 4. Premium Features Testing
- [ ] Look for premium badges (Crown icons) in navigation
- [ ] Test premium feature access based on subscription tiers
- [ ] Verify role-based feature restrictions

### 5. Error Handling
- [ ] Test invalid routes (`/invalid-path`)
- [ ] Check access denied behavior for restricted routes
- [ ] Verify error boundaries catch and display errors properly

## Expected Test Results

✅ **Success Indicators:**
- All personas can login successfully
- Role-specific dashboards load correctly
- Navigation items match user permissions
- Bank accounts visible in financial sections
- No console errors during navigation
- Premium features display appropriate access controls

❌ **Report These Issues:**
- Login failures for any test persona
- Missing or broken navigation links
- Dashboard widgets not loading
- Bank account data not appearing
- Console errors or network failures
- Incorrect role-based access control

## Post-Testing Notes
- Test in both light and dark themes
- Check responsive design on mobile/tablet
- Verify all links in hierarchical navigation work
- Test page refresh behavior (session persistence)