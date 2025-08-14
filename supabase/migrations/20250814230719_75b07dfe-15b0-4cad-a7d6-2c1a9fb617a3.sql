-- Create swag_intakes table for prospect intake tracking
CREATE TABLE public.swag_intakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  prospect_id UUID,
  scorecard_run_id UUID,
  persona_group TEXT NOT NULL DEFAULT 'family',
  status TEXT NOT NULL DEFAULT 'created',
  meeting_type TEXT,
  meeting_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scorecard_accounts table for account data storage
CREATE TABLE public.scorecard_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scorecard_run_id UUID NOT NULL,
  account_name TEXT NOT NULL,
  tax_type TEXT NOT NULL CHECK (tax_type IN ('taxable', 'trad', 'roth', 'hsa', 'annuity_qualified', 'annuity_nonqualified')),
  qualified BOOLEAN NOT NULL DEFAULT false,
  balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  annual_contrib NUMERIC(15,2) NOT NULL DEFAULT 0,
  expected_return NUMERIC(5,4) NOT NULL DEFAULT 0.07,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scorecard_runs table to track runs
CREATE TABLE public.scorecard_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  score INTEGER NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}',
  inputs JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.swag_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecard_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecard_runs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for swag_intakes
CREATE POLICY "Users can view their own swag intakes"
  ON public.swag_intakes FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create swag intakes"
  ON public.swag_intakes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own swag intakes"
  ON public.swag_intakes FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for scorecard_accounts
CREATE POLICY "Users can view accounts for their scorecards"
  ON public.scorecard_accounts FOR SELECT
  USING (scorecard_run_id IN (
    SELECT id FROM public.scorecard_runs WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create accounts for their scorecards"
  ON public.scorecard_accounts FOR INSERT
  WITH CHECK (scorecard_run_id IN (
    SELECT id FROM public.scorecard_runs WHERE user_id = auth.uid()
  ));

-- RLS Policies for scorecard_runs
CREATE POLICY "Users can view their own scorecard runs"
  ON public.scorecard_runs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scorecard runs"
  ON public.scorecard_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scorecard runs"
  ON public.scorecard_runs FOR UPDATE
  USING (auth.uid() = user_id);