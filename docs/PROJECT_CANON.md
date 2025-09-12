# MyBFOCFO Project Canon

**Last Updated:** 2025-09-12  
**Purpose:** Comprehensive inventory of application structure, routes, navigation, personas, and tools.

## 1. Routes & Pages

### Core Application Routes
- `/` → `src/pages/LandingPage.tsx` - Main landing page with hero and features
- `/about` → `src/pages/AboutPage.tsx` - Platform overview and team information
- `/contact` → `src/pages/ContactPage.tsx` - Contact form and support information
- `/privacy` → `src/pages/PrivacyPage.tsx` - Privacy policy and data handling
- `/terms` → `src/pages/TermsPage.tsx` - Terms of service and usage agreements

### Authentication & Onboarding
- `/auth` → `src/pages/AuthPage.tsx` - Unified authentication (sign-in/sign-up)
- `/auth/callback` → `src/pages/AuthCallbackPage.tsx` - OAuth callback handling
- `/onboarding` → `src/pages/OnboardingPage.tsx` - User onboarding flow
- `/onboarding/advisor` → `src/pages/AdvisorOnboardingPage.tsx` - Advisor-specific onboarding
- `/onboarding/family` → `src/pages/FamilyOnboardingPage.tsx` - Family-specific onboarding
- `/invite/:token` → `src/pages/InvitePage.tsx` - Magic link invitation handling

### Professional Workspaces
- `/pros` → `src/pages/ProfessionalsPage.tsx` - Overview of service professionals
- `/pros/advisors` → `src/pages/AdvisorsPage.tsx` - Financial advisors hub
- `/pros/advisors/*` → Nested advisor workspace routes
- `/pros/accountants` → `src/pages/AccountantsPage.tsx` - CPA hub
- `/pros/attorneys` → `src/pages/AttorneysPage.tsx` - Legal professionals hub
- `/pros/insurance/life` → `src/pages/LifeInsurancePage.tsx` - Life insurance professionals
- `/pros/insurance/other` → `src/pages/OtherInsurancePage.tsx` - P&C, Medicare, LTC insurance

### Family Workspaces
- `/families` → `src/pages/FamiliesPage.tsx` - Family overview and segments
- `/start/families` → Family onboarding with segment parameters
- `/wealth/*` → Family wealth management tools (defined in WealthManagementRegistry)

### Financial Tools & Features
- `/goals` → `src/pages/GoalsPage.tsx` - Financial goals setting and tracking
- `/budgets` → `src/pages/BudgetsPage.tsx` - Budget management and planning
- `/cashflow` → `src/features/cashflow/pages/CashFlowPage.tsx` - Cash flow analysis
- `/transactions` → `src/features/transactions/pages/TransactionsPage.tsx` - Transaction management
- `/reports` → `src/pages/ReportsPage.tsx` - Financial reporting dashboard
- `/accounts` → `src/pages/AccountsPage.tsx` - Account management
- `/investments` → `src/pages/InvestmentsPage.tsx` - Investment portfolio management
- `/advice` → `src/pages/AdvicePage.tsx` - Advisory services and recommendations

### Specialized Features
- `/health` → `src/pages/HealthcarePage.tsx` - Healthcare management tools
- `/solutions` → `src/pages/SolutionsPage.tsx` - Platform solutions overview
- `/catalog` → `src/pages/CatalogPage.tsx` - Service and product catalog
- `/search` → `src/pages/SearchPage.tsx` - Global search functionality
- `/nil` → `src/pages/NilPage.tsx` - Placeholder/development route

### Administrative
- `/dashboard` → `src/pages/DashboardPage.tsx` - Main user dashboard
- `/settings` → `src/pages/SettingsPage.tsx` - User settings and preferences
- `/profile` → `src/pages/ProfilePage.tsx` - User profile management

## 2. Navigation Architecture

