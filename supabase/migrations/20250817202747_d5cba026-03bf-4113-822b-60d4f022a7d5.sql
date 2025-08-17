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

-- Create policy with proper syntax
create policy if not exists self_rw on public.nil_training_status for all
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

-- Create policies with proper syntax
create policy if not exists disclosures_self_ins on public.nil_disclosures for insert
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());

create policy if not exists disclosures_self_sel on public.nil_disclosures for select
using (athlete_user_id = auth.uid() or public.is_admin_jwt());

create policy if not exists disclosures_self_upd on public.nil_disclosures for update
using (athlete_user_id = auth.uid() or public.is_admin_jwt())
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());

-- ====== NIL Sessions (1:1 or group) ======
create table if not exists public.meet_offerings (
  id uuid primary key default gen_random_uuid(),
  athlete_user_id uuid not null,
  slug text not null,
  title text not null,
  description text,
  duration_min int not null default 30,
  price_cents int not null default 0,
  currency text not null default 'USD',
  capacity int not null default 1, -- 1:1 or group
  visibility text not null default 'public', -- public|unlisted|private
  published boolean default false,
  media jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (athlete_user_id, slug)
);
alter table public.meet_offerings enable row level security;

create table if not exists public.meet_windows (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.meet_offerings(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at   timestamptz not null,
  seats_total int not null default 1
);
alter table public.meet_windows enable row level security;

create table if not exists public.meet_bookings (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid not null references public.meet_offerings(id) on delete cascade,
  window_id   uuid not null references public.meet_windows(id) on delete cascade,
  buyer_user_id uuid not null,
  status text not null default 'pending',        -- pending|reserved|confirmed|cancelled|completed|noshow
  payment_status text not null default 'unpaid', -- unpaid|reserved|paid|refunded
  contact jsonb default '{}'::jsonb,             -- {name,email}
  join_url text,
  ics text,
  created_by uuid,
  created_at timestamptz default now()
);
alter table public.meet_bookings enable row level security;

-- Create policies for meet tables
create policy if not exists offerings_public_read on public.meet_offerings for select
using (published = true and visibility in ('public','unlisted'));

create policy if not exists offerings_owner_rw on public.meet_offerings for all
using (athlete_user_id = auth.uid() or public.is_admin_jwt())
with check (athlete_user_id = auth.uid() or public.is_admin_jwt());

create policy if not exists windows_public_read on public.meet_windows for select
using (exists (
  select 1 from public.meet_offerings o
  where o.id = meet_windows.offering_id and o.published = true and o.visibility in ('public','unlisted')
) and starts_at > now());

create policy if not exists windows_owner_rw on public.meet_windows for all
using (exists (
  select 1 from public.meet_offerings o
  where o.id = meet_windows.offering_id and o.athlete_user_id = auth.uid()
) or public.is_admin_jwt())
with check (exists (
  select 1 from public.meet_offerings o
  where o.id = meet_windows.offering_id and o.athlete_user_id = auth.uid()
) or public.is_admin_jwt());

create policy if not exists bookings_insert on public.meet_bookings for insert
with check (auth.uid() is not null and buyer_user_id = auth.uid());

create policy if not exists bookings_select on public.meet_bookings for select
using (
  buyer_user_id = auth.uid()
  or exists (select 1 from public.meet_offerings o where o.id = meet_bookings.offering_id and o.athlete_user_id = auth.uid())
  or public.is_admin_jwt()
);

create policy if not exists bookings_update_owner on public.meet_bookings for update
using (
  buyer_user_id = auth.uid()
  or exists (select 1 from public.meet_offerings o where o.id = meet_bookings.offering_id and o.athlete_user_id = auth.uid())
  or public.is_admin_jwt()
)
with check (true);

-- Prevent overbooking
create or replace function public.fn_meet_capacity_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare taken int; cap int;
begin
  select count(*) into taken
  from public.meet_bookings
  where window_id = new.window_id and status in ('pending','reserved','confirmed');
  select seats_total into cap from public.meet_windows where id = new.window_id;
  if taken >= cap then raise exception 'No seats left for this time slot'; end if;
  return new;
end $$;

drop trigger if exists trg_meet_capacity_guard on public.meet_bookings;
create trigger trg_meet_capacity_guard before insert on public.meet_bookings
for each row execute function public.fn_meet_capacity_guard();