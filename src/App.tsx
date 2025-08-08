import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeAnalytics } from "@/lib/analytics";
import { setupErrorMonitoring, monitorAuthEvents } from "@/lib/monitoring";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { RoleProvider } from "@/context/RoleContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TenantProvider } from "@/context/TenantContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { PersonaProvider } from "@/context/PersonaContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { getAdvisorAccessRoles } from "@/utils/roleHierarchy";
import { DynamicLandingController } from "@/components/auth/DynamicLandingController";
import { Navigation } from "@/components/Navigation";
import { StickyTopBanner } from "@/components/layout/StickyTopBanner";
import ReferralTracker from "@/components/tracking/ReferralTracker";
import { QABypassIndicator } from "@/components/security/QABypassIndicator";
import { APIWarningBanner } from "@/components/admin/APIWarningBanner";
import { ExtensionHealthBanner } from "@/components/ExtensionHealthBanner";
import { BrandedFooter } from "@/components/ui/BrandedFooter";
import { LeadIntakeForm } from "@/pages/leads/LeadIntakeForm";
import { LeadConfirmation } from "@/pages/leads/LeadConfirmation";
import { PipelineBoard } from "@/pages/leads/PipelineBoard";
import { LeadScoringDashboard } from "@/components/leads/LeadScoringDashboard";
import { FamilyOfficeMarketplacePage } from "@/components/marketplace/FamilyOfficeMarketplacePage";
import LinkedInImport from "./pages/LinkedInImport";
import ProfessionalOnboardingSuccess from "./pages/ProfessionalOnboardingSuccess";
import ProOnboarding from "./pages/ProOnboarding";
import JoinProsLanding from "./pages/JoinProsLanding";
import Index from "./pages/Index";
// Dashboard default export
import Dashboard from "./pages/Dashboard";
// Public pages
import WelcomePage from "./pages/WelcomePage";
import RetirementConfidenceScorecard from "./pages/RetirementConfidenceScorecard";
import LongevityScorecard from "./pages/LongevityScorecard";
import PublicFeeCalculator from "./pages/PublicFeeCalculator";
import RetirementIncomeGapAnalyzer from "./pages/RetirementIncomeGapAnalyzer";
import RetirementRoadmapInfo from "./pages/RetirementRoadmapInfo";
import RetirementAnalyzerDemo from "./pages/RetirementAnalyzerDemo";
import PublicTaxCenter from "./pages/PublicTaxCenter";
import { AuthPage } from "./pages/AuthPage";
import { SecuritySettingsPage } from "./pages/SecuritySettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import ClientWelcomeOnboardingPage from "./pages/ClientWelcomeOnboardingPage";
import PremiumOnboardingPage from "./pages/PremiumOnboardingPage";
import RoleBasedOnboardingPage from "./pages/RoleBasedOnboardingPage";
import { ClientDashboard } from "./pages/ClientDashboard";
import ClientPortalPage from "./pages/ClientPortalPage";
import BusinessEntitiesPage from "./pages/BusinessEntitiesPage";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdvisorBillingPage from "./pages/advisor/AdvisorBillingPage";
import AdvisorCompliancePage from "./pages/advisor/AdvisorCompliancePage";
import RegulatoryReportingPage from "./pages/advisor/RegulatoryReportingPage";
import { AdvisorCPARiskDashboard } from "./pages/AdvisorCPARiskDashboard";
import { TaxRulesAdminPage } from "./pages/TaxRulesAdminPage";
import { TaxPlatformQAPage } from "./pages/TaxPlatformQAPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import CRMDashboardPage from "./pages/CRMDashboardPage";
import { AccountantDashboard } from "./pages/AccountantDashboard";
import { ConsultantDashboard } from "./pages/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/AttorneyDashboard";
import { CoachDashboard } from "./pages/CoachDashboard";
import { ComplianceDashboard } from "./pages/ComplianceDashboard";
import HealthcareLongevityCenter from "@/components/healthcare/HealthcareLongevityCenter";

