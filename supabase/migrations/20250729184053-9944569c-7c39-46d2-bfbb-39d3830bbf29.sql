-- Fix the audit_table_changes function to use valid severity values
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
  
  -- Insert into audit log using correct column names and valid severity
  INSERT INTO public.security_audit_logs (
    user_id, table_name, operation, record_id, tenant_id,
    old_data, new_data, changed_fields, severity
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    TG_OP,
    CASE 
      WHEN has_id_field THEN
        CASE WHEN TG_OP = 'DELETE' THEN (old_data->>'id')::uuid ELSE (new_data->>'id')::uuid END
      ELSE NULL
    END,
    CASE 
      WHEN has_tenant_id THEN
        CASE WHEN TG_OP = 'DELETE' THEN (old_data->>'tenant_id')::uuid ELSE (new_data->>'tenant_id')::uuid END
      ELSE NULL
    END,
    old_data,
    new_data,
    CASE 
      WHEN TG_OP = 'UPDATE' AND new_data IS NOT NULL AND old_data IS NOT NULL THEN (
        SELECT array_agg(key)
        FROM jsonb_each(new_data)
        WHERE new_data->key IS DISTINCT FROM old_data->key
      )
      ELSE NULL
    END,
    'info'  -- Changed from 'low' to 'info' to match constraint
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Now clean up test users, keeping only production superusers
DELETE FROM auth.users 
WHERE email NOT IN ('tonygomes88@gmail.com', 'votepedro1988@gmail.com');

-- Also clean up corresponding profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users 
  WHERE email IN ('tonygomes88@gmail.com', 'votepedro1988@gmail.com')
);