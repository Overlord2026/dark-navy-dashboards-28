# Platform Claim Map — Multi-Persona OS

Map of claim elements to concrete code locations and artifacts.

| Claim Element | Code Location | Summary |
|---|---|---|
| Policy/ABAC engine driving UI/data access | src/hooks/usePersonaSystem.ts (detectPersona, forcePersona); src/services/persona/*; Supabase fn public.validate_user_role_access | Persona detection, role checks, and RLS-backed access control |
| Persona/role guard middleware | src/hooks/usePersonaSystem.ts; src/pages/IPProtection.tsx (admin-only DiagnosticsAccessButton) | UI gated by user role/persona |
| Consent tokens | src/services/policy/TokenService.ts | Policy token generation/validation (consent semantics) |
| Audit ledger of changes | Supabase triggers: public.create_audit_log, public.log_security_event, public.log_policy_change | DB-level audit logs for CRUD/policy changes |
| AnchorProof hooks (hash/anchor) | src/services/vetting/BlockchainAnchoringService.ts; Supabase tables (anchors/merkle_batches) [synthesized] | Artifact hashing, Merkle batching, anchoring receipts |
| Cross-module orchestration | src/services/integrations/IntegrationService.ts | Integration registry, connect/disconnect flows |
| IP portfolio and marking | src/pages/ip/VirtualPatentMarking.tsx; src/config/patent-modules.ts | Module registry, routes, events, owner info |
| RLS policies | supabase/migrations/*; Supabase functions has_any_role, is_tenant_admin | Tenant/user-scoped access rules |

Endpoints/APIs
- Supabase Edge Functions: see dashboard logs and supabase/functions/* (where applicable)
- Database RPC: public.* functions (see Supabase functions list in project)

UI components surfacing decisions/conflicts
- IPProtection page tabs (IP agreement, repository access, audit logs, revoke access)
- DiagnosticsAccessButton (admin tools)

Audit artifact builders
- Anchoring service builds rationale/artifact payloads; DB triggers record audit trails
