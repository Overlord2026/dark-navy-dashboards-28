
-- Phase 1: Critical Database Function Fixes

-- 1. Fix the missing test_audit_logging function that's referenced by run_database_review_tests
CREATE OR REPLACE FUNCTION public.test_audit_logging()
RETURNS TABLE(test_name TEXT, result TEXT, details TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Test 1: Audit log creation functionality
  BEGIN
    -- Insert a test audit log entry
    INSERT INTO public.audit_logs (event_type, status, details, user_id)
    VALUES (
      'test_audit_entry',
      'success',
      jsonb_build_object('test', true, 'timestamp', now()),
      auth.uid()
    );
    
    -- Verify the entry was created
    IF EXISTS (
      SELECT 1 FROM public.audit_logs 
      WHERE event_type = 'test_audit_entry' 
      AND status = 'success'
      AND created_at >= now() - interval '1 minute'
    ) THEN
      RETURN QUERY SELECT 'Audit Log Creation'::TEXT, 'PASSED'::TEXT, 'Audit entry created successfully'::TEXT;
    ELSE
      RETURN QUERY SELECT 'Audit Log Creation'::TEXT, 'FAILED'::TEXT, 'Audit entry not found'::TEXT;
    END IF;
    
    -- Clean up test data
    DELETE FROM public.audit_logs WHERE event_type = 'test_audit_entry';
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Audit Log Creation'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Audit log querying functionality
  BEGIN
    -- Count recent audit logs (basic functionality test)
    DECLARE
      log_count INTEGER;
    BEGIN
      SELECT COUNT(*) INTO log_count 
      FROM public.audit_logs 
      WHERE created_at >= now() - interval '24 hours';
      
      RETURN QUERY SELECT 'Audit Log Querying'::TEXT, 'PASSED'::TEXT, 
        format('Found %s audit logs in last 24 hours', log_count)::TEXT;
    END;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Audit Log Querying'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;
END;
$$;

-- 2. Fix the run_database_review_tests function to resolve type mismatch
CREATE OR REPLACE FUNCTION public.run_database_review_tests()
RETURNS TABLE(test_number INTEGER, area_feature TEXT, test_case TEXT, expected_result TEXT, actual_result TEXT, pass_fail TEXT, notes TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_counter INTEGER := 1;
BEGIN
  -- Test 1-2: RLS and tenant isolation
  FOR test_case, expected_result, actual_result, pass_fail, notes IN
    SELECT * FROM public.test_rls_and_tenant_isolation()
  LOOP
    RETURN QUERY SELECT test_counter, 'RLS/Tenant'::TEXT, test_case, expected_result, actual_result, pass_fail, notes;
    test_counter := test_counter + 1;
  END LOOP;
  
  -- Test 3: FK constraints
  FOR test_case, expected_result, actual_result, pass_fail, notes IN
    SELECT * FROM public.test_fk_constraints_cascade()
  LOOP
    RETURN QUERY SELECT test_counter, 'FK Constraints'::TEXT, test_case, expected_result, actual_result, pass_fail, notes;
    test_counter := test_counter + 1;
  END LOOP;
  
  -- Test 4: Webhook constraints
  FOR test_case, expected_result, actual_result, pass_fail, notes IN
    SELECT * FROM public.test_webhook_constraints()
  LOOP
    RETURN QUERY SELECT test_counter, 'Webhook Constraints'::TEXT, test_case, expected_result, actual_result, pass_fail, notes;
    test_counter := test_counter + 1;
  END LOOP;
  
  -- Test 5: Transfer validation
  FOR test_name, result, details IN
    SELECT * FROM public.test_transfer_validation()
  LOOP
    RETURN QUERY SELECT 
      test_counter,
      'Transfer Validation'::TEXT,
      test_name,
      'Error thrown, no bad transfer recorded',
      result,
      CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END,
      details;
    test_counter := test_counter + 1;
  END LOOP;
  
  -- Test 6: HSA compliance
  FOR test_name, result, details IN
    SELECT * FROM public.test_hsa_compliance()
  LOOP
    RETURN QUERY SELECT 
      test_counter,
      'HSA Compliance'::TEXT,
      test_name,
      'Error; limit enforced',
      result,
      CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END,
      details;
    test_counter := test_counter + 1;
  END LOOP;
  
  -- Test 7: Audit logs
  FOR test_name, result, details IN
    SELECT * FROM public.test_audit_logging()
  LOOP
    RETURN QUERY SELECT 
      test_counter,
      'Audit Logs'::TEXT,
      test_name,
      'All actions time-stamped and recorded in logs',
      result,
      CASE WHEN result = 'PASSED' THEN 'PASS' ELSE 'FAIL' END,
      details;
    test_counter := test_counter + 1;
  END LOOP;
END;
$$;

-- 3. Fix transfer validation test to use proper trigger simulation
CREATE OR REPLACE FUNCTION public.test_transfer_validation()
RETURNS TABLE(test_name TEXT, result TEXT, details TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_transfer_id UUID;
BEGIN
  -- Test 1: Try insufficient funds validation
  BEGIN
    test_transfer_id := gen_random_uuid();
    
    -- Attempt to insert a transfer that should fail validation
    INSERT INTO public.transfers (
      id,
      user_id,
      from_account_id,
      to_account_id,
      amount,
      transfer_fee,
      status,
      reference_number
    ) VALUES (
      test_transfer_id,
      '00000000-0000-0000-0000-000000000002',
      '22222222-2222-2222-2222-222222222222',
      '44444444-4444-4444-4444-444444444444',
      500.00,
      5.00,
      'pending',
      'TEST-INSUFFICIENT-' || extract(epoch from now())
    );
    
    -- If we get here, the validation failed to block the transfer
    DELETE FROM public.transfers WHERE id = test_transfer_id;
    RETURN QUERY SELECT 'Insufficient Funds Test'::TEXT, 'FAILED'::TEXT, 'Transfer should have been blocked'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Insufficient Funds Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Try closed account validation
  BEGIN
    test_transfer_id := gen_random_uuid();
    
    INSERT INTO public.transfers (
      id,
      user_id,
      from_account_id,
      to_account_id,
      amount,
      transfer_fee,
      status,
      reference_number
    ) VALUES (
      test_transfer_id,
      '00000000-0000-0000-0000-000000000003',
      '33333333-3333-3333-3333-333333333333', -- Closed account
      '44444444-4444-4444-4444-444444444444',
      100.00,
      5.00,
      'pending',
      'TEST-CLOSED-' || extract(epoch from now())
    );
    
    DELETE FROM public.transfers WHERE id = test_transfer_id;
    RETURN QUERY SELECT 'Closed Account Test'::TEXT, 'FAILED'::TEXT, 'Transfer from closed account should have been blocked'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Closed Account Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 3: Valid transfer should pass
  BEGIN
    test_transfer_id := gen_random_uuid();
    
    INSERT INTO public.transfers (
      id,
      user_id,
      from_account_id,
      to_account_id,
      amount,
      transfer_fee,
      status,
      reference_number
    ) VALUES (
      test_transfer_id,
      '00000000-0000-0000-0000-000000000001',
      '11111111-1111-1111-1111-111111111111', -- High balance account
      '44444444-4444-4444-4444-444444444444',
      1000.00,
      10.00,
      'pending',
      'TEST-VALID-' || extract(epoch from now())
    );
    
    -- Clean up test data
    DELETE FROM public.transfers WHERE id = test_transfer_id;
    RETURN QUERY SELECT 'Valid Transfer Test'::TEXT, 'PASSED'::TEXT, 'Valid transfer was accepted'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Valid Transfer Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;
END;
$$;

-- 4. Fix HSA compliance test to use proper trigger simulation
CREATE OR REPLACE FUNCTION public.test_hsa_compliance()
RETURNS TABLE(test_name TEXT, result TEXT, details TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  test_contribution_id UUID;
BEGIN
  -- Test 1: Over-contribution should fail
  BEGIN
    test_contribution_id := gen_random_uuid();
    
    INSERT INTO public.hsa_contributions (
      id,
      account_id,
      tx_date,
      amount,
      source
    ) VALUES (
      test_contribution_id,
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      CURRENT_DATE,
      10000.00, -- Way over limit
      'employee'
    );
    
    DELETE FROM public.hsa_contributions WHERE id = test_contribution_id;
    RETURN QUERY SELECT 'HSA Over-contribution Test'::TEXT, 'FAILED'::TEXT, 'Over-contribution should have been blocked'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Over-contribution Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Inactive account should fail
  BEGIN
    test_contribution_id := gen_random_uuid();
    
    INSERT INTO public.hsa_contributions (
      id,
      account_id,
      tx_date,
      amount,
      source
    ) VALUES (
      test_contribution_id,
      'cccccccc-cccc-cccc-cccc-cccccccccccc', -- Inactive account
      CURRENT_DATE,
      100.00,
      'employee'
    );
    
    DELETE FROM public.hsa_contributions WHERE id = test_contribution_id;
    RETURN QUERY SELECT 'HSA Inactive Account Test'::TEXT, 'FAILED'::TEXT, 'Contribution to inactive account should have been blocked'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Inactive Account Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 3: Valid contribution should pass
  BEGIN
    test_contribution_id := gen_random_uuid();
    
    INSERT INTO public.hsa_contributions (
      id,
      account_id,
      tx_date,
      amount,
      source
    ) VALUES (
      test_contribution_id,
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      CURRENT_DATE,
      500.00, -- Within limits
      'employee'
    );
    
    DELETE FROM public.hsa_contributions WHERE id = test_contribution_id;
    RETURN QUERY SELECT 'HSA Valid Contribution Test'::TEXT, 'PASSED'::TEXT, 'Valid HSA contribution was accepted'::TEXT;
    
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Valid Contribution Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;
END;
$$;

-- 5. Create missing tables that are referenced by the test functions
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  from_account_id UUID NOT NULL,
  to_account_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  transfer_fee NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  reference_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hsa_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL,
  tx_date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Add test data for the validation scenarios
INSERT INTO public.bank_accounts (id, user_id, name, account_type, balance) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'High Balance Account', 'checking', 50000.00),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Low Balance Account', 'checking', 100.00),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'Closed Account', 'closed', 0.00),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 'Destination Account', 'checking', 1000.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hsa_accounts (id, user_id, account_name, custodian_name, is_active, family_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'Active HSA', 'Test Custodian', true, 'family-1'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000003', 'Inactive HSA', 'Test Custodian', false, 'family-2')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.test_audit_logging() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.run_database_review_tests() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.test_transfer_validation() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.test_hsa_compliance() TO authenticated, service_role;
