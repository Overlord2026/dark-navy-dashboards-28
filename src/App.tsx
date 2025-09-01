import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import '@/styles/brand.css';
import BrandHeader from '@/components/layout/BrandHeader';
import { MegaMenu } from '@/components/nav/MegaMenu';
import { ToolsProvider } from '@/contexts/ToolsContext';
import { Toaster } from '@/components/ui/toaster';
import DevPanel from '@/components/dev/DevPanel';
import { AutoLoadDemo } from '@/components/AutoLoadDemo';
import CTAStickyBar from '@/components/ui/CTAStickyBar';
import NILOnboarding from '@/pages/nil/Onboarding';
import Education from '@/pages/nil/Education';
import Search from '@/pages/nil/Search';
import Goals from '@/pages/nil/Goals';
import Disclosures from '@/pages/nil/Disclosures';
import Offers from '@/pages/nil/Offers';
import Marketplace from '@/pages/nil/Marketplace';
import Contract from '@/pages/nil/Contract';
import Payments from '@/pages/nil/Payments';
import Disputes from '@/pages/nil/Disputes';
import Receipts from '@/pages/nil/Receipts';
import Index from '@/pages/nil/Index';
import Admin from '@/pages/nil/Admin';
import NilReadyCheckPage from '@/pages/nil/admin/NilReadyCheckPage';
import Pricing from '@/pages/Pricing';

// Landing page imports
import FamiliesLanding from '@/pages/landing/FamiliesLanding';
import ProsLanding from '@/pages/landing/ProsLanding';
import GoalsPage from '@/pages/landing/GoalsPage';
import CatalogPage from '@/pages/landing/CatalogPage';
import HealthcareLanding from '@/pages/landing/HealthcareLanding';
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
const HQDashboard = React.lazy(() => import('@/pages/admin/hq'));

const AiesConsole = React.lazy(() => import('@/pages/admin/AiesConsole'));
import AdminPanel from '@/pages/admin/AdminPanel';
import JobsPanel from '@/pages/admin/JobsPanel';
import PublishPanel from '@/pages/admin/PublishPanel';
import { EnvInspector } from '@/pages/admin/EnvInspector';
import K401Partner from '@/pages/admin/K401Partner';
import RulesCoverage from '@/pages/admin/RulesCoverage';
import RulesImport from '@/pages/admin/RulesImport';
import AiAudit from '@/pages/admin/AiAudit';
import K401ChecklistRunner from '@/pages/admin/K401ChecklistRunner';
import MigrationHub from '@/pages/admin/MigrationHub';
import K401FormsAdmin from '@/pages/admin/K401FormsAdmin';
import K401ProviderRulesSearch from '@/pages/admin/K401ProviderRulesSearch';
import K401CMAUploader from '@/pages/admin/K401CMAUploader';
import DbMigrations from '@/pages/admin/DbMigrations';
import BrokerKit from '@/pages/broker/BrokerKit';
import K401CompliancePack from '@/pages/admin/K401CompliancePack';
import RulesExport from '@/pages/admin/RulesExport';
import AnchorList from '@/pages/admin/AnchorList';
import ReceiptView from '@/pages/admin/ReceiptView';
import MigrationHubInvite from '@/pages/admin/MigrationHubInvite';
import MigrationQueueAdmin from '@/pages/admin/MigrationQueueAdmin';
import RulesReplaceCounty from '@/pages/admin/RulesReplaceCounty';
import RulesReplaceStates from '@/pages/admin/RulesReplaceStates';
import CountyQuickAdd from '@/pages/admin/CountyQuickAdd';
import CountyMetaEditor from '@/pages/admin/estate/CountyMetaEditor';
import RuleSyncAdmin from '@/pages/admin/rulesync/RuleSyncAdmin';
import EstateRonDemo from '@/pages/admin/estate/EstateRonDemo';
import MarketingPreview from '@/pages/preview/MarketingPreview';
import NewReviewSession from '@/pages/estate/review/NewReviewSession';
import ReviewSession from '@/pages/attorney/ReviewSession';
import ReviewView from '@/pages/family/ReviewView';

// Trust Rails Admin Pages
import ReceiptsViewer from '@/pages/admin/receipts/ReceiptsViewer';
import TrustAnchors from '@/pages/admin/anchors/Anchors';

