-- Report which functions still lack an explicit search_path
select n.nspname as schema, p.proname as function,
       pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname not in ('pg_catalog','information_schema','pg_toast')
  and not exists (
    select 1 from unnest(coalesce(p.proconfig, array[]::text[])) cfg
    where cfg like 'search_path=%'
  )
order by 1,2;

-- Set a safe search_path everywhere (idempotent)
do $$
declare f record;
begin
  for f in
    select n.nspname as schema, p.proname as function,
           pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid=p.pronamespace
    where n.nspname not in ('pg_catalog','information_schema','pg_toast')
      and not exists (
        select 1 from unnest(coalesce(p.proconfig, array[]::text[])) cfg
        where cfg like 'search_path=%'
      )
  loop
    if f.schema='public' and f.function='vault_get_secret' then
      -- needs vault on search_path
      begin execute format('alter function %I.%I(%s) set search_path = public, vault, pg_temp', f.schema, f.function, f.args); exception when others then null; end;
    else
      begin execute format('alter function %I.%I(%s) set search_path = %I, pg_temp', f.schema, f.function, f.args, f.schema); exception when others then null; end;
    end if;
  end loop;
end $$;