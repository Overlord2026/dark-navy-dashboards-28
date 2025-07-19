-- Seed test users for E2E testing
-- Only run in test environment

-- Insert test users with known credentials
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