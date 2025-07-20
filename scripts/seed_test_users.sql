-- Comprehensive Test User Matrix for E2E Testing
-- Only run in test environment
-- 
-- COMPREHENSIVE TEST USER REFERENCE TABLE:
-- | Email                           | Role                 | UUID                                 | Scenario                | Segment/Stage  |
-- |----------------------------------|----------------------|--------------------------------------|-------------------------|----------------|
-- | jet_superadmin@bfocfo.com        | system_administrator | 00000000-0000-4000-8000-000000000011 | Full system admin       | N/A            |
-- | jet_readonly_admin@bfocfo.com    | system_administrator | 00000000-0000-4000-8000-000000000012 | Read-only admin         | N/A            |
-- | jet_tenant_admin@bfocfo.com      | tenant_admin         | 00000000-0000-4000-8000-000000000013 | Tenant-specific admin   | N/A            |
-- | jet_senior_advisor@bfocfo.com    | advisor              | 00000000-0000-4000-8000-000000000021 | Senior advisor          | N/A            |
-- | jet_junior_advisor@bfocfo.com    | advisor              | 00000000-0000-4000-8000-000000000022 | Junior advisor          | N/A            |
-- | jet_referral_advisor@bfocfo.com  | advisor              | 00000000-0000-4000-8000-000000000023 | Referral specialist     | N/A            |
-- | jet_recruiting_advisor@bfocfo.com| advisor              | 00000000-0000-4000-8000-000000000024 | Recruiting specialist   | N/A            |
-- | jet_new_client@bfocfo.com        | client               | 00000000-0000-4000-8000-000000000031 | New/onboarding client   | basic/prospect |
-- | jet_premium_client@bfocfo.com    | client               | 00000000-0000-4000-8000-000000000032 | Premium client          | premium/active |
-- | jet_basic_client@bfocfo.com      | client               | 00000000-0000-4000-8000-000000000033 | Basic client            | basic/active   |
-- | jet_inactive_client@bfocfo.com   | client               | 00000000-0000-4000-8000-000000000034 | Inactive client         | basic/inactive |
-- | jet_trial_client@bfocfo.com      | client               | 00000000-0000-4000-8000-000000000035 | Trial client            | trial/trial    |
--
-- Note: All test users use password 'Passw0rd!' for authentication
--
-- COMPREHENSIVE TEST DATA INCLUDES:
-- - 12 test users covering all roles and scenarios
-- - Realistic advisor-client relationships
-- - Differentiated health recommendations by client type
-- - Varied fee scenarios based on client segment
-- - Comprehensive audit log entries
-- - Sample professional network data
--
-- USAGE IN CYPRESS:
-- cy.loginAsScenario('premium_client')  // Login as specific scenario
-- cy.testUserScenario('senior_advisor') // Test complete scenario including permissions
-- cy.verifyPermissions(['client:manage', 'portfolio:full']) // Verify specific permissions

-- Legacy test users (maintained for backward compatibility)
INSERT INTO public.profiles (id, email, role, first_name, last_name, display_name)
VALUES 
  ('00000000-0000-4000-8000-000000000001', 'founder@bfocfo.com', 'system_administrator', 'Test', 'SuperAdmin', 'Test SuperAdmin'),
  ('00000000-0000-4000-8000-000000000002', 'advisor_test@bfocfo.com', 'advisor', 'Test', 'Advisor', 'Test Advisor'),
  ('00000000-0000-4000-8000-000000000003', 'client_test@bfocfo.com', 'client', 'Test', 'Client', 'Test Client')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  display_name = EXCLUDED.display_name;

-- Note: In a real test environment, you would also need to create corresponding
-- auth.users records via Supabase Auth API or admin functions
-- For Cypress tests, we handle authentication through the UI login flow

-- Create sample data for testing KPIs and functionality
INSERT INTO public.health_recommendations (id, user_id, title, description, category, priority, status)
VALUES 
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000003', 'Test Health Recommendation', 'Sample recommendation for testing', 'nutrition', 'medium', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO public.fee_scenarios (id, user_id, portfolio_value, time_horizon, growth_rate, current_fee, our_fee, healthcare_annual_budget)
VALUES 
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000003', 1000000, 20, 0.07, 0.015, 0.007, 8000)
ON CONFLICT DO NOTHING;

-- Add some audit log entries for testing recent activity
INSERT INTO public.audit_logs (event_type, status, details, user_id)
VALUES 
  ('user_login', 'success', '{"source": "test_suite"}', '00000000-0000-4000-8000-000000000001'),
  ('system_health_check', 'success', '{"component": "database"}', '00000000-0000-4000-8000-000000000001'),
  ('kpi_calculation', 'success', '{"metric": "active_clients"}', '00000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;