// BFO Ops Admin Pages
import SitesAdmin from '@/pages/admin/sites/SitesAdmin';
import RevenueAdmin from '@/pages/admin/revenue/RevenueAdmin';
import AutomationsAdmin from '@/pages/admin/automations/AutomationsAdmin';
import TransitionDetail from '@/pages/admin/transition/TransitionDetail';
import DiligenceAdmin from '@/pages/admin/diligence/DiligenceAdmin';
const RolloverWizard = React.lazy(() => import('@/pages/k401/RolloverWizard'));
const AdvisorBook = React.lazy(() => import('@/pages/k401/AdvisorBook'));

// K401 Delegated Access Components
const ClientGrantAccess = React.lazy(() => import('@/pages/k401/ClientGrantAccess'));
const AdvisorRequestAccess = React.lazy(() => import('@/pages/k401/AdvisorRequestAccess'));
const ClientApproveSession = React.lazy(() => import('@/pages/k401/ClientApproveSession'));
const AdvisorAssistConsole = React.lazy(() => import('@/pages/k401/AdvisorAssistConsole'));
import VaultAutofillConsent from '@/pages/family/VaultAutofillConsent';
import VaultAutofillReview from '@/pages/advisor/VaultAutofillReview';
import ChecklistExport from '@/pages/supervisor/ChecklistExport';
import NotFound from '@/pages/NotFound';
import { getFlag } from '@/lib/flags';
import '@/features/k401/init'; // Initialize provider rules

// Onboarding Components
const FamilyOnboarding = React.lazy(() => import('@/pages/onboarding/FamilyOnboarding'));
const AdvisorOnboarding = React.lazy(() => import('@/pages/onboarding/AdvisorOnboarding'));
import ProfessionalOnboarding from '@/pages/onboarding/ProfessionalOnboarding';
import HealthcareOnboarding from '@/pages/onboarding/HealthcareOnboarding';
import NILOnboardingFlow from '@/pages/onboarding/NILOnboarding';
import { BrandOnboarding } from '@/pages/brand/BrandOnboarding';
import { BrandHub } from '@/pages/brand/BrandHub';
import { SolutionsHub } from '@/components/solutions/SolutionsHub';
import StarterPage from '@/pages/learn/StarterPage';
import AdvisorPersonaDashboard from '@/pages/personas/AdvisorPersonaDashboard';
import AdvisorDashboardWithSideNav from '@/pages/personas/AdvisorDashboardWithSideNav';
import AccountantDashboard from '@/pages/pros/AccountantDashboard';
import Attorneys from '@/pages/pros/Attorneys';
import FamilyRoadmap from '@/pages/family/FamilyRoadmap';
import InsurancePersonaDashboard from '@/pages/personas/InsurancePersonaDashboard';
import AccountantPersonaDashboard from '@/pages/personas/AccountantPersonaDashboard';
import AttorneyPersonaDashboard from '@/pages/personas/AttorneyPersonaDashboard';
import FamilyRetireePersonaDashboard from '@/pages/personas/FamilyRetireePersonaDashboard';
import FamilyAspiringPersonaDashboard from '@/pages/personas/FamilyAspiringPersonaDashboard';
import Advisors from '@/pages/personas/Advisors';
import Insurance from '@/pages/personas/Insurance';
import DemoPersona from '@/pages/learn/DemoPersona';
import { PersonaDashboard } from '@/components/bfo/PersonaDashboard';
import { SecurityDashboard } from '@/components/bfo/SecurityDashboard';
import { AdminMigrations } from '@/components/bfo/AdminMigrations';
import { IPTracker } from '@/components/bfo/IPTracker';
import AdminHQ from '@/pages/admin/AdminHQ';
import IPHQ from '@/pages/admin/IPHQ';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Marketplace imports
import MarketplaceIndex from '@/pages/marketplace/Index';
import MarketplaceAdvisors from '@/pages/marketplace/Advisors';
import AdvisorProfile from '@/pages/marketplace/AdvisorProfile';

