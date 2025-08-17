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
do $$ begin
  if not exists (select 1 from pg_policies where tablename='nil_training_status' and policyname='self_rw') then
    execute $$ create policy self_rw on public.nil_training_status for all
      using (athlete_user_id = auth.uid() or public.is_admin_jwt())
      with check (athlete_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;
end $$;

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
do $$ begin
  if not exists (select 1 from pg_policies where tablename='nil_disclosures' and policyname='disclosures_self_ins') then
    execute $$ create policy disclosures_self_ins on public.nil_disclosures for insert
      with check (athlete_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='nil_disclosures' and policyname='disclosures_self_sel') then
    execute $$ create policy disclosures_self_sel on public.nil_disclosures for select
      using (athlete_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='nil_disclosures' and policyname='disclosures_self_upd') then
    execute $$ create policy disclosures_self_upd on public.nil_disclosures for update
      using (athlete_user_id = auth.uid() or public.is_admin_jwt())
      with check (athlete_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;
end $$;

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

do $$ begin
  -- Offerings: public read published; owner rw
  if not exists (select 1 from pg_policies where tablename='meet_offerings' and policyname='offerings_public_read') then
    execute $$ create policy offerings_public_read on public.meet_offerings for select
      using (published = true and visibility in ('public','unlisted')) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='meet_offerings' and policyname='offerings_owner_rw') then
    execute $$ create policy offerings_owner_rw on public.meet_offerings for all
      using (athlete_user_id = auth.uid() or public.is_admin_jwt())
      with check (athlete_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;

  -- Windows: public read for future windows; owner rw
  if not exists (select 1 from pg_policies where tablename='meet_windows' and policyname='windows_public_read') then
    execute $$ create policy windows_public_read on public.meet_windows for select
      using (exists (
        select 1 from public.meet_offerings o
        where o.id = meet_windows.offering_id and o.published = true and o.visibility in ('public','unlisted')
      ) and starts_at > now()) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='meet_windows' and policyname='windows_owner_rw') then
    execute $$ create policy windows_owner_rw on public.meet_windows for all
      using (exists (
        select 1 from public.meet_offerings o
        where o.id = meet_windows.offering_id and o.athlete_user_id = auth.uid()
      ) or public.is_admin_jwt())
      with check (exists (
        select 1 from public.meet_offerings o
        where o.id = meet_windows.offering_id and o.athlete_user_id = auth.uid()
      ) or public.is_admin_jwt()) $$;
  end if;

  -- Bookings: buyer insert; buyer + athlete + admin read/update
  if not exists (select 1 from pg_policies where tablename='meet_bookings' and policyname='bookings_insert') then
    execute $$ create policy bookings_insert on public.meet_bookings for insert
      with check (auth.uid() is not null and buyer_user_id = auth.uid()) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='meet_bookings' and policyname='bookings_select') then
    execute $$ create policy bookings_select on public.meet_bookings for select
      using (
        buyer_user_id = auth.uid()
        or exists (select 1 from public.meet_offerings o where o.id = meet_bookings.offering_id and o.athlete_user_id = auth.uid())
        or public.is_admin_jwt()
      ) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='meet_bookings' and policyname='bookings_update_owner') then
    execute $$ create policy bookings_update_owner on public.meet_bookings for update
      using (
        buyer_user_id = auth.uid()
        or exists (select 1 from public.meet_offerings o where o.id = meet_bookings.offering_id and o.athlete_user_id = auth.uid())
        or public.is_admin_jwt()
      )
      with check (true) $$;
  end if;
end $$;

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

-- ====== NIL Merch (storefront + products) ======
create table if not exists public.merch_stores (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null,
  slug text unique not null,
  display_name text not null,
  bio text,
  links jsonb default '{}'::jsonb,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.merch_stores enable row level security;

create table if not exists public.merch_products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.merch_stores(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  price_cents integer not null default 0,
  currency text not null default 'USD',
  attrs jsonb default '{}'::jsonb,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(store_id, slug)
);
alter table public.merch_products enable row level security;

create table if not exists public.merch_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.merch_products(id) on delete cascade,
  sku text unique,
  option1 text, -- size
  option2 text, -- color
  price_cents integer,
  stock_qty integer default 0,
  attrs jsonb default '{}'::jsonb
);
alter table public.merch_variants enable row level security;

