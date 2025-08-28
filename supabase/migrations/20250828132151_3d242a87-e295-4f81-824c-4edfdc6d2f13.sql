-- MICRO_SEC_5_RLS_OWNER_ADMIN Implementation

-- 1) Helper: admin checker
CREATE OR REPLACE FUNCTION public.is_admin_jwt() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_admin_jwt() TO authenticated, anon;

-- 2) Enable RLS
ALTER TABLE public.aies_consent_grants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_policies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aies_connector_health ENABLE ROW LEVEL SECURITY;

-- 3A) aies_consent_grants: owner read/write (subject_user_id = auth.uid())
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname='public' AND tablename='aies_consent_grants' AND policyname='consent_owner_all'
  ) THEN
    EXECUTE $SQL$
      CREATE POLICY consent_owner_all
      ON public.aies_consent_grants
      FOR ALL
      USING  (subject_user_id = auth.uid())
      WITH CHECK (subject_user_id = auth.uid());
    $SQL$;
  END IF;
END
$$ LANGUAGE plpgsql;

-- 3B) aies_policies: SELECT for authenticated; write only by admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname='public' AND tablename='aies_policies' AND policyname='policies_ro_auth'
  ) THEN
    EXECUTE $SQL$
      CREATE POLICY policies_ro_auth
      ON public.aies_policies
      FOR SELECT
      USING (auth.role() = 'authenticated');
    $SQL$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname='public' AND tablename='aies_policies' AND policyname='policies_admin_write'
  ) THEN
    EXECUTE $SQL$
      CREATE POLICY policies_admin_write
      ON public.aies_policies
      FOR ALL
      USING  (public.is_admin_jwt())
      WITH CHECK (public.is_admin_jwt());
    $SQL$;
  END IF;
END
$$ LANGUAGE plpgsql;

-- 3C) aies_connector_health: admin-only (SELECT + write)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
     WHERE schemaname='public' AND tablename='aies_connector_health' AND policyname='conn_health_admin_all'
  ) THEN
    EXECUTE $SQL$
      CREATE POLICY conn_health_admin_all
      ON public.aies_connector_health
      FOR ALL
      USING  (public.is_admin_jwt())
      WITH CHECK (public.is_admin_jwt());
    $SQL$;
  END IF;
END
$$ LANGUAGE plpgsql;

-- 4) Verification: list the policies we just ensured exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname='public'
  AND tablename IN ('aies_consent_grants','aies_policies','aies_connector_health')
ORDER BY tablename, policyname;