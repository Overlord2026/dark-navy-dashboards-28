# Family Office Platform - Persona Documentation

## Overview
This document provides comprehensive documentation of all user personas, their navigation structures, dashboard features, and access controls for the Family Office Platform.

## Visual Persona Summary

### 1. Client Basic
**Navigation Menu:**
- Dashboard
- Education & Solutions (4 items: Resources & Solutions Catalog, Investment Solutions, Tax Planning, Insurance Solutions)
- Family Wealth Tools (Basic features only)
- Health Optimization (Basic overview)

**Dashboard Features:**
- Portfolio overview with key metrics
- Asset allocation charts
- Financial goals tracking
- Recent transactions
- Basic quick actions
- Mobile-responsive grid layout

**Visual Differentiators:**
- Standard UI colors and theming
- Basic feature set without premium indicators
- Standard tooltips and help text

### 2. Client Premium
**Navigation Menu:**
- Dashboard
- Education & Solutions (Same as Basic)
- Family Wealth Tools (Enhanced with Premium Features section)
- Health Optimization (Full suite including premium health features)

**Dashboard Features:**
- All Basic features PLUS:
- Premium features showcase card
- Advanced tax optimization tools
- Premium-gated quick actions (rebalancing, advanced analytics)
- Crown icons and premium badges throughout

**Visual Differentiators:**
- Golden/amber color accents for premium features
- Crown icons and "PREMIUM" badges
- Premium tooltips with upgrade prompts for locked features
- Gradient backgrounds on premium cards
- Premium watermarks on enhanced features

### 3. Advisor
**Navigation Menu:**
- Dashboard
- Client Management (Client List, Prospect Management)
- Portfolio Management (Portfolio Overview, Performance Reports)
- Business Management (Fee & Billing, Compliance & Reporting)

**Dashboard Features:**
- Client overview metrics
- Prospect pipeline
- Portfolio performance summaries
- Business KPIs and metrics
- Client activity feed
- Advisor-specific quick actions

**Visual Differentiators:**
- Professional advisor theming
- Business-focused iconography (briefcase, users, charts)
- Client management focus in layout

### 4. Accountant
**Navigation Menu:**
- Dashboard
- Tax Services (Tax Preparation, Tax Planning)
- Bookkeeping (General Ledger, Financial Statements)

**Dashboard Features:**
- Tax season overview
- Client portfolio metrics
- Bookkeeping status
- Compliance deadlines
- Document management tools
- Tax-focused quick actions

**Visual Differentiators:**
- Accounting-focused icons (calculator, books, documents)
- Tax and compliance theming
- Financial statement layouts

### 5. Consultant
**Navigation Menu:**
- Dashboard
- Consulting Projects (Active Projects, Client Assessments)
- Knowledge Base (Methodologies, Best Practices)

**Dashboard Features:**
- Project status overview
- Client assessment metrics
- Knowledge base access
- Methodology tracking
- Consulting-specific analytics
- Project management tools

**Visual Differentiators:**
- Consulting-focused iconography (briefcase, assessment tools)
- Project-oriented layouts
- Knowledge management emphasis

### 6. Attorney
**Navigation Menu:**
- Dashboard
- Legal Services (Estate Planning, Business Law)
- Document Management (Contracts, Legal Research)

**Dashboard Features:**
- Legal case overview
- Document status tracking
- Estate planning metrics
- Compliance monitoring
- Legal research tools
- Attorney-specific quick actions

**Visual Differentiators:**
- Legal-focused icons (scales, documents, shields)
- Document-centric layouts
- Compliance and legal theming

### 7. Admin
**Navigation Menu:**
- Dashboard
- User Management (Users, Roles & Permissions)
- System Settings (Platform Settings, System Monitoring)

**Dashboard Features:**
- User activity overview
- System health metrics
- Administrative quick actions
- Platform usage statistics
- Security monitoring
- Admin-specific tools

