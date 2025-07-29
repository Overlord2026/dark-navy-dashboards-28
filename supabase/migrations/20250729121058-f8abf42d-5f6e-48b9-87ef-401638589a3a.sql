-- Delete all test/demo users except the production superuser account
DELETE FROM auth.users 
WHERE email != 'tonygomes88@gmail.com' 
AND email IN (
  SELECT email FROM public.profiles 
  WHERE email LIKE '%@bfocfo.com' 
     OR email LIKE '%@qa.local' 
     OR email LIKE 'persona.%'
     OR email LIKE 'jet_%'
     OR email LIKE '%test%'
);

-- Clean up any orphaned profile records
DELETE FROM public.profiles 
WHERE email != 'tonygomes88@gmail.com' 
AND (
  email LIKE '%@bfocfo.com' 
  OR email LIKE '%@qa.local' 
  OR email LIKE 'persona.%'
  OR email LIKE 'jet_%'
  OR email LIKE '%test%'
);

-- Log the cleanup operation
INSERT INTO public.audit_logs (event_type, status, details, user_id)
VALUES (
  'production_cleanup', 
  'success',
  jsonb_build_object(
    'cleanup_type', 'test_user_removal',
    'retained_users', 1,
    'cleanup_timestamp', now(),
    'production_ready', true
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com')
);