#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-staging}" # staging | prod
HASH="$(git rev-parse --short HEAD)"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
export BUILD_ID="${HASH}-${STAMP}"

# Vite public flags
export VITE_PUBLIC_MODE="${MODE}"
if [[ "${MODE}" == "prod" ]]; then
  export VITE_ENABLE_DEV_PANEL=0
  export VITE_ENABLE_EXPERIMENTS=0
else
  export VITE_ENABLE_DEV_PANEL=1
  export VITE_ENABLE_EXPERIMENTS=0
fi

echo "==> Releasing ${MODE} with BUILD_ID=${BUILD_ID}"
npm ci
npm run build
node scripts/patchlog.mjs "${MODE}" "${BUILD_ID}"

echo
echo "DONE. BUILD_ID=${BUILD_ID}"
echo "See ops/release/PATCHLOG.md"