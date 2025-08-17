-- Revoke public/anon on *any* view that still references the sensitive bases.
do $$
declare v record;
begin
  for v in
    select schemaname, viewname from pg_views
    where schemaname='public'
      and (definition ilike '%advisor_profiles%'
           or definition ilike '%reserved_profiles%'
           or definition ilike '%attorney_document_classifications%'
           or definition ilike '%goal_category_templates%')
  loop
    begin execute format('revoke all on view %I.%I from public, anon', v.schemaname, v.viewname); exception when others then null; end;
  end loop;
end $$;

-- Our redacted views (created earlier) stay granted to authenticated.
-- (No changes needed here if you already see green on "critical exposure".)