import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import '@/styles/brand.css';
import { TopBanner } from '@/components/layout/TopBanner';
import BrandHeader from '@/components/layout/BrandHeader';
import { ConditionalMegaMenu } from '@/components/nav/ConditionalMegaMenu';
import { RedirectHandler } from '@/components/RedirectHandler';
import { ToolsProvider } from '@/contexts/ToolsContext';
import { Toaster } from '@/components/ui/toaster';
import DevPanel from '@/components/dev/DevPanel';
import { AutoLoadDemo } from '@/components/AutoLoadDemo';
import { DemoStatus } from '@/components/DemoStatus';
import CTAStickyBar from '@/components/ui/CTAStickyBar';
import { SecondaryNav } from '@/components/layout/SecondaryNav';
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
import NILIndex from '@/pages/nil/index';
import Admin from '@/pages/nil/Admin';
import NilReadyCheckPage from '@/pages/nil/admin/NilReadyCheckPage';
import Pricing from '@/pages/Pricing';

// Landing page imports
import FamiliesLanding from '@/pages/landing/FamiliesLanding';
import ProsLanding from '@/pages/landing/ProsLanding';
import ReportsPage from '@/pages/ReportsPage';
import GoalsPageLanding from '@/pages/landing/GoalsPage';
import GoalsPage from '@/pages/GoalsPage';
import { BudgetsPage } from '@/pages/BudgetsPage';
import { CashFlowPage } from '@/features/cashflow/pages/CashFlowPage';
import { TransactionsPage } from '@/features/transactions/pages/TransactionsPage';
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
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { AuthCallback } from '@/pages/auth/AuthCallback';
import { FamilyOnboardingWelcome } from '@/pages/onboarding/FamilyOnboardingWelcome';
import MainPageOnboarding from '@/pages/onboarding/MainPageOnboarding';
import { FamilyDashboard } from '@/pages/families/FamilyDashboard';
import { FamilyTypeDashboard } from '@/pages/families/FamilyTypeDashboard';
import { VoiceTestPage } from '@/pages/test/VoiceTestPage';
import QACoverage from '@/pages/admin/QACoverage';
import ReadyCheck from '@/pages/admin/ReadyCheck';
import { ReadyCheckEnhanced } from '@/pages/admin/ReadyCheckEnhanced';
import HQDashboard from '@/pages/stubs/HQDashboard';
import PublishIndex from '@/pages/admin/publish/Index';
import AdminPanel from '@/pages/stubs/AdminPanel';

// New persona landing pages  
const FamiliesIndex = lazy(() => import('@/pages/families/index'));
const ProsIndex = lazy(() => import('@/pages/pros/index'));
import ProsHub from '@/pages/pros/ProsHub';
import ProWorkspaceLayout from '@/components/layout/ProWorkspaceLayout';
const NILLanding = lazy(() => import('@/pages/nil/landing'));
const HealthcareNew = lazy(() => import('@/pages/healthcare/index'));
const SolutionsLanding = lazy(() => import('@/pages/solutions/index'));
const LearnLanding = lazy(() => import('@/pages/learn/index'));

const AiesConsole = lazy(() => import('@/pages/admin/AiesConsole'));
// Removed duplicate AdminPanel import
import JobsPanel from '@/pages/admin/JobsPanel';
import PublishPanel from '@/pages/admin/PublishPanel';
import Release from '@/pages/admin/Release';
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
const ReceiptsAdmin = lazy(() => import('@/pages/admin/ReceiptsAdmin'));
const CanonTest = lazy(() => import("@/components/testing/CanonTest"));
import HealthCheck from "@/pages/HealthCheck";

// Demo Pages
const RetireeBucketDemo = lazy(() => import('@/pages/demos/retiree-bucket'));
const AdvisorFeeCompareDemo = lazy(() => import('@/pages/demos/advisor-fee-compare'));
const NILSearchDemo = lazy(() => import('@/pages/demos/nil-search'));
const IPLedgerPage = lazy(() => import('@/pages/admin/hq/ip'));

