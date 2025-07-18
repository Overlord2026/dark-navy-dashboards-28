-- Add CASCADE constraints where missing, skip constraints that already exist
-- Some tables already have constraints but without CASCADE, we need to recreate those

-- First, update existing constraints to have CASCADE behavior
-- These have NO ACTION currently and need to be CASCADE
ALTER TABLE public.digital_assets DROP CONSTRAINT digital_assets_user_id_fkey;
ALTER TABLE public.digital_assets ADD CONSTRAINT digital_assets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.business_filings DROP CONSTRAINT business_filings_user_id_fkey;
ALTER TABLE public.business_filings ADD CONSTRAINT business_filings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.coach_insights DROP CONSTRAINT coach_insights_user_id_fkey;
ALTER TABLE public.coach_insights ADD CONSTRAINT coach_insights_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.device_tokens DROP CONSTRAINT device_tokens_user_id_fkey;
ALTER TABLE public.device_tokens ADD CONSTRAINT device_tokens_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.estate_planning_documents DROP CONSTRAINT estate_planning_documents_user_id_fkey;
ALTER TABLE public.estate_planning_documents ADD CONSTRAINT estate_planning_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercise_entries DROP CONSTRAINT exercise_entries_user_id_fkey;
ALTER TABLE public.exercise_entries ADD CONSTRAINT exercise_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercise_goals DROP CONSTRAINT exercise_goals_user_id_fkey;
ALTER TABLE public.exercise_goals ADD CONSTRAINT exercise_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.family_members DROP CONSTRAINT family_members_user_id_fkey;
ALTER TABLE public.family_members ADD CONSTRAINT family_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.health_alerts DROP CONSTRAINT health_alerts_user_id_fkey;
ALTER TABLE public.health_alerts ADD CONSTRAINT health_alerts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_documents DROP CONSTRAINT healthcare_documents_user_id_fkey;
ALTER TABLE public.healthcare_documents ADD CONSTRAINT healthcare_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_providers DROP CONSTRAINT healthcare_providers_user_id_fkey;
ALTER TABLE public.healthcare_providers ADD CONSTRAINT healthcare_providers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_shared_documents DROP CONSTRAINT healthcare_shared_documents_user_id_fkey;
ALTER TABLE public.healthcare_shared_documents ADD CONSTRAINT healthcare_shared_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.metric_entries DROP CONSTRAINT metric_entries_user_id_fkey;
ALTER TABLE public.metric_entries ADD CONSTRAINT metric_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.nutrition_entries DROP CONSTRAINT nutrition_entries_user_id_fkey;
ALTER TABLE public.nutrition_entries ADD CONSTRAINT nutrition_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.nutrition_goals DROP CONSTRAINT nutrition_goals_user_id_fkey;
ALTER TABLE public.nutrition_goals ADD CONSTRAINT nutrition_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.physicians DROP CONSTRAINT physicians_user_id_fkey;
ALTER TABLE public.physicians ADD CONSTRAINT physicians_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prescriptions DROP CONSTRAINT prescriptions_user_id_fkey;
ALTER TABLE public.prescriptions ADD CONSTRAINT prescriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.professionals DROP CONSTRAINT professionals_user_id_fkey;
ALTER TABLE public.professionals ADD CONSTRAINT professionals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.properties DROP CONSTRAINT properties_user_id_fkey;
ALTER TABLE public.properties ADD CONSTRAINT properties_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.shared_documents DROP CONSTRAINT shared_documents_user_id_fkey;
ALTER TABLE public.shared_documents ADD CONSTRAINT shared_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.social_security_members DROP CONSTRAINT social_security_members_user_id_fkey;
ALTER TABLE public.social_security_members ADD CONSTRAINT social_security_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.strategy_comparisons DROP CONSTRAINT strategy_comparisons_user_id_fkey;
ALTER TABLE public.strategy_comparisons ADD CONSTRAINT strategy_comparisons_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.strategy_engagement_tracking DROP CONSTRAINT strategy_engagement_tracking_user_id_fkey;
ALTER TABLE public.strategy_engagement_tracking ADD CONSTRAINT strategy_engagement_tracking_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_consultations DROP CONSTRAINT tax_planning_consultations_user_id_fkey;
ALTER TABLE public.tax_planning_consultations ADD CONSTRAINT tax_planning_consultations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_interests DROP CONSTRAINT tax_planning_interests_user_id_fkey;
ALTER TABLE public.tax_planning_interests ADD CONSTRAINT tax_planning_interests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_strategies DROP CONSTRAINT tax_planning_strategies_user_id_fkey;
ALTER TABLE public.tax_planning_strategies ADD CONSTRAINT tax_planning_strategies_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_enabled_metrics DROP CONSTRAINT user_enabled_metrics_user_id_fkey;
ALTER TABLE public.user_enabled_metrics ADD CONSTRAINT user_enabled_metrics_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_financial_snapshots DROP CONSTRAINT user_financial_snapshots_user_id_fkey;
ALTER TABLE public.user_financial_snapshots ADD CONSTRAINT user_financial_snapshots_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_onboarding_progress DROP CONSTRAINT user_onboarding_progress_user_id_fkey;
ALTER TABLE public.user_onboarding_progress ADD CONSTRAINT user_onboarding_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_portfolio_assignments DROP CONSTRAINT user_portfolio_assignments_user_id_fkey;
ALTER TABLE public.user_portfolio_assignments ADD CONSTRAINT user_portfolio_assignments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_training_progress DROP CONSTRAINT user_training_progress_user_id_fkey;
ALTER TABLE public.user_training_progress ADD CONSTRAINT user_training_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;