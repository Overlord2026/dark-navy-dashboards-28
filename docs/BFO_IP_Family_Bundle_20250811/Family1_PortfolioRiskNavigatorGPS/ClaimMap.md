# Claim Map — Portfolio Risk Navigator GPS

| Claim Element | Code Location | Summary |
|---|---|---|
| Phase-aware optimizer hooks | src/config/patent-modules.ts (P3 Phase-Based Portfolio Optimization) | Declares routes/events for optimizer |
| Persona/role guard | src/hooks/usePersonaSystem.ts | Persona gates analytics & UI |
| Audit anchoring | 00_Platform/Figures/FIG4_Audit_Anchoring.mmd | Anchoring flow for outputs |

Schema and RLS
- See schema/schema.sql and schema/rls_policies.sql (synthesized from Supabase tables: advisor_proposals, advisor_performance_metrics, analytics_events)
