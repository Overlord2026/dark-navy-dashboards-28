-- QA Test Data Cleanup Script
-- Run this ONLY after QA testing is complete and before production launch

-- Log the cleanup operation start
INSERT INTO public.audit_logs (
  event_type,
  status,
  table_name,
  details,
  user_id
) VALUES (
  'test_data_cleanup_start',
  'success',
  'multiple_tables',
  '{"action": "Starting QA test data cleanup", "timestamp": "' || now() || '"}',
  '88888888-8888-8888-8888-888888888888'
);

-- Remove test analytics events
DELETE FROM public.analytics_events 
WHERE tenant_id = '11111111-1111-1111-1111-111111111111'
  AND session_id LIKE 'test-session-%';

-- Remove test bank accounts
DELETE FROM public.bank_accounts 
WHERE id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
);

-- Remove test profiles (this will cascade to remove associated data)
DELETE FROM public.profiles 
WHERE id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

-- Remove test tenant
DELETE FROM public.tenants 
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Clean up test-related audit logs (keep the cleanup logs for record)
DELETE FROM public.audit_logs 
WHERE event_type IN ('test_data_setup') 
  AND user_id = '88888888-8888-8888-8888-888888888888';

-- Verify cleanup - should return 0 for all
DO $$
DECLARE
  remaining_test_profiles INTEGER;
  remaining_test_accounts INTEGER;
  remaining_test_events INTEGER;
  remaining_test_tenants INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_test_profiles 
  FROM public.profiles 
  WHERE email LIKE '%@test.com';
  
  SELECT COUNT(*) INTO remaining_test_accounts 
  FROM public.bank_accounts 
  WHERE name LIKE 'Test %' OR name LIKE '%Test%';
  
  SELECT COUNT(*) INTO remaining_test_events 
  FROM public.analytics_events 
  WHERE session_id LIKE 'test-session-%';
  
  SELECT COUNT(*) INTO remaining_test_tenants 
  FROM public.tenants 
  WHERE name LIKE '%QA Test%';
  
  -- Log cleanup results
  INSERT INTO public.audit_logs (
    event_type,
    status,
    table_name,
    details,
    user_id
  ) VALUES (
    'test_data_cleanup_complete',
    CASE WHEN (remaining_test_profiles + remaining_test_accounts + remaining_test_events + remaining_test_tenants) = 0 
         THEN 'success' 
         ELSE 'warning' 
    END,
    'multiple_tables',
    jsonb_build_object(
      'action', 'QA test data cleanup completed',
      'remaining_test_profiles', remaining_test_profiles,
      'remaining_test_accounts', remaining_test_accounts,
      'remaining_test_events', remaining_test_events,
      'remaining_test_tenants', remaining_test_tenants,
      'cleanup_timestamp', now()
    ),
    NULL
  );
  
  RAISE NOTICE 'Cleanup complete. Remaining test data: Profiles=%, Accounts=%, Events=%, Tenants=%', 
    remaining_test_profiles, remaining_test_accounts, remaining_test_events, remaining_test_tenants;
END $$;