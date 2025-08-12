-- Enable pgcrypto for digest (sha256)
create extension if not exists pgcrypto;

-- Tables
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
  exposures jsonb not null,    -- [{symbol, weight}] or factor map
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
  weights jsonb not null,       -- {mdd:0.25, tuw:0.20, ...}
  submetrics jsonb not null,    -- measured values for transparency
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
  kind text not null,                   -- 'RDI' | 'RAC' | 'UNSMOOTH' | etc.
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

-- RLS (assumes profiles(id uuid, org_id uuid))
alter table fund_navs enable row level security;
alter table fund_returns_raw enable row level security;
alter table fund_returns_unsmoothed enable row level security;
alter table proxy_baskets enable row level security;
alter table risk_metrics enable row level security;
alter table rdi_scores enable row level security;
alter table rac_scores enable row level security;
alter table pmqi_receipts enable row level security;

-- Helper: resolve caller's org_id
create or replace view v_current_org as
select p.org_id
from profiles p
where p.id = auth.uid();

-- Policies (read/write within tenant/org)
do $$ begin
  perform 1 from pg_policies where polname='org_select_fund_navs';
  if not found then
    create policy org_select_fund_navs on fund_navs
      for select using (tenant_id = (select org_id from v_current_org));
    create policy org_modify_fund_navs on fund_navs
      for insert with check (tenant_id = (select org_id from v_current_org));
    create policy org_update_fund_navs on fund_navs
      for update using (tenant_id = (select org_id from v_current_org));
  end if;
end $$;

-- Duplicate same pattern for the other tables:
do $$ declare tbl text; begin
  for tbl in select unnest(array[
    'fund_returns_raw','fund_returns_unsmoothed','proxy_baskets','risk_metrics','rdi_scores','rac_scores','pmqi_receipts'
  ])
  loop
    execute format('create policy org_select_%I on %I for select using (tenant_id = (select org_id from v_current_org));', tbl, tbl);
    execute format('create policy org_insert_%I on %I for insert with check (tenant_id = (select org_id from v_current_org));', tbl, tbl);
    execute format('create policy org_update_%I on %I for update using (tenant_id = (select org_id from v_current_org));', tbl, tbl);
  end loop;
end $$;