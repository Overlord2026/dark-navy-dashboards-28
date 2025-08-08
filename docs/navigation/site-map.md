# BFO Platform Site Map & Navigation Audit

## Executive Summary
This document provides a comprehensive mapping of all routes in the BFO (Boutique Family Office) platform, categorized by access level and persona. The platform serves multiple professional personas with specialized workflows and tools.

---

## Public Routes (Marketing & Calculators)

### Landing Pages & Marketing
- `/` - PublicLandingPage (main entry point)
- `/universal` - UniversalLandingPage (universal persona selector)
- `/marketplace-demo` - MarketplaceLandingPage
- `/lead-magnet` - LeadMagnetPage
- `/welcome` - WelcomePage
- `/about` - AboutUsPage
- `/careers` - CareersPage
- `/privacy` - PrivacyPolicyPage
- `/terms` - TermsOfServicePage
- `/contact` - ContactPage

### Public Calculators & Tools
- `/value-calculator` - EnhancedValueCalculator
- `/calculator/fee` - PublicFeeCalculator
- `/demo` - DemoCalculator
- `/scorecard/retirement-confidence` - RetirementConfidenceScorecard
- `/scorecard/longevity` - LongevityScorecard
- `/analyzer/retirement-income-gap` - RetirementIncomeGapAnalyzer
- `/retirement-analyzer` - RetirementAnalyzerDemo (SWAG™ Retirement Analyzer)
- `/info/retirement-roadmap` - RetirementRoadmapInfo
- `/tax-center` - PublicTaxCenter

### Public Education & Resources
- `/education-hub` - EducationHub
- `/solutions-hub` - SolutionsHub
- `/faq` - FAQPage
- `/help` - HelpPage

---

## Authentication Routes

### Auth Flow
- `/auth` - AuthPage (unified auth entry)
- `/auth/:authType` - AuthPage (specific auth type)
- `/auth/:authType/:tenantId` - AuthPage (tenant-specific auth)
- `/dynamic-landing` - DynamicLandingController
- `/reset-password` - ResetPassword

### Onboarding
- `/onboarding` - OnboardingPage (general)
- `/onboarding/:personaId` - PersonaOnboardingFlow (persona-specific)
- `/welcome-onboarding` - ClientWelcomeOnboardingPage
- `/premium-onboarding` - PremiumOnboardingPage
- `/professional-onboarding/:role` - RoleBasedOnboardingPage

---

## Client/Family Portal Routes

### Core Client Dashboard
- `/client` - ClientDashboard
- `/client-portal` - ClientPortalPage
- `/dashboard` - Dashboard (general dashboard)

### Financial Management
- `/accounts-tab` - AccountsPage
- `/investments` - Investments
- `/portfolio` - PortfolioPage
- `/goals` - GoalsPage
- `/goals/create` - CreateGoalPage
- `/goals/create/:category` - GoalFormPage
- `/goals/:id` - GoalDetailPage

### Business & Entities
- `/business-entities` - BusinessEntitiesPage
- `/properties` - Properties

### Family & Collaboration
- `/family-wealth-tab` - FamilyWealthPage
- `/collaboration-tab` - CollaborationPage
- `/vault` - VaultPage
- `/documents` - Documents

### Tools & Planning
- `/retirement-roadmap` - SwagRetirementRoadmap
- `/annuities` - AnnuitiesPage
- `/annuities/learn` - EducationCenter
- `/annuities/compare` - ProductComparison
- `/annuities/analyze` - ContractAnalyzer

---

## Professional Persona Routes

### Advisor Portal
**Routes:** `/advisor/*`
**Landing:** `/advisor` - AdvisorDashboard
**Onboarding:** `/advisor/onboarding` - AdvisorOnboardingPage
**Specialized Pages:**
- `/advisor/billing` - AdvisorBillingPage
- `/advisor/compliance` - AdvisorCompliancePage
- `/advisor/regulatory` - RegulatoryReportingPage
- `/advisor/practice` - AdvisorPracticeHome
- `/advisor-roi` - AdvisorROIDashboard

### CPA/Accountant Portal
**Routes:** `/accountant/*`
**Landing:** `/accountant` - AccountantDashboard
**Onboarding:** `/accountant/onboarding` - AccountantOnboardingPage
**Features:**
- Tax planning and compliance
- Entity management
- Client onboarding automation
- CE tracking

### Attorney Portals

#### Estate Attorney
**Routes:** `/estate-attorney/*`
**Landing:** `/estate-attorney` - EstateAttorneyLanding
**Onboarding:** `/estate-attorney/onboarding` - EstateAttorneyOnboarding
**Dashboard:** `/estate-attorney/dashboard` - EstateAttorneyDashboard
**Marketing:** `/estate-attorney/marketing-deck` - EstateAttorneyMarketingDeck

