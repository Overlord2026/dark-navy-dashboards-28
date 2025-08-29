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
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='insurance_submissions' AND polname='p_ins_submissions_owner')
  THEN EXECUTE 'CREATE POLICY p_ins_submissions_owner ON public.insurance_submissions
                FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL)';
  END IF;
END $$ LANGUAGE plpgsql;