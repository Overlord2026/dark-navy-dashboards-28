-- 0) Make sure wrappers are callable by client tokens
grant execute on function public.graphql_is_configured() to authenticated, anon;
grant execute on function public.vault_is_configured() to authenticated, anon;

-- 1) CRITICAL: Lock down advisor_profiles / reserved_profiles (no public emails)
do $$
begin
  -- advisor_profiles
  if to_regclass('public.advisor_profiles') is not null then
    execute 'alter table public.advisor_profiles enable row level security';
    execute 'revoke all on table public.advisor_profiles from anon, authenticated';
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='advisor_profiles' and column_name='user_id') then
      begin execute 'create policy advisor_profiles_read_own on public.advisor_profiles for select using (auth.uid() = user_id)'; exception when duplicate_object then null; end;
      begin execute 'create policy advisor_profiles_insert_own on public.advisor_profiles for insert with check (auth.uid() = user_id)'; exception when duplicate_object then null; end;
      begin execute 'create policy advisor_profiles_update_own on public.advisor_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id)'; exception when duplicate_object then null; end;
    end if;
  end if;

  -- reserved_profiles
  if to_regclass('public.reserved_profiles') is not null then
    execute 'alter table public.reserved_profiles enable row level security';
    execute 'revoke all on table public.reserved_profiles from anon, authenticated';
    if exists (select 1 from information_schema.columns where table_schema='public' and table_name='reserved_profiles' and column_name='user_id') then
      begin execute 'create policy reserved_profiles_read_own on public.reserved_profiles for select using (auth.uid() = user_id)'; exception when duplicate_object then null; end;
      begin execute 'create policy reserved_profiles_insert_own on public.reserved_profiles for insert with check (auth.uid() = user_id)'; exception when duplicate_object then null; end;
      begin execute 'create policy reserved_profiles_update_own on public.reserved_profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id)'; exception when duplicate_object then null; end;
    end if;
  end if;
end $$;

-- 2) HIGH: Classifications & Templates — restrict base tables and create redacted public views
do $$
declare r record; cols text; view_name text;
begin
  for r in
    select table_name
    from information_schema.tables
    where table_schema='public'
      and (lower(table_name) like '%classification%' or lower(table_name) like '%template%')
  loop
    -- enable RLS + remove public/anon direct reads
    begin execute format('alter table public.%I enable row level security', r.table_name); exception when others then null; end;
    begin execute format('revoke all on table public.%I from anon, authenticated', r.table_name); exception when others then null; end;

    -- build a column list minus sensitive fields
    select string_agg(quote_ident(column_name), ', ')
      into cols
    from information_schema.columns
    where table_schema='public' and table_name=r.table_name
      and lower(column_name) not in ('phone','phone_number','contact_phone','email','contact_email','ssn','tax_id');

    if cols is not null then
      view_name := 'v_'||r.table_name||'_public';
      begin
        execute format('create or replace view public.%I as select %s from public.%I', view_name, cols, r.table_name);
        -- allow authenticated to read the redacted view
        execute format('grant select on public.%I to authenticated', view_name);
      exception when others then
        raise notice 'Skipped redacted view for % due to: %', r.table_name, sqlerrm;
      end;
    end if;
  end loop;
end $$;

-- 4) Harden SECURITY DEFINER functions
do $$
declare f record;
begin
  for f in
    select n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where p.prosecdef=true and n.nspname='public'
  loop
    begin
      execute format('alter function %I.%I(%s) set search_path = public, pg_temp', f.nspname, f.proname, f.args);
    exception when others then null;
    end;
  end loop;
end $$;