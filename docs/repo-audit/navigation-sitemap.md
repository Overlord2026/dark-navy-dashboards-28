# Navigation Sitemap - Family Office CRM Platform

## Public Routes (No Authentication Required)

### Marketing & Landing Pages
- `/` - PublicLandingPage.tsx - Main marketing landing with persona selector
- `/welcome` - WelcomePage.tsx - Welcome page with value proposition
- `/universal` - UniversalLandingPage.tsx - Universal landing page
- `/marketplace` - FamilyOfficeMarketplacePage.tsx - Marketplace landing
- `/marketplace-demo` - MarketplaceLandingPage.tsx - Demo marketplace
- `/lead-magnet` - LeadMagnetPage.tsx - Lead capture page
- `/persona-landing` - PersonaLandingPage.tsx - Persona selection hub
- `/persona-preview/:personaId` - PersonaPreviewPage.tsx - Preview specific persona

### Calculators & Tools (Public)
- `/demo` - DemoCalculator.tsx - Public demo calculator
- `/retirement-analyzer` - RetirementAnalyzerDemo.tsx - SWAG™ Retirement Analyzer
- `/analyzer/retirement-income-gap` - RetirementIncomeGapAnalyzer.tsx - Income gap calculator
- `/scorecard/retirement-confidence` - RetirementConfidenceScorecard.tsx - Confidence scorecard
- `/retirement-roadmap-info` - RetirementRoadmapInfo.tsx - Roadmap info page
- `/fee-calculator` - PublicFeeCalculator.tsx - Fee comparison calculator
- `/tax-center` - PublicTaxCenter.tsx - Public tax planning center

### Education & Content
- `/faq` - FAQPage.tsx - Frequently asked questions
- `/about` - AboutUsPage.tsx - About us page
- `/careers` - CareersPage.tsx - Careers page
- `/contact` - ContactPage.tsx - Contact information
- `/privacy` - PrivacyPolicyPage.tsx - Privacy policy
- `/terms` - TermsOfServicePage.tsx - Terms of service
- `/accessibility` - AccessibilityPage.tsx - Accessibility information

### Specialized Landing Pages
- `/athletes/nil-landing` - NILLandingPage.tsx - NIL athlete landing
- `/athletes/nil-education` - NILEducationCenter.tsx - NIL education center
- `/estate-attorney` - EstateAttorneyLanding.tsx - Estate attorney landing
- `/litigation-attorney` - LitigationAttorneyLanding.tsx - Litigation attorney landing
- `/insurance-medicare` - InsuranceMedicareLanding.tsx - Insurance & Medicare landing
- `/insurance-life-annuity` - InsuranceLifeAnnuityLanding.tsx - Life insurance & annuity landing
- `/personas/realtor` - RealtorPersonaLanding.tsx - Realtor persona landing

## Authentication Routes

### Auth Flow
- `/auth` - AuthPage.tsx - Main auth page (login/signup)
- `/auth/:authType` - AuthPage.tsx - Specific auth type (login, signup, etc.)
- `/auth/:authType/:tenantId` - AuthPage.tsx - Tenant-specific auth
- `/security` - SecuritySettingsPage.tsx - Security settings

### Onboarding Flows
- `/onboarding` - OnboardingPage.tsx - General onboarding
- `/onboarding/:personaId` - PersonaOnboardingFlow.tsx - Persona-specific onboarding
- `/welcome-onboarding` - ClientWelcomeOnboardingPage.tsx - Client welcome flow
- `/premium-onboarding` - PremiumOnboardingPage.tsx - Premium client onboarding
- `/professional-onboarding/:role` - RoleBasedOnboardingPage.tsx - Professional onboarding

## Application Routes (Authentication Required)

### Main Dashboards
- `/dashboard` - Dashboard.tsx - Main dashboard (role-based routing)
- `/client` - ClientDashboard.tsx - Client dashboard
- `/advisor` - AdvisorDashboard.tsx - Advisor dashboard
- `/accountant` - AccountantDashboard.tsx - Accountant dashboard
- `/attorney` - AttorneyDashboard.tsx - Attorney dashboard
- `/consultant` - ConsultantDashboard.tsx - Consultant dashboard
- `/coach` - CoachDashboard.tsx - Coach dashboard
- `/compliance` - ComplianceDashboard.tsx - Compliance dashboard

