do $$
declare v record;
begin
  for v in select schemaname, viewname from pg_views where schemaname='public'
  loop
    begin execute format('alter view %I.%I set (security_invoker = true)',  v.schemaname, v.viewname); exception when others then null; end;
    begin execute format('alter view %I.%I set (security_barrier = true)',  v.schemaname, v.viewname); exception when others then null; end;
  end loop;
end $$;