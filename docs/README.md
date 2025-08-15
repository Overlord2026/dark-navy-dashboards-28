# BFO Platform Documentation

## Lead-to-Sales Closure Module
- [QA Testing Guide](qa/tests/lead-to-close-ux.md) - 25 comprehensive test cases

## Twilio Integration Audit
- [Feature Inventory](twilio/FEATURE_INVENTORY.md) - Complete capability overview
- [File Map](twilio/FILE_MAP.json) - All Twilio-related files
- [Webhooks Guide](twilio/WEBHOOKS.md) - Security and testing
- [Environment Setup](twilio/ENV_SAMPLE.md) - Configuration guide

## Quick Links
- **Preview Routes**: `/crm`, `/admin/insights/win-loss`, `/settings/automation`
- **Test Coverage**: Desktop + Mobile across 25 test scenarios
- **Twilio Edge Functions**: 7 production-ready functions with webhooks
- **New Analytics Events**: 6 events for lead-to-close tracking

## Secrets & Vault
Vault is optional; this service uses **Edge Function env vars only**.
Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
Optional: BRIDGEFT_BASE_URL, BRIDGEFT_API_KEY, AKOYA_API_KEY, PLAID_CLIENT_ID, PLAID_SECRET,
CANOE_API_KEY/ICAPITAL_API_KEY, DOCUSIGN_* , REPORTS_BUCKET (default 'reports').

Security: No secrets in Postgres. Evidence uses public.sha256_hex(); raw payloads never exposed.