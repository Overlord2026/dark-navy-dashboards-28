# Information Architecture - Current Baseline

## Current Navigation Structure

### Primary Navigation (MegaMenu)
- **Families**: Landing page and general family services
- **Pros**: Professional services for advisors, CPAs, attorneys
- **NIL**: Name, Image, Likeness platform for athletes
- **Healthcare**: Healthcare-focused services and tools
- **Solutions**: Financial products and services marketplace
- **Learn**: Educational resources and content

### Current Route Patterns

#### Family Routes
- `/families` - Families landing page
- `/families/index` - Family persona index
- `/families/home` - Family dashboard (authenticated)
- `/families/start` - Family onboarding
- `/families/retirees` - Retiree-specific dashboard
- `/families/aspiring` - Aspiring wealth dashboard

#### Professional Routes
- `/pros` - Pros landing page
- `/pros/index` - Professional persona index
- `/advisors` - Advisor workspace
- `/advisors/home` - Advisor dashboard
- `/advisors/leads` - Lead management
- `/advisors/meetings` - Meeting management
- `/advisors/campaigns` - Campaign management
- `/advisors/pipeline` - Sales pipeline
- `/advisors/tools` - Advisor tools
- `/cpa` - CPA dashboard
- `/attorney` - Attorney dashboard
- `/insurance` - Insurance professional dashboard
- `/healthcare` - Healthcare professional dashboard
- `/realtor` - Realtor dashboard

#### Marketplace Routes
- `/marketplace` - General marketplace
- `/marketplace/advisors` - Find advisors
- `/marketplace/cpas` - Find CPAs
- `/marketplace/attorneys` - Find attorneys
- `/marketplace/insurance` - Find insurance professionals

#### Specialized Routes
- `/nil` - NIL platform landing
- `/nil/index` - NIL platform index
- `/nil/athlete/home` - Athlete dashboard
- `/nil/agent/home` - Agent dashboard
- `/nil/school/home` - School dashboard
- `/nil/brand/home` - Brand dashboard

### Current Issues
1. Inconsistent naming conventions (pros vs professionals)
2. Mixed navigation patterns (some use /home, others don't)
3. Marketplace separate from main professional routes
4. Deep nesting in some areas, shallow in others
5. No clear grouping of related services

### User Journey Pain Points
- Users struggle to find appropriate professional services
- Confusion between marketplace and direct professional access
- Inconsistent entry points for similar user types
- Navigation doesn't reflect actual usage patterns