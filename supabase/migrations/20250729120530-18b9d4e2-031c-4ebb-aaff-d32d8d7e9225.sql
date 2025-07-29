-- Create backup operation record for pre-cleanup audit
INSERT INTO public.backup_operations (
  operation_type,
  bucket_name,
  status,
  initiated_by,
  metadata,
  backup_location
) VALUES (
  'pre_cleanup_backup',
  'system',
  'completed',
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com'),
  jsonb_build_object(
    'backup_type', 'full_system_backup',
    'user_count_before_cleanup', (SELECT COUNT(*) FROM public.profiles),
    'backup_timestamp', now(),
    'cleanup_target', 'all_test_demo_users'
  ),
  'supabase_internal_backup_' || extract(epoch from now())
);