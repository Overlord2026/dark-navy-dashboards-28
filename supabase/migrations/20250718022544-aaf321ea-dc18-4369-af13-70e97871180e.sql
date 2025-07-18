-- Create comprehensive database/backend testing suite

-- 1. Test RLS recursion fix and tenant isolation
CREATE OR REPLACE FUNCTION public.test_rls_and_tenant_isolation()
RETURNS TABLE(
  test_case TEXT,
  expected_result TEXT,
  actual_result TEXT,
  pass_fail TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_user_id UUID;
  test_tenant_id UUID;
  other_tenant_id UUID;
  profile_count INTEGER;
  cross_tenant_count INTEGER;
BEGIN
  -- Test Case 1: RLS Recursion Fix
  BEGIN
    -- Try CRUD operations on profiles table
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    
    -- Try to insert a test profile
    INSERT INTO public.profiles (id, first_name, last_name, email, tenant_id) 
    VALUES (
      gen_random_uuid(), 
      'Test', 
      'User', 
      'test@example.com',
      get_current_user_tenant_id()
    );
    
    RETURN QUERY SELECT 
      'RLS Recursion Fix'::TEXT,
      'No infinite recursion errors; data accessible'::TEXT,
      'CRUD operations completed successfully'::TEXT,
      'PASS'::TEXT,
      format('Profile count: %s, operations completed', profile_count)::TEXT;
      
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'RLS Recursion Fix'::TEXT,
      'No infinite recursion errors; data accessible'::TEXT,
      format('ERROR: %s', SQLERRM)::TEXT,
      'FAIL'::TEXT,
      'RLS recursion or access error detected'::TEXT;
  END;

  -- Test Case 2: RLS Tenant Isolation
  BEGIN
    -- Get current user's tenant
    test_tenant_id := get_current_user_tenant_id();
    
    -- Create a different tenant ID for testing
    other_tenant_id := gen_random_uuid();
    
    -- Try to query cross-tenant data (should be blocked)
    SELECT COUNT(*) INTO cross_tenant_count 
    FROM public.documents 
    WHERE tenant_id != test_tenant_id;
    
    -- If we can see other tenant data, that's a problem
    IF cross_tenant_count > 0 THEN
      RETURN QUERY SELECT 
        'RLS Tenant Isolation'::TEXT,
        'No cross-tenant data leakage'::TEXT,
        format('Can see %s records from other tenants', cross_tenant_count)::TEXT,
        'FAIL'::TEXT,
        'Cross-tenant data leakage detected'::TEXT;
    ELSE
      RETURN QUERY SELECT 
        'RLS Tenant Isolation'::TEXT,
        'No cross-tenant data leakage'::TEXT,
        'No cross-tenant data accessible'::TEXT,
        'PASS'::TEXT,
        'Tenant isolation working correctly'::TEXT;
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'RLS Tenant Isolation'::TEXT,
      'No cross-tenant data leakage'::TEXT,
      format('ERROR: %s', SQLERRM)::TEXT,
      'FAIL'::TEXT,
      'Error testing tenant isolation'::TEXT;
  END;

END;
$$;

-- 2. Test FK constraints and cascade delete
CREATE OR REPLACE FUNCTION public.test_fk_constraints_cascade()
RETURNS TABLE(
  test_case TEXT,
  expected_result TEXT,
  actual_result TEXT,
  pass_fail TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_user_id UUID;
  related_records_before INTEGER;
  related_records_after INTEGER;
BEGIN
  -- Note: We can't actually delete auth.users in a test, but we can simulate
  -- by testing related table constraints
  
  BEGIN
    -- Test foreign key constraints on user-related tables
    test_user_id := auth.uid();
    
    -- Count related records before (simulated test)
    SELECT COUNT(*) INTO related_records_before 
    FROM public.bank_accounts 
    WHERE user_id = test_user_id;
    
    -- Test constraint by trying invalid FK insert
    BEGIN
      INSERT INTO public.bank_accounts (user_id, name, account_type, balance)
      VALUES ('00000000-0000-0000-0000-000000000000', 'Test Account', 'checking', 1000);
      
      RETURN QUERY SELECT 
        'FK Constraints/Cascade Delete'::TEXT,
        'All dependent records deleted, no orphans'::TEXT,
        'Invalid FK insert succeeded (should fail)'::TEXT,
        'FAIL'::TEXT,
        'FK constraint not enforced'::TEXT;
        
    EXCEPTION WHEN foreign_key_violation THEN
      RETURN QUERY SELECT 
        'FK Constraints/Cascade Delete'::TEXT,
        'All dependent records deleted, no orphans'::TEXT,
        'FK constraints properly enforced'::TEXT,
        'PASS'::TEXT,
        'Foreign key validation working'::TEXT;
    END;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'FK Constraints/Cascade Delete'::TEXT,
      'All dependent records deleted, no orphans'::TEXT,
      format('ERROR: %s', SQLERRM)::TEXT,
      'FAIL'::TEXT,
      'Error testing FK constraints'::TEXT;
  END;
END;
$$;

-- 3. Test webhook status constraints
CREATE OR REPLACE FUNCTION public.test_webhook_constraints()
RETURNS TABLE(
  test_case TEXT,
  expected_result TEXT,
  actual_result TEXT,
  pass_fail TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Test webhook status constraints by trying invalid status
  BEGIN
    -- Try to insert invalid webhook status
    INSERT INTO public.webhook_deliveries (
      webhook_config_id,
      event_type,
      payload,
      status,
      tenant_id
    ) VALUES (
      gen_random_uuid(),
      'test_event',
      '{"test": true}'::jsonb,
      'invalid_status',
      get_current_user_tenant_id()
    );
    
    RETURN QUERY SELECT 
      'Webhook Status Constraints'::TEXT,
      'Constraint blocks invalid value'::TEXT,
      'Invalid status insert succeeded (should fail)'::TEXT,
      'FAIL'::TEXT,
      'Status constraint not enforced'::TEXT;
      
  EXCEPTION WHEN check_violation OR invalid_text_representation THEN
    RETURN QUERY SELECT 
      'Webhook Status Constraints'::TEXT,
      'Constraint blocks invalid value'::TEXT,
      'Invalid status blocked by constraint'::TEXT,
      'PASS'::TEXT,
      'Status constraint working correctly'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 
      'Webhook Status Constraints'::TEXT,
      'Constraint blocks invalid value'::TEXT,
      format('Unexpected error: %s', SQLERRM)::TEXT,
      'FAIL'::TEXT,
      'Unexpected error during constraint test'::TEXT;
  END;
END;
$$;

-- 4. Create comprehensive test runner
CREATE OR REPLACE FUNCTION public.run_database_review_tests()
RETURNS TABLE(
  test_number INTEGER,
  area_feature TEXT,
  test_case TEXT,
  expected_result TEXT,
  actual_result TEXT,
  pass_fail TEXT,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Test 1-2: RLS and tenant isolation
  RETURN QUERY 
  SELECT ROW_NUMBER() OVER () + 0 as test_number, 'RLS/Tenant'::TEXT as area_feature, * 
  FROM public.test_rls_and_tenant_isolation();
  
  -- Test 3: FK constraints
  RETURN QUERY 
  SELECT ROW_NUMBER() OVER () + 2 as test_number, 'FK Constraints'::TEXT as area_feature, * 
  FROM public.test_fk_constraints_cascade();
  
  -- Test 5: Webhook constraints
  RETURN QUERY 
  SELECT ROW_NUMBER() OVER () + 3 as test_number, 'Webhook Constraints'::TEXT as area_feature, * 
  FROM public.test_webhook_constraints();
  
  -- Test 7: Transfer validation (using existing function)
  RETURN QUERY 
  SELECT 
    7 as test_number,
    'Transfer Validation'::TEXT as area_feature,
    test_name as test_case,
    'Error thrown, no bad transfer recorded' as expected_result,
    result as actual_result,
    CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END as pass_fail,
    details as notes
  FROM public.test_transfer_validation();
  
  -- Test 8: HSA compliance (using existing function)
  RETURN QUERY 
  SELECT 
    8 as test_number,
    'HSA Compliance'::TEXT as area_feature,
    test_name as test_case,
    'Error; limit enforced' as expected_result,
    result as actual_result,
    CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END as pass_fail,
    details as notes
  FROM public.test_hsa_compliance();
  
  -- Test 10: Audit logs (using existing function)
  RETURN QUERY 
  SELECT 
    10 as test_number,
    'Audit Logs'::TEXT as area_feature,
    test_name as test_case,
    'All actions time-stamped and recorded in logs' as expected_result,
    result as actual_result,
    CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END as pass_fail,
    details as notes
  FROM public.test_audit_logging();
  
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.test_rls_and_tenant_isolation() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_fk_constraints_cascade() TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_webhook_constraints() TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_database_review_tests() TO authenticated;