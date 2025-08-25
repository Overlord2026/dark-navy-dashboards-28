import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import { ToolsProvider } from '@/contexts/ToolsContext';
import { Toaster } from '@/components/ui/toaster';
import DevPanel from '@/components/dev/DevPanel';
import CTAStickyBar from '@/components/ui/CTAStickyBar';
import NILOnboarding from '@/pages/nil/Onboarding';
import Education from '@/pages/nil/Education';
import Disclosures from '@/pages/nil/Disclosures';
import Offers from '@/pages/nil/Offers';
import Marketplace from '@/pages/nil/Marketplace';
import Contract from '@/pages/nil/Contract';
import Payments from '@/pages/nil/Payments';
import Disputes from '@/pages/nil/Disputes';
import Receipts from '@/pages/nil/Receipts';
import Admin from '@/pages/nil/Admin';
import NilReadyCheckPage from '@/pages/nil/admin/NilReadyCheckPage';
import Pricing from '@/pages/Pricing';
import FixturesPanel from '@/pages/dev/FixturesPanel';
import Discover from '@/pages/Discover';
import SearchPage from '@/pages/SearchPage';
import { HowItWorks } from '@/pages/HowItWorks';
import SolutionsPage from '@/pages/SolutionsPage';
import SolutionCategoryPage from '@/pages/solutions/SolutionCategoryPage';
import { Annuities } from '@/pages/solutions/Annuities';
import { SolutionsInvestmentsPage } from '@/pages/solutions/SolutionsInvestmentsPage';
import { SolutionsInsurancePage } from '@/pages/solutions/SolutionsInsurancePage';
import { SolutionsLendingPage } from '@/pages/solutions/SolutionsLendingPage';
import { SolutionsTaxPage } from '@/pages/solutions/SolutionsTaxPage';
import { SolutionsEstatePage } from '@/pages/solutions/SolutionsEstatePage';
import { OnboardingFlow } from '@/pages/OnboardingFlow';
import QACoverage from '@/pages/admin/QACoverage';
import ReadyCheck from '@/pages/admin/ReadyCheck';
import { ReadyCheckEnhanced } from '@/pages/admin/ReadyCheckEnhanced';
import AdminPanel from '@/pages/admin/AdminPanel';
import JobsPanel from '@/pages/admin/JobsPanel';
import PublishPanel from '@/pages/admin/PublishPanel';
import { EnvInspector } from '@/pages/admin/EnvInspector';
import RulesCoverage from '@/pages/admin/RulesCoverage';
import RulesImport from '@/pages/admin/RulesImport';
import RulesExport from '@/pages/admin/RulesExport';
import RulesReplaceCounty from '@/pages/admin/RulesReplaceCounty';
import RulesReplaceStates from '@/pages/admin/RulesReplaceStates';
import CountyQuickAdd from '@/pages/admin/CountyQuickAdd';
import MarketingPreview from '@/pages/preview/MarketingPreview';
import NewReviewSession from '@/pages/estate/review/NewReviewSession';
import ReviewSession from '@/pages/attorney/ReviewSession';
import ReviewView from '@/pages/family/ReviewView';
import VaultAutofillConsent from '@/pages/family/VaultAutofillConsent';
import VaultAutofillReview from '@/pages/advisor/VaultAutofillReview';
import ChecklistExport from '@/pages/supervisor/ChecklistExport';
import NotFound from '@/pages/NotFound';
import { getFlag } from '@/lib/flags';

// Onboarding Components
import FamilyOnboarding from '@/pages/onboarding/FamilyOnboarding';
import ProfessionalOnboarding from '@/pages/onboarding/ProfessionalOnboarding';
import HealthcareOnboarding from '@/pages/onboarding/HealthcareOnboarding';
import NILOnboardingFlow from '@/pages/onboarding/NILOnboarding';
import { BrandOnboarding } from '@/pages/brand/BrandOnboarding';
import { BrandHub } from '@/pages/brand/BrandHub';
import { SolutionsHub } from '@/components/solutions/SolutionsHub';

const DemoPage = React.lazy(() => import('@/pages/demos/[persona]'));
const PreviewPage = React.lazy(() => import('@/components/PreviewPage'));

// Estate Planning Components
const EstateWorkbench = React.lazy(() => import('@/pages/estate/EstateWorkbench'));
const EstateDIYWizard = React.lazy(() => import('@/pages/estate/EstateDIYWizard'));
const HealthcareDIYWizard = React.lazy(() => import('@/pages/estate/HealthcareDIYWizard'));
const AdvisorEstatePage = React.lazy(() => import('@/pages/advisors/AdvisorEstatePage'));
const AttorneyEstateWorkbench = React.lazy(() => import('@/pages/attorney/AttorneyEstateWorkbench'));
const HealthcareProWorkbench = React.lazy(() => import('@/pages/attorney/HealthcareProWorkbench'));
const CPAEstatePage = React.lazy(() => import('@/pages/cpa/CPAEstatePage'));

