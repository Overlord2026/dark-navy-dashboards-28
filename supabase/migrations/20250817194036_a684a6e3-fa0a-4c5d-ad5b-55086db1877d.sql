-- ===== Buckets (private) =====
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nil_docs', 'nil_docs', false, null, null)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('agent_docs', 'agent_docs', false, null, null)
on conflict (id) do nothing;

-- ===== University contacts (for disclosure emailing) =====
create table if not exists public.nil_university_contacts (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null,
  name text,
  email text not null,
  created_at timestamptz default now()
);

alter table public.nil_university_contacts enable row level security;

-- Drop policy if exists, then create
drop policy if exists "uni_contacts_admin_only" on public.nil_university_contacts;
create policy "uni_contacts_admin_only" on public.nil_university_contacts
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ===== Helper: strict "are we admin?" wrapper for functions =====
create or replace function public.is_admin_jwt()
returns boolean language sql stable as $$
  select current_setting('request.jwt.claims', true)::jsonb ? 'role'
     and (current_setting('request.jwt.claims', true)::jsonb->>'role') in ('service_role','admin')
$$;