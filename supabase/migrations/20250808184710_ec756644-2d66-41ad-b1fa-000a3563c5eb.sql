-- Safe SQL Migration: App Events Table and RLS (Idempotent)

-- Create app_events table if not exists
CREATE TABLE IF NOT EXISTS public.app_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NULL,
  session_id text NULL,
  event_type text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  referrer text NULL,
  utm jsonb NULL,
  page text NULL
);

-- Enable RLS safely
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname='public' AND tablename='app_events'
  ) THEN
    -- Enable RLS
    ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;
    
    -- Insert policy: allow authenticated users to insert their own events or anonymous
    DROP POLICY IF EXISTS app_events_insert_authenticated ON public.app_events;
    CREATE POLICY app_events_insert_authenticated
    ON public.app_events
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
    
    -- Select policy: admins can see all, users can see their own
    DROP POLICY IF EXISTS app_events_select_own ON public.app_events;
    CREATE POLICY app_events_select_own
    ON public.app_events
    FOR SELECT
    TO authenticated
    USING (
      user_id = auth.uid() OR 
      has_any_role(ARRAY['admin', 'cfo', 'marketing', 'compliance'])
    );
    
    -- Allow anonymous insert for non-authenticated users
    DROP POLICY IF EXISTS app_events_insert_anonymous ON public.app_events;
    CREATE POLICY app_events_insert_anonymous
    ON public.app_events
    FOR INSERT
    TO anon
    WITH CHECK (user_id IS NULL);
    
  ELSE
    RAISE NOTICE 'app_events table missing—skipping RLS setup';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RLS setup failed: %', SQLERRM;
END$$;