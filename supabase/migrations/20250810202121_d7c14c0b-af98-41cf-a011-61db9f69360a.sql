-- ========= RLS: add WITH CHECK on "manage" policies ==========================
drop policy if exists "Users can manage their own portfolio positions" on public.portfolio_positions;
create policy "Users can manage their own portfolio positions" on public.portfolio_positions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own portfolio targets" on public.portfolio_targets;
create policy "Users can manage their own portfolio targets" on public.portfolio_targets
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own rebalancing events" on public.rebalancing_events;
create policy "Users can manage their own rebalancing events" on public.rebalancing_events
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own recommendation audit" on public.recommendation_audit;
create policy "Users can manage their own recommendation audit" on public.recommendation_audit
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage their own private fund holdings" on public.private_fund_holdings;
create policy "Users can manage their own private fund holdings" on public.private_fund_holdings
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- manager_signals: ensure service role can also INSERT/UPDATE via WITH CHECK
drop policy if exists "System can update manager signals" on public.manager_signals;
create policy "System can update manager signals" on public.manager_signals
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- ========= Integrity constraints & helpful indexes ===========================
-- Prevent duplicate targets for same (user, phase, asset_class, model_version)
alter table public.portfolio_targets
  add constraint uq_targets_user_phase_asset_model
  unique (user_id, phase, asset_class, model_version);

-- Ensure non-negative numeric fields where appropriate
alter table public.portfolio_positions
  add constraint chk_quantity_nonneg check (quantity >= 0),
  add constraint chk_market_value_nonneg check (market_value is null or market_value >= 0),
  add constraint chk_cost_basis_nonneg check (cost_basis is null or cost_basis >= 0);

alter table public.private_fund_holdings
  add constraint chk_committed_capital_nonneg check (committed_capital >= 0),
  add constraint chk_called_capital_nonneg check (called_capital >= 0),
  add constraint chk_market_value_nonneg2 check (market_value >= 0);

-- Indexes that speed up the optimizer/drift checks
create index if not exists idx_targets_user_phase_asset_model
  on public.portfolio_targets(user_id, phase, asset_class, model_version);

create index if not exists idx_rebalancing_events_user_created
  on public.rebalancing_events(user_id, created_at desc);

-- ========= Updated_at trigger convenience (optional but nice) ===============
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