-- Onboarding steps table (if missing)
create table if not exists public.onboarding_steps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  step text not null,
  status text not null check (status in ('pending','in_progress','done')),
  created_at timestamptz not null default now()
);

-- Vault activity log table (if missing)
create table if not exists public.vault_activity_log (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null,
  user_id uuid not null,
  action_type text not null,
  resource_type text not null,
  resource_id uuid,
  details jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- Enable RLS on both tables
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding_steps
CREATE POLICY "Users can manage their own onboarding steps" 
ON public.onboarding_steps 
FOR ALL 
USING (user_id = auth.uid());

-- RLS policies for vault_activity_log
CREATE POLICY "Users can view their own vault activity" 
ON public.vault_activity_log 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can log vault activity" 
ON public.vault_activity_log 
FOR INSERT 
WITH CHECK (true);