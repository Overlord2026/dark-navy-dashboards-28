# Information Architecture - Target (IA_V2)

## New Navigation Structure

### Primary Navigation Groups

#### 1. Families Hub
Central hub for all family-oriented services and tools.

**Main Route**: `/families`
- `/families` - Families hub landing page
- `/families/dashboard` - Unified family dashboard (was `/families/home`)
- `/families/wealth` - Wealth management tools
- `/families/planning` - Financial and estate planning
- `/families/education` - Family education resources
- `/families/marketplace` - Find professionals

**Legacy Redirects**:
- `/families/home` → `/families/dashboard`
- `/families/index` → `/families`

#### 2. Service Pros Suite
Unified professional workspace for all service providers.

**Main Route**: `/pros`
- `/pros` - Service pros hub landing page
- `/pros/dashboard` - Unified professional dashboard
- `/pros/clients` - Client management
- `/pros/leads` - Lead management
- `/pros/meetings` - Meeting management
- `/pros/tools` - Professional tools
- `/pros/marketplace` - Professional networking

**Specialization Routes** (within pros suite):
- `/pros/advisors` - Advisor-specific features
- `/pros/cpas` - CPA-specific features  
- `/pros/attorneys` - Attorney-specific features
- `/pros/insurance` - Insurance-specific features
- `/pros/healthcare` - Healthcare-specific features

**Legacy Redirects**:
- `/advisors/*` → `/pros/advisors/*`
- `/cpa` → `/pros/cpas`
- `/attorney` → `/pros/attorneys`
- `/insurance` → `/pros/insurance`
- `/healthcare` → `/pros/healthcare`
- `/marketplace/advisors` → `/pros/marketplace?type=advisors`
- `/marketplace/cpas` → `/pros/marketplace?type=cpas`
- `/marketplace/attorneys` → `/pros/marketplace?type=attorneys`

#### 3. NIL Platform
Standalone platform for Name, Image, Likeness services.

**Main Route**: `/nil` (unchanged)
- Maintains existing structure
- No breaking changes

#### 4. Solutions Marketplace
Unified marketplace for all financial solutions and products.

**Main Route**: `/solutions` (enhanced)
- `/solutions` - Solutions marketplace hub
- `/solutions/browse` - Browse all solutions
- `/solutions/compare` - Compare solutions
- `/solutions/recommended` - Personalized recommendations

### Benefits of New IA

#### For Families
1. **Single Entry Point**: One place to access all family services
2. **Clear Progression**: Dashboard → Planning → Education → Marketplace
3. **Unified Experience**: Consistent navigation and terminology
4. **Better Discovery**: Easier to find relevant professionals and tools

#### For Professionals
1. **Unified Workspace**: All professional tools under `/pros`
2. **Specialization Support**: Specialized features while maintaining consistency
3. **Cross-Referral**: Easy to discover other professional types
4. **Simplified Onboarding**: One path for all professional types

#### For Platform
1. **Scalability**: Easy to add new professional types
2. **Consistency**: Uniform patterns across all user types
3. **Analytics**: Clearer user journey tracking
4. **Maintenance**: Reduced routing complexity

### Migration Strategy
1. **Phase 1**: Implement redirects for all legacy routes
2. **Phase 2**: Update internal links to use new routes
3. **Phase 3**: Update external documentation and bookmarks
4. **Phase 4**: Remove legacy route support (after 6 months)

### SEO Considerations
- All redirects are 301 (permanent) to preserve search rankings
- Maintain breadcrumb structure for deep pages
- Update sitemap.xml with new structure
- Update Google Search Console property settings