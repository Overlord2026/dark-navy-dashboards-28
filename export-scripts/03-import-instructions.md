# 🚀 Supabase Project Restoration Guide

This guide will help you restore your complete Supabase project (schema + data) to a new project.

## 📋 Prerequisites

1. **New Supabase Project**: Create a fresh project at [app.supabase.com](https://app.supabase.com)
2. **Project Credentials**: Note down your new project's:
   - Project URL
   - Project ID  
   - Service Role Key (for data import)
   - Anon Key

## 🔧 Method 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Export from Current Project
```bash
# Login to Supabase
supabase login

# Link to your current project
supabase link --project-ref xcmqjkvyvuhoslbzmlgi

# Export schema
supabase db dump --schema public > schema.sql

# Export data (optional)
supabase db dump --data-only --schema public > data.sql

# Export auth data
supabase db dump --schema auth > auth.sql
```

### Step 3: Import to New Project
```bash
# Link to your new project
supabase link --project-ref YOUR_NEW_PROJECT_ID

# Import schema first
supabase db push --schema schema.sql

# Import auth data
psql "postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres" < auth.sql

# Import data
psql "postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres" < data.sql
```

## 🔧 Method 2: Using SQL Scripts (Manual)

### Step 1: Export Schema Using Our Scripts

1. Open Supabase SQL Editor for your **current project**
2. Run the queries from `01-schema-export.sql` one by one
3. Copy and save each result to separate files:
   - `tables.sql` - Table creation statements
   - `types.sql` - Custom types and enums  
   - `indexes.sql` - Index creation statements
   - `foreign_keys.sql` - Foreign key constraints
   - `functions.sql` - Function definitions
   - `triggers.sql` - Trigger definitions
   - `policies.sql` - RLS policy statements
   - `rls_enable.sql` - RLS enable statements

### Step 2: Export Data Using Our Scripts

1. Run the queries from `02-data-export.sql` in your **current project**
2. Save the CSV outputs for each table
3. For auth.users, you'll need service role access

### Step 3: Import to New Project

1. **Create New Supabase Project**
2. **Import Schema in Order:**
   ```sql
   -- 1. Run types.sql first
   -- 2. Run tables.sql  
   -- 3. Run indexes.sql
   -- 4. Run foreign_keys.sql
   -- 5. Run functions.sql
   -- 6. Run triggers.sql
   -- 7. Run rls_enable.sql
   -- 8. Run policies.sql last
   ```

3. **Import Data:**
   - Use the CSV data to insert records
   - Start with auth.users if migrating users
   - Then import profiles and other dependent tables

## 🔧 Method 3: Using pg_dump (Advanced)

If you have direct PostgreSQL access:

```bash
# Export everything
pg_dump "postgresql://postgres:[PASSWORD]@db.xcmqjkvyvuhoslbzmlgi.supabase.co:5432/postgres" \
  --schema=public \
  --schema=auth \
  --no-owner \
  --no-privileges > full_backup.sql

# Import to new project  
psql "postgresql://postgres:[NEW_PASSWORD]@db.[NEW_PROJECT_ID].supabase.co:5432/postgres" < full_backup.sql
```

## ⚠️ Important Notes

### Schema Import Order
1. **Types & Enums** first
2. **Tables** (without foreign keys)
3. **Indexes**
4. **Foreign Key Constraints**
5. **Functions**
6. **Triggers**
7. **Enable RLS**
8. **RLS Policies** last

### Data Import Order
1. **auth.users** (if migrating users)
2. **profiles** 
3. **Reference tables** (charities, providers, etc.)
4. **Core business tables** (accounts, goals, etc.)
5. **Dependent tables** (documents, logs, etc.)

### Authentication Migration
- **Users**: Export from `auth.users` table
- **Passwords**: Will be preserved in encrypted form
- **Sessions**: Will need to be re-established
- **MFA**: May need to be re-configured

### File Storage Migration
- Storage buckets and files are **NOT** included in SQL export
- Use Supabase Storage API to migrate files separately
- Update file URLs in your data after migration

### Edge Functions
- Export function code from `supabase/functions/` folder
- Recreate in new project
- Update environment variables/secrets

## 🔍 Verification Steps

After import, verify:

```sql
-- Check table count
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';

-- Check user count  
SELECT count(*) FROM auth.users;
SELECT count(*) FROM public.profiles;

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check functions exist
SELECT proname FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public';
```

## 🛠️ Troubleshooting

### Common Issues:
1. **Foreign Key Errors**: Import tables before foreign key constraints
2. **Function Dependencies**: Some functions may reference others - import in dependency order
3. **RLS Policy Errors**: Ensure functions exist before creating policies that reference them
4. **User Permission Errors**: Use service role key for auth table operations

### If Import Fails:
1. **Drop and Recreate**: Drop the new project and start fresh
2. **Partial Import**: Import schema first, then data in smaller batches
3. **Manual Fixes**: Fix any custom dependencies that didn't export cleanly

## 📞 Support

If you encounter issues:
1. Check Supabase logs in the new project dashboard
2. Review PostgreSQL error messages carefully
3. Consider reaching out to Supabase support for complex migrations

---

**💡 Pro Tip**: Always test the migration process with a small subset of data first!