import FamilyHome from '@/pages/family/Home';
import FamilyToolsHub from '@/pages/family/FamilyToolsHub';
import RothLadderTool from '@/pages/family/RothLadderTool';
import RMDCheckTool from '@/pages/family/RMDCheckTool';
import TaxHubPreview from '@/pages/family/TaxHubPreview';
import FamilyReceipts from '@/pages/family/FamilyReceipts';
import RetirementRoadmapTool from '@/pages/tools/RetirementRoadmapTool';
import SocialSecurityTool from '@/pages/tools/SocialSecurityTool';
import AdvisorHome from '@/pages/advisor/AdvisorHome';
import { AdvisorsLayout } from '@/layouts/AdvisorsLayout';
import AdvisorsHome from '@/pages/advisors/AdvisorsHome';
import LeadsPage from '@/pages/advisors/LeadsPage';
import MeetingsPage from '@/pages/advisors/MeetingsPage';
import CampaignsPage from '@/pages/advisors/CampaignsPage';
import PipelinePage from '@/pages/advisors/PipelinePage';
import AdvisorTools from '@/pages/advisors/AdvisorTools';
import NILAthleteHome from '@/pages/nil/NILAthleteHome';
import MarketplacePage from '@/pages/nil/Marketplace';
import NILIndex from '@/pages/nil/NILIndex';

// Crypto Components
const CryptoDashboard = React.lazy(() => import('@/pages/crypto/CryptoDashboard'));
const BeneficiaryDirectives = React.lazy(() => import('@/pages/crypto/BeneficiaryDirectives'));
const TradePanel = React.lazy(() => import('@/pages/crypto/TradePanel'));

