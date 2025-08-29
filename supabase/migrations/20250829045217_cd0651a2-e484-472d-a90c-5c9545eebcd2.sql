-- Insurance submissions (home/auto intake payloads)
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
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='insurance_submissions' AND policyname='p_ins_submissions_owner'
  ) THEN
    CREATE POLICY p_ins_submissions_owner ON public.insurance_submissions
    FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END$$ LANGUAGE plpgsql;

-- Insurance claims (FNOL)
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
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='insurance_claims' AND policyname='p_ins_claims_owner'
  ) THEN
    CREATE POLICY p_ins_claims_owner ON public.insurance_claims
    FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END$$ LANGUAGE plpgsql;

-- quick check
SELECT tablename FROM pg_tables
WHERE schemaname='public' AND tablename IN ('insurance_submissions','insurance_claims')
ORDER BY tablename;