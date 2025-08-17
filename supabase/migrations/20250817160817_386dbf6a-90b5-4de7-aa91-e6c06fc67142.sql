do $$
declare f record;
begin
  for f in
    select n.nspname as schema, p.proname, pg_get_function_identity_arguments(p.oid) as args
    from pg_extension e
    join pg_depend d on d.refobjid=e.oid and d.deptype='e'
    join pg_proc p on p.oid=d.objid
    join pg_namespace n on n.oid=p.pronamespace
    where e.extname='pg_net'
  loop
    begin
      execute format('revoke all on function %I.%I(%s) from public, anon, authenticated', f.schema, f.proname, f.args);
      raise notice 'Revoked permissions on function %I.%I(%s)', f.schema, f.proname, f.args;
    exception when others then 
      raise notice 'Could not revoke permissions on function %I.%I(%s): %', f.schema, f.proname, f.args, sqlerrm;
    end;
  end loop;
end $$;