function App() {
  // Check authentication status (simplified for demo)
  const isAuthenticated = typeof window !== 'undefined' && 
    (localStorage.getItem('user_session') || localStorage.getItem('auth_token'));

  return (
    <ToolsProvider>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/family/home" replace /> : 
              getFlag('PUBLIC_DISCOVER_ENABLED') ? <Navigate to="/discover" replace /> : 
              <Navigate to="/nil/onboarding" replace />
            } />
            
            {/* Public Pages - Flag Protected */}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/discover" element={<Discover />} />}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/search" element={<SearchPage />} />}
            <Route path="/how-it-works" element={<HowItWorks />} />
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions" element={<SolutionsPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/annuities" element={<Annuities />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/investments" element={<SolutionsInvestmentsPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/insurance" element={<SolutionsInsurancePage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/lending" element={<SolutionsLendingPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/tax" element={<SolutionsTaxPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/estate" element={<SolutionsEstatePage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/:solutionKey" element={<SolutionCategoryPage />} />}
            
            {/* NIL Public Pages */}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil" element={<MarketplacePage />} />}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/index" element={<NILIndex />} />}
            
            {/* New Home Pages */}
            <Route path="/advisor/home" element={<AdvisorHome />} />
            <Route path="/nil/athlete/home" element={<NILAthleteHome />} />
            
            {/* Onboarding Routes - Flag Protected */}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/families" element={<FamilyOnboarding />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/advisors" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/cpas" element={<ProfessionalOnboarding professionalType="cpas" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/attorneys" element={<ProfessionalOnboarding professionalType="attorneys" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/realtor" element={<ProfessionalOnboarding professionalType="realtor" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/insurance" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/healthcare" element={<HealthcareOnboarding segment="providers" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/nil-athlete" element={<NILOnboardingFlow type="athlete" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/nil-school" element={<NILOnboardingFlow type="school" />} />}
            {getFlag('BRAND_PUBLIC_ENABLED') && <Route path="/start/brand" element={<BrandOnboarding />} />}
            
            {/* Estate Planning Routes */}
            <Route path="/estate/workbench" element={
              <Suspense fallback={<div>Loading...</div>}>
                <EstateWorkbench />
              </Suspense>
            } />
            <Route path="/estate/diy" element={
              <Suspense fallback={<div>Loading...</div>}>
                <EstateDIYWizard />
              </Suspense>
            } />
            <Route path="/estate/healthcare" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HealthcareDIYWizard />
              </Suspense>
            } />
            <Route path="/advisors/estate" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorEstatePage />
              </Suspense>
            } />
            <Route path="/attorney/estate" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AttorneyEstateWorkbench />
              </Suspense>
            } />
            <Route path="/attorney/estate/health" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HealthcareProWorkbench />
              </Suspense>
            } />
            <Route path="/cpa/estate" element={
              <Suspense fallback={<div>Loading...</div>}>
                <CPAEstatePage />
              </Suspense>
            } />
            
            {/* Family App Routes (Authenticated) */}
            <Route path="/family/home" element={<FamilyHome />} />
            <Route path="/family/tools" element={<FamilyToolsHub />} />
            <Route path="/family/tools/retirement" element={<RetirementRoadmapTool />} />
            <Route path="/family/tools/roth-ladder" element={<RothLadderTool />} />
            <Route path="/family/tools/ss-timing" element={<SocialSecurityTool />} />
            <Route path="/family/tools/rmd-check" element={<RMDCheckTool />} />
            <Route path="/family/tools/taxhub-preview" element={<TaxHubPreview />} />
            <Route path="/family/receipts" element={<FamilyReceipts />} />
            
            {/* Estate Review Routes */}
            <Route path="/estate/review/new" element={<NewReviewSession />} />
            <Route path="/attorney/estate/review/:id" element={<ReviewSession />} />
            <Route path="/family/review/:id" element={<ReviewView />} />
            <Route path="/family/vault/autofill-consent" element={<VaultAutofillConsent />} />
            <Route path="/advisor/vault/autofill-review" element={<VaultAutofillReview />} />
            <Route path="/supervisor/checklist" element={<ChecklistExport />} />
            
            {/* Advisor App Routes */}
            <Route path="/advisors" element={<Navigate to="/advisors/home" replace />} />
            <Route path="/advisors/*" element={<AdvisorsLayout />}>
              <Route path="home" element={<AdvisorsHome />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="tools" element={<AdvisorTools />} />
            </Route>
            
            {/* Legacy Advisor Route (redirect) */}
            <Route path="/advisor/home" element={<Navigate to="/advisors/home" replace />} />
            
            {/* Brand Hub Routes */}
            {getFlag('BRAND_PUBLIC_ENABLED') && <Route path="/brand" element={<BrandHub />} />}
            {getFlag('BRAND_PUBLIC_ENABLED') && <Route path="/brand/enterprise" element={<BrandHub segment="enterprise" />} />}
            {getFlag('BRAND_PUBLIC_ENABLED') && <Route path="/brand/local" element={<BrandHub segment="local-business" />} />}
            
            {/* Private App Routes */}
            <Route path="/onboarding" element={<OnboardingFlow />} />
            <Route path="/nil/onboarding" element={<NILOnboarding />} />
            <Route path="/nil/education" element={<Education />} />
            <Route path="/nil/disclosures" element={<Disclosures />} />
            <Route path="/nil/offers" element={<Offers />} />
            <Route path="/nil/marketplace" element={<Marketplace />} />
            <Route path="/nil/contract/:id" element={<Contract />} />
            <Route path="/nil/payments" element={<Payments />} />
            <Route path="/nil/disputes" element={<Disputes />} />
            <Route path="/nil/receipts" element={<Receipts />} />
            <Route path="/nil/admin" element={<Admin />} />
            <Route path="/nil/admin/ready-check" element={<NilReadyCheckPage />} />
            <Route path="/pricing" element={<Pricing />} />
            
            
            {/* Admin Routes - Flag Protected */}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/qa-coverage" element={<QACoverage />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ready-check" element={<ReadyCheck />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ready-check-enhanced" element={<ReadyCheckEnhanced />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rules-coverage" element={<RulesCoverage />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rules-import" element={<RulesImport />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rules-export" element={<RulesExport />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rules-replace-county" element={<RulesReplaceCounty />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rules-replace-states" element={<RulesReplaceStates />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/county-add" element={<CountyQuickAdd />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin" element={<AdminPanel />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/jobs" element={<JobsPanel />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/publish" element={<PublishPanel />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/env" element={<EnvInspector />} />}
            
            {/* Demo Routes */}
            {getFlag('DEMOS_ENABLED') && (
              <Route path="/demos/:persona" element={
                <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                  <DemoPage />
                </Suspense>
              } />
            )}
            
            {/* Dev Routes */}
            {process.env.NODE_ENV !== 'production' && (
              <Route path="/dev/fixtures" element={<FixturesPanel />} />
            )}
            
            {/* Preview Routes - Marketing pages for missing tools */}
            <Route path="/preview/:key" element={
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading preview...</div>}>
                <PreviewPage />
              </Suspense>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <DevPanel />
          
          
          {/* Show CTA bar on public pages only - Flag Protected */}
          {!isAuthenticated && getFlag('PUBLIC_CTA_BAR') && <CTAStickyBar />}
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ToolsProvider>
  );
}

export default App;