// BFO Ops Admin Pages
import SitesAdmin from '@/pages/admin/sites/SitesAdmin';
import RevenueAdmin from '@/pages/admin/revenue/RevenueAdmin';
import AutomationsAdmin from '@/pages/admin/automations/AutomationsAdmin';
import TransitionDetail from '@/pages/admin/transition/TransitionDetail';
import DiligenceAdmin from '@/pages/admin/diligence/DiligenceAdmin';
const RolloverWizard = lazy(() => import('@/pages/k401/RolloverWizard'));
const AdvisorBook = lazy(() => import('@/pages/k401/AdvisorBook'));

// K401 Delegated Access Components
const ClientGrantAccess = lazy(() => import('@/pages/k401/ClientGrantAccess'));
const AdvisorRequestAccess = lazy(() => import('@/pages/k401/AdvisorRequestAccess'));
const ClientApproveSession = lazy(() => import('@/pages/k401/ClientApproveSession'));
const AdvisorAssistConsole = lazy(() => import('@/pages/k401/AdvisorAssistConsole'));
import VaultAutofillConsent from '@/pages/family/VaultAutofillConsent';
import VaultAutofillReview from '@/pages/advisor/VaultAutofillReview';
import ChecklistExport from '@/pages/supervisor/ChecklistExport';
import NotFound from '@/pages/NotFound';
import { getFlag } from '@/lib/flags';
import '@/features/k401/init'; // Initialize provider rules

// Onboarding Components
const FamilyOnboarding = lazy(() => import('@/pages/onboarding/FamilyOnboarding'));
const AdvisorOnboarding = lazy(() => import('@/pages/onboarding/AdvisorOnboarding'));
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
import BuildWorkspacePage from '@/pages/onboarding/BuildWorkspacePage';
import Advisors from '@/pages/personas/Advisors';
import Insurance from '@/pages/personas/Insurance';
import DemoPersona from '@/pages/learn/DemoPersona';
import { PersonaDashboard } from '@/components/bfo/PersonaDashboard';
import { SecurityDashboard } from '@/components/bfo/SecurityDashboard';
import { AdminMigrations } from '@/components/bfo/AdminMigrations';
import { IPTracker } from '@/components/bfo/IPTracker';
import AdminHQ from '@/pages/admin/AdminHQ';
import IPHQ from '@/pages/admin/IPHQ';
import FamiliesStart from '@/pages/families/start';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PersonaGuard } from '@/components/auth/PersonaGuard';
import ReceiptsConsole from '@/pages/admin/ReceiptsConsole';
import RuleSyncConsole from '@/pages/admin/RuleSyncConsole';
import Control401k from '@/pages/admin/Control401k';
import Evidence from '@/pages/admin/Evidence';
import CanonicalExports from "@/diag/CanonicalExports";

// Welcome Flow Components
const FamilyWelcomeFlow = lazy(() => import('@/components/welcome/FullScreenWelcome').then(m => ({ default: m.FullScreenWelcome })));
const AuthPage = lazy(() => import('@/pages/auth/AuthPage').then(m => ({ default: m.AuthPage })));
const WelcomeTransition = lazy(() => import('@/pages/welcome/WelcomeTransition').then(m => ({ default: m.WelcomeTransition })));

// Marketplace imports
import MarketplaceIndex from '@/pages/marketplace/Index';
import MarketplaceAdvisors from '@/pages/marketplace/Advisors';
import AdvisorDetail from '@/pages/marketplace/AdvisorDetail';
import CPAIndex from '@/pages/marketplace/cpa/Index';
import CPADetail from '@/pages/marketplace/cpa/Detail';

