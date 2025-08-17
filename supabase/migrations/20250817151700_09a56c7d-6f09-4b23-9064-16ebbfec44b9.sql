do $$
declare r record;
begin
  for r in
    select n.nspname, c.relname
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r'
  loop
    begin execute format('alter table %I.%I enable row level security', r.nspname, r.relname); exception when others then null; end;
    begin execute format('alter table %I.%I force row level security',  r.nspname, r.relname); exception when others then null; end;
  end loop;
end $$;