
-- Enhanced Test User Seeding for Comprehensive E2E Testing
-- This expands the existing 3 users to 12 users covering all scenarios

-- First, let's add the enhanced test users with comprehensive data
INSERT INTO public.profiles (
  id, email, role, first_name, last_name, display_name, 
  client_segment, lead_stage, advisor_id, tenant_id,
  phone, investor_type, permissions
) VALUES 
  -- System Administrators (3 users)
  ('00000000-0000-4000-8000-000000000001', 'founder@bfocfo.com', 'system_administrator', 'Test', 'SuperAdmin', 'Test SuperAdmin', NULL, NULL, NULL, NULL, '+1-555-0001', 'institutional', ARRAY['admin:all', 'system:full']),
  ('00000000-0000-4000-8000-000000000011', 'jet_superadmin@bfocfo.com', 'system_administrator', 'Jet', 'SuperAdmin', 'Jet Super Admin', NULL, NULL, NULL, NULL, '+1-555-0011', 'institutional', ARRAY['admin:all', 'system:full']),
  ('00000000-0000-4000-8000-000000000012', 'jet_readonly_admin@bfocfo.com', 'system_administrator', 'Jet', 'ReadOnly', 'Jet ReadOnly Admin', NULL, NULL, NULL, NULL, '+1-555-0012', 'institutional', ARRAY['admin:read', 'system:view']),
  ('00000000-0000-4000-8000-000000000013', 'jet_tenant_admin@bfocfo.com', 'tenant_admin', 'Jet', 'TenantAdmin', 'Jet Tenant Admin', NULL, NULL, NULL, '11111111-1111-1111-1111-111111111111', '+1-555-0013', 'institutional', ARRAY['tenant:admin', 'users:manage']),
  
  -- Advisors (4 users)
  ('00000000-0000-4000-8000-000000000002', 'advisor_test@bfocfo.com', 'advisor', 'Test', 'Advisor', 'Test Advisor', NULL, NULL, NULL, NULL, '+1-555-0002', 'accredited', ARRAY['client:manage', 'portfolio:view']),
  ('00000000-0000-4000-8000-000000000021', 'jet_senior_advisor@bfocfo.com', 'advisor', 'Jet', 'Senior', 'Jet Senior Advisor', NULL, NULL, NULL, NULL, '+1-555-0021', 'accredited', ARRAY['client:manage', 'portfolio:full', 'referral:create']),
  ('00000000-0000-4000-8000-000000000022', 'jet_junior_advisor@bfocfo.com', 'advisor', 'Jet', 'Junior', 'Jet Junior Advisor', NULL, NULL, NULL, NULL, '+1-555-0022', 'accredited', ARRAY['client:view', 'portfolio:limited']),
  ('00000000-0000-4000-8000-000000000023', 'jet_referral_advisor@bfocfo.com', 'advisor', 'Jet', 'Referral', 'Jet Referral Advisor', NULL, NULL, NULL, NULL, '+1-555-0023', 'accredited', ARRAY['referral:full', 'commission:view']),
  ('00000000-0000-4000-8000-000000000024', 'jet_recruiting_advisor@bfocfo.com', 'advisor', 'Jet', 'Recruiting', 'Jet Recruiting Advisor', NULL, NULL, NULL, NULL, '+1-555-0024', 'accredited', ARRAY['advisor:recruit', 'team:manage']),
  
  -- Clients (5 users)
  ('00000000-0000-4000-8000-000000000003', 'client_test@bfocfo.com', 'client', 'Test', 'Client', 'Test Client', 'basic', 'active', '00000000-0000-4000-8000-000000000002', NULL, '+1-555-0003', 'retail', ARRAY['profile:edit', 'documents:view']),
  ('00000000-0000-4000-8000-000000000031', 'jet_new_client@bfocfo.com', 'client', 'Jet', 'New', 'Jet New Client', 'basic', 'prospect', '00000000-0000-4000-8000-000000000021', NULL, '+1-555-0031', 'retail', ARRAY['profile:edit']),
  ('00000000-0000-4000-8000-000000000032', 'jet_premium_client@bfocfo.com', 'client', 'Jet', 'Premium', 'Jet Premium Client', 'premium', 'active', '00000000-0000-4000-8000-000000000021', NULL, '+1-555-0032', 'accredited', ARRAY['profile:edit', 'documents:full', 'portfolio:view', 'health:premium']),
  ('00000000-0000-4000-8000-000000000033', 'jet_basic_client@bfocfo.com', 'client', 'Jet', 'Basic', 'Jet Basic Client', 'basic', 'active', '00000000-0000-4000-8000-000000000022', NULL, '+1-555-0033', 'retail', ARRAY['profile:edit', 'documents:view']),
  ('00000000-0000-4000-8000-000000000034', 'jet_inactive_client@bfocfo.com', 'client', 'Jet', 'Inactive', 'Jet Inactive Client', 'basic', 'inactive', '00000000-0000-4000-8000-000000000021', NULL, '+1-555-0034', 'retail', ARRAY['profile:edit']),
  ('00000000-0000-4000-8000-000000000035', 'jet_trial_client@bfocfo.com', 'client', 'Jet', 'Trial', 'Jet Trial Client', 'trial', 'trial', '00000000-0000-4000-8000-000000000021', NULL, '+1-555-0035', 'retail', ARRAY['profile:edit', 'trial:access'])
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  display_name = EXCLUDED.display_name,
  client_segment = EXCLUDED.client_segment,
  lead_stage = EXCLUDED.lead_stage,
  advisor_id = EXCLUDED.advisor_id,
  tenant_id = EXCLUDED.tenant_id,
  phone = EXCLUDED.phone,
  investor_type = EXCLUDED.investor_type,
  permissions = EXCLUDED.permissions;

