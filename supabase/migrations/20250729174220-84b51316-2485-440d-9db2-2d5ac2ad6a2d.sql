-- Fix the audit_table_changes function to handle tables without tenant_id
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_data jsonb := NULL;
  new_data jsonb := NULL;
  audit_data jsonb;
  has_tenant_id boolean := false;
  has_id_field boolean := false;
BEGIN
  -- Check if the table has tenant_id column
  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'tenant_id'
  ) INTO has_tenant_id;
  
  -- Check if the table has id column
  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'id'
  ) INTO has_id_field;
  
  -- Capture old and new data
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    old_data := row_to_json(OLD)::jsonb;
  END IF;
  
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    new_data := row_to_json(NEW)::jsonb;
  END IF;
  
  -- Build audit data with safe field access
  audit_data := jsonb_build_object(
    'table_name', TG_TABLE_NAME,
    'operation', TG_OP,
    'old_data', old_data,
    'new_data', new_data,
    'changed_fields', CASE 
      WHEN TG_OP = 'UPDATE' AND new_data IS NOT NULL AND old_data IS NOT NULL THEN (
        SELECT jsonb_object_agg(key, jsonb_build_object('old', old_data->key, 'new', new_data->key))
        FROM jsonb_each(new_data)
        WHERE new_data->key IS DISTINCT FROM old_data->key
      )
      ELSE NULL
    END,
    'tenant_id', CASE 
      WHEN has_tenant_id THEN
        COALESCE(
          CASE WHEN TG_OP = 'DELETE' THEN old_data->>'tenant_id' ELSE new_data->>'tenant_id' END,
          ''
        )
      ELSE NULL
    END,
    'record_id', CASE 
      WHEN has_id_field THEN
        CASE WHEN TG_OP = 'DELETE' THEN old_data->>'id' ELSE new_data->>'id' END
      ELSE NULL
    END,
    'timestamp', now(),
    'user_id', auth.uid()
  );
  
  -- Insert into audit log
  INSERT INTO public.security_audit_logs (
    user_id, event_type, severity, table_name, operation,
    metadata, tenant_id
  ) VALUES (
    auth.uid(),
    'table_change',
    'low',
    TG_TABLE_NAME,
    TG_OP,
    audit_data,
    CASE 
      WHEN has_tenant_id THEN
        CASE WHEN TG_OP = 'DELETE' THEN old_data->>'tenant_id' ELSE new_data->>'tenant_id' END::uuid
      ELSE NULL
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix search_path for all security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;