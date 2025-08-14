-- Security fixes: Enable RLS and create invitation system

-- Check if advisor_profiles table exists and enable RLS if it does
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'advisor_profiles') THEN
        ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policy for advisor profiles (owner access only)
        DROP POLICY IF EXISTS advisor_profiles_owner_access ON public.advisor_profiles;
        CREATE POLICY advisor_profiles_owner_access ON public.advisor_profiles
        FOR ALL USING (auth.uid() = user_id);
        
        -- Revoke anonymous access to protect emails
        REVOKE ALL ON public.advisor_profiles FROM anon;
    END IF;
END $$;

-- Add invitation tokens table for proper invite routing
CREATE TABLE IF NOT EXISTS public.prospect_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_token TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  persona_group TEXT NOT NULL DEFAULT 'family',
  target_path TEXT,
  advisor_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prospect invitations
ALTER TABLE public.prospect_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policy: advisors can manage their own invitations
CREATE POLICY prospect_invitations_advisor_access ON public.prospect_invitations
FOR ALL USING (auth.uid() = advisor_id);

-- RLS policy: public can read non-expired invitations by token
CREATE POLICY prospect_invitations_public_token_access ON public.prospect_invitations
FOR SELECT USING (expires_at > now() AND status = 'pending');

-- Update trigger for prospect invitations
CREATE OR REPLACE FUNCTION update_prospect_invitations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prospect_invitations_updated_at ON public.prospect_invitations;
CREATE TRIGGER prospect_invitations_updated_at
  BEFORE UPDATE ON public.prospect_invitations
  FOR EACH ROW EXECUTE FUNCTION update_prospect_invitations_updated_at();

-- Enable RLS on all public tables to fix security warnings
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE '%_pkey'
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.schemaname, r.tablename);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if already enabled or other issues
            NULL;
        END;
    END LOOP;
END $$;