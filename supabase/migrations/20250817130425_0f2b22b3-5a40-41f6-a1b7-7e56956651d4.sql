-- Minimal GraphQL grants (safe to re-run)
do $$
begin
  perform 1 from pg_namespace where nspname='graphql';
  if found then
    grant usage on schema graphql to authenticated, anon;
    grant execute on function graphql.graphql(text, json) to authenticated, anon;
  end if;
exception when others then
  raise notice 'GraphQL grants skipped (missing or insufficient privilege).';
end $$;

-- Safe "is configured" wrappers (front-end should call these)
create or replace function public.graphql_is_configured() returns boolean
language sql stable as $$ select exists (select 1 from pg_extension where extname='pg_graphql') $$;

create or replace function public.vault_is_configured() returns boolean
language sql stable as $$ select exists (select 1 from pg_extension where extname='supabase_vault') $$;

grant execute on function public.graphql_is_configured() to authenticated, anon;
grant execute on function public.vault_is_configured()   to authenticated, anon;