### Client Portal
- `/client-portal` - ClientPortalPage.tsx - Client portal main
- `/business-entities` - BusinessEntitiesPage.tsx - Business entities management
- `/legacy-vault` - LegacyVault.tsx - Document vault
- `/investments` - Investments.tsx - Investment tracking
- `/goals` - GoalsPage.tsx - Financial goals
- `/accounts` - Accounts.tsx - Account management
- `/reports` - Reports.tsx - Financial reports

### Advisor Tools
- `/advisor/billing` - AdvisorBillingPage.tsx - Billing management
- `/advisor/compliance` - AdvisorCompliancePage.tsx - Compliance tools
- `/advisor/practice` - AdvisorPracticeHome.tsx - Practice management
- `/advisor/regulatory` - RegulatoryReportingPage.tsx - Regulatory reporting
- `/crm` - CRMDashboardPage.tsx - CRM dashboard

### Retirement Planning
- `/retirement-roadmap` - SwagRetirementRoadmap.tsx - SWAG™ Roadmap
- `/investment-allocation` - InvestmentAllocationDashboard.tsx - Allocation dashboard

## Persona-Specific Routes

### Client/Family Routes
- `/client-family/onboarding` - ClientFamilyOnboardingPage.tsx - Family onboarding
- `/family/client-deck` - ClientFamilyDeck.tsx - Family presentation deck

### Advisor Routes  
- `/advisor/onboarding` - AdvisorOnboardingPage.tsx - Advisor onboarding
- `/advisor/onboarding-sequence` - AdvisorOnboardingSequencePage.tsx - Sequence flow
- `/sales/advisor-deck` - AdvisorDeck.tsx - Advisor sales deck

### CPA/Accountant Routes
- `/accountant/onboarding` - AccountantOnboardingPage.tsx - Accountant onboarding
- `/accountant/onboarding-sequence` - AccountantOnboardingSequencePage.tsx - Sequence flow
- `/accountant/deck` - AccountantDeck.tsx - Accountant presentation deck
- `/accountant/dashboard` - AccountantDashboardPage.tsx - Dashboard

### Attorney Routes (Estate)
- `/estate-attorney/onboarding` - EstateAttorneyOnboarding.tsx - Estate attorney onboarding
- `/estate-attorney/dashboard` - EstateAttorneyDashboard.tsx - Estate attorney dashboard
- `/estate-attorney/marketing-deck` - EstateAttorneyMarketingDeck.tsx - Marketing deck

### Attorney Routes (Litigation)
- `/litigation-attorney/onboarding` - LitigationAttorneyOnboarding.tsx - Litigation attorney onboarding
- `/litigation-attorney/dashboard` - LitigationAttorneyDashboard.tsx - Litigation attorney dashboard
- `/litigation-attorney/marketing-deck` - LitigationAttorneyMarketingDeck.tsx - Marketing deck

### Insurance Routes
- `/insurance-medicare/onboarding` - InsuranceMedicareOnboarding.tsx - Medicare onboarding
- `/insurance-life-annuity/onboarding` - InsuranceLifeAnnuityOnboarding.tsx - Life insurance onboarding
- `/insurance/dashboard` - InsuranceDashboardPage.tsx - Insurance dashboard
- `/medicare/dashboard` - MedicareDashboardPage.tsx - Medicare dashboard

### Realtor/Property Manager Routes
- `/realtor/onboarding` - RealtorOnboarding.tsx - Realtor onboarding
- `/realtor/dashboard` - RealtorDashboard.tsx - Realtor dashboard

### Healthcare Routes
- `/healthcare/onboarding` - HealthcareOnboardingPage.tsx - Healthcare onboarding
- `/healthcare/dashboard` - HealthcareDashboardPage.tsx - Healthcare dashboard

### Coach/Consultant Routes
- `/coach/onboarding` - CoachOnboardingPage.tsx - Coach onboarding
- `/consultant/onboarding` - ConsultantOnboardingPage.tsx - Consultant onboarding

### Elite Family Office Routes
- `/elite-family-office/onboarding` - EliteFamilyOfficeOnboardingPage.tsx - Elite onboarding
- `/elite-family-office/dashboard` - EliteFamilyOfficeDashboardPage.tsx - Elite dashboard

