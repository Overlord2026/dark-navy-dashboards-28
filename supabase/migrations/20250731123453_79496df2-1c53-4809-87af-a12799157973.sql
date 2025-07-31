-- Create comprehensive test user data for QA testing
-- Fixed to use correct column names for tenants table

-- Insert test tenant
INSERT INTO public.tenants (
  id, 
  name, 
  billing_status, 
  color_palette, 
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'QA Test Family Office',
  'enterprise',
  '{"primary": "#1F1F1F", "secondary": "#F5F5F5", "accent": "#FFD700"}',
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  billing_status = EXCLUDED.billing_status,
  color_palette = EXCLUDED.color_palette;

-- Insert test profiles for different personas
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  tenant_id,
  subscription_tier,
  subscription_status,
  add_ons,
  two_factor_enabled,
  created_at,
  updated_at
) VALUES 
  -- Client user
  ('22222222-2222-2222-2222-222222222222', 'client@test.com', 'Test Client User', 'client', '11111111-1111-1111-1111-111111111111', 'premium', 'active', '{}', true, now(), now()),
  -- Advisor user  
  ('33333333-3333-3333-3333-333333333333', 'advisor@test.com', 'Test Advisor User', 'advisor', '11111111-1111-1111-1111-111111111111', 'premium', 'active', '{}', true, now(), now()),
  -- Accountant user
  ('44444444-4444-4444-4444-444444444444', 'accountant@test.com', 'Test Accountant User', 'accountant', '11111111-1111-1111-1111-111111111111', 'premium', 'active', '{}', true, now(), now()),
  -- Consultant user
  ('55555555-5555-5555-5555-555555555555', 'consultant@test.com', 'Test Consultant User', 'consultant', '11111111-1111-1111-1111-111111111111', 'premium', 'active', '{}', true, now(), now()),
  -- Attorney user
  ('66666666-6666-6666-6666-666666666666', 'attorney@test.com', 'Test Attorney User', 'attorney', '11111111-1111-1111-1111-111111111111', 'premium', 'active', '{}', true, now(), now()),
  -- Admin user
  ('77777777-7777-7777-7777-777777777777', 'admin@test.com', 'Test Admin User', 'admin', '11111111-1111-1111-1111-111111111111', 'elite', 'active', '{}', true, now(), now()),
  -- System Administrator
  ('88888888-8888-8888-8888-888888888888', 'sysadmin@test.com', 'Test System Admin', 'system_administrator', '11111111-1111-1111-1111-111111111111', 'elite', 'active', '{}', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  tenant_id = EXCLUDED.tenant_id,
  subscription_tier = EXCLUDED.subscription_tier,
  subscription_status = EXCLUDED.subscription_status,
  updated_at = now();

-- Create sample navigation test data
INSERT INTO public.analytics_events (
  id,
  user_id,
  tenant_id,
  event_type,
  event_category,
  event_data,
  session_id,
  created_at
) VALUES 
  -- Sample navigation events for testing
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'page_view', 'navigation', '{"page": "/dashboard", "role": "client"}', 'test-session-1', now()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'page_view', 'navigation', '{"page": "/portfolio", "role": "advisor"}', 'test-session-2', now()),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'page_view', 'navigation', '{"page": "/tax", "role": "accountant"}', 'test-session-3', now())
ON CONFLICT DO NOTHING;

-- Create sample bank accounts for testing financial features
INSERT INTO public.bank_accounts (
  id,
  user_id,
  name,
  account_type,
  balance,
  institution_name,
  account_number_last4,
  created_at,
  updated_at
) VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Test Checking Account', 'checking', 15000.00, 'Test Bank', '1234', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Test Savings Account', 'savings', 50000.00, 'Test Bank', '5678', now(), now()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Advisor Business Account', 'checking', 25000.00, 'Business Bank', '9012', now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  balance = EXCLUDED.balance,
  updated_at = now();

-- Log the test data creation
INSERT INTO public.audit_logs (
  event_type,
  status,
  table_name,
  details,
  user_id
) VALUES (
  'test_data_setup',
  'success',
  'multiple_tables',
  '{"action": "QA test data seeded", "tables": ["tenants", "profiles", "analytics_events", "bank_accounts"], "test_users_count": 7}',
  '88888888-8888-8888-8888-888888888888'
);