const CpaHome = lazy(() => import('@/pages/cpas/CpaHome'));
const CpaMarketplace = lazy(() => import('@/pages/marketplace/CpaMarketplace'));
const CpaProfile = lazy(() => import('@/pages/marketplace/CpaProfile'));
const TaxProjectionTool = lazy(() => import('@/pages/tools/TaxProjectionTool'));
const ContinuingEducation = lazy(() => import('@/pages/learn/ContinuingEducation'));
const TaxHubPro = lazy(() => import('@/pages/taxhub/TaxHubPro'));
const CpaTools = lazy(() => import('@/pages/cpa/CpaTools'));
const CpaLearn = lazy(() => import('@/pages/cpa/CpaLearn'));
const EstateWorkbench = lazy(() => import('@/pages/estate/EstateWorkbench'));
const AttorneyMarketplace = lazy(() => import('@/pages/marketplace/AttorneyMarketplace'));
const AttorneysHome = lazy(() => import('@/pages/marketplace/AttorneysHome'));
const AttorneyDetail = lazy(() => import('@/pages/marketplace/AttorneyDetail'));
const MarketplaceInsurance = lazy(() => import('@/pages/marketplace/Insurance'));
const FNOLStub = lazy(() => import('@/pages/insurance/fnol'));
const BindStub = lazy(() => import('@/pages/insurance/bind'));

const DemoPage = lazy(() => import('@/pages/demos/[persona]'));
const PreviewPage = lazy(() => import('@/components/PreviewPage'));

// Estate Planning Components
const EstateDIYWizard = lazy(() => import('@/pages/estate/EstateDIYWizard'));
const HealthcareDIYWizard = lazy(() => import('@/pages/estate/HealthcareDIYWizard'));
const AdvisorEstatePage = lazy(() => import('@/pages/advisors/AdvisorEstatePage'));
const AttorneyEstateWorkbench = lazy(() => import('@/pages/attorney/AttorneyEstateWorkbench'));
const HealthcareProWorkbench = lazy(() => import('@/pages/attorney/HealthcareProWorkbench'));
const CPAEstatePage = lazy(() => import('@/pages/cpa/CPAEstatePage'));

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
import NILIndexPage from '@/pages/nil/NILIndex';
import NILDemoPage from '@/pages/nil/DemoPage';
import NILTourPage from '@/pages/nil/TourPage';

// Contact pages
const ContactSchedulePage = lazy(() => import('@/pages/contact/schedule'));
const ContactMessagePage = lazy(() => import('@/pages/contact/message'));
import InvestorRollupPage from '@/pages/investor/InvestorRollupPage';

// Crypto Components
const CryptoDashboard = lazy(() => import('@/pages/crypto/CryptoDashboard'));
const BeneficiaryDirectives = lazy(() => import('@/pages/crypto/BeneficiaryDirectives'));
const TradePanel = lazy(() => import('@/pages/crypto/TradePanel'));

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
import { toast } from 'sonner';

const SelectPersona = lazy(() => import('@/pages/auth/SelectPersona'));

// Stub component for avoiding 404s
const Stub = ({ title }: { title: string }) => <div className="p-10 text-white text-2xl">{title}</div>;

