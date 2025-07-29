-- COMPREHENSIVE TEST USER CLEANUP SCRIPT
-- This script deletes all test/demo/QA users while preserving production user (tonygomes88@gmail.com)
-- Handles all foreign key dependencies properly

-- Step 1: Log cleanup start
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
SELECT 
  'comprehensive_user_cleanup_start', 
  'success',
  jsonb_build_object(
    'total_users_before', (SELECT COUNT(*) FROM public.profiles),
    'production_user_email', 'tonygomes88@gmail.com',
    'cleanup_timestamp', now(),
    'patterns_to_delete', ARRAY['@qa.local', '@bfocfo.com', 'test_', 'persona.', '@example.com', '@demo.com', 'qa-', 'demo-']
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com' LIMIT 1),
  'user_cleanup'
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE email = 'tonygomes88@gmail.com');

-- Step 2: Get list of test user IDs to delete
DO $$
DECLARE
    test_user_ids uuid[];
    production_user_id uuid;
BEGIN
    -- Get production user ID
    SELECT id INTO production_user_id 
    FROM public.profiles 
    WHERE email = 'tonygomes88@gmail.com' 
    LIMIT 1;
    
    -- Get all test user IDs
    SELECT array_agg(id) INTO test_user_ids
    FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' 
        OR email LIKE '%@bfocfo.com' 
        OR email LIKE 'test_%'
        OR email LIKE 'persona.%'
        OR email LIKE 'jet_%'
        OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com'
        OR email LIKE 'qa-%'
        OR email LIKE 'demo-%'
        OR email LIKE '%test%'
        OR first_name LIKE '%Test%'
        OR last_name LIKE '%Test%'
    );
    
    -- Log the users to be deleted
    INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
    VALUES (
        'test_users_identified', 
        'success',
        jsonb_build_object(
            'test_user_count', array_length(test_user_ids, 1),
            'test_user_ids', test_user_ids,
            'production_user_preserved', production_user_id
        ),
        production_user_id,
        'user_cleanup'
    );
END $$;

-- Step 3: Delete from dependent tables first (in correct order to avoid FK violations)

-- Service role audit logs
DELETE FROM public.service_role_audit_logs 
WHERE user_context IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Security audit logs
DELETE FROM public.security_audit_logs 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Client storage audit
DELETE FROM public.client_storage_audit 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Analytics events
DELETE FROM public.analytics_events 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- User OTP codes
DELETE FROM public.user_otp_codes 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- File access logs
DELETE FROM public.file_access_log 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Coach insights
DELETE FROM public.coach_insights 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- User donations
DELETE FROM public.user_donations 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Bank accounts
DELETE FROM public.bank_accounts 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Credit cards
DELETE FROM public.credit_cards 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Budget goals
DELETE FROM public.budget_goals 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Business entities
DELETE FROM public.business_entities 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Business filings
DELETE FROM public.business_filings 
WHERE user_id IN (
    SELECT id FROM public.profiles 
    WHERE email != 'tonygomes88@gmail.com' 
    AND (
        email LIKE '%@qa.local' OR email LIKE '%@bfocfo.com' OR email LIKE 'test_%'
        OR email LIKE 'persona.%' OR email LIKE 'jet_%' OR email LIKE '%@example.com'
        OR email LIKE '%@demo.com' OR email LIKE 'qa-%' OR email LIKE 'demo-%'
        OR email LIKE '%test%' OR first_name LIKE '%Test%' OR last_name LIKE '%Test%'
    )
);

-- Step 4: Delete from profiles table
DELETE FROM public.profiles 
WHERE email != 'tonygomes88@gmail.com' 
AND (
    email LIKE '%@qa.local' 
    OR email LIKE '%@bfocfo.com' 
    OR email LIKE 'test_%'
    OR email LIKE 'persona.%'
    OR email LIKE 'jet_%'
    OR email LIKE '%@example.com'
    OR email LIKE '%@demo.com'
    OR email LIKE 'qa-%'
    OR email LIKE 'demo-%'
    OR email LIKE '%test%'
    OR first_name LIKE '%Test%'
    OR last_name LIKE '%Test%'
);

-- Step 5: Log cleanup completion
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
SELECT 
  'comprehensive_user_cleanup_complete', 
  'success',
  jsonb_build_object(
    'total_users_after', (SELECT COUNT(*) FROM public.profiles),
    'production_user_preserved', 'tonygomes88@gmail.com',
    'cleanup_timestamp', now(),
    'production_ready', true,
    'tables_cleaned', ARRAY[
        'service_role_audit_logs', 'security_audit_logs', 'client_storage_audit',
        'analytics_events', 'user_otp_codes', 'file_access_log', 'coach_insights',
        'user_donations', 'bank_accounts', 'credit_cards', 'budget_goals',
        'business_entities', 'business_filings', 'profiles'
    ]
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com' LIMIT 1),
  'user_cleanup'
WHERE EXISTS (SELECT 1 FROM public.profiles WHERE email = 'tonygomes88@gmail.com');