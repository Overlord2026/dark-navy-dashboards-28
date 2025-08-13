-- =========================
-- Accounting OS v0 (Core Schema)
-- =========================

-- ---------- Utilities ----------
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- Reference Data ----------
create table if not exists ref_currencies(
  code char(3) primary key, -- 'USD'
  name text not null
);

insert into ref_currencies(code,name) values
  ('USD','US Dollar')
on conflict do nothing;

-- ---------- Chart of Accounts ----------
create table if not exists coa_accounts(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  code text not null,                -- 1000, 1100-01, etc.
  name text not null,
  type text not null check (type in ('asset','liability','equity','income','expense')),
  subtype text,
  normal_balance text not null check (normal_balance in ('debit','credit')),
  parent_id uuid references coa_accounts(id) on delete set null,
  is_active boolean not null default true,
  currency char(3) not null default 'USD' references ref_currencies(code),
  created_at timestamptz not null default now(),
  unique (org_id, code)
);

-- ---------- Journals (header) ----------
create table if not exists journals(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  txn_date date not null,
  reference text,                -- external ref / memo
  source text,                   -- 'ap','ar','bank','manual'
  status text not null default 'draft' check (status in ('draft','posted','void')),
  created_by uuid,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

-- ---------- Ledger Entries (lines) ----------
create table if not exists ledger_entries(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  journal_id uuid not null references journals(id) on delete cascade,
  account_id uuid not null references coa_accounts(id),
  description text,
  debit numeric(18,2) not null default 0,
  credit numeric(18,2) not null default 0,
  currency char(3) not null default 'USD' references ref_currencies(code),
  created_at timestamptz not null default now(),
  check (debit >= 0 and credit >= 0),
  check (not (debit = 0 and credit = 0))
);

create index if not exists idx_ledger_entries_org_journal on ledger_entries(org_id, journal_id);
create index if not exists idx_ledger_entries_org_account on ledger_entries(org_id, account_id);

-- ---------- AP/AR Primitives ----------
create table if not exists partners (          -- vendors/customers unified
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  kind text not null check (kind in ('customer','vendor','both')),
  name text not null,
  email text,
  phone text,
  tax_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_partners_org_kind on partners(org_id, kind);

-- AR: invoices
create table if not exists ar_invoices(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  partner_id uuid not null references partners(id),
  invoice_no text not null,
  invoice_date date not null,
  due_date date,
  currency char(3) not null default 'USD' references ref_currencies(code),
  subtotal numeric(18,2) not null default 0,
  tax_total numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  status text not null default 'open' check (status in ('open','paid','void')),
  journal_id uuid references journals(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(org_id, invoice_no)
);

create table if not exists ar_invoice_lines(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  invoice_id uuid not null references ar_invoices(id) on delete cascade,
  line_no int not null,
  description text,
  quantity numeric(18,4) not null default 1,
  unit_price numeric(18,4) not null default 0,
  amount numeric(18,2) not null default 0,
  revenue_account uuid references coa_accounts(id),
  tax_rate numeric(9,4) default 0
);
create index if not exists idx_ar_lines_invoice on ar_invoice_lines(invoice_id);

-- AP: bills
create table if not exists ap_bills(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  partner_id uuid not null references partners(id),
  bill_no text not null,
  bill_date date not null,
  due_date date,
  currency char(3) not null default 'USD' references ref_currencies(code),
  subtotal numeric(18,2) not null default 0,
  tax_total numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  status text not null default 'open' check (status in ('open','paid','void')),
  journal_id uuid references journals(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(org_id, bill_no)
);

create table if not exists ap_bill_lines(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  bill_id uuid not null references ap_bills(id) on delete cascade,
  line_no int not null,
  description text,
  quantity numeric(18,4) not null default 1,
  unit_price numeric(18,4) not null default 0,
  amount numeric(18,2) not null default 0,
  expense_account uuid references coa_accounts(id),
  tax_rate numeric(9,4) default 0
);

-- Payments (cash receipts / disbursements)
create table if not exists payments(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  kind text not null check (kind in ('ar_receipt','ap_disbursement')),
  partner_id uuid references partners(id),
  payment_date date not null,
  amount numeric(18,2) not null,
  currency char(3) not null default 'USD' references ref_currencies(code),
  method text, -- ach, wire, check
  memo text,
  journal_id uuid references journals(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Payment applications (link payment to AR/AP docs)
create table if not exists payment_applications(
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  payment_id uuid not null references payments(id) on delete cascade,
  target_kind text not null check (target_kind in ('invoice','bill')),
  target_id uuid not null, -- ar_invoices.id or ap_bills.id
  amount numeric(18,2) not null check (amount >= 0)
);

-- ---------- Posting Guard (double-entry) ----------
create or replace function validate_double_entry(p_journal uuid)
returns boolean language plpgsql as $$
declare v_debits numeric(18,2); v_credits numeric(18,2);
begin
  select coalesce(sum(debit),0), coalesce(sum(credit),0)
  into v_debits, v_credits
  from ledger_entries le
  join journals j on j.id = le.journal_id
  where le.journal_id = p_journal;

  if v_debits <> v_credits then
    raise exception 'Journal % is unbalanced: debits % != credits %', p_journal, v_debits, v_credits;
  end if;
  return true;
end $$;

create or replace function post_journal(p_journal uuid)
returns void language plpgsql as $$
declare v_org uuid;
begin
  perform validate_double_entry(p_journal);
  select org_id into v_org from journals where id = p_journal for update;
  update journals set status='posted', posted_at=now() where id=p_journal;
end $$;

-- ---------- Views: Trial Balance / BS / IS ----------
create or replace view vw_trial_balance as
select
  le.org_id,
  a.id as account_id,
  a.code,
  a.name,
  a.type,
  sum(le.debit) as debits,
  sum(le.credit) as credits,
  sum(le.debit - le.credit) as balance
from ledger_entries le
join coa_accounts a on a.id = le.account_id
join journals j on j.id = le.journal_id and j.status = 'posted'
group by le.org_id, a.id, a.code, a.name, a.type;

create or replace view vw_balance_sheet as
select * from vw_trial_balance where type in ('asset','liability','equity');

create or replace view vw_income_statement as
select * from vw_trial_balance where type in ('income','expense');

-- ---------- RLS Policies ----------
alter table coa_accounts enable row level security;
alter table journals enable row level security;
alter table ledger_entries enable row level security;
alter table partners enable row level security;
alter table ar_invoices enable row level security;
alter table ar_invoice_lines enable row level security;
alter table ap_bills enable row level security;
alter table ap_bill_lines enable row level security;
alter table payments enable row level security;
alter table payment_applications enable row level security;

-- Basic RLS policies - users can access their organization's data
create policy "Users can access their org's COA" on coa_accounts
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's journals" on journals
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's ledger entries" on ledger_entries
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's partners" on partners
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's AR invoices" on ar_invoices
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's AR invoice lines" on ar_invoice_lines
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's AP bills" on ap_bills
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's AP bill lines" on ap_bill_lines
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's payments" on payments
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

create policy "Users can access their org's payment applications" on payment_applications
  for all using (org_id in (
    select distinct tenant_id from profiles where id = auth.uid()
  ));

-- ---------- Sample Seed Data ----------
-- Create a default organization for testing
insert into profiles (id, name, email, tenant_id, role) 
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Accountant',
  'demo@accounting.test',
  '11111111-1111-1111-1111-111111111111'::uuid,
  'accountant'
) on conflict (id) do update set
  tenant_id = excluded.tenant_id,
  role = excluded.role;

-- Seed COA for demo tenant
insert into coa_accounts(org_id, code, name, type, normal_balance)
values
  ('11111111-1111-1111-1111-111111111111', '1000','Cash','asset','debit'),
  ('11111111-1111-1111-1111-111111111111', '2000','Accounts Payable','liability','credit'),
  ('11111111-1111-1111-1111-111111111111', '1200','Accounts Receivable','asset','debit'),
  ('11111111-1111-1111-1111-111111111111', '4000','Revenue','income','credit'),
  ('11111111-1111-1111-1111-111111111111', '5000','Expense','expense','debit')
on conflict (org_id, code) do nothing;

-- Sample partner
insert into partners(org_id,kind,name,email)
values ('11111111-1111-1111-1111-111111111111','customer','Acme Corp','billing@acme.com')
on conflict do nothing;

-- Sample balanced journal (Cash receipt)
do $$
declare 
  j uuid; 
  v_org uuid := '11111111-1111-1111-1111-111111111111';
  cash_account uuid;
  revenue_account uuid;
begin
  -- Get account IDs
  select id into cash_account from coa_accounts where org_id = v_org and code = '1000';
  select id into revenue_account from coa_accounts where org_id = v_org and code = '4000';
  
  if cash_account is not null and revenue_account is not null then
    insert into journals(org_id, txn_date, reference, source) 
    values (v_org, current_date, 'Seed Receipt','manual') 
    returning id into j;
    
    insert into ledger_entries(org_id,journal_id,account_id,debit,credit)
    values (v_org, j, cash_account, 1000, 0);
    
    insert into ledger_entries(org_id,journal_id,account_id,debit,credit)
    values (v_org, j, revenue_account, 0, 1000);
    
    perform post_journal(j);
  end if;
end $$;