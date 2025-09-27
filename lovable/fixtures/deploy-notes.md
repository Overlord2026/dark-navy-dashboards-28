# Deploy Notes (Lovable)

## Staging
Run in terminal:
```bash
bash scripts/release.sh staging
```
Then deploy the `dist/` folder to your staging environment.

## Production
Run in terminal:
```bash
bash scripts/release.sh prod
```
Then deploy the `dist/` folder to your production environment.

## Verification
After deploy:
1. **Staging**: Should show yellow banner with app name + build ID
2. **Production**: No banner, just build tag in footer
3. **Admin Routes**: Accessible in staging, redirect to home in prod
4. **Dev Panel**: Visible in staging, hidden in prod

## Build ID Format
`{git-hash}-{UTC-timestamp}` - enables precise tracking and rollback identification.