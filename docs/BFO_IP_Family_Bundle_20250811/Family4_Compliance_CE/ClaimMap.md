# Claim Map — Compliance & CE Monitoring

| Claim Element | Code Location | Summary |
|---|---|---|
| CE requirements | Supabase tables: accountant_ce_requirements, accountant_ce_providers | Public SELECT; curated tables |
| CE records/status | accountant_ce_records, accountant_license_status | RLS: user-owned INSERT/SELECT where applicable |
| Audit binder | Supabase: product_audit_log, security_audit_logs | Evidence assembly |
