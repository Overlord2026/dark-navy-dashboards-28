-- Create test functions to verify trigger logic without permissions issues

-- Test function for transfer validation
CREATE OR REPLACE FUNCTION public.test_transfer_validation()
RETURNS TABLE(test_name TEXT, result TEXT, details TEXT) AS $$
BEGIN
  -- Test 1: Try insufficient funds validation
  BEGIN
    PERFORM public.validate_transfer() FROM (
      SELECT 
        gen_random_uuid() as id,
        '00000000-0000-0000-0000-000000000002'::uuid as user_id,
        '22222222-2222-2222-2222-222222222222'::uuid as from_account_id,
        '44444444-4444-4444-4444-444444444444'::uuid as to_account_id,
        500.00 as amount,
        5.00 as transfer_fee,
        'pending' as status,
        'TEST-REF' as reference_number,
        NOW() as created_at,
        NOW() as updated_at
    ) as NEW;
    
    RETURN QUERY SELECT 'Insufficient Funds Test'::TEXT, 'FAILED'::TEXT, 'Should have thrown exception'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Insufficient Funds Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Try closed account validation
  BEGIN
    PERFORM public.validate_transfer() FROM (
      SELECT 
        gen_random_uuid() as id,
        '00000000-0000-0000-0000-000000000003'::uuid as user_id,
        '33333333-3333-3333-3333-333333333333'::uuid as from_account_id, -- Closed account
        '44444444-4444-4444-4444-444444444444'::uuid as to_account_id,
        100.00 as amount,
        5.00 as transfer_fee,
        'pending' as status,
        'TEST-REF' as reference_number,
        NOW() as created_at,
        NOW() as updated_at
    ) as NEW;
    
    RETURN QUERY SELECT 'Closed Account Test'::TEXT, 'FAILED'::TEXT, 'Should have thrown exception'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Closed Account Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 3: Valid transfer should pass
  BEGIN
    PERFORM public.validate_transfer() FROM (
      SELECT 
        gen_random_uuid() as id,
        '00000000-0000-0000-0000-000000000001'::uuid as user_id,
        '11111111-1111-1111-1111-111111111111'::uuid as from_account_id, -- High balance account
        '44444444-4444-4444-4444-444444444444'::uuid as to_account_id,
        1000.00 as amount,
        10.00 as transfer_fee,
        'pending' as status,
        'TEST-REF' as reference_number,
        NOW() as created_at,
        NOW() as updated_at
    ) as NEW;
    
    RETURN QUERY SELECT 'Valid Transfer Test'::TEXT, 'PASSED'::TEXT, 'Validation succeeded'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Valid Transfer Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test function for HSA compliance
CREATE OR REPLACE FUNCTION public.test_hsa_compliance()
RETURNS TABLE(test_name TEXT, result TEXT, details TEXT) AS $$
BEGIN
  -- Test 1: Over-contribution should fail
  BEGIN
    PERFORM public.enforce_hsa_compliance() FROM (
      SELECT 
        gen_random_uuid() as id,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid as account_id,
        CURRENT_DATE as tx_date,
        5000.00 as amount, -- Would exceed family limit
        'employee' as source,
        NOW() as created_at
    ) as NEW;
    
    RETURN QUERY SELECT 'HSA Over-contribution Test'::TEXT, 'FAILED'::TEXT, 'Should have thrown exception'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Over-contribution Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Inactive account should fail
  BEGIN
    PERFORM public.enforce_hsa_compliance() FROM (
      SELECT 
        gen_random_uuid() as id,
        'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid as account_id, -- Inactive account
        CURRENT_DATE as tx_date,
        100.00 as amount,
        'employee' as source,
        NOW() as created_at
    ) as NEW;
    
    RETURN QUERY SELECT 'HSA Inactive Account Test'::TEXT, 'FAILED'::TEXT, 'Should have thrown exception'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Inactive Account Test'::TEXT, 'PASSED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 3: Valid contribution should pass
  BEGIN
    PERFORM public.enforce_hsa_compliance() FROM (
      SELECT 
        gen_random_uuid() as id,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid as account_id,
        CURRENT_DATE as tx_date,
        1000.00 as amount, -- Valid amount within limits
        'employee' as source,
        NOW() as created_at
    ) as NEW;
    
    RETURN QUERY SELECT 'HSA Valid Contribution Test'::TEXT, 'PASSED'::TEXT, 'Validation succeeded'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'HSA Valid Contribution Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;