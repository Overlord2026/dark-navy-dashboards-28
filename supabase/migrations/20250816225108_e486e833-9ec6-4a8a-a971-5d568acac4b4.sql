-- Task 2: Fix GraphQL and Vault
-- Apply idempotent GraphQL grants and vault configuration

-- Check and grant GraphQL permissions if extension exists
do $$
begin
  if exists (select 1 from pg_extension where extname='pg_graphql') then
    grant usage on schema graphql to authenticated, anon;
    grant execute on function graphql.graphql(text, json) to authenticated, anon;
    raise notice 'GraphQL grants applied successfully.';
  else
    raise notice 'GraphQL extension not found; skipping grants.';
  end if;
exception when others then
  raise notice 'Skipping GraphQL grants check due to permissions: %', SQLERRM;
end $$;

-- Create vault configuration check function
create or replace function public.vault_is_configured() 
returns boolean
language sql stable security definer
set search_path to ''
as $$
  select exists (select 1 from pg_extension where extname='supabase_vault');
$$;