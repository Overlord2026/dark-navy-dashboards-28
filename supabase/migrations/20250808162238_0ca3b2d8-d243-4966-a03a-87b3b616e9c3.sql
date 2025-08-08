-- Enable RLS
alter table public.onboarding_steps enable row level security;
alter table public.vault_activity_log enable row level security;

-- Onboarding: users see/manage only their steps
drop policy if exists onboarding_owner_select on public.onboarding_steps;
drop policy if exists onboarding_owner_dml on public.onboarding_steps;

create policy onboarding_owner_select
on public.onboarding_steps
for select
to authenticated
using (user_id = auth.uid());

create policy onboarding_owner_dml
on public.onboarding_steps
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Vault activity: users can insert their own logs; read only their logs
drop policy if exists vault_log_owner_select on public.vault_activity_log;
drop policy if exists vault_log_owner_insert on public.vault_activity_log;

create policy vault_log_owner_select
on public.vault_activity_log
for select
to authenticated
using (user_id = auth.uid());

create policy vault_log_owner_insert
on public.vault_activity_log
for insert
to authenticated
with check (user_id = auth.uid());