const CpaHome = React.lazy(() => import('@/pages/cpas/CpaHome'));
const CpaMarketplace = React.lazy(() => import('@/pages/marketplace/CpaMarketplace'));
const CpaProfile = React.lazy(() => import('@/pages/marketplace/CpaProfile'));
const TaxProjectionTool = React.lazy(() => import('@/pages/tools/TaxProjectionTool'));
const ContinuingEducation = React.lazy(() => import('@/pages/learn/ContinuingEducation'));
const TaxHubPro = React.lazy(() => import('@/pages/taxhub/TaxHubPro'));
const CpaTools = React.lazy(() => import('@/pages/cpa/CpaTools'));
const CpaLearn = React.lazy(() => import('@/pages/cpa/CpaLearn'));
const EstateWorkbench = React.lazy(() => import('@/pages/estate/EstateWorkbench'));
const AttorneyMarketplace = React.lazy(() => import('@/pages/marketplace/AttorneyMarketplace'));

const DemoPage = React.lazy(() => import('@/pages/demos/[persona]'));
const PreviewPage = React.lazy(() => import('@/components/PreviewPage'));

// Estate Planning Components
const EstateDIYWizard = React.lazy(() => import('@/pages/estate/EstateDIYWizard'));
const HealthcareDIYWizard = React.lazy(() => import('@/pages/estate/HealthcareDIYWizard'));
const AdvisorEstatePage = React.lazy(() => import('@/pages/advisors/AdvisorEstatePage'));
const AttorneyEstateWorkbench = React.lazy(() => import('@/pages/attorney/AttorneyEstateWorkbench'));
const HealthcareProWorkbench = React.lazy(() => import('@/pages/attorney/HealthcareProWorkbench'));
const CPAEstatePage = React.lazy(() => import('@/pages/cpa/CPAEstatePage'));

import FamilyHome from '@/pages/families/FamilyHome';
import FamilyToolsHub from '@/pages/family/FamilyToolsHub';
import RothLadderTool from '@/pages/family/RothLadderTool';
import RMDCheckTool from '@/pages/family/RMDCheckTool';
import TaxHubPreview from '@/pages/family/TaxHubPreview';
import FamilyReceipts from '@/pages/family/FamilyReceipts';
import RetirementRoadmapTool from '@/pages/tools/RetirementRoadmapTool';
import SocialSecurityTool from '@/pages/tools/SocialSecurityTool';
import EstateToolPage from '@/pages/tools/EstateToolPage';
import TaxToolPage from '@/pages/tools/TaxToolPage';
import VaultPage from '@/pages/tools/VaultPage';
import RetireeGoals from '@/pages/families/RetireeGoals';
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
import NILDemoPage from '@/pages/nil/DemoPage';
import NILTourPage from '@/pages/nil/TourPage';
import InvestorRollupPage from '@/pages/investor/InvestorRollupPage';

// Crypto Components
const CryptoDashboard = React.lazy(() => import('@/pages/crypto/CryptoDashboard'));
const BeneficiaryDirectives = React.lazy(() => import('@/pages/crypto/BeneficiaryDirectives'));
const TradePanel = React.lazy(() => import('@/pages/crypto/TradePanel'));

// Insurance & Marketplace
import { IntakePage as InsuranceIntakePage } from './pages/insurance/IntakePage';
import { QuotePage } from './pages/insurance/QuotePage';
import { BindPage } from './pages/insurance/BindPage';
import { FNOLPage } from './pages/insurance/FNOLPage';
import { AssetsPage as FamilyAssetsPage } from './pages/family/AssetsPage';
import { AssetDetailPage } from './pages/family/AssetDetailPage';
import { MeetingsPage as ProMeetingsPage } from './pages/pros/MeetingsPage';
import { AgentsPage } from './pages/marketplace/AgentsPage';
import { QuoteStartPage } from './pages/marketplace/QuoteStartPage';
import { supabase } from '@/integrations/supabase/client';

// Stub component for avoiding 404s
const Stub = ({ title }: { title: string }) => <div className="p-10 text-white text-2xl">{title}</div>;

