-- Create admin function to emit KPI proof slips
CREATE OR REPLACE FUNCTION public.admin_emit_kpi_proofslip(days integer DEFAULT 1, firm_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_admin_check boolean;
  v_proof_data jsonb;
  v_event_id uuid;
BEGIN
  -- Check if user has admin role
  SELECT public.has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']) INTO v_admin_check;
  
  IF NOT v_admin_check THEN
    RAISE EXCEPTION 'Insufficient permissions to emit KPI proof slip' USING ERRCODE = '42501';
  END IF;
  
  -- Generate proof slip data
  v_proof_data := jsonb_build_object(
    'event_type', 'kpi_report_emitted',
    'firm_id', firm_id,
    'days_period', days,
    'emitted_by', auth.uid(),
    'emitted_at', now(),
    'proof_hash', encode(digest(concat(auth.uid()::text, now()::text, days::text), 'sha256'), 'hex')
  );
  
  -- Log the KPI report emission event
  INSERT INTO public.app_events (
    event,
    event_type,
    user_id,
    advisor_firm_id,
    data
  ) VALUES (
    'audit.kpi_report_emitted',
    'audit.kpi_report_emitted',
    auth.uid(),
    firm_id,
    v_proof_data
  ) RETURNING id INTO v_event_id;
  
  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'event_id', v_event_id,
    'proof_data', v_proof_data
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;