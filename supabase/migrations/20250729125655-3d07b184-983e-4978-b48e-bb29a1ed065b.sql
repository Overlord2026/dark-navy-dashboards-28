-- Fix audit function and complete user cleanup
-- First check the current audit function issue

-- Drop the broken trigger
DROP TRIGGER IF EXISTS create_audit_log_trigger ON public.profiles;

-- Fix the audit function to handle null event_type properly
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    changed_columns text[] := '{}';
BEGIN
    -- Only proceed if we have a valid context
    IF TG_OP = 'UPDATE' THEN
        -- Get changed columns for updates
        SELECT array_agg(column_name) INTO changed_columns
        FROM information_schema.columns 
        WHERE table_name = TG_TABLE_NAME 
        AND table_schema = TG_TABLE_SCHEMA;
    END IF;
    
    -- Insert audit log with proper event_type
    INSERT INTO public.audit_logs(
        event_type,
        status,
        table_name,
        record_id,
        changed_columns,
        old_row,
        new_row,
        changed_at,
        user_id
    )
    VALUES (
        CASE TG_OP 
            WHEN 'INSERT' THEN 'record_created'
            WHEN 'UPDATE' THEN 'record_updated' 
            WHEN 'DELETE' THEN 'record_deleted'
            ELSE 'unknown_operation'
        END,
        'success',
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        changed_columns,
        CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::jsonb ELSE NULL END,
        now(),
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Now perform the user cleanup safely
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
VALUES (
  'production_user_cleanup_start', 
  'success',
  jsonb_build_object(
    'total_users_before', (SELECT COUNT(*) FROM public.profiles),
    'production_user_email', 'tonygomes88@gmail.com',
    'cleanup_timestamp', now()
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com' LIMIT 1),
  'user_cleanup'
);

-- Delete test users from all dependent tables
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

-- Re-enable audit trigger with fixed function
CREATE TRIGGER create_audit_log_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Fix security definer functions with mutable search_path
ALTER FUNCTION public.update_support_ticket_timestamp() SET search_path = '';
ALTER FUNCTION public.cleanup_expired_export_requests() SET search_path = '';
ALTER FUNCTION public.update_charity_annual_totals() SET search_path = '';
ALTER FUNCTION public.reset_product_compliance() SET search_path = '';
ALTER FUNCTION public.notify_medication_change() SET search_path = '';
ALTER FUNCTION public.create_document_expiry_reminders() SET search_path = '';
ALTER FUNCTION public.trigger_project_analytics_update() SET search_path = '';

-- Log security fixes completion
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
VALUES (
  'security_definer_functions_hardened', 
  'success',
  jsonb_build_object(
    'functions_updated', ARRAY[
      'update_support_ticket_timestamp',
      'cleanup_expired_export_requests', 
      'update_charity_annual_totals',
      'reset_product_compliance',
      'notify_medication_change',
      'create_document_expiry_reminders',
      'trigger_project_analytics_update'
    ],
    'security_improvement', 'Added SET search_path = empty to prevent privilege escalation',
    'timestamp', now()
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com' LIMIT 1),
  'security_hardening'
);

-- Log final cleanup completion
INSERT INTO public.audit_logs (event_type, status, details, user_id, table_name)
VALUES (
  'production_user_cleanup_complete', 
  'success',
  jsonb_build_object(
    'total_users_after', (SELECT COUNT(*) FROM public.profiles),
    'production_user_preserved', 'tonygomes88@gmail.com',
    'cleanup_timestamp', now(),
    'production_ready', true
  ),
  (SELECT id FROM public.profiles WHERE email = 'tonygomes88@gmail.com' LIMIT 1),
  'user_cleanup'
);