### Header Components
- **Primary Header:** `src/components/layout/Header.tsx`
  - Rendered in: `src/App.tsx` (main application shell)
  - Features: Logo, main navigation, user menu, theme toggle
  - Responsive behavior with mobile hamburger menu

- **Conditional Mega Menu:** `src/components/navigation/ConditionalMegaMenu.tsx`
  - Rendered in: Header component
  - Purpose: Context-aware navigation based on user persona and current route
  - Includes professional workspace shortcuts

### Sidebar Components
- **Main Sidebar:** `src/components/sidebar/MainSidebar.tsx`
  - Rendered in: `src/App.tsx` (application shell)
  - Features: Collapsible navigation, persona-based menu items
  - Connected to: `src/components/navigation/WealthManagementRegistry.ts`

- **Secondary Navigation:** `src/components/navigation/SecondaryNav.tsx`
  - Rendered in: Various page layouts
  - Purpose: Context-specific sub-navigation for tool sections

- **Bottom Navigation:** `src/components/sidebar/SidebarBottomNav.tsx`
  - Rendered in: MainSidebar component
  - Purpose: Secondary actions and settings access

### Navigation Configuration
- **Main Nav Config:** `src/config/nav.ts` - Primary navigation structure
- **Wealth Management Registry:** `src/components/navigation/WealthManagementRegistry.ts` - Family tools navigation
- **New Navigation Config:** `src/components/navigation/newNavigationConfig.ts` - Modern nav structure

## 3. Personas & Hubs

### Professional Personas
- **Financial Advisors**
  - Hub: `/pros/advisors` → `src/pages/AdvisorsPage.tsx`
  - Features: Client management, prospect invitations, advisor dashboard
  - Nested routes: Client workflows, reporting tools, compliance features

- **CPAs/Accountants**
  - Hub: `/pros/accountants` → `src/pages/AccountantsPage.tsx`
  - Features: Tax planning tools, client coordination, document management

- **Attorneys**
  - Hub: `/pros/attorneys` → `src/pages/AttorneysPage.tsx`
  - Features: Estate planning, legal document management, client collaboration

- **Insurance Professionals**
  - Life/Annuity Hub: `/pros/insurance/life` → `src/pages/LifeInsurancePage.tsx`
  - Other Hub: `/pros/insurance/other` → `src/pages/OtherInsurancePage.tsx`
  - Features: Policy management, client needs analysis, product recommendations

### Family Personas
- **Retirees Segment**
  - Access: `/start/families?segment=retirees`
  - Focus: Retirement income planning, healthcare, estate management

- **Aspiring Families Segment**
  - Access: `/start/families?segment=aspiring`
  - Focus: Wealth building, goal setting, financial education

- **General Family Hub**
  - Hub: `/families` → `src/pages/FamiliesPage.tsx`
  - Features: Comprehensive financial management, advisor coordination

## 4. Tool Surfaces

### Core Financial Tools
- **Reports**
  - Route: `/reports`
  - Component: `src/pages/ReportsPage.tsx`
  - Features: Financial dashboards, performance analytics, custom reporting

- **Cash Flow**
  - Route: `/cashflow`
  - Component: `src/features/cashflow/pages/CashFlowPage.tsx`
  - Features: Income/expense tracking, cash flow projections, budgeting

- **Transactions**
  - Route: `/transactions`
  - Component: `src/features/transactions/pages/TransactionsPage.tsx`
  - Features: Transaction categorization, spending analysis, account reconciliation

- **Accounts**
  - Route: `/accounts`
  - Component: `src/pages/AccountsPage.tsx`
  - Features: Account aggregation, balance tracking, account management

- **Budget**
  - Route: `/budgets`
  - Component: `src/pages/BudgetsPage.tsx`
  - Features: Budget creation, variance analysis, spending controls

- **Goals**
  - Route: `/goals`
  - Component: `src/pages/GoalsPage.tsx`
  - Features: Financial goal setting, progress tracking, milestone management

