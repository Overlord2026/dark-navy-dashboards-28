# Claim Map — Multi-Persona OS + ZK

| Claim Element | Code Location | Summary |
|---|---|---|
| Persona OS | src/hooks/usePersonaSystem.ts; src/services/persona/* | Detection, selection, manual override |
| Policy/ABAC | Supabase fn validate_user_role_access, has_any_role | DB-enforced gating |
| ZK/VC hooks | AnchorProof layer (to be extended with VC/ZK) | Placeholder for selective disclosure |
