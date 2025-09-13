# Families Tool Map

## Landing Paths Used

From hubs → where user actually lands:

- **Index**: `/families` → `src/pages/families/index.tsx` → FamiliesPage
- **Aspiring**: `/families/aspiring` → FamilyAspiringPersonaDashboard
- **Retirees**: `/families/retirees` → FamilyRetireePersonaDashboard  
- **Type Dashboard**: `/families/:type` → FamilyTypeDashboard
- **Family Home**: `/family/home` → FamilyDashboard

## Tool Coverage Table

| Tool | Path | Component File | Data Source | Notable Props/Flags |
|------|------|---------------|-------------|-------------------|
| Wealth Vault | `/family/vault/autofill-consent` | `src/pages/personas/FamilyAspiringPersonaDashboard.tsx` | Live | category: 'Organization' |
| Retirement Roadmap | `/family/tools/retirement` | `src/pages/personas/FamilyAspiringPersonaDashboard.tsx` | Live | category: 'Planning' |
| Lending Solutions | `/solutions/lending` | `src/pages/personas/FamilyAspiringPersonaDashboard.tsx` | Live | category: 'Lending' |
| Insurance Catalog | `/solutions/insurance` | `src/pages/personas/FamilyAspiringPersonaDashboard.tsx` | Live | category: 'Protection' |
| Investment Hub | `/solutions/investments` | `src/pages/personas/FamilyAspiringPersonaDashboard.tsx` | Live | category: 'Investing' |
| Family Home | `/families/home` | `src/pages/families/FamilyHome.tsx` | Live | Main family dashboard |
| Family Tools Hub | `/family/tools` | `src/pages/family/FamilyToolsHub.tsx` | Live | Tool launcher page |
| Roth Ladder Tool | `/family/tools/roth-ladder` | `src/pages/family/RothLadderTool.tsx` | Live | Retirement planning |
| RMD Check Tool | `/family/tools/rmd-check` | `src/pages/family/RMDCheckTool.tsx` | Live | Required distributions |
| Tax Hub Preview | `/family/tools/taxhub-preview` | `src/pages/family/TaxHubPreview.tsx` | Live | Tax planning |
| Family Receipts | `/family/receipts` | `src/pages/family/FamilyReceipts.tsx` | Live | Document management |
| Family Assets | `/family/assets` | `src/pages/family/AssetsPage.tsx` | Live | Asset tracking |
| Asset Detail | `/family/assets/:id` | `src/pages/family/AssetDetailPage.tsx` | Live | Individual asset view |
| Family Roadmap | `/family/roadmap` | `src/pages/family/FamilyRoadmap.tsx` | Live | Planning overview |
| Retiree Goals | `/families/retirees/goals` | `src/pages/families/RetireeGoals.tsx` | Live | Goal setting for retirees |

## Entry Points

**Buttons/Links that reach each tool:**

1. **Navigation Bar**: PersonaNavBar families menu
   - File: `src/components/navigation/PersonaNavBar.tsx`
   - Links to family segments: `/families/retirees`, `/families/aspiring`

2. **Top Nav Dropdown**: Family segment selection
   - File: `src/components/layout/TopNav.tsx`
   - Paths: `/families/retirees`, `/families/aspiring`

3. **MegaMenu V2**: Family categories
   - File: `src/components/nav/MegaMenuV2.tsx`
   - Links: dashboard, wealth, planning, education, marketplace

4. **Persona Cards**: Tool grid in persona dashboards
   - File: `src/pages/personas/FamilyAspiringPersonaDashboard.tsx`
   - Cards with icons, descriptions, and categories

5. **Family Segments Config**: Programmatic navigation
   - File: `src/data/familySegments.ts`
   - FAMILY_SEGMENTS array with slugs and descriptions

## Working Assumptions

**What the page expects:**

- **Query params**: 
  - `:type` param for FamilyTypeDashboard
  - `:id` param for AssetDetailPage
- **Auth state**: 
  - User authentication required for most family routes
  - Family persona context expected
- **Context**:
  - User profile with family-specific settings
  - Family segment selection (aspiring, retirees, etc.)
- **Routing**: 
  - Lazy loading for family components
  - Nested routing structure under `/families` and `/family`

## Gaps / 404s / TODOs

**Evidence found:**

1. **Inconsistent Route Patterns**
   - `/families/*` vs `/family/*` naming inconsistency
   - `/families/home` vs `/family/home` both exist
   - Path: `src/App.tsx:746-747`

2. **Missing FamiliesPage Component**
   - Referenced: `src/pages/families/index.tsx:2` - `import FamiliesPage from '@/pages/FamiliesPage';`
   - FamiliesIndex wraps FamiliesPage but component location unclear

3. **Cross-Persona Tool Access**
   - Family tools link to `/solutions/*` paths
   - May be shared with other personas without clear boundaries
   - Potential confusion in tool ownership

4. **Segment Type Validation**
   - FamilyTypeDashboard accepts `:type` param
   - No validation against FAMILY_SEGMENTS slugs found
   - Path: `src/App.tsx:387`

5. **Voice Integration Questions**
   - VoiceMic component in FamilyAspiringPersonaDashboard
   - File: `src/pages/personas/FamilyAspiringPersonaDashboard.tsx:6`
   - transcript/summary state suggests voice features

6. **Navigation Menu Complexity**
   - Multiple overlapping navigation systems
   - MegaMenu, PersonaNavBar, TopNav all handle family routes
   - Potential for inconsistent navigation experience

7. **Asset Management Routes**
   - Asset detail page expects `:id` param
   - No validation or error handling visible for invalid IDs
   - Path: `src/App.tsx:700`

8. **Family Segment Configuration**
   - FAMILY_SEGMENTS data vs actual route implementation
   - File: `src/data/familySegments.ts` vs personas config
   - Multiple sources of truth for family types