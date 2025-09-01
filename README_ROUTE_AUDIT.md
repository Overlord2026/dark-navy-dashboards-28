# Route Audit System

## Overview

The route audit system automatically scans the application for routes, validates their existence, and prevents 404 errors by generating brand-compliant stub pages for missing routes.

## Usage

### Running the Audit

```bash
# Run route audit locally
npm run route:audit

# Or using tsx directly
tsx scripts/route_audit.ts
```

### Output

The audit generates:
- **Console output**: Summary of routes scanned, 404s found, stubs created
- **CSV report**: `out/Route_Audit.csv` with detailed route information
- **Stub pages**: Auto-generated components for missing routes

### CSV Columns

| Column | Description |
|--------|-------------|
| `path` | Route path (e.g., `/admin/hq`) |
| `title` | Inferred page title |
| `owner` | Responsible team (Marketing, CPO, CTO) |
| `mobile_ok` | Mobile optimization status |
| `has_404` | Whether route results in 404 error |

## Features

### 1. Route Discovery
- Scans `src/App.tsx` for React Router route definitions
- Extracts path patterns and component names
- Maps routes to responsible teams based on path prefixes

### 2. Mobile Support Detection
- Heuristic analysis based on component naming
- Admin/Dashboard components flagged as desktop-first
- Most public-facing routes assumed mobile-ready

### 3. Automatic Stub Generation
- Creates `NoContentStub` components for missing routes
- Brand-compliant styling using BFO design tokens
- Includes navigation back to home and contact options

### 4. CI/CD Integration
- GitHub Actions workflow validates routes on PR
- Fails build if 404 errors detected
- Uploads audit results as artifacts

## NoContentStub Component

Generated stub pages use the `NoContentStub` component which provides:

```tsx
<NoContentStub 
  title="Page Title"
  route="/path"
  description="Optional description"
  showContactButton={true}
/>
```

Features:
- Brand-locked styling with BFO design tokens
- Construction icon and "Stubbed — Content Incoming" badge  
- Navigation options (back, home, contact)
- Responsive design
- Accessibility compliant

## Owner Assignment

Routes are automatically assigned to teams based on path prefixes:

| Path Prefix | Owner | Rationale |
|-------------|-------|-----------|
| `/admin/*` | CTO | Administrative/technical functionality |
| `/personas/*` | CPO | User experience and product features |
| `/family/*` | CPO | Core product functionality |
| `/onboarding/*` | CPO | User acquisition and experience |
| `/solutions/*`, `/pricing/*` | Marketing | Public-facing marketing content |
| `/help/*`, `/learn/*` | CPO | User education and support |

## CI/CD Workflow

The GitHub Actions workflow (`.github/workflows/route-audit.yml`) runs on:
- Push to `main` or `develop` branches
- Pull requests to `main`

Workflow steps:
1. Install dependencies and tsx
2. Run route audit script
3. Upload CSV results as artifact
4. Comment on PR with audit summary

## Configuration

### Adding Required Routes

Edit `getNavigationRoutes()` in `scripts/route_audit.ts` to add routes that must exist:

```typescript
function getNavigationRoutes(): NavRoute[] {
  return [
    { path: '/new-required-page', title: 'New Page', owner: 'CPO' },
    // ... existing routes
  ];
}
```

### Customizing Owner Assignment

Modify `inferOwner()` function to adjust team assignments:

```typescript
const ownerMap: { [key: string]: string } = {
  'new-prefix': 'Team Name',
  // ... existing mappings
};
```

## Best Practices

1. **Keep routes organized**: Group related routes under common prefixes
2. **Update navigation**: Ensure new routes are linked from relevant navigation
3. **Replace stubs promptly**: Stubs are temporary solutions - implement real content
4. **Monitor CI**: Address 404 errors immediately when detected
5. **Review ownership**: Ensure routes are assigned to appropriate teams

## Error Handling

The audit script:
- **Continues on errors**: Individual route failures don't stop the audit
- **Reports issues**: All problems logged to console with context
- **Fails CI appropriately**: Only fails build for actual 404 errors
- **Creates recovery stubs**: Generates fallback pages to prevent user-facing 404s

## Maintenance

Regular tasks:
- Review and update required routes list
- Replace stub pages with real implementations  
- Update owner assignments as team structure evolves
- Monitor mobile optimization flags and update heuristics
