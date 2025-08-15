-- === Helper claims accessors (Supabase) ===
create schema if not exists app;

create or replace function app.jwt() returns jsonb
language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true),''),'{}')::jsonb
$$;

create or replace function app.current_user_id() returns uuid
language sql stable as $$
  select nullif(app.jwt()->>'sub','')::uuid
$$;

create or replace function app.current_entity_id() returns uuid
language sql stable as $$
  select nullif(app.jwt()->>'app_entity_id','')::uuid
$$;

create or replace function app.current_role() returns text
language sql stable as $$
  select coalesce(app.jwt()->>'app_role', app.jwt()->>'role')
$$;

-- === Timestamps ===
create or replace function app.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- === Canonical columns & constraints (idempotent) ===
-- Add entity_id + timestamps where missing
alter table if exists public.accounts           add column if not exists entity_id uuid;
alter table if exists public.accounts           add column if not exists created_at timestamptz default now();
alter table if exists public.accounts           add column if not exists updated_at timestamptz default now();

alter table if exists public.positions          add column if not exists entity_id uuid;
alter table if exists public.positions          add column if not exists created_at timestamptz default now();
alter table if exists public.positions          add column if not exists updated_at timestamptz default now();

alter table if exists public.transactions       add column if not exists entity_id uuid;
alter table if exists public.transactions       add column if not exists created_at timestamptz default now();
alter table if exists public.transactions       add column if not exists updated_at timestamptz default now();

alter table if exists public.reports            add column if not exists entity_id uuid;
alter table if exists public.reports            add column if not exists persona_scope text default 'all';
alter table if exists public.reports            add column if not exists created_at timestamptz default now();
alter table if exists public.reports            add column if not exists updated_at timestamptz default now();
alter table if exists public.reports            add constraint if not exists reports_scope_ck
  check (persona_scope in ('all','client','advisor','cpa','attorney','admin'));

alter table if exists public.exceptions         add column if not exists entity_id uuid;
alter table if exists public.exceptions         add column if not exists created_at timestamptz default now();
alter table if exists public.exceptions         add column if not exists updated_at timestamptz default now();

alter table if exists public.billing_daily      add column if not exists entity_id uuid;
alter table if exists public.billing_daily      add column if not exists created_at timestamptz default now();

-- Optional: connector metadata scoping
alter table if exists public.connectors         add column if not exists tenant_id uuid;

-- Idempotency & uniqueness (adjust column names if your schema differs)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'positions_unique_snapshot'
  ) then
    alter table public.positions
      add constraint positions_unique_snapshot
      unique (account_id, instrument_id, as_of);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'txns_idem_key'
  ) then
    alter table public.transactions
      add column if not exists idem_key text,
      add constraint txns_idem_key unique (account_id, trade_date, type, amount, coalesce(idem_key,''));
  end if;
end$$;

-- Indexes
create index if not exists idx_accounts_entity       on public.accounts(entity_id);
create index if not exists idx_positions_entity_date on public.positions(entity_id, as_of);
create index if not exists idx_txns_entity_date      on public.transactions(entity_id, trade_date);
create index if not exists idx_reports_entity        on public.reports(entity_id);
create index if not exists idx_exceptions_entity     on public.exceptions(entity_id);
create index if not exists idx_billing_entity_date   on public.billing_daily(entity_id, as_of);

-- === Updated_at triggers ===
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='trg_accounts_touch') then
    create trigger trg_accounts_touch before update on public.accounts
      for each row execute function app.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_positions_touch') then
    create trigger trg_positions_touch before update on public.positions
      for each row execute function app.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_transactions_touch') then
    create trigger trg_transactions_touch before update on public.transactions
      for each row execute function app.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_reports_touch') then
    create trigger trg_reports_touch before update on public.reports
      for each row execute function app.touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname='trg_exceptions_touch') then
    create trigger trg_exceptions_touch before update on public.exceptions
      for each row execute function app.touch_updated_at();
  end if;
end $$;

-- === RLS: default DENY, entity-scoped ===
alter table if exists public.accounts      enable row level security;
alter table if exists public.positions     enable row level security;
alter table if exists public.transactions  enable row level security;
alter table if exists public.reports       enable row level security;
alter table if exists public.exceptions    enable row level security;
alter table if exists public.billing_daily enable row level security;
alter table if exists public.connector_accounts enable row level security;
alter table if exists public.connectors    enable row level security;

