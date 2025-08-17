-- 0) Make sure wrappers are callable by client tokens
grant execute on function public.graphql_is_configured() to authenticated, anon;
grant execute on function public.vault_is_configured()   to authenticated, anon;

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
      begin execute $q$
        create policy advisor_profiles_admin_read on public.advisor_profiles
        for select using (exists(select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'))
      $q$; exception when duplicate_object then null; end;
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
      begin execute $q$
        create policy reserved_profiles_admin_read on public.reserved_profiles
        for select using (exists(select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role = 'admin'))
      $q$; exception when duplicate_object then null; end;
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
        -- try to set security properties (ignore if server doesn't support)
        begin execute format('alter view public.%I set (security_invoker = true, security_barrier = true)', view_name); exception when others then null; end;
        -- allow authenticated to read the redacted view
        execute format('grant select on public.%I to authenticated', view_name);
      exception when others then
        raise notice 'Skipped redacted view for % due to: %', r.table_name, sqlerrm;
      end;
    end if;
  end loop;
end $$;

-- 3) Medium: baseline owner/household policies where columns exist (idempotent)
do $$
declare t record;
begin
  for t in
    select table_schema, table_name from information_schema.tables
    where table_schema='public' and table_type='BASE TABLE'
  loop
    -- OWNER (user_id)
    if exists (select 1 from information_schema.columns where table_schema=t.table_schema and table_name=t.table_name and column_name='user_id') then
      begin execute format('create policy %I_read_own on %I.%I for select using (auth.uid() = user_id)', t.table_name, t.table_schema, t.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_insert_own on %I.%I for insert with check (auth.uid() = user_id)', t.table_name, t.table_schema, t.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_update_own on %I.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t.table_name, t.table_schema, t.table_name); exception when duplicate_object then null; end;
      begin execute format('create policy %I_delete_own on %I.%I for delete using (auth.uid() = user_id)', t.table_name, t.table_schema, t.table_name); exception when duplicate_object then null; end;
    end if;

    -- HOUSEHOLD (household_id via household_users)
    if exists (select 1 from information_schema.columns where table_schema=t.table_schema and table_name=t.table_name and column_name='household_id')
       and to_regclass('public.household_users') is not null then
      begin execute format($q$
        create policy %I_read_household on %I.%I
        for select using (exists(select 1 from public.household_users hu where hu.household_id=%I.household_id and hu.user_id=auth.uid()))
      $q$, t.table_name, t.table_schema, t.table_name, t.table_name); exception when duplicate_object then null; end;
      begin execute format($q$
        create policy %I_insert_household on %I.%I
        for insert with check (exists(select 1 from public.household_users hu where hu.household_id=%I.household_id and hu.user_id=auth.uid()))
      $q$, t.table_name, t.table_schema, t.table_name, t.table_name); exception when duplicate_object then null; end;
      begin execute format($q$
        create policy %I_update_household on %I.%I
        for update using (exists(select 1 from public.household_users hu where hu.household_id=%I.household_id and hu.user_id=auth.uid()))
        with check (exists(select 1 from public.household_users hu where hu.household_id=%I.household_id and hu.user_id=auth.uid()))
      $q$, t.table_name, t.table_schema, t.table_name, t.table_name, t.table_name); exception when duplicate_object then null; end;
    end if;
  end loop;
end $$;

-- 4) Harden SECURITY DEFINER functions + views
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

do $$
declare v record;
begin
  for v in select schemaname, viewname from pg_views where schemaname='public'
  loop
    begin
      execute format('alter view %I.%I set (security_invoker = true, security_barrier = true)', v.schemaname, v.viewname);
    exception when others then
      -- ignore if server version doesn't support security_invoker
      null;
    end;
  end loop;
end $$;