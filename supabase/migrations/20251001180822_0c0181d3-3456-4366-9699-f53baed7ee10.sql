-- Create swag_scenarios table for user-specific scenario persistence
create table if not exists public.swag_scenarios(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  household_id uuid,
  name text not null,
  inputs jsonb not null,
  result jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.swag_scenarios enable row level security;

-- Create policies for user access
create policy "swag_select_own" on public.swag_scenarios 
  for select using (auth.uid() = user_id);

create policy "swag_insert_self" on public.swag_scenarios 
  for insert with check (auth.uid() = user_id);

create policy "swag_update_own" on public.swag_scenarios 
  for update using (auth.uid() = user_id);

create policy "swag_delete_own" on public.swag_scenarios 
  for delete using (auth.uid() = user_id);