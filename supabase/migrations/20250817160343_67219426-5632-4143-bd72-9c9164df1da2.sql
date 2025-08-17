create schema if not exists extensions;

-- See what's still in public
select x.extname from pg_extension x
join pg_namespace n on n.oid=x.extnamespace
where n.nspname='public';

-- Try to relocate anything relocatable
do $$
declare e record;
begin
  for e in
    select x.extname
    from pg_extension x
    join pg_namespace n on n.oid=x.extnamespace
    where n.nspname='public' and x.extrelocatable = true
  loop
    begin
      execute format('alter extension %I set schema extensions', e.extname);
      raise notice 'Successfully moved extension % to extensions schema', e.extname;
    exception when others then
      raise notice 'Could not move extension %, skipping: %', e.extname, sqlerrm;
    end;
  end loop;
end $$;