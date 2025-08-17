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

-- Drop and create merch policies
drop policy if exists stores_public_read on public.merch_stores;
create policy stores_public_read on public.merch_stores for select
using (published = true);

drop policy if exists stores_owner_rw on public.merch_stores;
create policy stores_owner_rw on public.merch_stores for all
using (owner_user_id = auth.uid() or public.is_admin_jwt())
with check (owner_user_id = auth.uid() or public.is_admin_jwt());

drop policy if exists products_public_read on public.merch_products;
create policy products_public_read on public.merch_products for select
using (published = true and exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.published=true));

drop policy if exists products_owner_rw on public.merch_products;
create policy products_owner_rw on public.merch_products for all
using (exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt())
with check (exists (select 1 from public.merch_stores s where s.id=merch_products.store_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt());

drop policy if exists variants_public_read on public.merch_variants;
create policy variants_public_read on public.merch_variants for select
using (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
               where p.id=merch_variants.product_id and p.published=true and s.published=true));

drop policy if exists variants_owner_rw on public.merch_variants;
create policy variants_owner_rw on public.merch_variants for all
using (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
               where p.id=merch_variants.product_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt())
with check (exists (select 1 from public.merch_products p join public.merch_stores s on s.id=p.store_id
                    where p.id=merch_variants.product_id and s.owner_user_id=auth.uid()) or public.is_admin_jwt());

drop policy if exists intents_ins on public.checkout_intents;
create policy intents_ins on public.checkout_intents for insert
with check (auth.uid() is not null);

drop policy if exists intents_sel on public.checkout_intents;
create policy intents_sel on public.checkout_intents for select
using (
  created_by = auth.uid()
  or buyer_user_id = auth.uid()
  or exists (select 1 from public.merch_stores s where s.id=checkout_intents.store_id and s.owner_user_id=auth.uid())
  or public.is_admin_jwt()
);

drop policy if exists orders_sel on public.merch_orders;
create policy orders_sel on public.merch_orders for select
using (
  buyer_user_id = auth.uid()
  or exists (select 1 from public.merch_stores s where s.id=merch_orders.store_id and s.owner_user_id=auth.uid())
  or public.is_admin_jwt()
);

-- Storage bucket for merch images
insert into storage.buckets (id, name, public)
select 'merch_images', 'merch_images', false
where not exists (select 1 from storage.buckets where id='merch_images');

-- Storage policies
drop policy if exists merch_owner_rw on storage.objects;
create policy merch_owner_rw on storage.objects for all
using (bucket_id = 'merch_images' and auth.role() = 'authenticated' and position('private/'||auth.uid()::text||'/' in name) = 1)
with check (bucket_id = 'merch_images' and auth.role() = 'authenticated' and position('private/'||auth.uid()::text||'/' in name) = 1);

drop policy if exists merch_public_read on storage.objects;
create policy merch_public_read on storage.objects for select
using (bucket_id = 'merch_images' and position('public/' in name) = 1);