**Visual Differentiators:**
- Administrative iconography (settings, users, monitoring)
- System-focused layouts
- Security and monitoring emphasis

### 8. Tenant Admin
**Navigation Menu:**
- Dashboard
- User Management (Organization Users, Tenant Roles)
- System Settings (Tenant Configuration, Analytics)

**Dashboard Features:**
- Tenant user metrics
- Organization analytics
- Tenant-specific settings
- Usage tracking
- Administrative oversight tools
- Tenant management actions

**Visual Differentiators:**
- Organizational focus in iconography (building, team management)
- Tenant-scoped analytics
- Multi-user management layouts

### 9. System Administrator
**Navigation Menu:**
- Dashboard
- User Management (Platform Users, Global Roles)
- System Settings (Infrastructure, Global Monitoring)

**Dashboard Features:**
- Platform-wide metrics
- Infrastructure monitoring
- Global user analytics
- System health dashboards
- Platform administration tools
- Infrastructure management actions

**Visual Differentiators:**
- Infrastructure-focused icons (servers, databases, monitoring)
- Platform-wide analytics
- Technical system layouts

## QA Mode & Development Features

### QA Mode Header
- **Visibility:** Always visible when emulating roles for `tonygomes88@gmail.com`
- **Display:** Orange-to-red gradient banner with:
  - "QA MODE ACTIVE" with pulsing eye icon
  - Actual role/tier display
  - Emulated role/tier display with premium indicators
  - "Exit QA Mode" button
- **Mobile:** Responsive layout with condensed view on small screens

### Role Switching
- **RoleSwitcher:** Available in dev mode for instant persona testing
- **ClientTierToggle:** Basic/Premium tier switching for client roles
- **Real-time Updates:** Navigation and dashboard update immediately on role change

### Premium Visual System
- **Colors:** Amber/orange gradient system (#f59e0b to #ea580c)
- **Badges:** Crown icons with "PREMIUM" text
- **Tooltips:** Contextual explanations for all premium features
- **Watermarks:** Subtle "PREMIUM" diagonal overlays on enhanced features
- **Gating:** Disabled states with upgrade prompts for non-premium users

## Mobile Responsiveness

### Navigation
- **Sidebar:** Collapses to hamburger menu on mobile
- **Touch Targets:** Minimum 44px tap targets for all interactive elements
- **Spacing:** Adequate spacing between touch elements

### Dashboard Layouts
- **Grid System:** Responsive grids that stack appropriately on mobile
- **Typography:** Responsive text sizing (text-sm sm:text-base patterns)
- **Quick Actions:** Grid layouts optimize for thumb navigation
- **Cards:** Full-width stacking on mobile with appropriate padding

### Interaction Patterns
- **Tooltips:** Work properly on touch devices
- **Premium Features:** Clear visual indicators work on all screen sizes
- **Forms:** Mobile-optimized form layouts where applicable

## Development Integration

### Route Configuration
- All persona dashboards properly routed in `src/routes.tsx`
- Coming Soon pages for unimplemented features
- Proper error handling and 404 prevention

### Component Architecture
- **Shared Components:** ActionButton, PremiumBadge, PremiumWrapper
- **Consistent Styling:** Design system tokens used throughout
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Testing Features
- **PersonaDebugSession:** Comprehensive role testing tool
- **Navigation Diagnostics:** Route and access validation
- **QA Tools:** Development-only features for testing all personas

## Future Enhancements

### Recommended Improvements
1. **A/B Testing:** Premium feature positioning and messaging
2. **Analytics Integration:** User engagement tracking per persona
3. **Personalization:** Dynamic content based on user behavior
4. **Advanced Tooltips:** Interactive tutorial system
5. **Theme Customization:** Tenant-specific branding options

### Integration Points
- **Supabase:** Row-level security for persona-based data access
- **Authentication:** Role-based route protection
- **State Management:** Consistent role/tier state across components

---

*Last Updated: [Current Date]*
*For technical implementation details, see the component source files and route configurations.*