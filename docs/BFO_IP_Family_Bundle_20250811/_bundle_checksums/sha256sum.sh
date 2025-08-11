#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
# Generate SHA-256 manifest for the bundle (excluding this folder)
find .. -type f ! -path "*/_bundle_checksums/*" -print0 | xargs -0 sha256sum > ./bundle.SHA256SUMS
printf "Generated: %s\n" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ./bundle.METADATA
