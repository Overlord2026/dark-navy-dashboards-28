do $$
declare r record;
begin
  for r in
    select c.relname as table_name
    from pg_class c
    join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and c.relrowsecurity
      and not exists (select 1 from pg_policies p where p.schemaname='public' and p.tablename=c.relname)
      and not exists (select 1 from information_schema.columns where table_schema='public' and table_name=c.relname and column_name in ('user_id','household_id'))
      and not exists (select 1 from information_schema.columns where table_schema='public' and table_name=c.relname and lower(column_name) in
        ('email','phone','phone_number','contact_phone','contact_email','ssn','tax_id','account_number','address','address1','address2'))
  loop
    -- Allow read for everyone *via RLS* (no data if RLS off). Grant select so RLS can evaluate.
    begin execute format('grant select on public.%I to authenticated', r.table_name); exception when others then null; end;
    begin execute format('create policy %I_read_all on public.%I for select using (true)', r.table_name, r.table_name); exception when duplicate_object then null; end;
  end loop;
end $$;