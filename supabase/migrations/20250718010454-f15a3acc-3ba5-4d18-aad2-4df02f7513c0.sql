-- Add proper CASCADE constraints for user deletion cleanup
-- This ensures when a user is deleted, all their related data is properly cleaned up

-- First, drop existing constraints that should have CASCADE behavior
-- Core user data tables
ALTER TABLE public.bank_accounts DROP CONSTRAINT IF EXISTS bank_accounts_user_id_fkey;
ALTER TABLE public.bank_accounts ADD CONSTRAINT bank_accounts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.budget_goals DROP CONSTRAINT IF EXISTS budget_goals_user_id_fkey;
ALTER TABLE public.budget_goals ADD CONSTRAINT budget_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.credit_cards DROP CONSTRAINT IF EXISTS credit_cards_user_id_fkey;
ALTER TABLE public.credit_cards ADD CONSTRAINT credit_cards_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.digital_assets DROP CONSTRAINT IF EXISTS digital_assets_user_id_fkey;
ALTER TABLE public.digital_assets ADD CONSTRAINT digital_assets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.epigenetic_tests DROP CONSTRAINT IF EXISTS epigenetic_tests_user_id_fkey;
ALTER TABLE public.epigenetic_tests ADD CONSTRAINT epigenetic_tests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.estate_planning_documents DROP CONSTRAINT IF EXISTS estate_planning_documents_user_id_fkey;
ALTER TABLE public.estate_planning_documents ADD CONSTRAINT estate_planning_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercise_entries DROP CONSTRAINT IF EXISTS exercise_entries_user_id_fkey;
ALTER TABLE public.exercise_entries ADD CONSTRAINT exercise_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.exercise_goals DROP CONSTRAINT IF EXISTS exercise_goals_user_id_fkey;
ALTER TABLE public.exercise_goals ADD CONSTRAINT exercise_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.families DROP CONSTRAINT IF EXISTS families_user_id_fkey;
ALTER TABLE public.families ADD CONSTRAINT families_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_user_id_fkey;
ALTER TABLE public.family_members ADD CONSTRAINT family_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.fee_scenarios DROP CONSTRAINT IF EXISTS fee_scenarios_user_id_fkey;
ALTER TABLE public.fee_scenarios ADD CONSTRAINT fee_scenarios_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.financial_plans DROP CONSTRAINT IF EXISTS financial_plans_user_id_fkey;
ALTER TABLE public.financial_plans ADD CONSTRAINT financial_plans_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.health_alerts DROP CONSTRAINT IF EXISTS health_alerts_user_id_fkey;
ALTER TABLE public.health_alerts ADD CONSTRAINT health_alerts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.health_goals DROP CONSTRAINT IF EXISTS health_goals_user_id_fkey;
ALTER TABLE public.health_goals ADD CONSTRAINT health_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.health_metrics DROP CONSTRAINT IF EXISTS health_metrics_user_id_fkey;
ALTER TABLE public.health_metrics ADD CONSTRAINT health_metrics_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.health_recommendations DROP CONSTRAINT IF EXISTS health_recommendations_user_id_fkey;
ALTER TABLE public.health_recommendations ADD CONSTRAINT health_recommendations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_documents DROP CONSTRAINT IF EXISTS healthcare_documents_user_id_fkey;
ALTER TABLE public.healthcare_documents ADD CONSTRAINT healthcare_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_providers DROP CONSTRAINT IF EXISTS healthcare_providers_user_id_fkey;
ALTER TABLE public.healthcare_providers ADD CONSTRAINT healthcare_providers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.healthcare_shared_documents DROP CONSTRAINT IF EXISTS healthcare_shared_documents_user_id_fkey;
ALTER TABLE public.healthcare_shared_documents ADD CONSTRAINT healthcare_shared_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.hsa_accounts DROP CONSTRAINT IF EXISTS hsa_accounts_user_id_fkey;
ALTER TABLE public.hsa_accounts ADD CONSTRAINT hsa_accounts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.hsa_receipts DROP CONSTRAINT IF EXISTS hsa_receipts_user_id_fkey;
ALTER TABLE public.hsa_receipts ADD CONSTRAINT hsa_receipts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.hsa_reimbursements DROP CONSTRAINT IF EXISTS hsa_reimbursements_user_id_fkey;
ALTER TABLE public.hsa_reimbursements ADD CONSTRAINT hsa_reimbursements_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.hsa_transactions DROP CONSTRAINT IF EXISTS hsa_transactions_user_id_fkey;
ALTER TABLE public.hsa_transactions ADD CONSTRAINT hsa_transactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.insurance_policies DROP CONSTRAINT IF EXISTS insurance_policies_user_id_fkey;
ALTER TABLE public.insurance_policies ADD CONSTRAINT insurance_policies_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investment_accounts DROP CONSTRAINT IF EXISTS investment_accounts_user_id_fkey;
ALTER TABLE public.investment_accounts ADD CONSTRAINT investment_accounts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investment_meetings DROP CONSTRAINT IF EXISTS investment_meetings_user_id_fkey;
ALTER TABLE public.investment_meetings ADD CONSTRAINT investment_meetings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.other_assets DROP CONSTRAINT IF EXISTS other_assets_user_id_fkey;
ALTER TABLE public.other_assets ADD CONSTRAINT other_assets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prescriptions DROP CONSTRAINT IF EXISTS prescriptions_user_id_fkey;
ALTER TABLE public.prescriptions ADD CONSTRAINT prescriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.private_equity_accounts DROP CONSTRAINT IF EXISTS private_equity_accounts_user_id_fkey;
ALTER TABLE public.private_equity_accounts ADD CONSTRAINT private_equity_accounts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.professionals DROP CONSTRAINT IF EXISTS professionals_user_id_fkey;
ALTER TABLE public.professionals ADD CONSTRAINT professionals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_user_id_fkey;
ALTER TABLE public.properties ADD CONSTRAINT properties_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.provider_reviews DROP CONSTRAINT IF EXISTS provider_reviews_user_id_fkey;
ALTER TABLE public.provider_reviews ADD CONSTRAINT provider_reviews_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.public_stocks DROP CONSTRAINT IF EXISTS public_stocks_user_id_fkey;
ALTER TABLE public.public_stocks ADD CONSTRAINT public_stocks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.real_estate_properties DROP CONSTRAINT IF EXISTS real_estate_properties_user_id_fkey;
ALTER TABLE public.real_estate_properties ADD CONSTRAINT real_estate_properties_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.retirement_plans DROP CONSTRAINT IF EXISTS retirement_plans_user_id_fkey;
ALTER TABLE public.retirement_plans ADD CONSTRAINT retirement_plans_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.shared_documents DROP CONSTRAINT IF EXISTS shared_documents_user_id_fkey;
ALTER TABLE public.shared_documents ADD CONSTRAINT shared_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.social_security_members DROP CONSTRAINT IF EXISTS social_security_members_user_id_fkey;
ALTER TABLE public.social_security_members ADD CONSTRAINT social_security_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.strategy_comparisons DROP CONSTRAINT IF EXISTS strategy_comparisons_user_id_fkey;
ALTER TABLE public.strategy_comparisons ADD CONSTRAINT strategy_comparisons_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.strategy_engagement_tracking DROP CONSTRAINT IF EXISTS strategy_engagement_tracking_user_id_fkey;
ALTER TABLE public.strategy_engagement_tracking ADD CONSTRAINT strategy_engagement_tracking_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.subscribers DROP CONSTRAINT IF EXISTS subscribers_user_id_fkey;
ALTER TABLE public.subscribers ADD CONSTRAINT subscribers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.supplements DROP CONSTRAINT IF EXISTS supplements_user_id_fkey;
ALTER TABLE public.supplements ADD CONSTRAINT supplements_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.transfers DROP CONSTRAINT IF EXISTS transfers_user_id_fkey;
ALTER TABLE public.transfers ADD CONSTRAINT transfers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_additional_info DROP CONSTRAINT IF EXISTS user_additional_info_user_id_fkey;
ALTER TABLE public.user_additional_info ADD CONSTRAINT user_additional_info_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_affiliations DROP CONSTRAINT IF EXISTS user_affiliations_user_id_fkey;
ALTER TABLE public.user_affiliations ADD CONSTRAINT user_affiliations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_assets DROP CONSTRAINT IF EXISTS user_assets_user_id_fkey;
ALTER TABLE public.user_assets ADD CONSTRAINT user_assets_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_beneficiaries DROP CONSTRAINT IF EXISTS user_beneficiaries_user_id_fkey;
ALTER TABLE public.user_beneficiaries ADD CONSTRAINT user_beneficiaries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_checklist_progress DROP CONSTRAINT IF EXISTS user_checklist_progress_user_id_fkey;
ALTER TABLE public.user_checklist_progress ADD CONSTRAINT user_checklist_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_contact_info DROP CONSTRAINT IF EXISTS user_contact_info_user_id_fkey;
ALTER TABLE public.user_contact_info ADD CONSTRAINT user_contact_info_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_content_interactions DROP CONSTRAINT IF EXISTS user_content_interactions_user_id_fkey;
ALTER TABLE public.user_content_interactions ADD CONSTRAINT user_content_interactions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_course_progress DROP CONSTRAINT IF EXISTS user_course_progress_user_id_fkey;
ALTER TABLE public.user_course_progress ADD CONSTRAINT user_course_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_downloads DROP CONSTRAINT IF EXISTS user_downloads_user_id_fkey;
ALTER TABLE public.user_downloads ADD CONSTRAINT user_downloads_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_enabled_metrics DROP CONSTRAINT IF EXISTS user_enabled_metrics_user_id_fkey;
ALTER TABLE public.user_enabled_metrics ADD CONSTRAINT user_enabled_metrics_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_events DROP CONSTRAINT IF EXISTS user_events_user_id_fkey;
ALTER TABLE public.user_events ADD CONSTRAINT user_events_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_financial_snapshots DROP CONSTRAINT IF EXISTS user_financial_snapshots_user_id_fkey;
ALTER TABLE public.user_financial_snapshots ADD CONSTRAINT user_financial_snapshots_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_investment_interests DROP CONSTRAINT IF EXISTS user_investment_interests_user_id_fkey;
ALTER TABLE public.user_investment_interests ADD CONSTRAINT user_investment_interests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_liabilities DROP CONSTRAINT IF EXISTS user_liabilities_user_id_fkey;
ALTER TABLE public.user_liabilities ADD CONSTRAINT user_liabilities_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_onboarding_progress DROP CONSTRAINT IF EXISTS user_onboarding_progress_user_id_fkey;
ALTER TABLE public.user_onboarding_progress ADD CONSTRAINT user_onboarding_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_otp_codes DROP CONSTRAINT IF EXISTS user_otp_codes_user_id_fkey;
ALTER TABLE public.user_otp_codes ADD CONSTRAINT user_otp_codes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_portfolio_assignments DROP CONSTRAINT IF EXISTS user_portfolio_assignments_user_id_fkey;
ALTER TABLE public.user_portfolio_assignments ADD CONSTRAINT user_portfolio_assignments_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_saved_content DROP CONSTRAINT IF EXISTS user_saved_content_user_id_fkey;
ALTER TABLE public.user_saved_content ADD CONSTRAINT user_saved_content_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_training_progress DROP CONSTRAINT IF EXISTS user_training_progress_user_id_fkey;
ALTER TABLE public.user_training_progress ADD CONSTRAINT user_training_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_trust_documents DROP CONSTRAINT IF EXISTS user_trust_documents_user_id_fkey;
ALTER TABLE public.user_trust_documents ADD CONSTRAINT user_trust_documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_trusts DROP CONSTRAINT IF EXISTS user_trusts_user_id_fkey;
ALTER TABLE public.user_trusts ADD CONSTRAINT user_trusts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.webinar_registrations DROP CONSTRAINT IF EXISTS webinar_registrations_user_id_fkey;
ALTER TABLE public.webinar_registrations ADD CONSTRAINT webinar_registrations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Also add missing constraints for tables that should reference users
-- Add user_id constraints for tables that may be missing them
ALTER TABLE public.health_docs ADD CONSTRAINT health_docs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.documents ADD CONSTRAINT documents_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.methylation_markers ADD CONSTRAINT methylation_markers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.metric_entries ADD CONSTRAINT metric_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications ADD CONSTRAINT notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.nutrition_entries ADD CONSTRAINT nutrition_entries_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.nutrition_goals ADD CONSTRAINT nutrition_goals_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.physicians ADD CONSTRAINT physicians_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_consultations ADD CONSTRAINT tax_planning_consultations_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_interests ADD CONSTRAINT tax_planning_interests_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tax_planning_strategies ADD CONSTRAINT tax_planning_strategies_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;