-- Fix webhook constraint test function to work with new tenant_id column

CREATE OR REPLACE FUNCTION public.test_webhook_constraints()
 RETURNS TABLE(test_case text, expected_result text, actual_result text, pass_fail text, notes text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  -- Test webhook status constraints by trying invalid status
  BEGIN
    -- Try to insert invalid webhook status (simplified for constraint testing)
    INSERT INTO public.webhook_deliveries (
      event_type,
      payload,
      status
    ) VALUES (
      'test_event',
      '{"test": true}'::jsonb,
      'invalid_status'
    );
    
    RETURN QUERY SELECT 
      'Webhook Status Constraints'::TEXT,
      'Constraint blocks invalid value'::TEXT,
      'Invalid status insert succeeded (should fail)'::TEXT,
      'FAIL'::TEXT,
      'Status constraint not enforced'::TEXT;
      
  EXCEPTION 
    WHEN check_violation THEN
      RETURN QUERY SELECT 
        'Webhook Status Constraints'::TEXT,
        'Constraint blocks invalid value'::TEXT,
        'Invalid status blocked by constraint'::TEXT,
        'PASS'::TEXT,
        'Status constraint working correctly'::TEXT;
    WHEN invalid_text_representation THEN
      RETURN QUERY SELECT 
        'Webhook Status Constraints'::TEXT,
        'Constraint blocks invalid value'::TEXT,
        'Invalid status blocked by constraint'::TEXT,
        'PASS'::TEXT,
        'Status constraint working correctly'::TEXT;
    WHEN OTHERS THEN
      RETURN QUERY SELECT 
        'Webhook Status Constraints'::TEXT,
        'Constraint blocks invalid value'::TEXT,
        format('Unexpected error: %s', SQLERRM)::TEXT,
        'FAIL'::TEXT,
        'Unexpected error during constraint test'::TEXT;
  END;
END;
$function$;