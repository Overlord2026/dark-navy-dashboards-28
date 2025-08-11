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

-- 2) Add tenant_id to existing vetting tables only
alter table public.vetting_requests      add column if not exists tenant_id uuid;
alter table public.credential_sources    add column if not exists tenant_id uuid;
alter table public.registry_records      add column if not exists tenant_id uuid;
alter table public.trust_scores          add column if not exists tenant_id uuid;

-- 3) Index for tenant filters (existing tables only)
create index if not exists vetting_requests_tenant_id_idx     on public.vetting_requests(tenant_id);
create index if not exists credential_sources_tenant_id_idx    on public.credential_sources(tenant_id);
create index if not exists registry_records_tenant_id_idx      on public.registry_records(tenant_id);
create index if not exists trust_scores_tenant_id_idx          on public.trust_scores(tenant_id);

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

-- Attach trigger to existing tables only
do $$
declare
  r record;
begin
  for r in
    select unnest(array[
      'vetting_requests',
      'credential_sources',
      'registry_records',
      'trust_scores'
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

-- 5) Enable RLS on existing tables
alter table public.vetting_requests      enable row level security;
alter table public.credential_sources    enable row level security;
alter table public.registry_records      enable row level security;
alter table public.trust_scores          enable row level security;

-- 6) BOOTSTRAP RLS POLICIES (permissive while you backfill)
--    These allow rows with NULL tenant_id (legacy data) OR matching tenant_id.

-- Drop old policies if present, then create bootstrap policies for existing tables
do $$
declare
  t text;
begin
  foreach t in array array[
    'vetting_requests',
    'credential_sources',
    'registry_records',
    'trust_scores'
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

-- Note: Missing tables (sanction_hits, monitoring_jobs, reconciliation_logs, evidence_packages)
-- will need tenant_id added when they are created in future migrations