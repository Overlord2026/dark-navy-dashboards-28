-- Fix audit log RLS policy violations by ensuring service role can manage audit logs
DROP POLICY IF EXISTS "Service role can manage audit logs" ON public.audit_logs;
CREATE POLICY "Service role can manage audit logs" 
ON public.audit_logs 
FOR ALL 
USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- Fix database functions with mutable search_path vulnerabilities
-- Add SET search_path = '' to all functions that are missing this critical security setting

CREATE OR REPLACE FUNCTION public.update_support_ticket_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_export_requests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.data_export_requests 
  WHERE status = 'expired' 
  AND expires_at < now() - INTERVAL '30 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.update_charity_annual_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the charity's annual raised amount
  UPDATE public.charities 
  SET annual_raised = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.user_donations 
    WHERE charity_id = COALESCE(NEW.charity_id, OLD.charity_id)
    AND EXTRACT(YEAR FROM donation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = COALESCE(NEW.charity_id, OLD.charity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_product_compliance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  major_fields TEXT[] := ARRAY['name', 'description', 'minimum_investment', 'maximum_investment', 'risk_level', 'fee_structure', 'asset_allocation', 'eligibility_requirements'];
  field_name TEXT;
  old_val TEXT;
  new_val TEXT;
  changes_found BOOLEAN := FALSE;
BEGIN
  -- Only check for updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    -- Check if any major fields changed
    FOREACH field_name IN ARRAY major_fields LOOP
      EXECUTE format('SELECT ($1).%I::TEXT, ($2).%I::TEXT', field_name, field_name) 
      INTO old_val, new_val 
      USING OLD, NEW;
      
      IF old_val IS DISTINCT FROM new_val THEN
        changes_found := TRUE;
        EXIT;
      END IF;
    END LOOP;
    
    -- If major fields changed and product was previously approved, reset compliance
    IF changes_found AND OLD.compliance_approved = TRUE THEN
      NEW.compliance_approved := FALSE;
      NEW.status := 'pending_approval';
      NEW.last_compliance_check := now();
      
      -- Create compliance tracking record
      INSERT INTO public.product_compliance_tracking (
        product_id,
        review_type,
        status,
        created_by
      ) VALUES (
        NEW.id,
        'change_triggered',
        'pending',
        auth.uid()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;