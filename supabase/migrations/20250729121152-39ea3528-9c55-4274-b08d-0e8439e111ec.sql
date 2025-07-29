-- Fix the audit log constraint issue first
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
SELECT 
  'production_cleanup_prep', 
  'success',
  jsonb_build_object(
    'cleanup_type', 'test_user_removal_prep',
    'users_before_cleanup', COUNT(*),
    'cleanup_timestamp', now()
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com'),
  'pre_cleanup_audit'
FROM public.profiles;

-- Now safely delete test users from profiles first
DELETE FROM public.profiles 
WHERE email != 'tonygomes88@gmail.com' 
AND (
  email LIKE '%@bfocfo.com' 
  OR email LIKE '%@qa.local' 
  OR email LIKE 'persona.%'
  OR email LIKE 'jet_%'
  OR email LIKE '%test%'
);

-- Log the completion
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
SELECT 
  'production_cleanup_complete', 
  'success',
  jsonb_build_object(
    'cleanup_type', 'test_user_removal_complete',
    'users_after_cleanup', COUNT(*),
    'cleanup_timestamp', now(),
    'production_ready', true
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com'),
  'post_cleanup_audit'
FROM public.profiles;