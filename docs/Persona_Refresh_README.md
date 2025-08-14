# Persona System + Trust Scoring Refresh

## What Changed

✅ **Database Migration**: Trust scoring pipeline with monitoring_jobs, trust_scores tables and v_professional_latest_trust view
✅ **TypeScript Types**: Comprehensive persona type system in `src/types/persona.ts`  
✅ **Navigation System**: Unified BFOHeader with mega menu and persona-aware sub-banner
✅ **Persona Links**: Updated `usePersonaSublinks` hook with healthcare sub-tracks and realtor support
✅ **Trust UI**: TrustScoreBadge component for professional dashboards
✅ **Inventory System**: API endpoint and export script for system auditing

## New Persona Taxonomy

**Families**: family_aspiring, family_younger, family_wealthy, family_executive, family_retiree, family_business_owner

**Professionals**: 
- Core: pro_advisor, pro_cpa, pro_attorney, pro_insurance, pro_bank_trust
- Healthcare: pro_healthcare_influencer, pro_healthcare_clinic, pro_healthcare_navigator, pro_pharmacy  
- Real Estate: pro_realtor

## Testing Instructions

### Database Functions
```sql
-- Test trust recompute
SELECT public.enqueue_trust_recompute(
  (SELECT id FROM public.tenants LIMIT 1), 
  gen_random_uuid()
);

-- Check trust scores view
SELECT * FROM public.v_professional_latest_trust LIMIT 5;
```

### Frontend Testing
1. **Header Navigation**: Check mega menu shows healthcare sub-tracks and realtors
2. **Persona Sub-banner**: Switch personas to see different quick links
3. **Trust Badge**: Add `<TrustScoreBadge trustScore={...} />` to professional dashboards
4. **Inventory**: Visit `/api/inventory` (if implemented) or use `getInventory()` function

### Export Inventory
```bash
INVENTORY_BASE_URL=http://localhost:3000 node scripts/export-inventory.ts
```

## Integration Status

- ✅ Trust scoring backend pipeline implemented
- ✅ Persona type system unified and extended  
- ✅ Navigation mega menu with healthcare/realtor sections
- ✅ Sub-banner for persona-specific quick links
- ⚠️ Route stubs needed for healthcare/realtor workflows
- ⚠️ Trust job scheduler needs implementation (cron/edge function)

## Next Steps

1. Create route stubs for missing healthcare/realtor paths
2. Implement trust score job scheduler 
3. Add persona switching instrumentation
4. Seed production database with persona data
5. Configure trust recompute scheduling

## Files Modified

- `src/types/persona.ts` - Comprehensive persona types
- `src/config/persona-links.ts` - Navigation configuration  
- `src/hooks/usePersonaSublinks.ts` - Updated persona link hook
- `src/components/site/BFOHeader.tsx` - Unified header with mega menu
- `src/components/trust/TrustScoreBadge.tsx` - Trust tier display
- Database: trust_scores, monitoring_jobs tables + functions