create table if not exists public.checkout_intents (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.merch_stores(id) on delete cascade,
  buyer_user_id uuid,
  cart jsonb not null, -- [{product_id, variant_id, qty, price_cents}]
  total_cents integer not null,
  currency text not null default 'USD',
  status text not null default 'pending', -- pending|reserved|paid|cancelled
  created_at timestamptz default now(),
  created_by uuid
);
alter table public.checkout_intents enable row level security;

create table if not exists public.merch_orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.merch_stores(id) on delete cascade,
  buyer_user_id uuid,
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  currency text not null default 'USD',
  status text not null default 'new', -- new|paid|fulfilled|cancelled|refunded
  shipping_address jsonb,
  created_at timestamptz default now()
);
alter table public.merch_orders enable row level security;

do $$ begin
  -- Stores: public read published; owner rw
  if not exists (select 1 from pg_policies where tablename='merch_stores' and policyname='stores_public_read') then
    execute $$ create policy stores_public_read on public.merch_stores for select
      using (published = true) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='merch_stores' and policyname='stores_owner_rw') then
    execute $$ create policy stores_owner_rw on public.merch_stores for all
      using (owner_user_id = auth.uid() or public.is_admin_jwt())
      with check (owner_user_id = auth.uid() or public.is_admin_jwt()) $$;
  end if;

  -- Products: public read published (if store published); owner rw
  if not exists (select 1 from pg_policies where tablename='merch_products' and policyname='products_public_read') then
    execute $$ create policy products_public_read on public.merch_products for select
      using (published = true and exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.published=true)) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='merch_products' and policyname='products_owner_rw') then
    execute $$ create policy products_owner_rw on public.merch_products for all
      using (exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt())
      with check (exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt()) $$;
  end if;

  -- Variants: public read when parent published; owner rw
  if not exists (select 1 from pg_policies where tablename='merch_variants' and policyname='variants_public_read') then
    execute $$ create policy variants_public_read on public.merch_variants for select
      using (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
                     where p.id=merch_variants.product_id and p.published=true and s.published=true)) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='merch_variants' and policyname='variants_owner_rw') then
    execute $$ create policy variants_owner_rw on public.merch_variants for all
      using (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
                     where p.id=merch_variants.product_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt())
      with check (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
                          where p.id=merch_variants.product_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt()) $$;
  end if;

  -- Checkout intents: creator/buyer/store-owner read; any logged-in insert
  if not exists (select 1 from pg_policies where tablename='checkout_intents' and policyname='intents_ins') then
    execute $$ create policy intents_ins on public.checkout_intents for insert
      with check (auth.uid() is not null) $$;
  end if;
  if not exists (select 1 from pg_policies where tablename='checkout_intents' and policyname='intents_sel') then
    execute $$ create policy intents_sel on public.checkout_intents for select
      using (
        created_by = auth.uid()
        or buyer_user_id = auth.uid()
        or exists (select 1 from public.merch_stores s where s.id=checkout_intents.store_id and s.owner_user_id=auth.uid())
        or public.is_admin_jwt()
      ) $$;
  end if;

  -- Orders: buyer or store owner read; inserts by admin/system later
  if not exists (select 1 from pg_policies where tablename='merch_orders' and policyname='orders_sel') then
    execute $$ create policy orders_sel on public.merch_orders for select
      using (
        buyer_user_id = auth.uid()
        or exists (select 1 from public.merch_stores s where s.id=merch_orders.store_id and s.owner_user_id=auth.uid())
        or public.is_admin_jwt()
      ) $$;
  end if;
end $$;

-- Storage bucket for merch images
insert into storage.buckets (id, name, public)
select 'merch_images', 'merch_images', false
where not exists (select 1 from storage.buckets where id='merch_images');

-- Storage policies
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='merch_owner_rw') then
    create policy merch_owner_rw on storage.objects for all
    using (bucket_id = 'merch_images' and auth.role() = 'authenticated' and position('private/'||auth.uid()::text||'/' in name) = 1)
    with check (bucket_id = 'merch_images' and auth.role() = 'authenticated' and position('private/'||auth.uid()::text||'/' in name) = 1);
  end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='merch_public_read') then
    create policy merch_public_read on storage.objects for select
    using (bucket_id = 'merch_images' and position('public/' in name) = 1);
  end if;
end $$;