-- Create credentials table for storing secure tokens
CREATE TABLE IF NOT EXISTS public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  credential_type text not null,
  credential_name text,
  encrypted_token text not null,
  metadata jsonb default '{}',
  expires_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only access their own credentials
CREATE POLICY "Users can manage their credentials" ON public.credentials
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index for efficient queries
CREATE INDEX idx_credentials_user_type ON public.credentials(user_id, credential_type);

-- Add trigger for updated_at
CREATE TRIGGER update_credentials_updated_at
  BEFORE UPDATE ON public.credentials
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();