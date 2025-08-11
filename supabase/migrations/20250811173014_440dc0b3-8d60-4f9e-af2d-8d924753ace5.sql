-- 0) Extensions (no-op if already installed)
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- 1) Helper: get tenant_id from JWT
create schema if not exists app;

create or replace function app.jwt_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id')::text, '')::uuid;
$$;

-- 2) Add tenant_id to all vetting tables (if missing)
alter table if exists public.vetting_requests      add column if not exists tenant_id uuid;
alter table if exists public.credential_sources    add column if not exists tenant_id uuid;
alter table if exists public.registry_records      add column if not exists tenant_id uuid;
alter table if exists public.sanction_hits         add column if not exists tenant_id uuid;
alter table if exists public.trust_scores          add column if not exists tenant_id uuid;
alter table if exists public.monitoring_jobs       add column if not exists tenant_id uuid;
alter table if exists public.reconciliation_logs   add column if not exists tenant_id uuid;
alter table if exists public.evidence_packages     add column if not exists tenant_id uuid;

-- 3) Index for tenant filters
create index if not exists vetting_requests_tenant_id_idx     on public.vetting_requests(tenant_id);
create index if not exists credential_sources_tenant_id_idx    on public.credential_sources(tenant_id);
create index if not exists registry_records_tenant_id_idx      on public.registry_records(tenant_id);
create index if not exists sanction_hits_tenant_id_idx         on public.sanction_hits(tenant_id);
create index if not exists trust_scores_tenant_id_idx          on public.trust_scores(tenant_id);
create index if not exists monitoring_jobs_tenant_id_idx       on public.monitoring_jobs(tenant_id);
create index if not exists reconciliation_logs_tenant_id_idx   on public.reconciliation_logs(tenant_id);
create index if not exists evidence_packages_tenant_id_idx     on public.evidence_packages(tenant_id);

-- 4) Trigger to auto-fill tenant_id from JWT on insert/update when null
create or replace function app.set_tenant_id()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.tenant_id is null then
    new.tenant_id := app.jwt_tenant_id();
  end if;
  return new;
end;
$$;

-- Attach trigger to each table
do $$
declare
  r record;
begin
  for r in
    select unnest(array[
      'vetting_requests',
      'credential_sources',
      'registry_records',
      'sanction_hits',
      'trust_scores',
      'monitoring_jobs',
      'reconciliation_logs',
      'evidence_packages'
    ]) as tbl
  loop
    execute format('
      drop trigger if exists set_tenant_id_%I on public.%I;
      create trigger set_tenant_id_%I
      before insert or update on public.%I
      for each row execute function app.set_tenant_id();
    ', r.tbl, r.tbl, r.tbl, r.tbl);
  end loop;
end$$;

-- 5) Enable RLS
alter table if exists public.vetting_requests      enable row level security;
alter table if exists public.credential_sources    enable row level security;
alter table if exists public.registry_records      enable row level security;
alter table if exists public.sanction_hits         enable row level security;
alter table if exists public.trust_scores          enable row level security;
alter table if exists public.monitoring_jobs       enable row level security;
alter table if exists public.reconciliation_logs   enable row level security;
alter table if exists public.evidence_packages     enable row level security;

-- 6) BOOTSTRAP RLS POLICIES (permissive while you backfill)
--    These allow rows with NULL tenant_id (legacy data) OR matching tenant_id.
--    After you backfill, swap to the hardened policies below.

-- Drop old policies if present, then create bootstrap policies
do $$
declare
  t text;
begin
  foreach t in array array[
    'vetting_requests',
    'credential_sources',
    'registry_records',
    'sanction_hits',
    'trust_scores',
    'monitoring_jobs',
    'reconciliation_logs',
    'evidence_packages'
  ]
  loop
    execute format('drop policy if exists p_%s_rw on public.%s;', t, t);
    execute format($pol$
      create policy p_%1$s_rw on public.%1$s
      using (tenant_id is null or tenant_id = app.jwt_tenant_id())
      with check (tenant_id is null or tenant_id = app.jwt_tenant_id());
    $pol$, t);
  end loop;
end$$;

-- 7) (Optional) Backfill tenant_id for legacy rows to your known tenant
-- update public.vetting_requests    set tenant_id = 'YOUR-TENANT-UUID' where tenant_id is null;
-- ...repeat for each table above...

-- 8) (Later) HARDENED POLICIES (run AFTER backfill completes)
-- do $$
-- declare t text;
-- begin
--   foreach t in array array[
--     'vetting_requests',
--     'credential_sources',
--     'registry_records',
--     'sanction_hits',
--     'trust_scores',
--     'monitoring_jobs',
--     'reconciliation_logs',
--     'evidence_packages'
--   ]
--   loop
--     execute format('drop policy if exists p_%s_rw on public.%s;', t, t);
--     execute format($pol$
--       create policy p_%1$s_rw on public.%1$s
--       using (tenant_id = app.jwt_tenant_id())
--       with check (tenant_id = app.jwt_tenant_id());
--     $pol$, t);
--   end loop;
-- end$$;