import { AuthTestPage } from "@/components/auth/AuthTestPage";
import { AssetInventory } from "@/components/AssetInventory";
import FAQPage from "./pages/FAQPage";
import AdvisorPracticeHome from "./pages/advisor/AdvisorPracticeHome";
import QATestingPage from "./pages/QATestingPage";
import VideoStoryboardPage from "./pages/VideoStoryboardPage";
import IMOAdminPage from "./pages/IMOAdminPage";
import RIAPracticeQATest from "./pages/RIAPracticeQATest";
import RIALicensingPage from "./pages/RIALicensingPage";
import CompliancePage from "./pages/CompliancePage";
import AttorneyCLEPage from "./pages/AttorneyCLEPage";
import EndToEndQAPage from "./pages/EndToEndQAPage";
import PersonaOnboardingQAPage from "./pages/PersonaOnboardingQAPage";
import StripeSubscriptionTestPage from "./pages/StripeSubscriptionTestPage";
import PersonaDashboardQAPage from "./pages/PersonaDashboardQAPage";
import GoNoGoQAPage from "./pages/GoNoGoQAPage";
import HealthcareQAPage from "./pages/HealthcareQAPage";
import AdvisorOnboardingPage from "./pages/AdvisorOnboardingPage";
import AdvisorOnboardingSequencePage from "./pages/AdvisorOnboardingSequencePage";
import AccountantOnboardingSequencePage from "./pages/AccountantOnboardingSequencePage";
import AttorneyOnboardingSequencePage from "./pages/AttorneyOnboardingSequencePage";
import AttorneyPersonaLandingPage from "./pages/AttorneyPersonaLandingPage";
import AttorneyOnboardingFlowPage from "./pages/AttorneyOnboardingFlowPage";
import AttorneyMarketingKitPage from "./pages/AttorneyMarketingKitPage";
import ClientFamilyOnboardingPage from "./pages/ClientFamilyOnboardingPage";
import MedicarePersonaLandingPage from "./pages/MedicarePersonaLandingPage";
import MedicareOnboardingPage from "./pages/MedicareOnboardingPage";
import MedicareDashboardPage from "./pages/MedicareDashboardPage";
import MedicareMarketingKitPage from "./pages/MedicareMarketingKitPage";
import InsurancePersonaLandingPage from "./pages/InsurancePersonaLandingPage";
import InsuranceOnboardingPage from "./pages/InsuranceOnboardingPage";
import AttorneyOnboardingPage from "./pages/AttorneyOnboardingPage";
import AccountantOnboardingPage from "./pages/AccountantOnboardingPage";
import AccountantDashboardPage from "./pages/AccountantDashboardPage";
import ConsultantOnboardingPage from "./pages/ConsultantOnboardingPage";
import ConsultantDashboardPage from "./pages/ConsultantDashboardPage";
import EliteFamilyOfficePersonaLandingPage from "./pages/EliteFamilyOfficePersonaLandingPage";
import EliteFamilyOfficeOnboardingPage from "./pages/EliteFamilyOfficeOnboardingPage";
import EliteFamilyOfficeDashboardPage from "./pages/EliteFamilyOfficeDashboardPage";
import RealtorPersonaLandingPage from "./pages/RealtorPersonaLandingPage";
import RealtorOnboardingPage from "./pages/RealtorOnboardingPage";
import CoachPersonaLandingPage from "./pages/CoachPersonaLandingPage";
import CoachOnboardingPage from "./pages/CoachOnboardingPage";
import SportsAgentPersonaLandingPage from "./pages/SportsAgentPersonaLandingPage";
import SportsAgentOnboardingPage from "./pages/SportsAgentOnboardingPage";
import InsuranceDashboardPage from "./pages/InsuranceDashboardPage";
import HealthcareOnboardingPage from "./pages/HealthcareOnboardingPage";
import HealthcareDashboardPage from "./pages/HealthcareDashboardPage";
import WireframePage from "./pages/WireframePage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import LendingWireframePage from "./pages/LendingWireframePage";
import CampaignVipEditorial from './pages/CampaignVipEditorial';
import GlobalOutreach from './pages/GlobalOutreach';
import GlobalPressKit from './pages/GlobalPressKit';
import SharkTankPitch from './pages/SharkTankPitch';
import PlatformMap from './pages/PlatformMap';
import NILEducationCenter from './pages/athletes/NILEducationCenter';
import NILOnboarding from './pages/athletes/NILOnboarding';
import NILLandingPage from './pages/athletes/NILLandingPage';
import { PersonaLandingPage } from './pages/PersonaLandingPage';
import { UniversalLandingPage } from './pages/UniversalLandingPage';
import { PersonaPreviewPage } from './pages/PersonaPreviewPage';
import { MarketplaceLandingPage } from './components/marketplace/MarketplaceLandingPage';
import { PublicLandingPage } from './components/marketplace/PublicLandingPage';
import { DemoCalculator } from './components/demo/DemoCalculator';
import AdminLayoutSettings from './pages/AdminLayoutSettings';
import CFODashboard from './pages/CFODashboard';
import AdminControlsPage from './pages/AdminControlsPage';
import VettingApplicationPage from './pages/VettingApplicationPage';
import { LeadMagnetPage } from './pages/LeadMagnetPage';