function App() {
  // Check authentication status using Supabase session
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  
  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(!!session)
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Query param demo auto-loading
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    const autoplay = params.get('autoplay');
    
    if (demo === 'nil_coach' || demo === 'nil_mom') {
      const profile = demo === 'nil_coach' ? 'coach' : 'mom';
      console.log('Auto-loading NIL demo for:', profile);
      
      // Dynamic import to avoid circular dependency
      import('@/fixtures/fixtures.nil').then(({ loadNilFixtures }) => {
        loadNilFixtures(profile).then(() => {
          if (autoplay === '1' && window.location.pathname.includes('/nil/tour')) {
            // Stay on tour page and trigger autoplay
            console.log('Auto-starting tour for:', profile);
          } else {
            // Remove query param and redirect to demo page
            window.history.replaceState({}, '', '/nil/demo');
          }
        });
      });
    }
  }, []);

  return (
    <ToolsProvider>
      <HelmetProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen bg-background text-foreground">
            <BrandHeader />
            <MegaMenu />
            <div>
            <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/family/home" replace /> : 
              getFlag('PUBLIC_DISCOVER_ENABLED') ? <Navigate to="/discover" replace /> : 
              <Navigate to="/nil/onboarding" replace />
            } />
            
            {/* NEW: Primary nav landing pages */}
            <Route path="/families" element={<FamiliesLanding />} />
            <Route path="/pros" element={<ProsLanding />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/health" element={<HealthcareLanding />} />
            
            {/* Family Routes */}
            <Route path="/family/roadmap" element={<FamilyRoadmap />} />
            
            {/* Route Redirects */}
            <Route path="/family" element={<Navigate to="/family/home" replace />} />
            <Route path="/advisors" element={<Navigate to="/pros/advisors" replace />} />
            <Route path="/insurance" element={<Navigate to="/pros/insurance" replace />} />
            
            
            {/* Pros sub-routes */}
            <Route path="/pros/advisors" element={<AdvisorDashboardWithSideNav />} />
            <Route path="/pros/accountants" element={<AccountantDashboard />} />
            <Route path="/pros/attorneys" element={<Attorneys />} />
            <Route path="/pros/insurance/life" element={<Navigate to="/personas/insurance/life" replace />} />
            <Route path="/pros/insurance/other" element={<Navigate to="/personas/insurance" replace />} />
            
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceIndex />} />
            <Route path="/marketplace/advisors" element={<MarketplaceAdvisors />} />
            <Route path="/marketplace/advisors/:id" element={<AdvisorProfile />} />
            <Route path="/cpas/home" element={<React.Suspense fallback={<div>Loading...</div>}><CpaHome /></React.Suspense>} />
            <Route path="/marketplace/cpas" element={<React.Suspense fallback={<div>Loading...</div>}><CpaMarketplace /></React.Suspense>} />
            <Route path="/marketplace/cpas/:id" element={<React.Suspense fallback={<div>Loading...</div>}><CpaProfile /></React.Suspense>} />
            <Route path="/marketplace/attorneys" element={<React.Suspense fallback={<div>Loading...</div>}><AttorneyMarketplace /></React.Suspense>} />
            <Route path="/tools/tax-projection" element={<React.Suspense fallback={<div>Loading...</div>}><TaxProjectionTool /></React.Suspense>} />
            <Route path="/learn/ce" element={<React.Suspense fallback={<div>Loading...</div>}><ContinuingEducation /></React.Suspense>} />
            <Route path="/taxhub/pro" element={<React.Suspense fallback={<div>Loading...</div>}><TaxHubPro /></React.Suspense>} />
            <Route path="/cpa/tools" element={<React.Suspense fallback={<div>Loading...</div>}><CpaTools /></React.Suspense>} />
            <Route path="/cpa/learn" element={<React.Suspense fallback={<div>Loading...</div>}><CpaLearn /></React.Suspense>} />
            <Route path="/estate/workbench" element={<React.Suspense fallback={<div>Loading...</div>}><EstateWorkbench /></React.Suspense>} />
            <Route path="/families/retirees/goals" element={<RetireeGoals />} />
            
            {/* Stub routes to avoid 404s */}
            <Route path="/platform" element={<Stub title="Platform overview (stub)" />} />
            <Route path="/solutions" element={<Stub title="Solutions (stub)" />} />
            <Route path="/services" element={<Stub title="Services (stub)" />} />
            
            {/* Helpful redirects for old links */}
            <Route path="/personas" element={<Navigate to="/pros" replace />} />
            <Route path="/healthcare" element={<Navigate to="/health" replace />} />
            <Route path="/discover" element={<Navigate to="/catalog" replace />} />
            
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
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/index" element={<Index />} />}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/demo" element={<NILDemoPage />} />}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/tour" element={<NILTourPage />} />}
            
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
            
            {/* Direct Onboarding Routes */}
            <Route path="/onboarding/family" element={<Suspense fallback={<div>Loading...</div>}><FamilyOnboarding /></Suspense>} />
            <Route path="/onboarding/advisor" element={<Suspense fallback={<div>Loading...</div>}><AdvisorOnboarding /></Suspense>} />
            
            {/* Persona Dashboard Routes */}
            <Route path="/personas/advisors" element={<PersonaDashboard personaId="advisors" />} />
            <Route path="/personas/insurance" element={<PersonaDashboard personaId="insurance" />} />
            <Route path="/personas/insurance/:subPersonaId" element={<PersonaDashboard personaId="insurance" />} />
            <Route path="/personas/attorney" element={<PersonaDashboard personaId="attorney" />} />
            <Route path="/personas/attorney/:subPersonaId" element={<PersonaDashboard personaId="attorney" />} />
            <Route path="/personas/cpa" element={<PersonaDashboard personaId="cpa" />} />
            <Route path="/personas/healthcare" element={<PersonaDashboard personaId="healthcare" />} />
            <Route path="/personas/healthcare/:subPersonaId" element={<PersonaDashboard personaId="healthcare" />} />
            <Route path="/personas/nil" element={<PersonaDashboard personaId="nil" />} />
            <Route path="/family/home" element={<PersonaDashboard personaId="family" />} />
            
            {/* Admin & Security Routes */}
            <Route path="/admin/security" element={<SecurityDashboard />} />
            <Route path="/admin/migrations" element={<AdminMigrations />} />
            <Route path="/admin/ip-tracker" element={<IPTracker />} />
            <Route path="/admin/ip" element={<ProtectedRoute requiredRole="admin"><IPHQ/></ProtectedRoute>} />
            <Route path="/admin/hq/ip" element={<Suspense fallback={<div>Loading...</div>}><AiesConsole /></Suspense>} />
            <Route path="/admin/hq/ip-ledger" element={<ProtectedRoute requiredRole="admin"><IPHQ/></ProtectedRoute>} />
            
            {/* Investor Routes */}
            <Route path="/investor/rollup" element={<InvestorRollupPage />} />
            
            <Route path="/insurance" element={<Insurance />} />
            
            {/* Full Persona Dashboard Routes */}
            <Route path="/personas/advisors/full" element={<AdvisorPersonaDashboard />} />
            <Route path="/personas/insurance/full" element={<InsurancePersonaDashboard />} />
            <Route path="/personas/accountants" element={<AccountantPersonaDashboard />} />
            <Route path="/personas/attorneys" element={<AttorneyPersonaDashboard />} />
            <Route path="/personas/families/retirees" element={<FamilyRetireePersonaDashboard />} />
            <Route path="/personas/families/aspiring" element={<FamilyAspiringPersonaDashboard />} />
            
            {/* Learn/Booking Routes */}
            <Route path="/learn/:persona/starter" element={<StarterPage />} />
            <Route path="/learn/demo/:persona" element={
              <Suspense fallback={<div>Loading...</div>}>
                <DemoPersona />
              </Suspense>
            } />
          
          {/* Insurance Hub Routes */}
          <Route path="/insurance/intake" element={<InsuranceIntakePage />} />
          <Route path="/insurance/quote/:id" element={<QuotePage />} />
          <Route path="/insurance/bind/:id" element={<BindPage />} />
          <Route path="/insurance/fnol/:id" element={<FNOLPage />} />
          
          {/* Family Assets Routes */}
          <Route path="/family/assets" element={<FamilyAssetsPage />} />
          <Route path="/family/assets/:id" element={<AssetDetailPage />} />
          
          {/* Professional Meeting Tools */}
          <Route path="/pros/meetings" element={<ProMeetingsPage />} />
          
          {/* Marketplace & Quotes */}
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/quotes/start" element={<QuoteStartPage />} />
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
            <Route path="/families/home" element={<FamilyHome />} />
            <Route path="/family/home" element={<FamilyHome />} />
            <Route path="/family/tools" element={<FamilyToolsHub />} />
            <Route path="/family/tools/retirement" element={<RetirementRoadmapTool />} />
            <Route path="/family/tools/roth-ladder" element={<RothLadderTool />} />
            <Route path="/family/tools/ss-timing" element={<SocialSecurityTool />} />
            <Route path="/family/tools/rmd-check" element={<RMDCheckTool />} />
            <Route path="/family/tools/taxhub-preview" element={<TaxHubPreview />} />
            <Route path="/family/receipts" element={<FamilyReceipts />} />
            
            {/* Tool Pages */}
            <Route path="/tools/retirement" element={<RetirementRoadmapTool />} />
            <Route path="/tools/estate" element={<EstateToolPage />} />
            <Route path="/tools/tax" element={<TaxToolPage />} />
            <Route path="/tools/vault" element={<VaultPage />} />
            
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
            <Route path="/nil/search" element={<Search />} />
            <Route path="/nil/goals" element={<Goals />} />
            <Route path="/nil/disclosures" element={<Disclosures />} />
            <Route path="/nil/offers" element={<Offers />} />
            <Route path="/nil/marketplace" element={<Marketplace />} />
            <Route path="/nil/contract/:id" element={<Contract />} />
            <Route path="/nil/payments" element={<Payments />} />
            <Route path="/nil/disputes" element={<Disputes />} />
            <Route path="/nil/index" element={<Index />} />
            <Route path="/nil/receipts" element={<Receipts />} />
            <Route path="/nil/admin" element={<Admin />} />
            <Route path="/nil/admin/ready-check" element={<NilReadyCheckPage />} />
            <Route path="/pricing" element={<Pricing />} />
            
            
            {/* K401 Routes */}
            <Route path="/k401/rollover" element={
              <Suspense fallback={<div>Loading...</div>}>
                <RolloverWizard />
              </Suspense>
            } />
            <Route path="/k401/advisor" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorBook />
              </Suspense>
            } />
            
            {/* K401 Delegated Access Routes */}
            <Route path="/k401/grant" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ClientGrantAccess />
              </Suspense>
            } />
            <Route path="/k401/advisor/request" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorRequestAccess />
              </Suspense>
            } />
            <Route path="/k401/approve" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ClientApproveSession />
              </Suspense>
            } />
            <Route path="/k401/advisor/assist" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorAssistConsole />
              </Suspense>
            } />
            
            {/* Crypto Routes - Flag Protected */}
            {getFlag('CRYPTO_ENABLED') && (
              <Route path="/crypto" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CryptoDashboard />
                </Suspense>
              } />
            )}
            {getFlag('CRYPTO_ENABLED') && (
              <Route path="/crypto/beneficiaries" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BeneficiaryDirectives />
                </Suspense>
              } />
            )}
            {getFlag('CRYPTO_ENABLED') && getFlag('CRYPTO_TRADE_ENABLED') && (
              <Route path="/crypto/trade" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <TradePanel />
                </Suspense>
              } />
            )}

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
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/estate/county-meta" element={<CountyMetaEditor />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/estate/demo" element={<EstateRonDemo />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/rulesync" element={<RuleSyncAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin" element={<AdminPanel />} />}
             <Route path="/admin/hq" element={<Suspense fallback={<div>Loading...</div>}><HQDashboard /></Suspense>} />
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/jobs" element={<JobsPanel />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/publish" element={<PublishPanel />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/env" element={<EnvInspector />} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ai/audit" element={<AiAudit />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/partner" element={<K401Partner />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/checklist" element={<K401ChecklistRunner />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/forms" element={<K401FormsAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/providers/search" element={<K401ProviderRulesSearch />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/cma" element={<K401CMAUploader />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/k401/compliance-pack" element={<K401CompliancePack />} />}
             
              {/* Broker Routes */}
              <Route path="/broker/roi" element={<div>ROI Calculator Coming Soon</div>} />
             <Route path="/broker/kit" element={<BrokerKit />} />
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/anchors" element={<AnchorList />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/receipt/:id" element={<ReceiptView />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/receipts" element={<ReceiptsViewer />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/trust-anchors" element={<TrustAnchors />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/sites" element={<SitesAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/revenue" element={<RevenueAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/automations" element={<AutomationsAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/transition/:id" element={<TransitionDetail />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/diligence" element={<DiligenceAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration-invite" element={<MigrationHubInvite />} />}
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration-queue" element={<MigrationQueueAdmin />} />}
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/db/migrations" element={<DbMigrations />} />}
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration" element={<MigrationHub />} />}
            
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
            
            {/* NotFound Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <DevPanel />
          <AutoLoadDemo />
          
          
           {/* Show CTA bar on public pages only - Flag Protected */}
           {!isAuthenticated && getFlag('PUBLIC_CTA_BAR') && <CTAStickyBar />}
           </div>
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ToolsProvider>
  );
}

export default App;