-- Create comprehensive test data for all user types
-- Health Recommendations for different client types
INSERT INTO public.health_recommendations (id, user_id, title, description, category, priority, status)
VALUES 
  -- Premium client gets multiple recommendations
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000032', 'Premium Wellness Plan', 'Comprehensive health optimization for premium clients', 'wellness', 'high', 'active'),
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000032', 'Executive Health Screening', 'Annual executive health assessment', 'screening', 'medium', 'active'),
  
  -- Basic clients get standard recommendations
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000033', 'Basic Health Check', 'Standard health screening for basic clients', 'screening', 'medium', 'active'),
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000031', 'New Client Welcome Health Plan', 'Initial health recommendations for new clients', 'nutrition', 'low', 'active'),
  
  -- Existing test client
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000003', 'Test Health Recommendation', 'Sample recommendation for testing', 'nutrition', 'medium', 'active')
ON CONFLICT DO NOTHING;

-- Fee Scenarios for different client segments
INSERT INTO public.fee_scenarios (id, user_id, portfolio_value, time_horizon, growth_rate, current_fee, our_fee, healthcare_annual_budget)
VALUES 
  -- Premium client with larger portfolio
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000032', 5000000, 25, 0.08, 0.012, 0.006, 20000),
  
  -- Basic clients with standard portfolios
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000033', 750000, 15, 0.07, 0.015, 0.008, 6000),
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000031', 250000, 10, 0.06, 0.018, 0.009, 3000),
  
  -- Trial client with minimal portfolio
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000035', 100000, 5, 0.05, 0.020, 0.010, 2000),
  
  -- Existing test client
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000003', 1000000, 20, 0.07, 0.015, 0.007, 8000)
ON CONFLICT DO NOTHING;

-- Audit logs for comprehensive activity testing
INSERT INTO public.audit_logs (event_type, status, details, user_id)
VALUES 
  -- System admin activities
  ('user_login', 'success', '{"source": "test_suite", "role": "system_administrator"}', '00000000-0000-4000-8000-000000000001'),
  ('system_health_check', 'success', '{"component": "database"}', '00000000-0000-4000-8000-000000000011'),
  ('user_management', 'success', '{"action": "create_user", "target_role": "client"}', '00000000-0000-4000-8000-000000000012'),
  
  -- Advisor activities
  ('client_onboarding', 'success', '{"client_id": "00000000-0000-4000-8000-000000000031", "advisor_id": "00000000-0000-4000-8000-000000000021"}', '00000000-0000-4000-8000-000000000021'),
  ('portfolio_review', 'success', '{"client_id": "00000000-0000-4000-8000-000000000032"}', '00000000-0000-4000-8000-000000000021'),
  ('referral_created', 'success', '{"referral_code": "TEST123", "advisor_id": "00000000-0000-4000-8000-000000000023"}', '00000000-0000-4000-8000-000000000023'),
  
  -- Client activities
  ('profile_update', 'success', '{"fields_updated": ["phone", "address"]}', '00000000-0000-4000-8000-000000000032'),
  ('document_upload', 'success', '{"document_type": "tax_return", "file_size": "2.5MB"}', '00000000-0000-4000-8000-000000000032'),
  ('health_goal_set', 'success', '{"goal_type": "weight_loss", "target": "10lbs"}', '00000000-0000-4000-8000-000000000033'),
  
  -- System monitoring
  ('kpi_calculation', 'success', '{"metric": "active_clients", "value": 12}', '00000000-0000-4000-8000-000000000001'),
  ('performance_check', 'success', '{"component": "api_response_time", "avg_ms": 245}', '00000000-0000-4000-8000-000000000011')
ON CONFLICT DO NOTHING;

-- Create some professionals for testing
INSERT INTO public.professionals (id, user_id, tenant_id, name, email, type, company, phone, specialties, certifications, rating)
VALUES 
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000021', '11111111-1111-1111-1111-111111111111', 'Dr. Jane Smith', 'dr.smith@healthpartners.com', 'Doctor', 'Health Partners Medical', '+1-555-1001', ARRAY['Cardiology', 'Internal Medicine'], ARRAY['Board Certified Internal Medicine', 'FACP'], 4.8),
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000021', '11111111-1111-1111-1111-111111111111', 'Attorney John Doe', 'john.doe@legalpartners.com', 'Attorney', 'Legal Partners LLC', '+1-555-1002', ARRAY['Estate Planning', 'Tax Law'], ARRAY['Juris Doctor', 'Estate Planning Specialist'], 4.5),
  (gen_random_uuid(), '00000000-0000-4000-8000-000000000022', '11111111-1111-1111-1111-111111111111', 'CPA Sarah Johnson', 'sarah@accountingpro.com', 'Accountant', 'Accounting Pro Services', '+1-555-1003', ARRAY['Tax Preparation', 'Financial Planning'], ARRAY['CPA', 'CFP'], 4.7)
ON CONFLICT DO NOTHING;
