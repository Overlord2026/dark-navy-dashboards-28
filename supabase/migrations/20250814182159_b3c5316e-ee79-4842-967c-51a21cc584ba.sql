-- Create target_runs table for Target Analyzer
CREATE TABLE IF NOT EXISTS public.target_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  household_id UUID NOT NULL,
  scenario_id UUID,
  label TEXT NOT NULL,
  params JSONB NOT NULL,
  computed JSONB NOT NULL,
  success_pct NUMERIC,
  gap_amount NUMERIC,
  created_by UUID NOT NULL DEFAULT auth.uid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_target_runs_household ON public.target_runs (tenant_id, household_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.target_runs ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant-scoped access
CREATE POLICY "target_runs_select_tenant" ON public.target_runs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.tenant_id = target_runs.tenant_id
  ));

CREATE POLICY "target_runs_insert_tenant" ON public.target_runs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.tenant_id = target_runs.tenant_id
  ));

-- Update prospect_invitations table to include persona_group if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prospect_invitations' AND column_name = 'persona_group') THEN
        ALTER TABLE public.prospect_invitations ADD COLUMN persona_group TEXT CHECK (persona_group IN ('family','pro'));
    END IF;
END $$;

-- Create accept_invite RPC function for secure token validation
CREATE OR REPLACE FUNCTION public.accept_invite(raw_token TEXT)
RETURNS TABLE(persona_group TEXT, target_path TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE 
  v RECORD;
BEGIN
  SELECT * INTO v
  FROM public.prospect_invitations
  WHERE token_hash = encode(digest(raw_token, 'sha256'), 'hex')
    AND status = 'pending' 
    AND expires_at > now();
    
  IF NOT FOUND THEN 
    RETURN; 
  END IF;

  UPDATE public.prospect_invitations
  SET status = 'accepted', activated_at = now()
  WHERE id = v.id;

  RETURN QUERY SELECT v.persona_group, COALESCE(v.target_path, '');
END; $$;

-- Grant execute permission to anon users for invite acceptance
GRANT EXECUTE ON FUNCTION public.accept_invite(TEXT) TO anon;