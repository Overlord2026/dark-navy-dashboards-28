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

## Post-Deploy
- [ ] Load app → banner (staging only), footer build tag everywhere
- [ ] Smoke test critical routes and auth
- [ ] Log release hash in incident doc if any issues