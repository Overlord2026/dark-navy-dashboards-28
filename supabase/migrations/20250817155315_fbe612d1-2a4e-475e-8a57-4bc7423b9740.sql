-- Move relocatable extensions to dedicated schema for security
create schema if not exists extensions;

do $$
declare e record;
begin
  for e in
    select extname
    from pg_extension x
    join pg_namespace n on n.oid=x.extnamespace
    where n.nspname='public' and x.extrelocatable = true
  loop
    begin
      execute format('alter extension %I set schema extensions', e.extname);
      raise notice 'Moved extension % to extensions schema', e.extname;
    exception when others then
      raise notice 'Could not move extension %, skipping: %', e.extname, sqlerrm;
    end;
  end loop;
end $$;