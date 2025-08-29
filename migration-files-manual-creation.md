# Manual Migration Files Creation

Since the migrations directory is read-only, create these files manually:

## 1. `/supabase/migrations/2025-08-28_insurance_support.sql`
```sql
-- Idempotent, run-anywhere SQL (use IF NOT EXISTS; do not drop).
------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Personal lines intake
CREATE TABLE IF NOT EXISTS public.insurance_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  type text NOT NULL CHECK (type IN ('home','auto')),
  risk_hash text NOT NULL,
  applicant jsonb NOT NULL DEFAULT '{}'::jsonb,
  property jsonb NOT NULL DEFAULT '{}'::jsonb,
  vehicle jsonb NOT NULL DEFAULT '{}'::jsonb,
  coverage_limits jsonb NOT NULL DEFAULT '{}'::jsonb,
  deductibles jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.insurance_submissions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public'
      AND tablename='insurance_submissions' AND polname='p_ins_submissions_owner'
  ) THEN
    EXECUTE 'CREATE POLICY p_ins_submissions_owner ON public.insurance_submissions
             FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;
END $$ LANGUAGE plpgsql;

-- FNOL claims
CREATE TABLE IF NOT EXISTS public.insurance_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  claim_number text NOT NULL,
  policy_number text NOT NULL,
  status text NOT NULL DEFAULT 'reported',
  priority text NOT NULL DEFAULT 'normal',
  intake_data jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public'
      AND tablename='insurance_claims' AND polname='p_ins_claims_owner'
  ) THEN
    EXECUTE 'CREATE POLICY p_ins_claims_owner ON public.insurance_claims
             FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;
END $$ LANGUAGE plpgsql;
------------------------------------------------
```

## 2. `/supabase/migrations/2025-08-28_view_security_barrier.sql`
```sql
------------------------------------------------
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relkind='v'
  LOOP
    EXECUTE format('ALTER VIEW %I.%I SET (security_barrier=true);', r.nspname, r.relname);
  END LOOP;
END$$;
------------------------------------------------
```

## 3. `/supabase/migrations/2025-08-28_functions_hardening.sql`
```sql
-- if you have SECURITY DEFINER functions, set a safe search_path; otherwise leave note.
------------------------------------------------
DO $$
DECLARE f record;
BEGIN
  FOR f IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args, p.prosecdef
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
    WHERE p.prosecdef = true AND n.nspname NOT IN ('pg_catalog','information_schema')
  LOOP
    EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path TO public, pg_temp;', f.nspname, f.proname, f.args);
  END LOOP;
END$$ LANGUAGE plpgsql;
------------------------------------------------
```