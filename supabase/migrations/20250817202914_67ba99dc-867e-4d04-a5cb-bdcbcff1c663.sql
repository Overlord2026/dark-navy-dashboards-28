-- ====== Helpers & Admin Detection ======
create extension if not exists pgcrypto;

-- Keep this if your project doesn't already have it:
create or replace function public.is_admin_jwt() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role')='admin', false)
$$;
grant execute on function public.is_admin_jwt() to authenticated, anon;

-- ====== NIL Compliance: training + disclosures ======
create table if not exists public.nil_training_status (
  athlete_user_id uuid not null,
  module text not null,
  completed_at timestamptz default now(),
  primary key (athlete_user_id, module)
);
alter table public.nil_training_status enable row level security;

-- Drop existing policy if it exists and create new one
drop policy if exists self_rw on public.nil_training_status;
create policy self_rw on public.nil_training_status for all
using (athlete_user_id = auth.uid() or public.is_admin_jwt())
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());

-- If not already created earlier:
create table if not exists public.nil_disclosures (
  id uuid primary key default gen_random_uuid(),
  athlete_user_id uuid not null,
  university text,
  brand text,
  description text,
  filed_at timestamptz default now()
);
alter table public.nil_disclosures enable row level security;

-- Drop and create policies
drop policy if exists disclosures_self_ins on public.nil_disclosures;
create policy disclosures_self_ins on public.nil_disclosures for insert
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());

drop policy if exists disclosures_self_sel on public.nil_disclosures;
create policy disclosures_self_sel on public.nil_disclosures for select
using (athlete_user_id = auth.uid() or public.is_admin_jwt());

drop policy if exists disclosures_self_upd on public.nil_disclosures;
create policy disclosures_self_upd on public.nil_disclosures for update
using (athlete_user_id = auth.uid() or public.is_admin_jwt())
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());