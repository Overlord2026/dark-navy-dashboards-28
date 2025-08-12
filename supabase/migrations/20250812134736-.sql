-- Create PMQI tables and RLS using tenant function
create extension if not exists pgcrypto;

create table if not exists fund_navs (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  nav_date date not null,
  nav numeric(18,8) not null,
  contribution numeric(18,8) default 0,
  distribution numeric(18,8) default 0,
  source text default 'admin_feed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (fund_id, nav_date)
);

create table if not exists fund_returns_raw (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  period_date date not null,
  return_raw numeric(12,8) not null,
  inputs_hash text,
  source text default 'derived_nav',
  created_at timestamptz not null default now(),
  unique (fund_id, period_date)
);

create table if not exists fund_returns_unsmoothed (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  period_date date not null,
  return_unsmoothed numeric(12,8) not null,
  method text not null default 'AR1',
  params jsonb default '{}'::jsonb,
  model_hash text,
  created_at timestamptz not null default now(),
  unique (fund_id, period_date, method)
);

create table if not exists proxy_baskets (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  exposures jsonb not null,
  fit_method text not null default 'constrained_ols',
  alpha numeric(12,8),
  beta numeric(12,8),
  r2 numeric(6,5),
  policy_hash text,
  fitted_at timestamptz not null default now()
);

create table if not exists risk_metrics (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  window_start date not null,
  window_end date not null,
  mdd numeric(12,8),
  time_under_water_days integer,
  ulcer_index numeric(12,8),
  sortino numeric(12,8),
  cvar_5 numeric(12,8),
  vol_annualized numeric(12,8),
  nav_lag_days integer,
  created_at timestamptz not null default now(),
  unique (fund_id, window_start, window_end)
);

create table if not exists rdi_scores (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  window_start date not null,
  window_end date not null,
  drawdown_fund numeric(12,8),
  drawdown_proxy numeric(12,8),
  lag_applied_days integer,
  rdi numeric(6,2),
  reason_codes jsonb default '[]'::jsonb,
  receipt_sha256 text,
  created_at timestamptz not null default now(),
  unique (fund_id, window_start, window_end)
);

create table if not exists rac_scores (
  id bigserial primary key,
  tenant_id uuid not null,
  fund_id uuid not null,
  window_start date not null,
  window_end date not null,
  rac numeric(6,2),
  weights jsonb not null,
  submetrics jsonb not null,
  reason_codes jsonb default '[]'::jsonb,
  breach_flags jsonb default '[]'::jsonb,
  receipt_sha256 text,
  created_at timestamptz not null default now(),
  unique (fund_id, window_start, window_end)
);

create table if not exists pmqi_receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  fund_id uuid,
  kind text not null,
  payload jsonb not null,
  inputs_hash text,
  model_hash text,
  policy_hash text,
  sha256 text generated always as (encode(digest(coalesce(payload::text,''), 'sha256'),'hex')) stored,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_navs_fund_date on fund_navs (fund_id, nav_date);
create index if not exists idx_raw_returns_fund_date on fund_returns_raw (fund_id, period_date);
create index if not exists idx_unsmoothed_fund_date on fund_returns_unsmoothed (fund_id, period_date);
create index if not exists idx_proxy_baskets_fund on proxy_baskets (fund_id);
create index if not exists idx_risk_metrics_fund on risk_metrics (fund_id, window_end);
create index if not exists idx_rdi_fund on rdi_scores (fund_id, window_end);
create index if not exists idx_rac_fund on rac_scores (fund_id, window_end);
create index if not exists idx_receipts_fund on pmqi_receipts (fund_id, created_at);

-- Updated-at trigger for fund_navs
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_navs_updated on fund_navs;
create trigger trg_navs_updated before update on fund_navs
for each row execute function set_updated_at();

-- Enable RLS
alter table fund_navs enable row level security;
alter table fund_returns_raw enable row level security;
alter table fund_returns_unsmoothed enable row level security;
alter table proxy_baskets enable row level security;
alter table risk_metrics enable row level security;
alter table rdi_scores enable row level security;
alter table rac_scores enable row level security;
alter table pmqi_receipts enable row level security;

-- Policies using get_current_user_tenant_id()
-- fund_navs
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'fund_navs' and polname = 'tenant_select_fund_navs') then
    create policy tenant_select_fund_navs on fund_navs for select using (tenant_id = get_current_user_tenant_id());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'fund_navs' and polname = 'tenant_insert_fund_navs') then
    create policy tenant_insert_fund_navs on fund_navs for insert with check (tenant_id = get_current_user_tenant_id());
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'fund_navs' and polname = 'tenant_update_fund_navs') then
    create policy tenant_update_fund_navs on fund_navs for update using (tenant_id = get_current_user_tenant_id());
  end if;
end $$;

-- Apply same pattern to other tables
do $$ declare tbl text; begin
  for tbl in select unnest(array[
    'fund_returns_raw','fund_returns_unsmoothed','proxy_baskets','risk_metrics','rdi_scores','rac_scores','pmqi_receipts'
  ])
  loop
    execute format('do $$ begin if not exists (select 1 from pg_policies where schemaname = ''public'' and tablename = ''%1$s'' and polname = ''tenant_select_%1$s'') then create policy tenant_select_%1$s on %1$s for select using (tenant_id = get_current_user_tenant_id()); end if; end $$;', tbl);
    execute format('do $$ begin if not exists (select 1 from pg_policies where schemaname = ''public'' and tablename = ''%1$s'' and polname = ''tenant_insert_%1$s'') then create policy tenant_insert_%1$s on %1$s for insert with check (tenant_id = get_current_user_tenant_id()); end if; end $$;', tbl);
    execute format('do $$ begin if not exists (select 1 from pg_policies where schemaname = ''public'' and tablename = ''%1$s'' and polname = ''tenant_update_%1$s'') then create policy tenant_update_%1$s on %1$s for update using (tenant_id = get_current_user_tenant_id()); end if; end $$;', tbl);
  end loop;
end $$;