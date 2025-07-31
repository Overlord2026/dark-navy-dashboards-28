# QA Users Setup Guide

## Setup Test Users

I've created edge functions to properly set up and clean up QA test users. Here's how to use them:

### 1. Create Test Users

Call the setup edge function:
```bash
curl -X POST https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/setup-qa-users \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

Or visit in browser: `https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/setup-qa-users`

### 2. Test User Credentials

After setup, you can log in with these credentials:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Client | `client@test.com` | `TestClient2024!` | `/client-dashboard` |
| Advisor | `advisor@test.com` | `TestAdvisor2024!` | `/advisor-dashboard` |
| Accountant | `accountant@test.com` | `TestAccountant2024!` | `/accountant-dashboard` |
| Consultant | `consultant@test.com` | `TestConsultant2024!` | `/consultant-dashboard` |
| Attorney | `attorney@test.com` | `TestAttorney2024!` | `/attorney-dashboard` |
| Admin | `admin@test.com` | `TestAdmin2024!` | `/admin-dashboard` |
| System Admin | `sysadmin@test.com` | `TestSysAdmin2024!` | `/admin-dashboard` |

### 3. What Gets Created

For each user:
- ✅ **Auth User**: Created in `auth.users` with proper authentication
- ✅ **Profile**: Linked profile in `public.profiles` with role and tenant
- ✅ **Bank Accounts**: Sample accounts for Client and Advisor roles
- ✅ **Analytics Events**: Sample navigation events for testing
- ✅ **Tenant**: QA Test Family Office tenant for all users

### 4. QA Testing Checklist

#### Authentication Tests
- [ ] Login with each persona
- [ ] Verify role-based dashboard redirection
- [ ] Test logout functionality
- [ ] Check session persistence on page refresh

#### Navigation Tests
- [ ] Verify role-specific navigation items
- [ ] Test hierarchical navigation expansion
- [ ] Check premium feature badges (Crown icons)
- [ ] Verify access control for restricted routes

#### Data Population Tests
- [ ] **Client**: Check Test Checking ($15,000) and Savings ($50,000) accounts
- [ ] **Advisor**: Check Advisor Business Account ($25,000)
- [ ] **All**: Verify analytics events in browser dev tools
- [ ] **All**: Test profile data loads correctly

#### Dashboard Widget Tests
- [ ] **Client**: Portfolio overview, goals, wealth summary
- [ ] **Advisor**: Client list, performance metrics, proposals
- [ ] **Accountant**: Tax tools, ledger access
- [ ] **Consultant**: Projects, assessments, methodologies
- [ ] **Attorney**: Estate planning, contracts, research
- [ ] **Admin**: User management, monitoring tools

#### Error Handling Tests
- [ ] Test invalid login credentials
- [ ] Check access denied for unauthorized routes
- [ ] Verify error boundaries catch navigation errors
- [ ] Test responsive design on mobile/tablet

### 5. Clean Up After Testing

When QA is complete, clean up all test data:

```bash
curl -X POST https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/cleanup-qa-users \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

Or visit: `https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/cleanup-qa-users`

### 6. Production Readiness

After successful QA testing and cleanup:
- ✅ No test users remain in database
- ✅ No test data in bank_accounts or analytics_events
- ✅ Ready to switch to live keys
- ✅ Ready to accept real user signups

## Troubleshooting

### Common Issues:
1. **Login fails**: Check if users were created successfully by calling setup function again
2. **No bank accounts**: Verify setup completed for client/advisor roles
3. **Navigation errors**: Check browser console for auth or permission errors
4. **Dashboard doesn't load**: Verify role-based routing is working correctly

### Verification Queries:
```sql
-- Check created users
SELECT email, role, subscription_tier FROM profiles WHERE email LIKE '%@test.com';

-- Check bank accounts
SELECT user_id, name, balance FROM bank_accounts WHERE name LIKE 'Test%';

-- Check analytics events  
SELECT user_id, event_type, session_id FROM analytics_events WHERE session_id LIKE 'test-session-%';
```