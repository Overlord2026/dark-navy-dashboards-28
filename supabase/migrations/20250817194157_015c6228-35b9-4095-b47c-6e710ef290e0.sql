-- Fix the search path security issue for the admin helper function
create or replace function public.is_admin_jwt()
returns boolean 
language sql 
stable 
security definer
set search_path = public, pg_temp
as $$
  select current_setting('request.jwt.claims', true)::jsonb ? 'role'
     and (current_setting('request.jwt.claims', true)::jsonb->>'role') in ('service_role','admin')
$$;