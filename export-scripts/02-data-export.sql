-- =============================================================================
-- SUPABASE PROJECT DATA EXPORT
-- Project ID: xcmqjkvyvuhoslbzmlgi
-- Generated: 2025-07-29
-- =============================================================================

-- This script exports all data from your tables
-- Run each section separately in Supabase SQL Editor

-- =============================================================================
-- CRITICAL: Export Auth Users First
-- =============================================================================

-- Export auth.users table (requires service role key)
COPY (
  SELECT 
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    confirmed_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  FROM auth.users
  ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- PROFILES DATA EXPORT
-- =============================================================================

COPY (
  SELECT * FROM public.profiles ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- CORE BUSINESS TABLES DATA EXPORT
-- =============================================================================

-- Financial data
COPY (SELECT * FROM public.bank_accounts ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.credit_cards ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.financial_accounts ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.financial_goals ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.budget_goals ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Business entities
COPY (SELECT * FROM public.business_entities ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.business_filings ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Family and health data
COPY (SELECT * FROM public.families ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.family_members ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.health_metrics ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.health_goals ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Investment data
COPY (SELECT * FROM public.investment_accounts ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.investment_models ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.investment_strategies ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- Documents
COPY (SELECT * FROM public.documents ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.document_categories ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- AUDIT AND SECURITY DATA EXPORT
-- =============================================================================

COPY (SELECT * FROM public.audit_logs ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.security_audit_logs ORDER BY timestamp) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.compliance_checks ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- CONFIGURATION DATA EXPORT
-- =============================================================================

COPY (SELECT * FROM public.api_integrations ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.crm_integrations ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- REFERENCE DATA EXPORT
-- =============================================================================

COPY (SELECT * FROM public.charities ORDER BY created_at) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM public.healthcare_providers ORDER BY created_at) TO STDOUT WITH CSV HEADER;

-- =============================================================================
-- Generate INSERT statements for all tables
-- =============================================================================

-- Use this query to generate INSERT statements for any table:
-- Replace 'table_name' with the actual table name

/*
DO $$
DECLARE
    rec RECORD;
    table_name TEXT := 'your_table_name_here';
    sql_statement TEXT;
BEGIN
    FOR rec IN 
        SELECT * FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name = table_name
    LOOP
        EXECUTE format('
            SELECT ''INSERT INTO %I.%I ('' || 
                   string_agg(column_name, '', '') || 
                   '') VALUES'' FROM (
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = %L 
                AND table_name = %L 
                ORDER BY ordinal_position
            ) cols;
        ', rec.table_schema, rec.table_name, rec.table_schema, rec.table_name);
    END LOOP;
END $$;
*/