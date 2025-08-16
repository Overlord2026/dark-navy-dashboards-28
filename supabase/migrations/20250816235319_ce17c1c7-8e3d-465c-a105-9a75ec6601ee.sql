-- Security hardening: Fix function search_path settings (corrected)
-- This migration addresses security warnings by setting explicit search_path on existing functions

-- Standard business logic functions - set explicit search_path
ALTER FUNCTION public.activate_referral(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.calculate_audit_hash_sha3(uuid, uuid, text, text, text, text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.cleanup_expired_export_requests() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.cleanup_old_diagnostic_runs(integer) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.complete_attorney_onboarding(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.create_override_payout(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.create_security_incident(text, text, text, text, jsonb, jsonb, uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.current_tenant_id() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.fn_touch_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_cpa_staff_permissions(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_current_user_firm_id() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_current_user_organization_id() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_onboarding_documents(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_table_policies() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_table_rls_status() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.initiate_disaster_recovery(text, text, text, text[]) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.log_education_content_changes() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.log_product_changes() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.log_rls_violation(text, text, uuid, jsonb) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.merkle_root(text[]) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.post_journal(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.receipt_emit(jsonb, jsonb, text, jsonb, uuid, text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.receipt_emit_secure(jsonb, jsonb, text, jsonb, uuid, text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.request_receipt_emission(jsonb, jsonb, text, jsonb, uuid, text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.secure_create_secret(text, text, text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.send_onboarding_reminder(uuid) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.set_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.sha256_hex(text) SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.trigger_follow_up_email() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.trigger_follow_up_scheduling() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.trigger_meeting_summary_processing() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.trigger_recompute_trust_score() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_agent_ce_credits() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_attorney_onboarding_progress() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_connector_timestamp() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_estate_requests_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_goals_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_ip_watch_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_message_thread_timestamp() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_nil_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_prospect_invitations_updated_at() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.update_training_schedule_on_completion() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.validate_plan_activation(uuid) SET search_path = 'public', 'pg_temp';

-- Security-critical functions maintain restricted search_path 
-- (vault_is_configured, check_extension_health already have proper search_path = '')

-- Add security documentation
COMMENT ON FUNCTION public.vault_is_configured() IS 'Security function - maintains empty search_path to prevent injection attacks';
COMMENT ON FUNCTION public.check_extension_health() IS 'Security function - maintains empty search_path to prevent injection attacks';