### Sports Agent Routes
- `/sports-agent/onboarding` - SportsAgentOnboardingPage.tsx - Sports agent onboarding

### Athletes/NIL Routes
- `/athletes/nil-onboarding` - NILOnboarding.tsx - NIL onboarding
- `/athletes/wealth-deck` - AthleteWealthDeck.tsx - Athlete wealth deck

## Admin Routes (Admin Role Required)

### Main Admin
- `/admin` - AdminDashboard.tsx - Main admin dashboard
- `/admin/layout` - AdminLayoutSettings.tsx - Layout configuration
- `/admin/controls` - AdminControlsPage.tsx - Admin controls
- `/admin/roadmap-settings` - SwagRoadmapSettings.tsx - Roadmap settings

### QA & Testing
- `/qa-testing` - QATestingPage.tsx - QA testing dashboard
- `/end-to-end-qa` - EndToEndQAPage.tsx - End-to-end testing
- `/persona-onboarding-qa` - PersonaOnboardingQAPage.tsx - Persona onboarding QA
- `/persona-dashboard-qa` - PersonaDashboardQAPage.tsx - Dashboard QA
- `/go-no-go-qa` - GoNoGoQAPage.tsx - Go/no-go decision QA

### Financial Admin
- `/cfo` - CFODashboard.tsx - CFO dashboard
- `/tax-rules-admin` - TaxRulesAdminPage.tsx - Tax rules management
- `/imo-admin` - IMOAdminPage.tsx - IMO administration

### Development Tools
- `/wireframe` - WireframePage.tsx - Wireframe tools
- `/platform-map` - PlatformMap.tsx - Platform mapping
- `/image-generator` - ImageGeneratorPage.tsx - Image generation tools

## Specialized Routes

### Lead Management
- `/leads/intake` - LeadIntakeForm.tsx - Lead intake form
- `/leads/confirmation` - LeadConfirmation.tsx - Lead confirmation
- `/leads/pipeline` - PipelineBoard.tsx - Pipeline board
- `/leads/scoring` - LeadScoringDashboard.tsx - Lead scoring

### Document Management
- `/documents` - Documents.tsx - Document center
- `/document-upload` - DocumentUploadPage.tsx - Document upload
- `/document-view` - DocumentViewPage.tsx - Document viewer

### Communications
- `/communications` - Communications.tsx - Communication center
- `/secure-messages` - SecureMessagesPage.tsx - Secure messaging
- `/recordings` - RecordingsPage.tsx - Call recordings

### Compliance & Reporting
- `/compliance` - CompliancePage.tsx - Compliance center
- `/compliance-reporting` - ComplianceReportingPage.tsx - Compliance reporting
- `/regulatory-reporting` - RegulatoryReportingPage.tsx - Regulatory reporting

## Route Protection Patterns

### Authentication Guards
- Public routes: No auth required
- App routes: `<AuthWrapper requireAuth={true}>`
- Role-specific routes: `<AuthWrapper requireAuth={true} allowedRoles={['role1', 'role2']}>`

### Role Hierarchies
- Admin: `['admin', 'system_administrator', 'tenant_admin']`
- Client: `['client', 'admin', 'system_administrator', 'tenant_admin']`
- Advisor: Uses `getAdvisorAccessRoles()` helper
- Professional: Role-specific access patterns

### Feature Flags
- Premium features gated by subscription status
- Beta features controlled by feature flags
- Persona-specific feature visibility

## Primary CTAs by Route Type

### Marketing Routes
- "Get Started" → Auth/Onboarding
- "See Demo" → Demo calculator
- "Contact Sales" → Lead form

### Calculator Routes  
- "View Full Roadmap" → Retirement analyzer
- "Speak to Advisor" → Lead form
- "Get Personalized Plan" → Onboarding

### Dashboard Routes
- "Add Goal" → Goal creation
- "Import Plan" → Plan import wizard
- "Generate Report" → Report builder
- "Schedule Meeting" → Calendar integration

### Onboarding Routes
- "Next Step" → Continue flow
- "Skip for Now" → Optional steps
- "Complete Setup" → Dashboard redirect