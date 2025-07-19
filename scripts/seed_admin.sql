-- Seed admin user for development
INSERT INTO public.profiles (id, email, role, first_name, last_name)
VALUES 
  ('00000000-0000-4000-8000-000000000001', 'founder@bfocfo.com', 'system_administrator', 'Founder', 'Admin'),
  ('00000000-0000-4000-8000-000000000002', 'admin@example.com', 'admin', 'Test', 'Admin'),
  ('00000000-0000-4000-8000-000000000003', 'advisor@example.com', 'advisor', 'Test', 'Advisor')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;