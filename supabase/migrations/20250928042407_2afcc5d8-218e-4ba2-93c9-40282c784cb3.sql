-- Simple app_events table creation
create table if not exists public.app_events (
  id bigserial primary key,
  event_name text not null,
  user_id uuid,
  household_id uuid,
  advisor_firm_id uuid,
  plan_key text,
  export_hash text,
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.app_events enable row level security;

-- Basic RLS policy
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'app_events' 
    and policyname = 'app_events_authenticated_read'
  ) then
    create policy app_events_authenticated_read
      on public.app_events
      for select
      to authenticated
      using (true);
  end if;
end$$;