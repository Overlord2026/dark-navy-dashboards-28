# Security Verification Report
Generated: 2025-08-17T03:55:00Z

## Summary Statistics

| Category | Count | Status |
|----------|-------|---------|
| **RLS OFF Tables** | 0 | ✅ GOOD |
| **RLS ON without Policies** | 42 | ⚠️ WARNING |
| **Security Definer Functions** | 173 | ℹ️ INFO |
| **Installed Extensions** | 2 | ✅ GOOD |
| **Storage Buckets** | 15 | ✅ SECURED |

## Detailed Findings

### 1. RLS OFF Tables (0)
**Status: ✅ EXCELLENT** - All tables have RLS enabled

### 2. RLS ON without Policies (42)
**Status: ⚠️ REQUIRES ATTENTION**

Tables with RLS enabled but no policies:
- accountant_ce_alerts
- analytics_scorecard_events
- api_integration_configs
- attorney_cle_alerts
- call_routing
- ce_completions
- compliance_checks
- draft_proposals
- email_sequences
- estate_filings
- estate_notaries
- estate_requests
- estate_sessions
- estate_witnesses
- firm_billing
- firm_handoffs
- firm_invitations
- fund_holdings_lookup
- ip_rules
- kyc_verifications
- liquidity_events
- phishing_simulations
- product_documents
- professional_seat_audit
- proposal_overrides
- ref_currencies
- retirement_confidence_submissions
- ria_state_comms
- roadmap_intake_sessions
- rollup_analytics
- security_review_completions
- security_training_completions
- tenant_hierarchies
- twilio_phone_numbers
- ui_layout_components
- vip_admin_activity_log
- vip_batch_imports
- vip_invitation_tracking
- vip_outreach_log
- vip_referral_networks
- voicemails
- xr_attestations

### 3. Security Definer Functions (173)
**Status: ℹ️ INFORMATIONAL** - System has many privileged functions

Key functions include:
- Authentication helpers (has_role, get_current_user_role, etc.)
- Audit logging functions
- Security validation functions
- Business logic functions

### 4. Installed Extensions (2)
**Status: ✅ GOOD** - Safe extensions only
- pg_net (public schema)
- pg_trgm (public schema)

### 5. Storage Bucket Policies (15 buckets)

| Bucket | Policies | Status |
|--------|----------|---------|
| attorney-documents | 4 | ✅ |
| client-documents | 1 | ✅ |
| compliance-filings | 3 | ✅ |
| documents | 4 | ✅ |
| education-content | 3 | ✅ |
| education-files | 3 | ✅ |
| healthcare-documents | 8 | ✅ |
| legacy-vault | 2 | ✅ |
| lending-documents | 2 | ✅ |
| meeting-recordings | 2 | ✅ |
| onboarding-docs | 2 | ✅ |
| plan-imports | 1 | ✅ |
| project-documents | 3 | ✅ |
| proposals | 0 | ⚠️ |
| reports | 6 | ✅ |

**Storage Issues:**
- `proposals` bucket has no policies (needs attention)

## Recommendations

### High Priority
1. Add RLS policies for 42 tables missing policies
2. Secure `proposals` storage bucket with appropriate policies

### Medium Priority
1. Review Security Definer functions for necessity
2. Audit function security implementations

### Security Score: 8/10
- Excellent RLS coverage (100% enabled)
- Good extension security (only safe extensions)
- Strong storage security (14/15 buckets secured)
- Need policies for unprotected tables