-- Fix constraint syntax and apply schema safely
alter table public.portfolio_targets
  drop constraint if exists uq_targets_user_phase_asset_model;
alter table public.portfolio_targets
  add constraint uq_targets_user_phase_asset_model
  unique (user_id, phase, asset_class, model_version);

-- Private Market Alpha Schema
-- fund holdings detail (lookup of positions per private fund)
create table if not exists public.fund_holdings_lookup (
  id uuid primary key default gen_random_uuid(),
  fund_id text not null,
  holding_id text not null,
  holding_name text not null,
  holding_type text,            -- company/security/sector
  sector text,
  country text,
  weight_pct numeric,           -- fund-reported weight
  as_of_date date not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_fhl_fund_asof on public.fund_holdings_lookup(fund_id, as_of_date desc);

-- computed overlaps per user/fund set (materialized results)
create table if not exists public.fund_holdings_overlap (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  portfolio_id uuid,
  scope jsonb not null,         -- list of fund_ids and date range
  overlap_metrics jsonb not null, -- { pairwise:{[fundId_fundId]: pct}, top_contributors:[], sector_heatmap:{} }
  created_at timestamptz default now()
);
create index if not exists idx_fho_user_created on public.fund_holdings_overlap(user_id, created_at desc);

-- liquidity events and service levels
create table if not exists public.liquidity_events (
  id uuid primary key default gen_random_uuid(),
  fund_id text not null,
  event_date date not null,
  event_type text not null,     -- gate/partial-fill/queue/pause/resume
  details jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_liq_events_fund_date on public.liquidity_events(fund_id, event_date desc);

-- computed Liquidity IQ scores per user/fund
create table if not exists public.liquidity_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  fund_id text not null,
  as_of_date date not null default now(),
  inputs jsonb not null,        -- {gate_prob, nav_to_cash_days, fulfillment_rate, penalties, vintage, aum_trend, ...}
  score numeric not null,       -- 0-100
  breakdown jsonb not null,     -- weights and component scores
  created_at timestamptz default now()
);
create unique index if not exists uq_liq_score_user_fund_asof on public.liquidity_scores(user_id, fund_id, as_of_date);

-- automated DD packages
create table if not exists public.dd_packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  fund_id text not null,
  snapshot jsonb not null,      -- compiled facts: perf, fees, docs list, PM3, liquidity, compliance checks
  artifact_urls jsonb,          -- {pdf:"...", zip:"..."}
  created_at timestamptz default now()
);
create index if not exists idx_ddpkg_user_fund on public.dd_packages(user_id, fund_id, created_at desc);

-- RLS
alter table public.fund_holdings_overlap enable row level security;
alter table public.liquidity_scores enable row level security;
alter table public.dd_packages enable row level security;

-- Create policies safely
drop policy if exists "own_overlap_read" on public.fund_holdings_overlap;
create policy "own_overlap_read" on public.fund_holdings_overlap for select using (auth.uid()=user_id);
drop policy if exists "own_overlap_write" on public.fund_holdings_overlap;
create policy "own_overlap_write" on public.fund_holdings_overlap for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

drop policy if exists "own_liq_read" on public.liquidity_scores;
create policy "own_liq_read" on public.liquidity_scores for select using (auth.uid()=user_id);
drop policy if exists "own_liq_write" on public.liquidity_scores;
create policy "own_liq_write" on public.liquidity_scores for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

drop policy if exists "own_dd_read" on public.dd_packages;
create policy "own_dd_read" on public.dd_packages for select using (auth.uid()=user_id);
drop policy if exists "own_dd_write" on public.dd_packages;
create policy "own_dd_write" on public.dd_packages for all using (auth.uid()=user_id) with check (auth.uid()=user_id);

-- touch trigger
drop trigger if exists trg_touch_fhl on public.fund_holdings_lookup;
create trigger trg_touch_fhl before update on public.fund_holdings_lookup
for each row execute function public.fn_touch_updated_at();