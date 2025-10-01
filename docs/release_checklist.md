# Release Checklist

## Preflight
- [ ] `npm ci` passes
- [ ] Lint & typecheck pass
- [ ] `VITE_PUBLIC_MODE` set correctly (staging|prod)
- [ ] Non-prod banner visible in staging (shows App Name + BUILD_ID)
- [ ] Dev Panel hidden in prod (visible in staging when ENABLE_DEV_PANEL=1)
- [ ] /admin and /qa blocked in prod; accessible in staging

## Build & Tag
- [ ] Run `bash scripts/release.sh staging` (or `prod`)
- [ ] Verify `ops/release/PATCHLOG.md` appended with correct BUILD_ID and commit
- [ ] Deploy artifact to hosting per Lovable notes

## Automated Checks
- [ ] `./scripts/release.sh` prints BUILD_ID + PUBLIC_MODE and exits 0
- [ ] `curl -fsS https://<your-staging-domain>/healthz` returns `ok <BUILD_ID>`

## Manual Checks (/_smoke)
Open `/_smoke` and verify:
- [ ] PUBLIC_MODE & BUILD_ID are present and correct
- [ ] /healthz status shows **ok** (green)
- [ ] NonProd banner shows Health: ok (green dot) in staging
- [ ] "Trigger Toast" displays a Sonner toast notification
- [ ] "Go to Pricing (Families)" opens **/pricing#families** with Families section visible
- [ ] "Home" shows **Hero → Catalog → Pricing** in correct order
- [ ] Header/links spaced correctly on mobile and desktop

## Functional Spot Checks
- [ ] `/wealth/retirement`: SWAG™ ScenarioBar runs and saves a scenario
- [ ] `/estate/planner`: Save Progress works; Request Attorney Review inserts record
- [ ] `/estate/ron`: Schedule RON appointment (toast confirmation)
- [ ] `/projects`: Create project, select handoff template → tasks persist; status updates persist

## Post-Deploy
- [ ] Load app → banner (staging only), footer build tag everywhere
- [ ] Smoke test critical routes and auth
- [ ] Log release hash in incident doc if any issues

## Publish
1. Confirm all checks above ✅
2. Tag release in `ops/release/PATCHLOG.md` with current `BUILD_ID`
3. Publish to **my.bfocfo.com** (or production domain)

## Rollback
- Revert to previous `BUILD_ID` (keep last two noted in PATCHLOG.md)
- Re-run "Automated checks" and "/_smoke" before reopening traffic
- Update PATCHLOG.md with rollback entry
