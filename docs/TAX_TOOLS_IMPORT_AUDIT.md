# Tax Tools Import Audit Report

**Project**: Advanced Tax Planning Integration Prep  
**Target Source**: https://github.com/Overlord2026/neptune-react-orbit  
**Branch**: docs/tax-audit  
**Date**: 2025-09-15  

## Executive Summary

Audit of existing tax calculators and features in preparation for integrating the Neptune React Orbit advanced tax planning project. The codebase already contains a robust tax planning foundation with 12+ implemented calculators.

**Results Overview:**
- ✅ **FOUND**: 6 target calculators with full implementations
- ⚠️ **PARTIAL**: 3 calculators with basic or scattered implementations  
- ❌ **MISSING**: 2 calculators completely absent
- 📊 **ADDITIONAL**: 6+ tax tools already implemented beyond target list

## Target Calculator Audit

| Calculator | Expected Route | Status | Main Files | Notes |
|------------|---------------|---------|------------|-------|
| **roth-conversion** | `/tax/roth-conversion` | ✅ FOUND | `src/components/tax-planning/RothConversionAnalyzer.tsx` | Full implementation with multi-year projections, IRS compliance |
| **appreciated-stock** | `/tax/appreciated-stock` | ⚠️ PARTIAL | `src/pages/wealth/premium/AppreciatedStock.tsx` | Premium placeholder only, no calculator logic |
| **qsbs** | `/tax/qsbs` | ❌ MISSING | - | Only mentioned in investment descriptions |
| **nua** | `/tax/nua` | ✅ FOUND | `src/components/tax-planning/NUAAnalyzer.tsx` | Comprehensive NUA calculator with employer stock analysis |
| **loss-harvest** | `/tax/loss-harvest` | ⚠️ SCATTERED | Multiple scenario/advisor tool files | Features exist but no dedicated calculator |
| **basis-planning** | `/tax/basis-planning` | ❌ MISSING | - | No dedicated basis planning calculator found |
| **charitable-gift** | `/tax/charitable-gift` | ⚠️ PARTIAL | `src/components/calculators/TaxPlanningModal.tsx` | Basic calculator in modal, not standalone |
| **donor-advised-fund** | `/tax/donor-advised` | ❌ MISSING | - | Mentioned in features but no calculator |

## Additional Tax Tools Discovered

| Calculator | Current Route | Files | Status |
|------------|---------------|-------|--------|
| **tax-bracket-projector** | `/tax/brackets` | `src/components/tax-planning/TaxBracketProjector.tsx` | ✅ FOUND |
| **multi-year-projector** | `/tax/multi-year` | `src/components/tax-planning/MultiYearTaxProjector.tsx` | ✅ FOUND |
| **withdrawal-sequencing** | `/tax/withdrawal` | `src/components/tax-planning/WithdrawalSequencingSimulator.tsx` | ✅ FOUND |
| **qcd-planner** | `/tax/qcd` | `src/components/tax-planning/QCDPlanner.tsx` | ✅ FOUND |
| **tax-readiness** | `/tax/readiness` | `src/components/tax-planning/TaxReadinessAssessment.tsx` | ✅ FOUND |
| **unified-analyzer** | `/tax/analyzer` | `src/components/tax-planning/UnifiedTaxAnalyzer.tsx` | ✅ FOUND |

## Current Tax Module Structure

### Primary Locations
- **Tax Planning Components**: `src/components/tax-planning/` (20+ components)
- **Tax Pages**: `src/pages/TaxPlanning.tsx`, `TaxRulesAdminPage.tsx`, `TaxPlatformQAPage.tsx`
- **Premium Placeholders**: `src/pages/wealth/premium/` (structure exists)
- **Calculator Modals**: `src/components/calculators/`

### Existing Routes
- `/tools/tax` - Main tax tools page
- `/solutions/tax` - Tax solutions overview
- `/family/tools/taxhub-preview` - Family tax hub preview
- `/calculators` - General calculator page with tax tools

### Notable Files
- `src/lib/401k/` - 401k and retirement tax planning utilities
- `src/lib/scorecard/` - Tax-aware retirement scoring system
- `src/features/calculators/` - Calculator framework and catalog

## Integration Recommendations

### Next Steps

1. **Namespace Consolidation**
   - Create unified `/tax/*` route structure
   - Consolidate scattered tax routes under single namespace
   - Implement route-based code splitting for performance

2. **Module Architecture**
   - Add `@tax/*` alias → `packages/tax-tools/src/*` (preferred)
   - Alternative: `@tax/*` → `src/features/tax/*`
   - Extract shared tax utilities into dedicated module

3. **Missing Calculator Implementation**
   - **Priority 1**: QSBS calculator (high-value feature)
   - **Priority 2**: Basis planning calculator 
   - **Priority 3**: Donor-advised fund calculator

4. **Upgrade Partial Implementations**
   - Convert appreciated-stock from placeholder to full calculator
   - Consolidate loss-harvest features into dedicated calculator
   - Enhance charitable-gift calculator with standalone version

5. **Route Skeleton Structure**
   ```
   /tax/
   ├── roth-conversion     ✅ Ready
   ├── nua                 ✅ Ready  
   ├── brackets            ✅ Ready
   ├── multi-year          ✅ Ready
   ├── withdrawal          ✅ Ready
   ├── qcd                 ✅ Ready
   ├── readiness           ✅ Ready
   ├── analyzer            ✅ Ready
   ├── appreciated-stock   ⚠️ TODO: Upgrade
   ├── loss-harvest        ⚠️ TODO: Consolidate
   ├── charitable-gift     ⚠️ TODO: Enhance
   ├── qsbs                ❌ TODO: Create
   ├── basis-planning      ❌ TODO: Create
   └── donor-advised       ❌ TODO: Create
   ```

## Import Strategy

### Phase 1: Foundation (Current State)
- ✅ Tax planning framework exists
- ✅ 6+ fully functional calculators
- ✅ Routing infrastructure in place

### Phase 2: Enhancement (Neptune Integration)
- Import missing calculator components from Neptune React Orbit
- Upgrade partial implementations with Neptune logic
- Standardize tax calculation utilities

### Phase 3: Consolidation
- Unify tax routes under `/tax/*` namespace
- Implement shared tax calculation library
- Add comprehensive test coverage

## Technical Notes

- **Framework**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI components
- **State**: Zustand for tax calculation state
- **Routing**: React Router v6
- **Tax Logic**: Custom utilities in `src/lib/` directories

## Risk Assessment

**Low Risk**: Integration should be straightforward given existing tax planning infrastructure

**Considerations**:
- Route conflicts with existing `/tools/tax` routes
- Component naming conflicts
- State management integration
- Design system consistency (ensure Neptune components match current Tailwind theme)

---

**Audit completed**: 2025-09-15  
**Status**: Ready for Neptune React Orbit integration  
**Next Action**: Create tax-tools module structure and begin component migration