-- Estate Planning Module - Core Tables

-- Core estate planning requests
CREATE TABLE IF NOT EXISTS public.estate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  household_id UUID,
  advisor_id UUID,
  attorney_id UUID,
  state_code TEXT NOT NULL,
  matter_type TEXT NOT NULL CHECK (matter_type IN ('will', 'revocable_trust', 'poa', 'ahcd', 'package_basic', 'package_trust')),
  status TEXT NOT NULL DEFAULT 'intake' CHECK (status IN ('intake', 'drafting', 'review', 'signing', 'notarizing', 'witnessing', 'filing', 'complete', 'on_hold')),
  priority TEXT NOT NULL DEFAULT 'standard' CHECK (priority IN ('standard', 'rush')),
  intake JSONB NOT NULL DEFAULT '{}',
  docs JSONB NOT NULL DEFAULT '[]',
  compliance JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Estate planning sessions (review, signing, notary, witness)
CREATE TABLE IF NOT EXISTS public.estate_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.estate_requests(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('attorney_review', 'client_sign', 'notary', 'witness')),
  provider TEXT,
  provider_session_id TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  recording_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate planning witnesses
CREATE TABLE IF NOT EXISTS public.estate_witnesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.estate_requests(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'failed')),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate planning notaries
CREATE TABLE IF NOT EXISTS public.estate_notaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.estate_requests(id) ON DELETE CASCADE,
  provider TEXT,
  notary_name TEXT,
  credential_id TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'failed')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- State filing submissions
CREATE TABLE IF NOT EXISTS public.estate_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.estate_requests(id) ON DELETE CASCADE,
  state_code TEXT,
  filing_type TEXT CHECK (filing_type IN ('deed_recording', 'trust_registration', 'poa_registration', 'other')),
  method TEXT CHECK (method IN ('api', 'efile', 'mail', 'in_person')),
  submitted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  receipt_url TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Estate planning audit log
CREATE TABLE IF NOT EXISTS public.estate_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.estate_requests(id) ON DELETE CASCADE,
  user_id UUID,
  actor_role TEXT CHECK (actor_role IN ('client', 'advisor', 'attorney', 'system', 'witness', 'notary')),
  action TEXT,
  details JSONB DEFAULT '{}',
  ip INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.estate_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_witnesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_notaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estate_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for estate_requests
CREATE POLICY "Users can manage their own estate requests"
ON public.estate_requests
FOR ALL
USING (
  user_id = auth.uid() OR
  advisor_id = auth.uid() OR
  attorney_id = auth.uid() OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

-- RLS Policies for estate_sessions
CREATE POLICY "Users can access sessions for their requests"
ON public.estate_sessions
FOR ALL
USING (
  request_id IN (
    SELECT id FROM public.estate_requests 
    WHERE user_id = auth.uid() OR advisor_id = auth.uid() OR attorney_id = auth.uid()
  ) OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

-- RLS Policies for estate_witnesses
CREATE POLICY "Users can access witnesses for their requests"
ON public.estate_witnesses
FOR ALL
USING (
  request_id IN (
    SELECT id FROM public.estate_requests 
    WHERE user_id = auth.uid() OR advisor_id = auth.uid() OR attorney_id = auth.uid()
  ) OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

-- RLS Policies for estate_notaries
CREATE POLICY "Users can access notaries for their requests"
ON public.estate_notaries
FOR ALL
USING (
  request_id IN (
    SELECT id FROM public.estate_requests 
    WHERE user_id = auth.uid() OR advisor_id = auth.uid() OR attorney_id = auth.uid()
  ) OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

-- RLS Policies for estate_filings
CREATE POLICY "Users can access filings for their requests"
ON public.estate_filings
FOR ALL
USING (
  request_id IN (
    SELECT id FROM public.estate_requests 
    WHERE user_id = auth.uid() OR advisor_id = auth.uid() OR attorney_id = auth.uid()
  ) OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

-- RLS Policies for estate_audit_log
CREATE POLICY "Users can view audit logs for their requests"
ON public.estate_audit_log
FOR SELECT
USING (
  request_id IN (
    SELECT id FROM public.estate_requests 
    WHERE user_id = auth.uid() OR advisor_id = auth.uid() OR attorney_id = auth.uid()
  ) OR
  has_any_role(ARRAY['admin', 'system_administrator'])
);

CREATE POLICY "System can insert audit logs"
ON public.estate_audit_log
FOR INSERT
WITH CHECK (true);

-- Update trigger for estate_requests
CREATE OR REPLACE FUNCTION update_estate_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_estate_requests_updated_at
BEFORE UPDATE ON public.estate_requests
FOR EACH ROW EXECUTE FUNCTION update_estate_requests_updated_at();