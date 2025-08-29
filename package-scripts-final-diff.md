# Package.json Scripts Required

Since package.json is read-only, add these scripts manually:

```json
{
  "scripts": {
    "db:migrate:dev": "supabase db push --project-ref $SUPABASE_PROJECT_REF --db-url $SUPABASE_DB_URL",
    "db:diff": "supabase db diff --linked"
  }
}
```

## Environment Variables
```bash
export SUPABASE_PROJECT_REF=xcmqjkvyvuhoslbzmlgi  
export SUPABASE_DB_URL="postgres://postgres:[SERVICE_PW]@db.xcmqjkvyvuhoslbzmlgi.supabase.co:5432/postgres"
```

Replace `[SERVICE_PW]` with your service role password from Supabase Dashboard.