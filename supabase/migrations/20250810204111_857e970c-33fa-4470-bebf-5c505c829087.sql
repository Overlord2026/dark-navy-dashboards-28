-- RLS WITH CHECK + integrity constraints + indexes + touch triggers
drop policy if exists "Users can manage their own portfolio positions" on public.portfolio_positions;
create policy "Users can manage their own portfolio positions" on public.portfolio_positions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own portfolio targets" on public.portfolio_targets;
create policy "Users can manage their own portfolio targets" on public.portfolio_targets
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own rebalancing events" on public.rebalancing_events;
create policy "Users can manage their own rebalancing events" on public.rebalancing_events
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own recommendation audit" on public.recommendation_audit;
create policy "Users can manage their own recommendation audit" on public.recommendation_audit
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own private fund holdings" on public.private_fund_holdings;
create policy "Users can manage their own private fund holdings" on public.private_fund_holdings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "System can update manager signals" on public.manager_signals;
create policy "System can update manager signals" on public.manager_signals
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

alter table public.portfolio_targets
  add constraint if not exists uq_targets_user_phase_asset_model
  unique (user_id, phase, asset_class, model_version);

do $$ begin
  alter table public.portfolio_positions
    add constraint chk_quantity_nonneg check (quantity >= 0);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.portfolio_positions
    add constraint chk_market_value_nonneg check (market_value is null or market_value >= 0);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.portfolio_positions
    add constraint chk_cost_basis_nonneg check (cost_basis is null or cost_basis >= 0);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.private_fund_holdings
    add constraint chk_committed_capital_nonneg check (committed_capital >= 0);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.private_fund_holdings
    add constraint chk_called_capital_nonneg check (called_capital >= 0);
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.private_fund_holdings
    add constraint chk_market_value_nonneg2 check (market_value >= 0);
exception when duplicate_object then null; end $$;

create index if not exists idx_targets_user_phase_asset_model
  on public.portfolio_targets(user_id, phase, asset_class, model_version);
create index if not exists idx_rebalancing_events_user_created
  on public.rebalancing_events(user_id, created_at desc);

create or replace function public.fn_touch_updated_at()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    if exists (select 1 from information_schema.columns
               where table_schema = 'public'
                 and table_name = tg_table_name
                 and column_name = 'updated_at') then
      new.updated_at := now();
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_touch_positions on public.portfolio_positions;
create trigger trg_touch_positions before update on public.portfolio_positions
for each row execute function public.fn_touch_updated_at();

drop trigger if exists trg_touch_targets on public.portfolio_targets;
create trigger trg_touch_targets before update on public.portfolio_targets
for each row execute function public.fn_touch_updated_at();

drop trigger if exists trg_touch_pf on public.private_fund_holdings;
create trigger trg_touch_pf before update on public.private_fund_holdings
for each row execute function public.fn_touch_updated_at();

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

do $$ begin
  create policy "own_overlap_read" on public.fund_holdings_overlap for select using (auth.uid()=user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "own_overlap_write" on public.fund_holdings_overlap for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own_liq_read" on public.liquidity_scores for select using (auth.uid()=user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "own_liq_write" on public.liquidity_scores for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "own_dd_read" on public.dd_packages for select using (auth.uid()=user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "own_dd_write" on public.dd_packages for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
exception when duplicate_object then null; end $$;

-- touch trigger
drop trigger if exists trg_touch_fhl on public.fund_holdings_lookup;
create trigger trg_touch_fhl before update on public.fund_holdings_lookup
for each row execute function public.fn_touch_updated_at();