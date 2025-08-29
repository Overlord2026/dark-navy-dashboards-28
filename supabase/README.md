# Supabase Database Migrations

This directory contains idempotent SQL migration files for the BFO MVP Client App database.

## Environment Setup

1. **Copy environment variables:**
   ```bash
   cp .env.example .env.local
   ```

2. **Set required variables in `.env.local`:**
   ```bash
   SUPABASE_PROJECT_REF=xcmqjkvyvuhoslbzmlgi
   SUPABASE_DB_URL=postgres://postgres:[YOUR_SERVICE_PASSWORD]@db.xcmqjkvyvuhoslbzmlgi.supabase.co:5432/postgres
   ```

3. **Install Supabase CLI (if not already installed):**
   ```bash
   npm install -g supabase
   ```

## Running Migrations

### Development Environment
```bash
# Apply all pending migrations
npm run db:migrate:dev

# Check migration status
npm run db:status

# View differences between local and remote
npm run db:diff
```

### Production Environment
```bash
# Set production environment variables first
export SUPABASE_PROJECT_REF=xcmqjkvyvuhoslbzmlgi
export SUPABASE_DB_URL=postgres://postgres:[PROD_PASSWORD]@db.xcmqjkvyvuhoslbzmlgi.supabase.co:5432/postgres

# Apply migrations to production
npm run db:migrate:dev
```

## Migration Files

All migration files are **idempotent** and safe to run multiple times:

### 1. `2025-08-27_bfo_ops_fix_pack_v2.sql`
**BFO Operations Complete Setup**
- IAR Sites and Pages management system
- Revenue rules and ledger for financial tracking
- Payouts system with status tracking
- Automation framework with execution runs
- Transitions and workflow system
- Diligence requests and evidence tracking
- Vault objects for secure document storage
- Performance indexes for optimal queries
- Row Level Security (RLS) on all tables
- Seed data for default automations

### 2. `2025-08-27_rls_three_tables.sql`
**RLS Policies for Core AIES Tables**
- `public.aies_consent_grants` - User and admin access policies
- `public.aies_policies` - Admin-managed with tenant isolation
- `public.aies_connector_health` - Monitoring and service role access

### 3. `2025-08-27_view_security_barrier.sql`
**View Security Enhancement**
- Sets `security_barrier = true` on all public views
- Creates secure views with proper RLS integration
- Enhances query planner security for view access

### 4. `2025-08-27_functions_hardening.sql`
**Function Security Hardening**
- Adds `SECURITY DEFINER` to custom functions
- Sets `search_path = ''` to prevent injection attacks
- Hardens existing utility functions without changing behavior

## Adding New Migrations

1. **Create timestamped filename:**
   ```bash
   # Format: YYYY-MM-DD_descriptive_name.sql
   touch supabase/migrations/2025-08-28_my_new_feature.sql
   ```

2. **Write idempotent SQL:**
   ```sql
   -- Always use IF NOT EXISTS for new objects
   CREATE TABLE IF NOT EXISTS public.my_table (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     -- columns here
   );
   
   -- Use DO blocks for conditional logic
   DO $$
   BEGIN
     IF NOT EXISTS (SELECT 1 FROM ...) THEN
       -- Safe operations here
     END IF;
   END $$;
   ```

3. **Test locally first:**
   ```bash
   npm run db:diff  # Check what will change
   npm run db:migrate:dev  # Apply to development
   ```

## Rollback Policy

**⚠️ Rollbacks are discouraged.** Instead:

1. **Create a forward-fix migration** that corrects the issue
2. **Test thoroughly** in development environment
3. **Apply forward-fix** to production

This maintains a clear audit trail and prevents data loss.

## Monitoring Migration Status

Visit `/admin/db/migrations` in the application to see:
- Applied migration history
- Migration checksums and execution times
- Database health status
- Quick links to run migration commands

## Safety Features

- **Idempotent SQL:** All migrations can be run multiple times safely
- **Conflict handling:** Uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`
- **Error handling:** Graceful exception handling with informative logs
- **Verification:** Each migration includes verification steps
- **RLS by default:** All new tables get Row Level Security enabled

## Troubleshooting

### Migration Failed
1. Check the error message in Supabase logs
2. Verify environment variables are correct
3. Ensure database permissions are sufficient
4. Run `npm run db:status` to check connection

### Permission Denied
1. Verify `SUPABASE_DB_URL` includes correct password
2. Check that user has necessary database privileges
3. Confirm project reference is correct

### Table Already Exists
This is normal - migrations are idempotent. The migration will skip existing objects and continue.

## Development Workflow

1. **Make schema changes** in migration files (not Supabase Studio)
2. **Test locally** with `npm run db:migrate:dev`
3. **Verify in admin panel** at `/admin/db/migrations`
4. **Commit migration files** to version control
5. **Deploy to production** using same commands

The repository is the **source of truth** for all database schema changes.