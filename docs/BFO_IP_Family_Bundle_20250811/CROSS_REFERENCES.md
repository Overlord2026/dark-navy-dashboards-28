# Cross-References Matrix

Shared components used across modules (✓ = uses; note in parentheses):

| Component | Multi-Persona OS | Compliance CE | Liquidity Compass | Diligence Compass | Transition Pilot | Portfolio Radar | EpochVault | Tax Navigator | Estate Navigator | Social/Ad Compliance | LinkedIn Auto-Pop | Vetting Engine | NIL OS | NIL Marketplace | NIL Auction |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Policy/ABAC engine | ✓ (UI/data guards) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Consent tokens | ✓ | ✓ |  | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |  |
| Audit ledger | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AnchorProof anchoring | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Persona/role guard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Regime classifier |  |  | ✓ |  |  | ✓ |  |  |  |  |  |  |  |  |
| LARB optimizer |  |  | ✓ |  |  | ✓ |  |  |  |  |  |  |  |  |
| Overlap detection |  |  |  | ✓ |  |  |  |  |  |  |  | ✓ |  |  |
| Evidence binder | ✓ | ✓ |  | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ |  | ✓ |  |  |

Notes
- Anchoring and audit logging leverage database functions such as public.log_security_event, public.create_audit_log, and policy_version_history triggers.
- Persona gating implemented via usePersonaSystem hook and persona services.