-- Clean grants (service_role bypasses RLS; anon gets nothing)
revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;
grant select, insert, update, delete on public.accounts, public.positions, public.transactions,
     public.reports, public.exceptions, public.billing_daily, public.connector_accounts
     to authenticated;

-- Simple entity policy (reuse on multiple tables)
create or replace function app.is_same_entity(entity uuid)
returns boolean language sql stable as $$
  select entity is not distinct from app.current_entity_id()
$$;

-- Policies
do $$ begin
  -- ACCOUNTS
  if not exists (select 1 from pg_policies where polname='acc_sel') then
    create policy acc_sel on public.accounts for select using (app.is_same_entity(entity_id));
    create policy acc_ins on public.accounts for insert with check (app.is_same_entity(entity_id));
    create policy acc_upd on public.accounts for update using (app.is_same_entity(entity_id)) with check (app.is_same_entity(entity_id));
    create policy acc_del on public.accounts for delete using (app.is_same_entity(entity_id));
  end if;

  -- POSITIONS
  if not exists (select 1 from pg_policies where polname='pos_sel') then
    create policy pos_sel on public.positions for select using (app.is_same_entity(entity_id));
    create policy pos_ins on public.positions for insert with check (app.is_same_entity(entity_id));
    create policy pos_upd on public.positions for update using (app.is_same_entity(entity_id)) with check (app.is_same_entity(entity_id));
    create policy pos_del on public.positions for delete using (app.is_same_entity(entity_id));
  end if;

  -- TRANSACTIONS
  if not exists (select 1 from pg_policies where polname='txn_sel') then
    create policy txn_sel on public.transactions for select using (app.is_same_entity(entity_id));
    create policy txn_ins on public.transactions for insert with check (app.is_same_entity(entity_id));
    create policy txn_upd on public.transactions for update using (app.is_same_entity(entity_id)) with check (app.is_same_entity(entity_id));
    create policy txn_del on public.transactions for delete using (app.is_same_entity(entity_id));
  end if;

  -- REPORTS (add persona gating)
  if not exists (select 1 from pg_policies where polname='rep_sel') then
    create policy rep_sel on public.reports for select
      using (
        app.is_same_entity(entity_id)
        and (
          persona_scope = 'all'
          or persona_scope = coalesce(app.current_role(),'client')
          or app.current_role() = 'admin'
        )
      );
    create policy rep_ins on public.reports for insert with check (app.is_same_entity(entity_id));
    create policy rep_upd on public.reports for update using (app.is_same_entity(entity_id));
    create policy rep_del on public.reports for delete using (app.is_same_entity(entity_id));
  end if;

  -- EXCEPTIONS
  if not exists (select 1 from pg_policies where polname='ex_sel') then
    create policy ex_sel on public.exceptions for select using (app.is_same_entity(entity_id));
    create policy ex_ins on public.exceptions for insert with check (app.is_same_entity(entity_id));
    create policy ex_upd on public.exceptions for update using (app.is_same_entity(entity_id));
    create policy ex_del on public.exceptions for delete using (app.is_same_entity(entity_id));
  end if;

  -- BILLING
  if not exists (select 1 from pg_policies where polname='bill_sel') then
    create policy bill_sel on public.billing_daily for select using (app.is_same_entity(entity_id));
    create policy bill_ins on public.billing_daily for insert with check (app.is_same_entity(entity_id));
    create policy bill_upd on public.billing_daily for update using (app.is_same_entity(entity_id));
  end if;

  -- CONNECTOR_ACCOUNTS (entity owns their linkage)
  if not exists (select 1 from pg_policies where polname='cacc_sel') then
    create policy cacc_sel on public.connector_accounts for select using (app.is_same_entity(entity_id));
    create policy cacc_ins on public.connector_accounts for insert with check (app.is_same_entity(entity_id));
    create policy cacc_upd on public.connector_accounts for update using (app.is_same_entity(entity_id));
    create policy cacc_del on public.connector_accounts for delete using (app.is_same_entity(entity_id));
  end if;

  -- CONNECTORS (system-level; only admins see tenant-scoped or shared)
  if not exists (select 1 from pg_policies where polname='con_sel') then
    create policy con_sel on public.connectors for select
      using (
        tenant_id is null
        or app.current_role() = 'admin'
      );
  end if;
end $$;