- **Investments**
  - Route: `/investments`
  - Component: `src/pages/InvestmentsPage.tsx`
  - Features: Portfolio management, asset allocation, performance tracking

- **Advice**
  - Route: `/advice`
  - Component: `src/pages/AdvicePage.tsx`
  - Features: Advisory recommendations, financial guidance, planning tools

### Wealth Management Sub-Tools
- **Cash Management:** `/wealth/cash/management`
- **Transfers:** `/wealth/cash/transfers`
- **Properties:** `/wealth/properties`
- **Documents & Vault:** `/wealth/docs`
- **Social Security:** `/wealth/social-security`
- **Business Filings:** `/wealth/business-filings`
- **Bill Pay:** `/wealth/bill-pay`

## 5. Auth & Onboarding

### Authentication Flows
- **Unified Auth:** `src/pages/AuthPage.tsx`
  - Supports both sign-in and sign-up
  - Integrates with Supabase authentication
  - Handles OAuth providers and magic links

- **Callback Handling:** `src/pages/AuthCallbackPage.tsx`
  - Processes OAuth redirects
  - Manages session establishment
  - Handles error states and redirects

### Onboarding Flows
- **General Onboarding:** `src/pages/OnboardingPage.tsx`
  - Basic user setup and preferences
  - Platform introduction and tour

- **Advisor Onboarding:** `src/pages/AdvisorOnboardingPage.tsx`
  - Professional credential verification
  - Practice setup and configuration
  - Client management system setup

- **Family Onboarding:** `src/pages/FamilyOnboardingPage.tsx`
  - Financial profile creation
  - Goal setting and prioritization
  - Service provider matching

### Invitation System
- **Magic Link Invites:** `src/pages/InvitePage.tsx`
  - Token-based invitation handling
  - Advisor-to-client invitation flow
  - Automatic account linking upon acceptance

### Persona Parameter Usage
- URL segments like `?segment=retirees` control onboarding paths
- Persona detection drives navigation and feature availability
- Role-based access control for professional tools

## 6. Configuration Files

### Navigation Configuration
- **`src/config/nav.ts`** - Main navigation structure and hierarchy
- **`src/components/navigation/WealthManagementRegistry.ts`** - Family wealth tools navigation
- **`src/components/navigation/newNavigationConfig.ts`** - Modern navigation patterns

### Tool Configuration
- **`src/config/toolsRegistry.ts`** - Financial tools registry and routing
- **`src/types/integrations.ts`** - Integration types and meeting preferences

### Persona Configuration
- **`src/types/p5.ts`** - Persona types, consent tokens, and session management
- **Navigation configs** - Persona-specific menu structures

### Type Definitions
- **`src/types/navigation.ts`** - Navigation component types
- **`src/types/integrations.ts`** - Integration and scheduling types
- **`src/types/jest.d.ts`** - Testing framework type declarations

## 7. Feature Flags & Environment Expectations

### Known Feature Flags
- **Professional Workspaces:** Controlled via persona detection and route access
- **Wealth Management Tools:** Feature-gated based on user subscription/persona
- **Integration Capabilities:** Conditional rendering based on available integrations

### Environment Expectations
- **Supabase Integration:** Database, authentication, and real-time subscriptions
- **OAuth Providers:** Support for multiple authentication methods
- **Email Services:** Integration with Resend for magic link invitations
- **File Storage:** Supabase storage for document management

### Development Features
- **Test Data Reset:** Administrative tools for development/testing
- **Audit Logging:** Comprehensive activity tracking and compliance
- **Security Scanning:** Automated security analysis and reporting

### Integration Points
- **CRM Systems:** Advisor client management integration
- **Financial Data:** Account aggregation and transaction import
- **Calendar Systems:** Meeting scheduling and calendar integration
- **Document Management:** Secure document storage and sharing

---

**Note:** This documentation reflects the current state of the application as of 2025-09-12. For the most up-to-date information, refer to the actual source code and recent commit history.