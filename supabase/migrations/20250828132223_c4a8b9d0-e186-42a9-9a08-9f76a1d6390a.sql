-- Create audit log entry for MICRO_SEC_5_RLS_OWNER_ADMIN completion
INSERT INTO public.security_audit_logs (
  event_type,
  severity,
  details,
  user_id,
  created_at
) VALUES (
  'micro_sec_5_rls_owner_admin',
  'info',
  jsonb_build_object(
    'micro_ticket', 'MICRO_SEC_5_RLS_OWNER_ADMIN',
    'description', 'Implemented Row-Level Security policies for AIES tables',
    'tables_secured', jsonb_build_array('aies_consent_grants', 'aies_policies', 'aies_connector_health'),
    'policies_created', jsonb_build_array(
      'consent_owner_all - owner read/write on aies_consent_grants',
      'policies_ro_auth - authenticated read access on aies_policies', 
      'policies_admin_write - admin write access on aies_policies',
      'conn_health_admin_all - admin-only access on aies_connector_health'
    ),
    'admin_function_created', 'is_admin_jwt() for JWT app_metadata role checking',
    'schema_adjustments', jsonb_build_object(
      'aies_consent_grants', 'Used subject_user_id instead of user_id for owner policy'
    ),
    'security_benefits', jsonb_build_array(
      'Enforced data isolation per user for consent grants',
      'Protected policy management to admin-only access',
      'Secured connector health data with admin-only access',
      'Added JWT-based admin role verification'
    ),
    'timestamp', now()
  ),
  auth.uid(),
  now()
);