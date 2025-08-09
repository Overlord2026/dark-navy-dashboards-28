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
import SwagRetirementRoadmap from "./pages/retirement-roadmap/SwagRetirementRoadmap";
import InvestmentAllocationDashboard from "./pages/retirement-roadmap/InvestmentAllocationDashboard";
import SwagRoadmapSettings from "./pages/admin/SwagRoadmapSettings";
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
import { EngineDashboard } from "./pages/marketing/EngineDashboard";
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
import RealtorPersonaLanding from "./pages/personas/RealtorPersonaLanding";
import RealtorOnboarding from "./pages/realtor/RealtorOnboarding";
import RealtorDashboard from "./pages/realtor/RealtorDashboard";
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
import AthleteWealthDeck from './pages/athletes/AthleteWealthDeck';
import AdvisorDeck from './pages/sales/AdvisorDeck';
import AdvisorPersonaDeck from './components/decks/AdvisorPersonaDeck';
import CPAPersonaDeck from './components/decks/CPAPersonaDeck';
import AdvisorEmailSequence from './components/advisor/AdvisorEmailSequence';
import AdvisorEmailTester from './components/advisor/AdvisorEmailTester';
import ClientFamilyDeck from './pages/family/ClientFamilyDeck';
import AccountantDeck from './pages/accountant/AccountantDeck';
import ClientFamilySolutionsDeck from '@/components/decks/ClientFamilySolutionsDeck';
import EstateAttorneyLanding from './pages/estate-attorney/EstateAttorneyLanding';
import EstateAttorneyOnboarding from './pages/estate-attorney/EstateAttorneyOnboarding';
import EstateAttorneyDashboard from './pages/estate-attorney/EstateAttorneyDashboard';
import EstateAttorneyMarketingDeck from './pages/estate-attorney/EstateAttorneyMarketingDeck';
import LitigationAttorneyLanding from './pages/litigation-attorney/LitigationAttorneyLanding';
import LitigationAttorneyOnboarding from './pages/litigation-attorney/LitigationAttorneyOnboarding';
import LitigationAttorneyDashboard from './pages/litigation-attorney/LitigationAttorneyDashboard';
import LitigationAttorneyMarketingDeck from './pages/litigation-attorney/LitigationAttorneyMarketingDeck';
import InsuranceMedicareLanding from './pages/insurance-medicare/InsuranceMedicareLanding';
import InsuranceMedicareOnboarding from './pages/insurance-medicare/InsuranceMedicareOnboarding';
import InsuranceLifeAnnuityLanding from './pages/insurance-life-annuity/InsuranceLifeAnnuityLanding';
import InsuranceLifeAnnuityOnboarding from './pages/insurance-life-annuity/InsuranceLifeAnnuityOnboarding';
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
import { ClientFamilyIntroPage } from '@/pages/ClientFamilyIntroPage';
import { FinancialAdvisorIntroPage } from '@/pages/FinancialAdvisorIntroPage';
import { CPAAccountantIntroPage } from '@/pages/CPAAccountantIntroPage';
import { EstatePlanningAttorneyIntroPage } from '@/pages/EstatePlanningAttorneyIntroPage';
import { LitigationAttorneyIntroPage } from '@/pages/LitigationAttorneyIntroPage';
import { InsuranceAnnuityIntroPage } from '@/pages/InsuranceAnnuityIntroPage';
import { InsuranceIMOIntroPage } from '@/pages/InsuranceIMOIntroPage';
import { MarketingAgencyIntroPage } from '@/pages/MarketingAgencyIntroPage';
import { LitigationAttorneyPersonaPage } from '@/pages/persona/LitigationAttorneyPersonaPage';
import { HealthcareLongevityExpertPersonaPage } from '@/pages/persona/HealthcareLongevityExpertPersonaPage';
import { CoachConsultantPersonaPage } from '@/pages/persona/CoachConsultantPersonaPage';
import { RealtorRealEstatePersonaPage } from '@/pages/persona/RealtorRealEstatePersonaPage';
import { MarketingLeadGenAgencyPersonaPage } from '@/pages/persona/MarketingLeadGenAgencyPersonaPage';
import { PhysicianPersonaPage } from '@/pages/persona/PhysicianPersonaPage';
import { DentistPersonaPage } from '@/pages/persona/DentistPersonaPage';
import { IndustryAssociationPersonaPage } from '@/pages/persona/IndustryAssociationPersonaPage';
import { ProAthletesNILPersonaPage } from '@/pages/persona/ProAthletesNILPersonaPage';
import BusinessOwnerPersonaPage from '@/pages/persona/BusinessOwnerPersonaPage';
import EntrepreneurFounderPersonaPage from '@/pages/persona/EntrepreneurFounderPersonaPage';
import IndependentWomanPersonaPage from '@/pages/persona/IndependentWomanPersonaPage';
import CorporateExecutivePersonaPage from '@/pages/persona/CorporateExecutivePersonaPage';
import PreRetireeRetireePersonaPage from '@/pages/persona/PreRetireeRetireePersonaPage';

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
        <Route path="/athletes/wealth-deck" element={<AthleteWealthDeck />} />
          <Route path="/sales/advisor-deck" element={<AdvisorDeck />} />
          <Route path="/decks/advisor-persona" element={<AdvisorPersonaDeck />} />
          <Route path="/decks/cpa-persona" element={<CPAPersonaDeck />} />
          <Route path="/advisor/email-sequence" element={<AdvisorEmailSequence />} />
          <Route path="/advisor/email-tester" element={<AdvisorEmailTester />} />
        <Route path="/family/client-deck" element={<ClientFamilyDeck />} />
        <Route path="/accountant/deck" element={<AccountantDeck />} />
        <Route path="/decks/client-family-solutions" element={<ClientFamilySolutionsDeck />} />
        <Route path="/estate-attorney" element={<EstateAttorneyLanding />} />
        <Route path="/estate-attorney/onboarding" element={<EstateAttorneyOnboarding />} />
        <Route path="/estate-attorney/dashboard" element={<EstateAttorneyDashboard />} />
        <Route path="/litigation-attorney" element={<LitigationAttorneyLanding />} />
        <Route path="/litigation-attorney/onboarding" element={<LitigationAttorneyOnboarding />} />
        <Route path="/litigation-attorney/dashboard" element={<LitigationAttorneyDashboard />} />
        <Route path="/litigation-attorney/marketing-deck" element={<LitigationAttorneyMarketingDeck />} />
        <Route path="/estate-attorney/marketing-deck" element={<EstateAttorneyMarketingDeck />} />
        
        {/* Insurance & Medicare routes */}
        <Route path="/insurance-medicare" element={<InsuranceMedicareLanding />} />
        <Route path="/insurance-medicare/onboarding" element={<InsuranceMedicareOnboarding />} />
        
        {/* Life Insurance & Annuity routes */}
        <Route path="/insurance-life-annuity" element={<InsuranceLifeAnnuityLanding />} />
        <Route path="/insurance-life-annuity/onboarding" element={<InsuranceLifeAnnuityOnboarding />} />
        
        {/* Realtor/Property Manager routes */}
        <Route path="/personas/realtor" element={<RealtorPersonaLanding />} />
        <Route path="/realtor/onboarding" element={<RealtorOnboarding />} />
        <Route path="/realtor/dashboard" element={<RealtorDashboard />} />
        <Route path="/lending-wireframe" element={<LendingWireframePage />} />
        <Route path="/image-generator" element={<ImageGeneratorPage />} />
                             <Route path="/persona-landing" element={<PersonaLandingPage />} />
                             <Route path="/persona-preview/:personaId" element={<PersonaPreviewPage />} />
                                <Route path="/" element={<PublicLandingPage />} />
                                
                                {/* Persona intro dashboard routes */}
                                <Route path="/persona/client" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/ClientPersonaPage').then(m => ({ default: m.ClientPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/advisor" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/AdvisorPersonaPage').then(m => ({ default: m.AdvisorPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/financial-advisor" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/FinancialAdvisorPersonaPage').then(m => ({ default: m.FinancialAdvisorPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/accountant-cpa" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/AccountantCPAPersonaPage').then(m => ({ default: m.AccountantCPAPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/cpa" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/CPAPersonaPage').then(m => ({ default: m.CPAPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/attorney" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/AttorneyPersonaPage').then(m => ({ default: m.AttorneyPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/insurance" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/InsurancePersonaPage').then(m => ({ default: m.InsurancePersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/healthcare" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/HealthcarePersonaPage').then(m => ({ default: m.HealthcarePersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/realtor" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/RealtorPersonaPage').then(m => ({ default: m.RealtorPersonaPage }))))}
                                  </React.Suspense>
                                } />
                                <Route path="/persona/org" element={
                                  <React.Suspense fallback={<div>Loading...</div>}>
                                    {React.createElement(React.lazy(() => import('./pages/persona/OrgPersonaPage').then(m => ({ default: m.OrgPersonaPage }))))}
                                  </React.Suspense>
                                 } />
                                  <Route path="/client-family-intro" element={<ClientFamilyIntroPage />} />
                                  <Route path="/financial-advisor-intro" element={<FinancialAdvisorIntroPage />} />
                                  <Route path="/cpa-accountant-intro" element={<CPAAccountantIntroPage />} />
                                  <Route path="/estate-planning-attorney-intro" element={<EstatePlanningAttorneyIntroPage />} />
                                  <Route path="/litigation-attorney-intro" element={<LitigationAttorneyIntroPage />} />
          <Route path="/insurance-annuity-intro" element={<InsuranceAnnuityIntroPage />} />
          <Route path="/insurance-imo-intro" element={<InsuranceIMOIntroPage />} />
          <Route path="/marketing-agency-intro" element={<MarketingAgencyIntroPage />} />
          <Route path="/persona/litigation-attorney" element={<LitigationAttorneyPersonaPage />} />
        <Route path="/persona/healthcare-longevity-expert" element={<HealthcareLongevityExpertPersonaPage />} />
        <Route path="/persona/coach-consultant" element={<CoachConsultantPersonaPage />} />
        <Route path="/persona/realtor-real-estate-professional" element={<RealtorRealEstatePersonaPage />} />
        <Route path="/persona/marketing-lead-gen-agency" element={<MarketingLeadGenAgencyPersonaPage />} />
        <Route path="/persona/physician" element={<PhysicianPersonaPage />} />
        <Route path="/persona/dentist" element={<DentistPersonaPage />} />
        <Route path="/persona/industry-association" element={<IndustryAssociationPersonaPage />} />
        <Route path="/persona/pro-athletes-nil" element={<ProAthletesNILPersonaPage />} />
        <Route path="/persona/business-owner" element={<BusinessOwnerPersonaPage />} />
        <Route path="/persona/entrepreneur-founder" element={<EntrepreneurFounderPersonaPage />} />
        <Route path="/persona/independent-woman" element={<IndependentWomanPersonaPage />} />
        <Route path="/persona/corporate-executive" element={<CorporateExecutivePersonaPage />} />
        <Route path="/persona/pre-retiree-retiree" element={<PreRetireeRetireePersonaPage />} />
                                 <Route path="/calculator" element={<PublicFeeCalculator />} />
                                <Route path="/demo" element={<div className="min-h-screen bg-background p-8"><DemoCalculator /></div>} />
                                <Route path="/lead-magnet" element={<LeadMagnetPage />} />
                                <Route path="/marketplace-demo" element={<MarketplaceLandingPage />} />
                               <Route path="/universal" element={<UniversalLandingPage />} />
                           <Route path="/marketplace" element={<FamilyOfficeMarketplacePage />} />
                            <Route path="/welcome" element={<WelcomePage />} />
                             <Route path="/value-calculator" element={
                               <React.Suspense fallback={<div>Loading...</div>}>
                                 {React.createElement(React.lazy(() => import('./pages/ValueCalculator')))}
                               </React.Suspense>
                           } />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/auth/:authType" element={<AuthPage />} />
                              <Route path="/auth/:authType/:tenantId" element={<AuthPage />} />
                              <Route path="/settings/automation" element={
                                <AuthWrapper requireAuth={true}>
                                  {React.createElement(React.lazy(() => import('./pages/settings/AutomationSettings')))}
                                </AuthWrapper>
                              } />
                              <Route path="/admin/insights/win-loss" element={
                                <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                  {React.createElement(React.lazy(() => import('./pages/admin/insights/WinLossInsights')))}
                                </AuthWrapper>
                              } />
                             
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
                            <Route path="/admin/ai-marketing-engine" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin', 'marketing_manager', 'compliance_officer']}>
                                <EngineDashboard />
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
                             <Route path="/admin/roadmap-settings" element={
                               <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                 <SwagRoadmapSettings />
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
                            <Route path="/value-calculator" element={
                              <React.Suspense fallback={<div>Loading...</div>}>
                                {React.createElement(React.lazy(() => import('./pages/value-calculator')))}
                              </React.Suspense>
                            } />
                            <Route path="/admin/qa-center" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                {React.createElement(React.lazy(() => import('./pages/admin/QACenter')))}
                              </AuthWrapper>
                            } />
                            <Route path="/admin/deck-hub" element={
                              <AuthWrapper requireAuth={true} allowedRoles={['admin', 'system_administrator', 'tenant_admin']}>
                                {React.createElement(React.lazy(() => import('./pages/admin/DeckHub')))}
                              </AuthWrapper>
                            } />
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
                            <Route path="/realtor-persona" element={<RealtorPersonaLanding />} />
                            <Route path="/realtor-onboarding" element={<RealtorOnboarding />} />
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