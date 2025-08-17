-- 2025-08-17_security_hardening_guarded.sql
-- Idempotent security hardening for Boutique Family Office™

-- 1) GraphQL & Vault safety (idempotent)
do $$
begin
  perform 1 from pg_namespace where nspname='graphql';
  if found then
    grant usage on schema graphql to authenticated, anon;
    grant execute on function graphql.graphql(text, json) to authenticated, anon;
  end if;
exception when others then
  raise notice 'GraphQL grants skipped (insufficient privileges or missing extension).';
end $$;

create or replace function public.vault_is_configured() returns boolean
language sql stable as $$
  select exists (select 1 from pg_extension where extname='supabase_vault');
$$;

-- 2) Enable RLS on all public tables that still have it off
do $$
declare r record;
begin
  for r in
    select n.nspname as schema, c.relname as tbl
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and c.relrowsecurity=false
  loop
    execute format('alter table %I.%I enable row level security;', r.schema, r.tbl);
  end loop;
end $$;

-- 3) Owner- and household-based baseline policies where applicable
do $$
declare r record;
begin
  for r in
    select table_schema, table_name
    from information_schema.tables
    where table_schema='public' and table_type='BASE TABLE'
  loop
    -- OWNER rules (user_id)
    if exists (select 1 from information_schema.columns
               where table_schema=r.table_schema and table_name=r.table_name and column_name='user_id') then
      begin execute format('create policy %I_read_own on %I.%I for select using (auth.uid() = user_id);',
                           r.table_name, r.table_schema, r.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_write_own on %I.%I for insert with check (auth.uid() = user_id);',
                           r.table_name, r.table_schema, r.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_update_own on %I.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);',
                           r.table_name, r.table_schema, r.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_delete_own on %I.%I for delete using (auth.uid() = user_id);',
                           r.table_name, r.table_schema, r.table_name); exception when duplicate_object then null; end;
    end if;

    -- HOUSEHOLD rules (household_id via membership table household_users(user_id, household_id))
    if exists (select 1 from information_schema.columns
               where table_schema=r.table_schema and table_name=r.table_name and column_name='household_id') then
      begin execute format($q$
        create policy %I_read_household on %I.%I
        for select using (
          exists(select 1 from public.household_users hu
                 where hu.household_id=%I.household_id and hu.user_id=auth.uid())
        );$q$, r.table_name, r.table_schema, r.table_name, r.table_name);
      exception when duplicate_object then null; end;

      begin execute format($q$
        create policy %I_write_household on %I.%I
        for insert with check (
          exists(select 1 from public.household_users hu
                 where hu.household_id=%I.household_id and hu.user_id=auth.uid())
        );$q$, r.table_name, r.table_schema, r.table_name, r.table_name);
      exception when duplicate_object then null; end;

      begin execute format($q$
        create policy %I_update_household on %I.%I
        for update using (
          exists(select 1 from public.household_users hu
                 where hu.household_id=%I.household_id and hu.user_id=auth.uid())
        ) with check (
          exists(select 1 from public.household_users hu
                 where hu.household_id=%I.household_id and hu.user_id=auth.uid())
        );$q$, r.table_name, r.table_schema, r.table_name, r.table_name, r.table_name);
      exception when duplicate_object then null; end;
    end if;
  end loop;
end $$;

-- 4) Storage policies per bucket (restrict by metadata.owner UUID when present)
do $$
declare b record;
begin
  for b in select id from storage.buckets loop
    begin
      execute format('create policy %I_read on storage.objects for select using (bucket_id=%L and (metadata->>''owner'')::uuid = auth.uid());',
                     'bfo_storage_'||b.id||'_read', b.id);
    exception when duplicate_object then null; end;
    begin
      execute format('create policy %I_write on storage.objects for insert with check (bucket_id=%L and (metadata->>''owner'')::uuid = auth.uid());',
                     'bfo_storage_'||b.id||'_write', b.id);
    exception when duplicate_object then null; end;
  end loop;
exception when undefined_table then
  raise notice 'storage.buckets not present; skipping storage policies.';
end $$;

-- 5) SECURITY DEFINER hardening: set explicit search_path (skip if none)
do $$
declare f record;
begin
  for f in
    select n.nspname as schema, p.proname, pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where p.prosecdef=true and n.nspname='public'
  loop
    execute format('alter function %I.%I(%s) set search_path = public, pg_temp;', f.schema, f.proname, f.args);
  end loop;
end $$;