-- Create consent records table
CREATE TABLE public.consent_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scope TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scope, version)
);

-- Enable RLS
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own consent records" 
ON public.consent_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consent records" 
ON public.consent_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to accept consent
CREATE OR REPLACE FUNCTION public.consent_accept(
  p_scope TEXT,
  p_version TEXT DEFAULT 'v1',
  p_metadata JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  consent_id UUID;
  current_user_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Insert or update consent record
  INSERT INTO public.consent_records (
    user_id, 
    scope, 
    version, 
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    current_user_id,
    p_scope,
    p_version,
    p_metadata,
    p_ip_address,
    p_user_agent
  )
  ON CONFLICT (user_id, scope, version) 
  DO UPDATE SET 
    accepted_at = now(),
    metadata = EXCLUDED.metadata,
    ip_address = EXCLUDED.ip_address,
    user_agent = EXCLUDED.user_agent
  RETURNING id INTO consent_id;
  
  RETURN consent_id;
END;
$$;

-- Create function to check if user has given consent
CREATE OR REPLACE FUNCTION public.consent_check(
  p_scope TEXT,
  p_version TEXT DEFAULT 'v1'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  has_consent BOOLEAN := FALSE;
BEGIN
  -- Check if user has given consent for the specified scope and version
  SELECT EXISTS(
    SELECT 1 FROM public.consent_records 
    WHERE user_id = auth.uid() 
    AND scope = p_scope 
    AND version = p_version
  ) INTO has_consent;
  
  RETURN has_consent;
END;
$$;