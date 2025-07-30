-- Create temporary MFA bypass for development access
-- This allows the system administrator to access the system while maintaining security audit trail

INSERT INTO public.mfa_bypass_audit (
  user_id,
  user_role,
  bypass_reason,
  initiated_by,
  expires_at,
  is_active
) VALUES (
  -- Get the first system_administrator user (should be the developer)
  (SELECT id FROM public.profiles WHERE role = 'system_administrator' LIMIT 1),
  'system_administrator',
  'Development access - system optimization and MFA setup',
  (SELECT id FROM public.profiles WHERE role = 'system_administrator' LIMIT 1),
  now() + INTERVAL '48 hours',
  true
);