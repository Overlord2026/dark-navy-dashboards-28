-- Database Hardening: Set security_barrier on sensitive public views
-- This prevents leakage of sensitive data through view optimization bypasses

-- Set security_barrier on all public views that expose filtered data
ALTER VIEW IF EXISTS public.advisor_profiles_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_communication_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_workflow_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_legal_document_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_document_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_invitation_message_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_goal_category_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_agreement_workflow_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_integration_templates_public SET (security_barrier = true);
ALTER VIEW IF EXISTS public.v_attorney_document_classifications_public SET (security_barrier = true);

-- Set security_barrier on other sensitive views
ALTER VIEW IF EXISTS public.referral_leaderboard SET (security_barrier = true);
ALTER VIEW IF EXISTS public.vw_balance_sheet SET (security_barrier = true);
ALTER VIEW IF EXISTS public.vw_income_statement SET (security_barrier = true);
ALTER VIEW IF EXISTS public.vw_trial_balance SET (security_barrier = true);