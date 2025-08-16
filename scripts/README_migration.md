# Portable Migration Template

This directory contains a fully portable Supabase migration template.

## Files

- `supabase/migrations/20250116143000_portable_migration_template.sql` - Main migration file
- `scripts/db/smoke.sql` - Verification script

## Usage

### Apply Migration

**Option 1: Supabase Studio (Recommended)**
1. Open [Supabase Studio SQL Editor](https://supabase.com/dashboard/project/your-project/sql/new)
2. Copy the contents of the migration file
3. Paste and run

**Option 2: Supabase CLI**
```bash
supabase db push
```

### Verify Setup
Run the smoke test to verify everything is working:
```sql
-- Copy and paste contents of scripts/db/smoke.sql
```

## Portability

✅ **No non-portable extensions** - Only uses `pgcrypto` and `pg_trgm`
✅ **No vault dependencies** - Works on any Supabase project
✅ **RLS enforced** - All tables have ENABLE and FORCE ROW LEVEL SECURITY
✅ **Deny-by-default policies** - Secure out of the box

## Customization

Replace the DDL section between `-- DDL_START` and `-- DDL_END` with your table definitions.

For each new table:
1. Add the table definition in DDL_START section
2. Add `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
3. Add `ALTER TABLE ... FORCE ROW LEVEL SECURITY;`  
4. Add appropriate RLS policies
5. Add updated_at trigger if needed