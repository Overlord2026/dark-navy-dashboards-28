# Client/Family Persona Feature Inventory

## Overview
The Client/Family persona is the core user type representing high-net-worth individuals and families seeking comprehensive wealth management solutions.

---

## Core Features & Pages

### Dashboard & Overview
**Component:** `ClientDashboard`
**File:** `src/pages/ClientDashboard.tsx`
**Features:**
- Net worth tracking and visualization
- Account aggregation (bank, investment, crypto)
- Goals progress monitoring
- Recent activity feed
- Quick actions panel

### Financial Goals Management
**Component:** `GoalsPage`
**File:** `src/pages/GoalsPage.tsx`
**Workflow:**
1. **Goal Creation** (`/goals/create`)
   - Goal categories: Retirement, Education, Travel, Real Estate, Business
   - Timeline and target amount setting
   - Priority assignment
2. **Goal Detail Management** (`/goals/:id`)
   - Progress tracking
   - Milestone updates
   - Strategy adjustments
   - Document attachment

### Account Management
**Component:** `AccountsPage`
**File:** `src/pages/TabPages.tsx`
**Account Types:**
- Bank accounts (checking, savings, CDs)
- Investment accounts (401k, IRA, brokerage)
- Digital assets (crypto wallets)
- Real estate properties
- Business entities
- Insurance policies

### Portfolio & Investments
**Component:** `PortfolioPage`
**File:** `src/pages/PortfolioPage.tsx`
**Features:**
- Asset allocation visualization
- Performance tracking
- Risk analysis
- Rebalancing recommendations
- Tax-loss harvesting alerts

### Business Entity Management
**Component:** `BusinessEntitiesPage`
**File:** `src/pages/BusinessEntitiesPage.tsx`
**Capabilities:**
- Entity structure visualization
- Ownership tracking
- Compliance calendar
- Document storage
- Tax planning integration

---

## Retirement Planning Module

### SWAG™ Retirement Roadmap
**Component:** `SwagRetirementRoadmap`
**File:** `src/pages/retirement-roadmap/SwagRetirementRoadmap.tsx`
**Four-Phase Model:**
1. **Income Now (Years 1-2)** - Cash, CDs, money market
2. **Income Later (Years 3-12)** - Bonds, conservative investments
3. **Growth (12+ years)** - Stocks, growth investments
4. **Legacy (Ongoing)** - Estate planning, charitable giving

### Retirement Analyzer
**Component:** `RetirementAnalyzerDemo`
**File:** `src/pages/RetirementAnalyzerDemo.tsx`
**Advanced Features:**
- Monte Carlo simulations
- Scenario modeling (market crashes, early retirement, LTC events)
- Tax-optimized withdrawal strategies
- Social Security optimization
- SWAG Score™ calculation (0-100 confidence rating)

### Plan Import & Analysis
**Component:** `PlanImportWizard`
**File:** `src/components/retirement/PlanImportWizard.tsx`
**AI Integration:**
- PDF plan upload and OCR
- OpenAI Vision analysis
- Data extraction and validation
- Gap analysis and recommendations

---

## Onboarding Flow

### Initial Setup (4 Steps)
**Component:** `ClientWelcomeOnboardingPage`
**File:** `src/pages/ClientWelcomeOnboardingPage.tsx`

1. **Welcome & Profile**
   - Name, age, family structure
   - Financial experience level
   - Primary goals identification

2. **Account Linking**
   - Bank account connections
   - Investment account aggregation
   - Property value estimates
   - Business entity mapping

3. **Goal Setting**
   - Retirement timeline
   - Education funding needs
   - Legacy planning preferences
   - Risk tolerance assessment

4. **Advisor Matching**
   - Specialization preferences
   - Communication style
   - Fee structure preferences
   - Geographic proximity

### Premium Onboarding
**Component:** `PremiumOnboardingPage`
**File:** `src/pages/PremiumOnboardingPage.tsx`
**Additional Steps:**
- Advanced tax strategies
- Estate planning documentation
- Business succession planning
- International considerations

---

## Sticky Moments & Engagement

### Celebration Triggers
- First goal completion
- Net worth milestones ($100K, $500K, $1M, $5M+)
- Retirement readiness improvements
- Successful tax optimizations

### Progress Indicators
- Onboarding completion progress bar
- Goal achievement percentages
- SWAG Score™ improvements
- Account connection status

### Gamification Elements
- Achievement badges
- Progress streaks
- Milestone celebrations
- Confetti animations on major wins

---

## Document Vault & Collaboration

### Secure Document Storage
**Component:** `VaultPage`
**File:** `src/pages/VaultPage.tsx`
**Categories:**
- Tax documents
- Insurance policies
- Estate planning documents
- Investment statements
- Real estate deeds
- Business agreements

### Family Collaboration
**Component:** `FamilyWealthPage`
**File:** `src/pages/TabPages.tsx`
**Features:**
- Multi-user access controls
- Family member permissions
- Shared goal tracking
- Communication center
- Activity notifications

---

## Tools & Calculators

### Built-in Calculators
- Retirement income gap analyzer
- Tax optimization scenarios
- Education funding projections
- Insurance needs analysis
- Estate tax calculations

### Educational Resources
**Component:** `EducationPage`
**File:** `src/pages/TabPages.tsx`
- Video library
- Articles and guides
- Webinar access
- Advisor Q&A sessions

---

## Dependencies & Integrations

### Environment Variables
- `SUPABASE_URL` - Database and auth
- `SUPABASE_ANON_KEY` - Public API access
- `OPENAI_API_KEY` - Plan analysis (Edge functions)

### Third-Party Services
- **Plaid** - Bank account aggregation
- **Calendly** - Advisor meeting booking
- **Twilio** - SMS notifications
- **Stripe** - Premium subscription billing

### Supabase Edge Functions
- `plan-analysis` - AI-powered plan import
- `retirement-calculations` - Monte Carlo simulations
- `pdf-generation` - Custom report creation
- `notification-system` - Email/SMS alerts

---

## Analytics & Tracking

### Key Events
- `client_onboarding_started`
- `client_onboarding_completed`
- `goal_created`
- `goal_completed`
- `retirement_analyzer_used`
- `swag_score_calculated`
- `plan_imported`
- `advisor_meeting_booked`
- `premium_upgrade_clicked`

### Success Metrics
- Onboarding completion rate
- Goal achievement rate
- SWAG Score™ improvements
- Advisor matching success
- Premium conversion rate
- User engagement frequency

---

## Success Criteria

### Onboarding Success
- ✅ Profile completion (100%)
- ✅ At least one account connected
- ✅ First financial goal created
- ✅ Initial SWAG Score™ calculated

### Engagement Success
- ✅ Weekly login frequency
- ✅ Regular goal progress updates
- ✅ Document uploads to vault
- ✅ Advisor interaction initiated

### Upgrade Success
- ✅ Premium feature exploration
- ✅ Advanced calculator usage
- ✅ Estate planning module access
- ✅ Family collaboration activation

---

*Last Updated: [Current Date]*
*Persona: Client/Family*
*Priority: Core User Base*