function App() {
  // Check authentication status using Supabase session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
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

  // Auth choice handler for FamilyOnboardingWelcome
  const handleAuthChoice = async (provider: string) => {
    if (provider === 'email') {
      // Navigate to auth page for email signup
      window.location.href = '/auth?mode=signup&redirect=/families';
      return;
    }

    if (provider === 'google') {
      try {
        // Handle Google OAuth through Supabase
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/families`,
          },
        });

        if (error) {
          console.error('Google auth error:', error);
          toast.error('Failed to sign in with Google. Please try again.');
        }
      } catch (error) {
        console.error('Google auth error:', error);
        toast.error('Something went wrong with Google authentication.');
      }
      return;
    }

    // Apple and Microsoft are disabled until APIs are configured
    if (provider === 'apple' || provider === 'microsoft') {
      toast.info(`${provider === 'apple' ? 'Apple' : 'Microsoft'} sign-in is coming soon!`);
      return;
    }
  };

  // Query param demo auto-loading
  useEffect(() => {
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
            {/* Permanent Top Banner on ALL pages */}
            <TopBanner />
            {/* Secondary Navigation on ALL pages */}
            <SecondaryNav />
            <RedirectHandler />
            <div style={{ paddingTop: '160px' }}>
            <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <Navigate to="/families" replace />
              ) : (
                <MainPageOnboarding onAuthChoice={handleAuthChoice} />
              )
            } />
            
            {/* Family Routes */}
            <Route path="/families" element={
              <Suspense fallback={<div>Loading...</div>}>
                <FamiliesIndex />
              </Suspense>
            } />
            <Route path="/families/:type" element={<FamilyTypeDashboard />} />
            <Route path="/family/home" element={<FamilyDashboard />} />
            <Route path="/pros" element={<ProsHub />} />
            <Route path="/pros/:role" element={<ProWorkspaceLayout />}>
              <Route index element={<Navigate to="/reports" replace />} />
            </Route>
        <Route path="/nil" element={<NILLanding />} />
        <Route path="/healthcare" element={
          <Suspense fallback={<div>Loading...</div>}>
            <HealthcareNew />
          </Suspense>
        } />
        <Route path="/solutions" element={<SolutionsLanding />} />
        <Route path="/learn" element={<LearnLanding />} />
        <Route path="/pros/cpa" element={<Stub title="CPA Services" />} />
        <Route path="/pros/attorney" element={<Stub title="Attorney Services" />} />
            <Route path="/solutions" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SolutionsLanding />
              </Suspense>
            } />
            <Route path="/learn" element={
              <Suspense fallback={<div>Loading...</div>}>
                <LearnLanding />
              </Suspense>
            } />
            
            {/* Demo Routes */}
            <Route path="/demos/retiree-bucket" element={
              <Suspense fallback={<div>Loading...</div>}>
                <RetireeBucketDemo />
              </Suspense>
            } />
            <Route path="/demos/advisor-fee-compare" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorFeeCompareDemo />
              </Suspense>
            } />
            <Route path="/demos/nil-search" element={
              <Suspense fallback={<div>Loading...</div>}>
                <NILSearchDemo />
              </Suspense>
            } />
            
            {/* Persona sub-routes */}
            <Route path="/build-workspace" element={<BuildWorkspacePage />} />
            <Route path="/families/retirees" element={
              <PersonaGuard allowedPersonas={['client']}>
                <FamilyRetireePersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/families/aspiring" element={
              <PersonaGuard allowedPersonas={['client']}>
                <FamilyAspiringPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/advisor" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <AdvisorPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/cpa" element={
              <PersonaGuard allowedPersonas={['accountant']}>
                <AccountantPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/attorney" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <AttorneyPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/insurance" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <InsurancePersonaDashboard />
              </PersonaGuard>
            } />
            
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/cashflow" element={<CashFlowPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/accounts" element={<Stub title="Accounts - Coming Soon" />} />
            <Route path="/recurring" element={<Stub title="Recurring Transactions - Coming Soon" />} />
            <Route path="/investments" element={<Stub title="Investments - Coming Soon" />} />
            <Route path="/advice" element={<Stub title="Advisory Services - Coming Soon" />} />
            
            
            {/* Tool routes - standardized paths that redirect to existing components */}
            <Route path="/tools/goals" element={<Navigate to="/goals" replace />} />
            <Route path="/tools/budget" element={<Navigate to="/budgets" replace />} />
            <Route path="/tools/cashflow" element={<Navigate to="/cashflow" replace />} />
            <Route path="/tools/transactions" element={<Navigate to="/transactions" replace />} />
            
            <Route path="/health" element={<HealthcareLanding />} />
            
            {/* Family Routes */}
            <Route path="/family/roadmap" element={<FamilyRoadmap />} />
            
            {/* Route Redirects */}
            <Route path="/family" element={<Navigate to="/family/home" replace />} />
            <Route path="/advisors" element={<Navigate to="/pros/advisors" replace />} />
            <Route path="/insurance" element={<Navigate to="/pros/insurance" replace />} />
            
            
            {/* Pros sub-routes */}
            <Route path="/pros/advisors" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <AdvisorDashboardWithSideNav />
              </PersonaGuard>
            } />
            <Route path="/pros/accountants" element={
              <PersonaGuard allowedPersonas={['accountant']}>
                <AccountantDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/attorneys" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <Attorneys />
              </PersonaGuard>
            } />
            <Route path="/accountants" element={<AccountantDashboard />} />
            <Route path="/pros/insurance/life" element={<Navigate to="/personas/insurance/life" replace />} />
            <Route path="/pros/insurance/other" element={<Navigate to="/personas/insurance" replace />} />
            
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceIndex />} />
            <Route path="/marketplace/advisors" element={<MarketplaceAdvisors />} />
            <Route path="/marketplace/advisors/:id" element={<AdvisorDetail />} />
            <Route path="/cpas/home" element={<Suspense fallback={<div>Loading...</div>}><CpaHome /></Suspense>} />
            <Route path="/marketplace/cpas" element={<Suspense fallback={<div>Loading...</div>}><CpaMarketplace /></Suspense>} />
            <Route path="/marketplace/cpas/:id" element={<Suspense fallback={<div>Loading...</div>}><CpaProfile /></Suspense>} />
            <Route path="/marketplace/attorneys" element={<Suspense fallback={<div>Loading...</div>}><AttorneysHome /></Suspense>} />
            <Route path="/marketplace/attorneys/:id" element={<Suspense fallback={<div>Loading...</div>}><AttorneyDetail /></Suspense>} />
            <Route path="/marketplace/insurance" element={<Suspense fallback={<div>Loading...</div>}><MarketplaceInsurance /></Suspense>} />
            <Route path="/insurance/fnol" element={<Suspense fallback={<div>Loading...</div>}><FNOLStub /></Suspense>} />
            <Route path="/insurance/bind" element={<Suspense fallback={<div>Loading...</div>}><BindStub /></Suspense>} />
            <Route path="/tools/tax-projection" element={<Suspense fallback={<div>Loading...</div>}><TaxProjectionTool /></Suspense>} />
            <Route path="/learn/ce" element={<Suspense fallback={<div>Loading...</div>}><ContinuingEducation /></Suspense>} />
            <Route path="/taxhub/pro" element={<Suspense fallback={<div>Loading...</div>}><TaxHubPro /></Suspense>} />
            <Route path="/cpa/tools" element={<Suspense fallback={<div>Loading...</div>}><CpaTools /></Suspense>} />
            <Route path="/cpa/learn" element={<Suspense fallback={<div>Loading...</div>}><CpaLearn /></Suspense>} />
            
            <Route path="/families/retirees/goals" element={<RetireeGoals />} />
            
            {/* Remove old stub routes that now have proper pages */}
            <Route path="/platform" element={<Stub title="Platform overview (stub)" />} />
            <Route path="/services" element={<Stub title="Services (stub)" />} />
            
            {/* Helpful redirects for old links */}
            <Route path="/personas" element={<Navigate to="/pros" replace />} />
            <Route path="/discover" element={<Navigate to="/catalog" replace />} />
            
            {/* Public Pages - Flag Protected */}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/discover" element={<Discover />} />}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/search" element={<SearchPage />} />}
            <Route path="/how-it-works" element={<HowItWorks />} />
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/annuities" element={<Annuities />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/investments" element={<SolutionsInvestmentsPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/insurance" element={<SolutionsInsurancePage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/lending" element={<SolutionsLendingPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/tax" element={<SolutionsTaxPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/estate" element={<SolutionsEstatePage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/:solutionKey" element={<SolutionCategoryPage />} />}
            
            {/* NIL Public Pages - conditional based on flag */}
            {!getFlag('NIL_PUBLIC_ENABLED') && (
              <Route path="/nil" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <NILLanding />
                </Suspense>
              } />
            )}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil" element={<MarketplacePage />} />}
            {getFlag('NIL_PUBLIC_ENABLED') && <Route path="/nil/index" element={<NILIndex />} />}
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
            <Route path="/personas/advisors" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <PersonaDashboard personaId="advisors" />
              </PersonaGuard>
            } />
            <Route path="/personas/insurance" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <PersonaDashboard personaId="insurance" />
              </PersonaGuard>
            } />
            <Route path="/personas/insurance/:subPersonaId" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <PersonaDashboard personaId="insurance" />
              </PersonaGuard>
            } />
            <Route path="/personas/attorney" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <PersonaDashboard personaId="attorney" />
              </PersonaGuard>
            } />
            <Route path="/personas/attorney/:subPersonaId" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <PersonaDashboard personaId="attorney" />
              </PersonaGuard>
            } />
            <Route path="/personas/cpa" element={
              <PersonaGuard allowedPersonas={['accountant']}>
                <PersonaDashboard personaId="cpa" />
              </PersonaGuard>
            } />
            <Route path="/personas/healthcare" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <PersonaDashboard personaId="healthcare" />
              </PersonaGuard>
            } />
            <Route path="/personas/healthcare/:subPersonaId" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <PersonaDashboard personaId="healthcare" />
              </PersonaGuard>
            } />
            <Route path="/personas/nil" element={
              <PersonaGuard allowedPersonas={['client', 'advisor']}>
                <PersonaDashboard personaId="nil" />
              </PersonaGuard>
            } />
            <Route path="/family/home" element={
              <PersonaGuard allowedPersonas={['client']}>
                <PersonaDashboard personaId="family" />
              </PersonaGuard>
            } />
            
            {/* Admin & Security Routes */}
            <Route path="/admin/security" element={
              <PersonaGuard allowedPersonas={['admin', 'system_administrator', 'tenant_admin']}>
                <SecurityDashboard />
              </PersonaGuard>
            } />
            <Route path="/admin/migrations" element={
              <PersonaGuard allowedPersonas={['admin', 'system_administrator', 'tenant_admin']}>
                <AdminMigrations />
              </PersonaGuard>
            } />
            <Route path="/admin/ip-tracker" element={
              <PersonaGuard allowedPersonas={['admin', 'system_administrator', 'tenant_admin']}>
                <IPTracker />
              </PersonaGuard>
            } />
            <Route path="/admin/ip" element={<ProtectedRoute requiredRole="admin"><IPHQ/></ProtectedRoute>} />
            <Route path="/admin/hq/ip" element={
              <ProtectedRoute requiredRole="admin">
                <Suspense fallback={<div>Loading...</div>}>
                  <IPLedgerPage />
                </Suspense>
              </ProtectedRoute>
            } />
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
            <Route path="/onboarding" element={<FamilyOnboardingWelcome onAuthChoice={handleAuthChoice} />} />
            <Route path="/test/voice" element={<VoiceTestPage />} />
            <Route path="/nil/onboarding" element={<NILOnboarding />} />
            
            {/* New Welcome Flow Routes */}
            <Route path="/welcome" element={<Suspense fallback={<div>Loading...</div>}><FamilyWelcomeFlow /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<div>Loading...</div>}><AuthPage /></Suspense>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/select-persona" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SelectPersona />
              </Suspense>
            } />
            <Route path="/welcome/transition" element={<Suspense fallback={<div>Loading...</div>}><WelcomeTransition /></Suspense>} />
            <Route path="/nil/education" element={<Education />} />
            <Route path="/nil/search" element={<Search />} />
            <Route path="/nil/goals" element={<Goals />} />
            <Route path="/nil/disclosures" element={<Disclosures />} />
            <Route path="/nil/offers" element={<Offers />} />
            <Route path="/nil/marketplace" element={<Marketplace />} />
            <Route path="/nil/contract/:id" element={<Contract />} />
            <Route path="/nil/payments" element={<Payments />} />
            <Route path="/nil/disputes" element={<Disputes />} />
            <Route path="/nil/index" element={<NILIndex />} />
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
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/hq" element={<HQDashboard />} />}
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/hq/ip" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <IPLedgerPage />
                </Suspense>
              } />}
              {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/jobs" element={<JobsPanel />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/publish" element={<PublishIndex />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/release" element={<Release />} />}
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
             <Route
               path="/admin/receipts"
               element={
                 <PersonaGuard allowedPersonas={["admin","system_administrator","tenant_admin"]}>
                   <ReceiptsConsole />
                 </PersonaGuard>
               }
             />
              <Route
                path="/admin/rulesync"
                element={
                  <PersonaGuard allowedPersonas={["admin","system_administrator","tenant_admin"]}>
                    <RuleSyncConsole />
                  </PersonaGuard>
                }
              />
          <Route
            path="/admin/401k"
            element={
              <PersonaGuard allowedPersonas={["admin","system_administrator","tenant_admin"]}>
                <Control401k />
              </PersonaGuard>
            }
          />
          <Route
            path="/admin/evidence"
            element={
              <PersonaGuard allowedPersonas={["admin","system_administrator","tenant_admin"]}>
                <Evidence />
              </PersonaGuard>
            }
          />
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/receipts" element={
               <Suspense fallback={<div>Loading...</div>}>
                 <ReceiptsAdmin />
               </Suspense>
             } />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/trust-anchors" element={<TrustAnchors />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/sites" element={<SitesAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/revenue" element={<RevenueAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/automations" element={<AutomationsAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/transition/:id" element={<TransitionDetail />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/diligence" element={<DiligenceAdmin />} />}
             {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration-invite" element={<MigrationHubInvite />} />}
               {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration-queue" element={<MigrationQueueAdmin />} />}
               {getFlag('ADMIN_TOOLS_ENABLED') && <Route
                 path="/admin/canon"
                 element={
                   <Suspense fallback={<div />}>
                     <CanonTest />
                   </Suspense>
                 }
                />}
               {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/db/migrations" element={<DbMigrations />} />}
               {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/migration" element={<MigrationHub />} />}
               
                {/* Public Health Check Route */}
                {getFlag('HEALTH_PUBLIC') && <Route path="/__health" element={<HealthCheck />} />}
            
            {/* Demo Routes */}
            {getFlag('DEMOS_ENABLED') && (
              <Route path="/demos/:persona" element={
                <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                  <DemoPage />
                </Suspense>
              } />
            )}
            
            {/* Contact Routes */}
            <Route path="/contact/schedule" element={
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <ContactSchedulePage />
              </Suspense>
            } />
            <Route path="/contact/message" element={
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
                <ContactMessagePage />
              </Suspense>
            } />
            
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
            
            {/* Stub Routes - Prevent 404s */}
            <Route path="/contact/schedule" element={<Stub title="Schedule a Meeting" />} />
            <Route path="/contact/message" element={<Stub title="Send a Message" />} />
            <Route path="/marketplace/advisors" element={<Stub title="Find Advisors" />} />
            <Route path="/marketplace/cpa" element={<CPAIndex />} />
            <Route path="/marketplace/cpa/:id" element={<CPADetail />} />
            <Route path="/marketplace/cpas" element={<Stub title="Find CPAs" />} />
            <Route path="/marketplace/insurance" element={<Stub title="Insurance Solutions" />} />
            <Route path="/tools/retirement-roadmap" element={<Stub title="Retirement Roadmap Tool" />} />
            <Route path="/tools/tax-projection" element={<Stub title="Tax Projection Tool" />} />
            <Route path="/tools/estate-planning" element={<Stub title="Estate Planning Tool" />} />
            <Route path="/vault" element={<Stub title="Secure Document Vault" />} />
            {/* Goals route moved to main routes section */}
            <Route path="/discover" element={<Stub title="Discover Solutions" />} />
            <Route path="/diag/canonical" element={<CanonicalExports />} />
            
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