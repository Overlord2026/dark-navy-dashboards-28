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

# Audit logging
echo "========================================="
echo "RELEASE PREFLIGHT"
echo "========================================="
echo "Build ID: ${BUILD_ID}"
echo "Mode: ${MODE}"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "========================================="
echo

echo "==> Running npm ci..."
npm ci

echo "==> Building ${MODE}..."
npm run build

echo "==> Updating patchlog..."
node scripts/patchlog.mjs "${MODE}" "${BUILD_ID}"

# Optional health check (if HEALTH_URL is set)
if [ -n "${HEALTH_URL:-}" ]; then
  echo
  echo "==> Health check: ${HEALTH_URL}"
  RESP="$(curl -fsS "${HEALTH_URL}" 2>&1 || echo "FAILED")"
  
  if [[ "${RESP}" == ok* ]]; then
    echo "✓ Health check passed: ${RESP}"
  else
    echo "✗ Health check FAILED" >&2
    echo "  Expected: ok <BUILD_ID>" >&2
    echo "  Got: ${RESP}" >&2
    exit 1
  fi
fi

echo
echo "========================================="
echo "✓ RELEASE COMPLETE"
echo "========================================="
echo "BUILD_ID: ${BUILD_ID}"
echo "MODE: ${MODE}"
echo "Patchlog: ops/release/PATCHLOG.md"
echo "========================================="