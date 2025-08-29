# Package.json Scripts Diff

Since package.json is read-only, here are the required script additions:

## Current scripts section:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Required additions:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview",
    "db:migrate:dev": "supabase db push --project-ref $SUPABASE_PROJECT_REF --db-url $SUPABASE_DB_URL",
    "db:diff": "supabase db diff --linked"
  }
}
```

## Environment Variables Needed:
```bash
export SUPABASE_PROJECT_REF=xcmqjkvyvuhoslbzmlgi
export SUPABASE_DB_URL=postgres://postgres:[SERVICE_PW]@db.xcmqjkvyvuhoslbzmlgi.supabase.co:5432/postgres
```

Replace `[SERVICE_PW]` with your actual service role password from Supabase Dashboard.