// Import onboarding flow component
const PersonaOnboardingFlow = React.lazy(() => 
  import('./components/onboarding/PersonaOnboardingFlow').then(module => ({
    default: module.PersonaOnboardingFlow
  }))
);

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initializeAnalytics();
    setupErrorMonitoring();
    monitorAuthEvents();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <RoleProvider>
                <SubscriptionProvider>
                  <TenantProvider>
                    <AdvisorProvider>
                      <PersonaProvider>
                        <BrowserRouter>
                          <StickyTopBanner />
                          <APIWarningBanner />
                          <ExtensionHealthBanner />
                          <ReferralTracker />
                           <Routes>
        <Route path="/wireframe" element={<WireframePage />} />
                           <Route path="/platform-map" element={<PlatformMap />} />
                           <Route path="/athletes/nil-education" element={<NILEducationCenter />} />
                           <Route path="/athletes/nil-onboarding" element={<NILOnboarding />} />
                           <Route path="/athletes/nil-landing" element={<NILLandingPage />} />
        <Route path="/lending-wireframe" element={<LendingWireframePage />} />
        <Route path="/image-generator" element={<ImageGeneratorPage />} />
                             <Route path="/persona-landing" element={<PersonaLandingPage />} />
                             <Route path="/persona-preview/:personaId" element={<PersonaPreviewPage />} />
                                <Route path="/" element={<PublicLandingPage />} />
                                <Route path="/lead-magnet" element={<LeadMagnetPage />} />
                                <Route path="/marketplace-demo" element={<MarketplaceLandingPage />} />
                                <Route path="/demo" element={<div className="min-h-screen bg-background p-8"><DemoCalculator /></div>} />
                               <Route path="/universal" element={<UniversalLandingPage />} />
                           <Route path="/marketplace" element={<FamilyOfficeMarketplacePage />} />
                           <Route path="/welcome" element={<WelcomePage />} />
                           <Route path="/auth" element={<AuthPage />} />
                           <Route path="/auth/:authType" element={<AuthPage />} />
                             <Route path="/auth/:authType/:tenantId" element={<AuthPage />} />
                             
                             {/* Persona Onboarding Routes */}
                             <Route path="/onboarding/:personaId" element={
                               <React.Suspense fallback={<div>Loading...</div>}>
                                 <PersonaOnboardingFlow />
                               </React.Suspense>
                             } />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/welcome-onboarding" element={<ClientWelcomeOnboardingPage />} />
        <Route path="/premium-onboarding" element={<PremiumOnboardingPage />} />
        <Route path="/professional-onboarding/:role" element={<RoleBasedOnboardingPage />} />
                            <Route path="/dynamic-landing" element={<DynamicLandingController><div /></DynamicLandingController>} />
                           <Route path="/security" element={<SecuritySettingsPage />} />
                          <Route path="/dashboard" element={
                            <AuthWrapper requireAuth={true}>
                              <Dashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/client" element={
                             <AuthWrapper requireAuth={true} allowedRoles={['client', 'admin', 'system_administrator', 'tenant_admin']}>
                               <ClientDashboard />
                             </AuthWrapper>
                           } />
                           <Route path="/client-portal" element={
                             <AuthWrapper requireAuth={true} allowedRoles={['client', 'admin', 'system_administrator', 'tenant_admin']}>
                               <ClientPortalPage />
                              </AuthWrapper>
                            } />
                            <Route path="/business-entities" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['client', 'admin', 'system_administrator', 'tenant_admin']}>
                                <BusinessEntitiesPage />
                              </AuthWrapper>
                            } />
                          <Route path="/advisor" element={
                            <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                              <AdvisorDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/admin" element={
                             <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                               <AdminDashboard />
                             </AuthWrapper>
                           } />
                            <Route path="/admin/layout" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                <AdminLayoutSettings />
                              </AuthWrapper>
                            } />
                            <Route path="/admin/controls" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                <AdminControlsPage />
                              </AuthWrapper>
                            } />
                            <Route path="/cfo-dashboard" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                <CFODashboard />
                              </AuthWrapper>
                            } />
                            <Route path="/apply-vetting" element={<VettingApplicationPage />} />
                          <Route path="/accountant" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['accountant', 'admin', 'system_administrator', 'tenant_admin']}>
                              <AccountantDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/consultant" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['consultant', 'admin', 'system_administrator', 'tenant_admin']}>
                              <ConsultantDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/attorney" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['attorney', 'admin', 'system_administrator', 'tenant_admin']}>
                              <AttorneyDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/coach" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['coach', 'admin', 'system_administrator', 'tenant_admin']}>
                              <CoachDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/compliance" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['compliance_officer', 'compliance_provider', 'admin', 'system_administrator', 'tenant_admin']}>
                              <ComplianceDashboard />
                            </AuthWrapper>
                          } />
                           <Route path="/compliance-ce" element={
                             <AuthWrapper requireAuth={true} allowedRoles={['accountant', 'admin', 'system_administrator', 'tenant_admin']}>
                               <CompliancePage />
                             </AuthWrapper>
                           } />
                           <Route path="/attorney-cle" element={
                             <AuthWrapper requireAuth={true} allowedRoles={['attorney', 'admin', 'system_administrator', 'tenant_admin']}>
                               <AttorneyCLEPage />
                             </AuthWrapper>
                           } />
                          <Route path="/cpa-risk" element={
                            <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                              <AdvisorCPARiskDashboard />
                            </AuthWrapper>
                          } />
                          <Route path="/crm" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                              <CRMDashboardPage />
                            </AuthWrapper>
                          } />
                          <Route path="/tax-rules" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                              <TaxRulesAdminPage />
                            </AuthWrapper>
                          } />
                          <Route path="/tax-qa" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                              <TaxPlatformQAPage />
                            </AuthWrapper>
                          } />
                          <Route path="/leads/new" element={<LeadIntakeForm />} />
                          <Route path="/leads/confirmation" element={<LeadConfirmation />} />
                          <Route path="/leads/pipeline" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                              <PipelineBoard />
                            </AuthWrapper>
                          } />
                          <Route path="/leads/scoring" element={
                            <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                              <LeadScoringDashboard />
                            </AuthWrapper>
                          } />
                          <Route path="/scorecard/retirement-confidence" element={<RetirementConfidenceScorecard />} />
                          <Route path="/scorecard/longevity" element={<LongevityScorecard />} />
                          <Route path="/calculator/fee" element={<PublicFeeCalculator />} />
                           <Route path="/analyzer/retirement-income-gap" element={<RetirementIncomeGapAnalyzer />} />
                           <Route path="/info/retirement-roadmap" element={<RetirementRoadmapInfo />} />
                           <Route path="/retirement-analyzer" element={<RetirementAnalyzerDemo />} />
                           <Route path="/tax-center" element={<PublicTaxCenter />} />
                            <Route path="/linkedin-import" element={<LinkedInImport />} />
                            <Route path="/pro-onboarding" element={<ProOnboarding />} />
                            <Route path="/join-pros" element={<JoinProsLanding />} />
                            <Route path="/professional-onboarding-success" element={<ProfessionalOnboardingSuccess />} />
                              <Route path="/faq" element={<FAQPage />} />
                              <Route path="/video-storyboard" element={<VideoStoryboardPage />} />
                              <Route path="/imo-admin" element={<IMOAdminPage />} />
                               <Route path="/qa/ria-practice" element={<RIAPracticeQATest />} />
                               <Route path="/ria-licensing/*" element={
                                 <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                                   <RIALicensingPage />
                                 </AuthWrapper>
                               } />
                  
                  <Route
                    path="/advisor/billing" 
                    element={
                      <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                        <AdvisorBillingPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/advisor/compliance" 
                    element={
                      <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                        <AdvisorCompliancePage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/advisor/regulatory-reporting" 
                    element={
                      <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                        <RegulatoryReportingPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/advisor/practice" 
                    element={
                      <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                        <AdvisorPracticeHome />
                      </AuthWrapper>
                    } 
                  />
                   <Route 
                     path="/advisor/practice/*" 
                     element={
                       <AuthWrapper requireAuth={true} allowedRoles={getAdvisorAccessRoles()}>
                         <AdvisorPracticeHome />
                       </AuthWrapper>
                     } 
                   />
                    <Route path="/healthcare" element={<HealthcareLongevityCenter />} />
                     <Route path="/healthcare-qa" element={<HealthcareQAPage />} />
                     <Route path="/auth-test" element={<AuthTestPage />} />
                     <Route path="/assets" element={<AssetInventory />} />
                     <Route path="/qa/end-to-end" element={<EndToEndQAPage />} />
        <Route path="/qa/persona-onboarding" element={<PersonaOnboardingQAPage />} />
        <Route path="/qa/stripe-subscription" element={<StripeSubscriptionTestPage />} />
        <Route path="/qa/persona-dashboards" element={<PersonaDashboardQAPage />} />
            <Route path="/qa/go-no-go" element={<GoNoGoQAPage />} />
            <Route path="/qa/healthcare" element={<HealthcareQAPage />} />
            <Route path="/advisor-onboarding" element={<AdvisorOnboardingPage />} />
        <Route path="/advisor-onboarding-sequence" element={<AdvisorOnboardingSequencePage />} />
        <Route path="/accountant-onboarding-sequence" element={<AccountantOnboardingSequencePage />} />
        <Route path="/attorney-onboarding-sequence" element={<AttorneyOnboardingSequencePage />} />
        <Route path="/client-family-onboarding" element={<ClientFamilyOnboardingPage />} />
        <Route path="/medicare-persona" element={<MedicarePersonaLandingPage />} />
        <Route path="/medicare-onboarding" element={<MedicareOnboardingPage />} />
          <Route path="/medicare-dashboard" element={<MedicareDashboardPage />} />
          <Route path="/medicare-marketing-kit" element={<MedicareMarketingKitPage />} />
                           <Route path="/insurance-persona" element={<InsurancePersonaLandingPage />} />
                           <Route path="/insurance-onboarding" element={<InsuranceOnboardingPage />} />
                           <Route path="/elite-family-office-persona" element={<EliteFamilyOfficePersonaLandingPage />} />
                           <Route path="/elite-family-office-onboarding" element={<EliteFamilyOfficeOnboardingPage />} />
                           <Route path="/elite-family-office-dashboard" element={<EliteFamilyOfficeDashboardPage />} />
                           <Route path="/realtor-persona" element={<RealtorPersonaLandingPage />} />
                           <Route path="/realtor-onboarding" element={<RealtorOnboardingPage />} />
                            <Route path="/coach-persona" element={<CoachPersonaLandingPage />} />
                            <Route path="/coach-onboarding" element={<CoachOnboardingPage />} />
                            <Route path="/sports-agent-persona" element={<SportsAgentPersonaLandingPage />} />
                            <Route path="/sports-agent-onboarding" element={<SportsAgentOnboardingPage />} />
            <Route path="/attorney-onboarding" element={<AttorneyOnboardingPage />} />
            <Route path="/accountant-onboarding" element={<AccountantOnboardingPage />} />
            <Route path="/accountant-dashboard" element={<AccountantDashboardPage />} />
          <Route path="/consultant-onboarding" element={<ConsultantOnboardingPage />} />
          <Route path="/consultant-dashboard" element={<ConsultantDashboardPage />} />
          <Route path="/insurance-onboarding" element={<InsuranceOnboardingPage />} />
          <Route path="/insurance-dashboard" element={<InsuranceDashboardPage />} />
          <Route path="/healthcare-onboarding" element={<HealthcareOnboardingPage />} />
          <Route path="/healthcare-dashboard" element={<HealthcareDashboardPage />} />
          <Route path="/shark-tank-pitch" element={<SharkTankPitch />} />

                         </Routes>
                        <Navigation />
                       </BrowserRouter>
                       <QABypassIndicator />
                       <BrandedFooter />
                      </PersonaProvider>
                     </AdvisorProvider>
                  </TenantProvider>
                  <Toaster />
                  <Sonner />
                </SubscriptionProvider>
              </RoleProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;