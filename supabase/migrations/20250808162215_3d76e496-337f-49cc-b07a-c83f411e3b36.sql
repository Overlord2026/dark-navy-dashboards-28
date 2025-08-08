-- 2a) Create default onboarding steps
create or replace function public.create_default_onboarding_steps(p_user_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.onboarding_steps (user_id, step, status)
  values
    (p_user_id, 'Welcome', 'pending'),
    (p_user_id, 'Profile Setup', 'pending'),
    (p_user_id, 'Connect Accounts', 'pending'),
    (p_user_id, 'Explore Features', 'pending');
end;
$$;

-- 2b) Current user's org id (read-only helper)
create or replace function public.get_current_user_organization_id()
returns uuid
language sql
stable
security invoker
set search_path = ''
as $$
  select organization_id
  from public.organization_admins
  where user_id = auth.uid() and is_active = true
  limit 1;
$$;

-- 2c) Vault activity logger (public wrapper, no vault schema access)
create or replace function public.log_vault_activity(
  p_vault_id uuid,
  p_action_type text,
  p_resource_type text,
  p_resource_id uuid default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  log_id uuid;
begin
  insert into public.vault_activity_log (
    vault_id, user_id, action_type, resource_type,
    resource_id, details, ip_address
  )
  values (
    p_vault_id, auth.uid(), p_action_type, p_resource_type,
    p_resource_id, p_details, inet_client_addr()
  )
  returning id into log_id;

  return log_id;
end;
$$;