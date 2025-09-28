-- Simple app_events table creation
CREATE TABLE IF NOT EXISTS public.app_events (
  id bigserial PRIMARY KEY,
  event text NOT NULL,
  user_id uuid,
  household_id uuid,
  advisor_firm_id uuid,
  plan_key text,
  export_hash text,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);