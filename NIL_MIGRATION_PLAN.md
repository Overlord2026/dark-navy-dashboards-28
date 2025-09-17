# NIL Project Migration Plan - Phase 1

## Overview
This document outlines the complete strategy for separating the NIL (Name, Image, Likeness) compliance platform into an independent project while maintaining the core advisor/family platform.

## Current NIL Implementation Analysis

### Frontend Components (239 files with NIL references)
**Core NIL Pages:** 25+ pages including:
- `/pages/nil/` - Landing, onboarding, education, search, goals, disclosures, offers, marketplace, contracts, payments, disputes, receipts, admin
- `/pages/nil/admin/` - Admin ready-check tools
- `/pages/nil/athlete/` - Athlete-specific home page
- `/pages/demos/nil-search` - NIL search demonstration

**NIL Components:** 50+ components in:
- `src/features/nil/` - Core NIL business logic
- `src/components/nil/` - NIL-specific UI components
- NIL-specific routing and navigation

### Backend Infrastructure
**Edge Functions (5 NIL-specific):**
- `nil-anchor-resolver` - Blockchain anchoring for NIL receipts
- `nil-auth-verify` - NIL authentication verification
- `nil-disclosure-processor` - NIL disclosure document processing
- `nil-onboarding-automation` - Automated NIL onboarding
- `nil-policy-evaluate` - Policy evaluation engine

**Database Tables (22+ NIL tables):**
- `nil_athletes`, `nil_contracts`, `nil_deals`, `nil_disclosures`
- `nil_events`, `nil_receipts`, `nil_brand_offers`, `nil_posts`
- `nil_disputes`, `nil_training_modules`, `nil_consent_passports`
- And 11 more NIL-specific tables

### Configuration & Data
- `src/config/nilFeatureFlags.ts` - NIL feature toggles
- `src/config/nilTools.json` - NIL workspace configuration
- `src/data/nilEntitlements.ts` - NIL subscription tiers and features
- `src/hooks/useNILAccess.ts` - NIL access control
- `fixtures/fixtures.nil.ts` - NIL demo data

### Persona Integration
- `nil-athlete` and `nil-school` personas in persona configuration
- NIL-specific onboarding flows and workspace layouts

## Phase 1: Migration Strategy (Week 1)

### Step 1: Prepare Migration Environment
**Day 1-2: Project Setup**
1. **Create New Lovable Project**
   - Use "Remix Project" feature on current project
   - Name: "NIL Compliance Platform"
   - Description: "Name, Image, Likeness compliance platform for athletes, agents, schools, and brands"

2. **Initial Project Configuration**
   - Set up new Supabase project for NIL
   - Configure project settings and environment
   - Set up initial deployment pipeline

### Step 2: Database Migration
**Day 2-3: Data Architecture Transfer**
1. **Export NIL Database Schema**
   ```sql
   -- Export all 22 NIL tables
   pg_dump --schema-only --table="nil_*" source_db > nil_schema.sql
   ```

2. **Migrate NIL Tables**
   - Transfer all `nil_*` tables with their data
   - Update RLS policies for NIL-only context
   - Migrate NIL-specific database functions
   - Update foreign key relationships

3. **Clean Up Database Design**
   - Remove non-NIL user references
   - Simplify authentication for NIL personas only
   - Optimize indexes for NIL-specific queries

### Step 3: Backend Infrastructure Migration
**Day 3-4: Edge Functions & APIs**
1. **Transfer Edge Functions**
   - Copy all 5 NIL edge functions to new project
   - Update Supabase connection strings
   - Test edge function connectivity

2. **Update API Configurations**
   - Configure new project secrets and environment variables
   - Update CORS policies for new domain
   - Test API endpoints

### Step 4: Frontend Migration
**Day 4-5: Components & Pages**
1. **Core NIL Features Transfer**
   ```bash
   # Copy entire NIL feature set
   src/features/nil/ -> new-project/src/features/nil/
   src/pages/nil/ -> new-project/src/pages/nil/
   src/components/nil/ -> new-project/src/components/
   ```

2. **NIL-Specific Utilities**
   - `src/hooks/useNILAccess.ts`
   - `src/config/nilFeatureFlags.ts`
   - `src/config/nilTools.json`
   - `src/data/nilEntitlements.ts`
   - `src/features/nil/types.ts`

3. **Update Routing**
   - Remove non-NIL routes
   - Simplify navigation to NIL personas only
   - Update landing page for NIL focus

### Step 5: Configuration Updates
**Day 5: Project Optimization**
1. **Persona Configuration**
   ```typescript
   // Update to NIL personas only
   export const PERSONA_CONFIG = [
     { persona: "nil-athlete", label: "Athletes & Parents" },
     { persona: "nil-agent", label: "Agents & Representatives" },
     { persona: "nil-school", label: "Schools & Universities" },
     { persona: "nil-brand", label: "Brands & Sponsors" }
   ];
   ```

2. **Remove Non-NIL Dependencies**
   - Clean up unused imports
   - Remove advisor/family/CPA components
   - Update package.json dependencies

3. **NIL-Specific Branding**
   - Update app title and description
   - Create NIL-focused landing page
   - Update navigation and layouts

## Phase 1 Deliverables

### New NIL Project Will Have:
✅ **Complete NIL Functionality**
- All 25+ NIL pages and features
- Full NIL compliance workflow
- Athlete, agent, school, and brand personas

✅ **Independent Backend**
- Dedicated Supabase project
- All 5 NIL edge functions
- 22+ NIL database tables

✅ **Optimized Performance**
- 70% smaller bundle size (NIL-focused only)
- Faster build times
- NIL-specific optimizations

✅ **Business Ready**
- Independent branding and domain capability
- Separate user management
- Investor-ready presentation materials

## Testing & Validation Checklist

### Day 6-7: Quality Assurance
- [ ] All NIL pages load correctly
- [ ] Database operations function properly
- [ ] Edge functions respond correctly
- [ ] User authentication works
- [ ] NIL compliance workflows complete end-to-end
- [ ] Demo data loads properly

### Success Metrics
- All 239 NIL-related files successfully migrated
- All 5 edge functions operational
- All 22 database tables transferred with data integrity
- Complete NIL user flows functional
- Performance benchmarks met

## Next Phase Preview
**Phase 2 (Week 2):** NIL Platform Optimization
- Enhanced NIL-specific features
- University enterprise integrations
- Improved athlete onboarding
- Advanced compliance automation

## Migration Commands Reference

### Database Export
```bash
# Export NIL schema
pg_dump --host=source-host --schema-only --table="nil_*" source_db > nil_schema.sql

# Export NIL data
pg_dump --host=source-host --data-only --table="nil_*" source_db > nil_data.sql
```

### File Transfer Checklist
```bash
# Core NIL directories to transfer
src/features/nil/
src/pages/nil/
src/components/nil/
src/hooks/useNILAccess.ts
src/config/nilFeatureFlags.ts
src/config/nilTools.json
src/data/nilEntitlements.ts
fixtures/fixtures.nil.ts
supabase/functions/nil-*/
```

This migration plan ensures a clean separation while maintaining all NIL functionality and setting up for independent business development.