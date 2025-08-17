create schema if not exists extensions;

do $$
declare r record;
begin
  for r in
    select extname
    from pg_extension e
    join pg_namespace n on n.oid=e.extnamespace
    where n.nspname='public'
      and extname not in ('plpgsql')  -- core, skip
  loop
    begin
      execute format('alter extension %I set schema extensions', r.extname);
    exception when others then
      raise notice 'Could not move extension %, skipping: %', r.extname, sqlerrm;
    end;
  end loop;
end $$;