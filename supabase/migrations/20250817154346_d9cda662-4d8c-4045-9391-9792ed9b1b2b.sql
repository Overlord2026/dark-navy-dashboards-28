-- No role can CREATE in public; allow only USAGE.
revoke create on schema public from public, anon, authenticated;
grant  usage on schema public to   public, anon, authenticated;

-- No auto-grants for new objects in public.
alter default privileges in schema public revoke all on tables    from public, anon, authenticated;
alter default privileges in schema public revoke all on sequences from public, anon, authenticated;
alter default privileges in schema public revoke all on functions from public, anon, authenticated;