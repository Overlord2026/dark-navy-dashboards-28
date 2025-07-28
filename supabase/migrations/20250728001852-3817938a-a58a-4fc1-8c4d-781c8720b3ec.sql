-- Fix function search path issues for security compliance
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.modified = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_product_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
  action_type TEXT;
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant ID
  SELECT tenant_id INTO user_tenant_id FROM public.profiles WHERE id = auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
  END IF;
  
  -- Log the change
  INSERT INTO public.product_audit_log (
    product_id,
    tenant_id,
    action_type,
    table_name,
    record_id,
    change_summary,
    user_id,
    user_role
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    COALESCE(user_tenant_id, NEW.tenant_id, OLD.tenant_id),
    action_type,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Record created'
      WHEN TG_OP = 'UPDATE' THEN 'Record updated'
      WHEN TG_OP = 'DELETE' THEN 'Record deleted'
    END,
    auth.uid(),
    get_current_user_role()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;