#### Litigation Attorney
**Routes:** `/litigation-attorney/*`
**Landing:** `/litigation-attorney` - LitigationAttorneyLanding
**Onboarding:** `/litigation-attorney/onboarding` - LitigationAttorneyOnboarding
**Dashboard:** `/litigation-attorney/dashboard` - LitigationAttorneyDashboard
**Marketing:** `/litigation-attorney/marketing-deck` - LitigationAttorneyMarketingDeck

### Insurance Portals

#### Medicare & Insurance
**Routes:** `/insurance-medicare/*`
**Landing:** `/insurance-medicare` - InsuranceMedicareLanding
**Onboarding:** `/insurance-medicare/onboarding` - InsuranceMedicareOnboarding

#### Life Insurance & Annuity
**Routes:** `/insurance-life-annuity/*`
**Landing:** `/insurance-life-annuity` - InsuranceLifeAnnuityLanding
**Onboarding:** `/insurance-life-annuity/onboarding` - InsuranceLifeAnnuityOnboarding

### Realtor/Property Manager Portal
**Routes:** `/realtor/*`
**Public Landing:** `/personas/realtor` - RealtorPersonaLanding
**Onboarding:** `/realtor/onboarding` - RealtorOnboarding
**Dashboard:** `/realtor/dashboard` - RealtorDashboard
**Features:**
- MLS integration
- Property listing management
- Owner/investor CRM
- Cap-rate analytics

### Healthcare Portal
**Routes:** `/healthcare/*`
**Onboarding:** `/healthcare/onboarding` - HealthcareOnboardingPage
**Dashboard:** `/healthcare/dashboard` - HealthcareDashboardPage

### Sports Agent Portal
**Routes:** `/sports-agent/*`
**Landing:** `/sports-agent` - SportsAgentPersonaLandingPage
**Onboarding:** `/sports-agent/onboarding` - SportsAgentOnboardingPage

### Coach Portal
**Routes:** `/coach/*`
**Landing:** `/coach` - CoachPersonaLandingPage
**Onboarding:** `/coach/onboarding` - CoachOnboardingPage

### Consultant Portal
**Routes:** `/consultant/*`
**Onboarding:** `/consultant/onboarding` - ConsultantOnboardingPage
**Dashboard:** `/consultant/dashboard` - ConsultantDashboardPage

---

## Admin & Management Routes

### Super Admin
- `/admin` - AdminDashboard
- `/admin/layout` - AdminLayoutSettings
- `/admin/controls` - AdminControlsPage

### CFO Portal
- `/cfo` - CFODashboard
- `/admin/cfo` - CFO Command Center (Coming Soon)

### Marketing Hub
- `/admin/marketing` - Marketing Hub (Coming Soon)

### Security & Compliance
- `/admin/security` - Security & Compliance (Coming Soon)
- `/admin/vetting` - Professional Vetting (Coming Soon)
- `/admin/operations` - Operations (Coming Soon)

---

## Specialized Routes

### Athletes/NIL
- `/athletes/nil-landing` - NILLandingPage
- `/athletes/nil-education` - NILEducationCenter
- `/athletes/nil-onboarding` - NILOnboarding
- `/athletes/wealth-deck` - AthleteWealthDeck

### Sales & Marketing Decks
- `/sales/advisor-deck` - AdvisorDeck
- `/family/client-deck` - ClientFamilyDeck
- `/accountant/deck` - AccountantDeck

### Lead Management
- `/leads/intake` - LeadIntakeForm
- `/leads/confirmation` - LeadConfirmation
- `/leads/pipeline` - PipelineBoard

### Development & QA Routes
- `/qa/*` - Various QA testing pages
- `/wireframe` - WireframePage
- `/platform-map` - PlatformMap
- `/image-generator` - ImageGeneratorPage

---

## Route Guards & Access Control

### Authentication Requirements
- **Public Routes:** No authentication required
- **Client Routes:** Requires `client`, `admin`, `system_administrator`, or `tenant_admin` role
- **Advisor Routes:** Requires advisor access roles (getAdvisorAccessRoles())
- **Admin Routes:** Requires `admin`, `system_administrator`, or `tenant_admin` role

### Feature Flags
- Demo mode capabilities for most calculators
- White-label branding support
- Tenant-specific customizations

---

## API & Edge Functions Integration

### Supabase Edge Functions
- Authentication and user management
- File storage and vault operations
- PDF generation and export
- Email/SMS communications
- Real-time data synchronization

### Third-Party Integrations
- OpenAI/Vision for PDF plan import
- Calendly for booking
- Stripe for subscriptions (placeholder)
- Twilio for communications
- MLS/RESO for real estate data

---

## Missing Routes Identified

The following routes are referenced but may need implementation:
- `/marketplace` - Currently placeholder
- `/estate-planning` - Currently placeholder
- `/magic-link/:id?` - Currently placeholder

---

*Last Updated: [Current Date]*
*Domain: my.bfocfo.com*