# Family Office Marketplace - Comprehensive Playbook

## Overview
The Family Office Marketplace is a comprehensive platform connecting financial professionals across the wealth management ecosystem. This playbook documents all supported roles, dashboards, workflows, and technical configurations.

## Supported User Roles & Segments

### Core User Roles
```typescript
type UserRole = 
  | "admin" 
  | "system_administrator" 
  | "advisor" 
  | "client" 
  | "coach"
  | "imo_executive" 
  | "fmo_executive" 
  | "branch_manager" 
  | "regional_director" 
  | "compliance_officer" 
  | "marketing_director"
  | "developer";
```

### Professional Segments
```typescript
type ProfessionalSegment = 
  | "financial_advisor" 
  | "insurance_agent" 
  | "investment_manager" 
  | "tax_professional" 
  | "estate_planner" 
  | "real_estate_agent" 
  | "mortgage_broker" 
  | "imo_executive" 
  | "fmo_executive" 
  | "coach" 
  | "consultant" 
  | "other";
```

## Dashboard Hierarchy & Access Control

### 1. Admin Dashboards
- **Admin Dashboard** (`/admin-dashboard`)
  - **Access**: `admin`, `system_administrator`
  - **Features**: System monitoring, user management, analytics
  - **Status**: ✅ Fully Implemented

- **Navigation Diagnostics** (`/navigation-diagnostics`)
  - **Access**: `admin`, `system_administrator`
  - **Features**: Route testing, performance monitoring
  - **Status**: ✅ Fully Implemented

### 2. Professional Dashboards

#### Advisor Dashboards
- **Advisor Dashboard** (`/advisor-dashboard`)
  - **Access**: `advisor`
  - **Features**: Client management, pipeline tracking, ROI analytics
  - **Status**: ✅ Fully Implemented

- **Advisor ROI Dashboard** (`/advisor-roi-dashboard`)
  - **Access**: `advisor`
  - **Features**: Advanced ROI tracking, campaign performance
  - **Status**: ✅ Fully Implemented

#### Executive Dashboards
- **IMO/FMO Dashboard** (`/imo-fmo-dashboard`)
  - **Access**: `imo_executive`, `fmo_executive`
  - **Features**: Interactive demo with compliance tracking, agent performance
  - **Status**: 🔶 Interactive Placeholder (Full version coming soon)

#### Coaching & Training
- **Coach Dashboard** (`/coach-dashboard`)
  - **Access**: `coach`
  - **Features**: Interactive demo with referral tracking, progress monitoring
  - **Status**: 🔶 Interactive Placeholder (Full version coming soon)

### 3. Client Dashboards
- **Client Dashboard** (`/client-dashboard`)
  - **Access**: `client`
  - **Features**: Portfolio overview, advisor communication
  - **Status**: ✅ Fully Implemented

### 4. Specialized Tools

#### Pipeline Management
- **Pipeline Board** (`/pipeline`)
  - **Access**: `advisor`, `admin`
  - **Features**: Lead tracking, funnel analytics, defensive data handling
  - **Status**: ✅ Fully Implemented with Defensive Programming

#### Analytics & ROI
- **ROI Dashboard** (`/roi-dashboard`)
  - **Access**: `advisor`, `admin`
  - **Features**: Comprehensive ROI tracking, campaign analysis
  - **Status**: ✅ Fully Implemented with Defensive Programming

## Technical Configuration

### Defensive Programming Implementation
All dashboards now include:
- ✅ Type guards for all database queries
- ✅ Fallback mock data for empty/error states
- ✅ "Data unavailable" messages instead of crashes
- ✅ Safe property access with optional chaining

### DateRange Type Safety
All date components now use:
```typescript
interface DateRange {
  from?: Date | null;
  to?: Date | null;
}
```

### Authentication & Route Protection
- ✅ Role-based access control implemented
- ✅ Protected routes with proper redirects
- ✅ Environment-aware authentication enforcement
- ✅ QA bypass functionality for testing

## Interactive Placeholder Strategy

For roles with upcoming dashboards:
- 🎯 **Coach Role**: Referral tracking demo, progress metrics
- 🎯 **IMO/FMO**: Compliance status, agent performance tiles
- 🎯 **Branch Manager**: Team performance overview
- 🎯 **Regional Director**: Multi-location analytics

Each placeholder includes:
- Interactive demo widgets with real functionality
- Mock data that demonstrates intended features
- "Full dashboard coming soon" messaging
- Feedback collection for feature prioritization

## Design System & Branding

### Color Tokens (HSL Format)
- Primary: `hsl(var(--primary))`
- Secondary: `hsl(var(--secondary))`
- Accent: `hsl(var(--accent))`
- Background: `hsl(var(--background))`
- Foreground: `hsl(var(--foreground))`

### Animation & Polish
- ✅ Confetti animations on key milestones
- ✅ Smooth transitions between states
- ✅ Consistent hover effects
- ✅ Loading states with branded spinners

## Data Model & Types

### User Profile Structure
```typescript
interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  professional_segment?: ProfessionalSegment;
  first_name?: string;
  last_name?: string;
  firstName?: string; // Alias for compatibility
  lastName?: string;  // Alias for compatibility
  email?: string;
  phone?: string;
  // ... additional fields
}
```

## Navigation & Routing

### Main Navigation Categories
1. **Core** - Dashboard, Profile, Settings
2. **Professional Tools** - Pipeline, ROI, Analytics
3. **Integration** - Connected Projects, API Management
4. **Admin** - User Management, Diagnostics (admin only)

### Route Security
- All routes protected by `ProtectedRoute` component
- Role-based access enforcement
- Graceful redirects for unauthorized access
- Development environment flexibility

## Quality Assurance

### Navigation Testing
- ✅ QA test suite at `/navigation-qa-test`
- ✅ Comprehensive route validation
- ✅ Role-based access verification
- ✅ Error handling validation

### Pre-Launch Checklist
- [x] All dashboards have interactive content
- [x] Defensive programming on all async operations
- [x] No TypeScript errors
- [x] Role-based navigation tested
- [x] Consistent branding applied
- [x] Animation polish completed

## Integration Documentation

### API Endpoints
- Lead management: Supabase Edge Functions
- Email delivery: Resend integration
- Analytics: Custom tracking with PostHog

### Database Schema
- User roles stored in separate `user_roles` table
- Professional profiles in `profiles` table
- Lead tracking in dedicated pipeline tables

## Deployment & Environment

### Environment Configuration
- Development: Flexible authentication
- Production: Strict role enforcement
- QA: Bypass mechanisms available

### Feature Flags
- Email enforcement toggleable
- Authentication bypass for development
- Role-based feature access

---

## Status Summary

✅ **Completed**: 
- Core dashboards for advisors, clients, admins
- Defensive programming across all data operations
- DateRange type safety fixes
- Interactive placeholders for new roles
- Navigation audit and protection

🔶 **In Progress**:
- Full implementation of IMO/FMO dashboards
- Advanced coaching tools
- Enhanced compliance tracking

📋 **Planned**:
- Advanced analytics for regional directors
- Compliance automation tools
- Multi-tenant organization support

---

*Last Updated: ${new Date().toISOString()}*
*Version: 2.0 - Marketplace Expansion*