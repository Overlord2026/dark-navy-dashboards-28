import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from 'react-helmet-async';
import '@/styles/brand.css';
import BrandHeader from '@/components/layout/BrandHeader';
import { ConditionalMegaMenu } from '@/components/nav/ConditionalMegaMenu';
import { RedirectHandler } from '@/components/RedirectHandler';

import { BehaviorTracker } from '@/components/automation/BehaviorTracker';

// Ensure React is properly initialized before using hooks
if (!React || typeof React.useState !== 'function') {
  throw new Error('React runtime not properly initialized in App');
}
import DevPanel from '@/components/dev/DevPanel';
import { AutoLoadDemo } from '@/components/AutoLoadDemo';
import { DemoStatus } from '@/components/DemoStatus';
import CTAStickyBar from '@/components/ui/CTAStickyBar';
import ReceiptsListPage from '@/pages/ReceiptsListPage';
import ReceiptDetailPage from '@/pages/ReceiptDetailPage';
import SamplesPage from '@/pages/SamplesPage';
import PricingPage from '@/pages/pricing';
import Checkout from '@/pages/pricing/Checkout';

// Landing page imports
import LandingNew from '@/pages/LandingNew';
import { HomePage } from '@/pages/HomePage';
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
import SmokeCheck from '@/pages/_smoke/SmokeCheck';
import Discover from '@/pages/Discover';
import SearchPage from '@/pages/SearchPage';
import { HowItWorks } from '@/pages/HowItWorks';
import SolutionsPage from '@/pages/SolutionsPage';
import SolutionCategoryPage from '@/pages/solutions/SolutionCategoryPage';
const SolutionsDetailPage = lazy(() => import('@/pages/solutions/SolutionsPage'));
import { Annuities } from '@/pages/solutions/Annuities';
import { SolutionsInvestmentsPage } from '@/pages/solutions/SolutionsInvestmentsPage';
import { SolutionsInsurancePage } from '@/pages/solutions/SolutionsInsurancePage';
import { SolutionsLendingPage } from '@/pages/solutions/SolutionsLendingPage';
import { SolutionsTaxPage } from '@/pages/solutions/SolutionsTaxPage';
import { SolutionsEstatePage } from '@/pages/solutions/SolutionsEstatePage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { AuthCallback } from '@/pages/auth/AuthCallback';
import LinkedInCallback from '@/pages/LinkedInCallback';
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

// New persona landing pages - eager loaded for instant navigation
import FamiliesIndex from '@/pages/families/index';
import ProsIndex from '@/pages/pros/index';
import ProfessionalsHub from '@/pages/professionals/index';
import ProsHub from '@/pages/pros/ProsHub';
import ToolsLauncher from '@/pages/pros/ToolsLauncher';
import AccountantsCTA from '@/pages/pros/AccountantsCTA';
import AttorneysCTA from '@/pages/pros/AttorneysCTA';
import ProWorkspaceLayout from '@/components/layout/ProWorkspaceLayout';

import HealthcareNew from '@/pages/healthcare/index';
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

// NIL Components - Lazy loaded and gated
const NILUniversity = lazy(() => import('@/pages/NILUniversity'));
const NILLandingPage = lazy(() => import('@/pages/athletes/NILLandingPage'));
const NILEducationCenter = lazy(() => import('@/pages/athletes/NILEducationCenter'));
const NILSearchDemo = lazy(() => import('@/pages/demos/nil-search'));
import NilDisabled from '@/pages/NilDisabled';

// Demo Pages
const RetireeBucketDemo = lazy(() => import('@/pages/demos/retiree-bucket'));
const AdvisorFeeCompareDemo = lazy(() => import('@/pages/demos/advisor-fee-compare'));
const SwagAnalyzerPage = lazy(() => import('@/pages/retirement/SwagAnalyzerPage'));
const SwagMinimalPage = lazy(() => import('@/pages/retirement/SwagMinimalPage'));
const PreRetirement = lazy(() => import('@/pages/retirement/PreRetirement'));

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
import { getFlag } from '@/config/flags';
import '@/features/k401/init'; // Initialize provider rules

// Onboarding Components
const FamilyOnboarding = lazy(() => import('@/pages/onboarding/FamilyOnboarding'));
const AdvisorOnboarding = lazy(() => import('@/pages/onboarding/AdvisorOnboarding'));
import ProfessionalOnboarding from '@/pages/onboarding/ProfessionalOnboarding';
import HealthcareOnboarding from '@/pages/onboarding/HealthcareOnboarding';

import { BrandOnboarding } from '@/pages/brand/BrandOnboarding';
import { BrandHub } from '@/pages/brand/BrandHub';
import { SolutionsHub } from '@/components/solutions/SolutionsHub';
import StarterPage from '@/pages/learn/StarterPage';
import AdvisorPersonaDashboard from '@/pages/personas/AdvisorPersonaDashboard';
import AdvisorDashboardWithSideNav from '@/pages/personas/AdvisorDashboardWithSideNav';
import AccountantDashboard from '@/pages/pros/AccountantDashboard';
import AccountantsAccess from '@/pages/pros/AccountantsAccess';
import Accountants from '@/pages/pros/Accountants';
import Attorneys from '@/pages/pros/Attorneys';
import AttorneysAccess from '@/pages/pros/AttorneysAccess';
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
const AspiringStart = lazy(() => import('@/pages/families/onboarding/AspiringStart'));
const RetireesStart = lazy(() => import('@/pages/families/onboarding/RetireesStart'));
import RequireAdmin from '@/components/auth/RequireAdmin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PersonaGuard } from '@/components/auth/PersonaGuard';
import ReceiptsConsole from '@/pages/admin/ReceiptsConsole';
import RuleSyncConsole from '@/pages/admin/RuleSyncConsole';
import Control401k from '@/pages/admin/Control401k';
import Evidence from '@/pages/admin/Evidence';
import CanonicalExports from "@/diag/CanonicalExports";
import ReactDiag from '@/pages/ReactDiag';
import AdminDiagnostics from '@/pages/admin/AdminDiagnostics';
import LegacyKPIDashboard from '@/pages/admin/LegacyKPIDashboard';

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
const AdvisorROITracker = lazy(() => import('@/pages/advisors/AdvisorROITracker'));

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
import InviteTokenPage from '@/pages/invite/InvitePage';
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
import ProjectIntegration from '@/pages/ProjectIntegration';

// Professional Dashboard Components
import CPADashboardPage from '@/pages/CPADashboardPage';
import EstateAttorneyDashboardPage from '@/pages/EstateAttorneyDashboardPage';

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
import { toast, Toaster } from 'sonner';
import DevTryPage from './pages/DevTryPage';
import LegacyDoc from '@/pages/docs/LegacyDoc';
import Health from '@/pages/Health';
import Healthz from '@/pages/Healthz';
import DebugStatus from '@/pages/DebugStatus';

// System protection components
import NonProdBanner from '@/components/system/NonProdBanner';
import FooterBuildTag from '@/components/system/FooterBuildTag';
import NonProdOnly from '@/components/guards/NonProdOnly';
import { ENABLE_DEV_PANEL } from '@/config/flags';

// Tax Planning Imports
import { TaxShell } from '@/features/tax/TaxShell';
import { TaxLauncher } from '@/pages/tax/TaxLauncher';
import { TaxRothConversion } from '@/pages/tax/calculators/roth-conversion';
import { TaxNua } from '@/pages/tax/calculators/nua';
import { TaxBracketManager } from '@/pages/tax/calculators/bracket-manager';
import { TaxAppreciatedStock } from '@/pages/tax/calculators/appreciated-stock';
import { TaxQsbs } from '@/pages/tax/calculators/qsbs';
import { TaxLossHarvest } from '@/pages/tax/calculators/loss-harvest';
import { TaxBasisPlanning } from '@/pages/tax/calculators/basis-planning';
import { TaxCharitableGift } from '@/pages/tax/calculators/charitable-gift';
import { TaxDonorAdvisedFund } from '@/pages/tax/calculators/daf';
import { TaxReturnAnalyzer } from '@/pages/tax/calculators/tax-return-analyzer';
import { TaxSocialSecurity } from '@/pages/tax/calculators/social-security';

// Advisor Platform Imports
import { AdvisorPlatformLayout } from '@/features/advisors/platform/layouts/AdvisorPlatformLayout';
import AdvisorPlatformDashboard from '@/features/advisors/platform/pages/AdvisorPlatformDashboard';
import ProspectsPage from '@/features/advisors/platform/pages/ProspectsPage';
import RecordingsPage from '@/features/advisors/platform/pages/RecordingsPage';
import QuestionnairesPage from '@/features/advisors/platform/pages/QuestionnairesPage';
import TemplatesPage from '@/features/advisors/platform/pages/TemplatesPage';
import ROITrackerPage from '@/features/advisors/platform/pages/ROITrackerPage';
import InviteFamily from '@/pages/advisors/InviteFamily';
import CalendarPage from '@/features/advisors/platform/pages/CalendarPage';
import SettingsPage from '@/features/advisors/platform/pages/SettingsPage';
import SocialSettingsPage from '@/features/advisors/platform/pages/SocialSettingsPage';
const InvitePage = lazy(() => import('@/features/advisors/platform/pages/InvitePage'));
const BillingPage = lazy(() => import('@/features/advisors/platform/pages/BillingPage'));

const SelectPersona = lazy(() => import('@/pages/auth/SelectPersona'));

// Stub component for avoiding 404s
const Stub = ({ title }: { title: string }) => <div className="p-10 text-white text-2xl">{title}</div>;

function App() {
  // Check authentication status using Supabase session
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe?: () => void } | null = null;

    (async () => {
      try {
        // Optional: auth session bootstrap
        const sb = supabase; // Use existing supabase import

        // If your project exposes onAuthStateChange
        if (sb?.auth?.onAuthStateChange) {
          const res = await sb.auth.onAuthStateChange((_event: any, _session: any) => {
            if (!isMounted) return;
            // TODO: set state from session if needed
            setIsAuthenticated(!!_session);
          });
          // Supabase v2: res.data.subscription
          subscription = res?.data?.subscription ?? null;
        }
      } catch {
        // swallow; app should not crash on auth bootstrap
      }
    })();

    return () => {
      isMounted = false;
      try {
        if (subscription?.unsubscribe) subscription.unsubscribe();
      } catch {
        // ignore
      }
    };
  }, []); // ← keep this line EXACTLY

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
    
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <NonProdBanner />
        <BrandHeader />
        <div className="min-h-screen bg-background text-foreground">
            <RedirectHandler />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/old-home" element={
              isAuthenticated ? (
                <Navigate to="/families" replace />
              ) : (
                <MainPageOnboarding onAuthChoice={handleAuthChoice} />
              )
            } />
            
            {/* Invite Route */}
            <Route path="/invite/:token" element={<InviteTokenPage />} />
            
            {/* LinkedIn OAuth Callback */}
            <Route path="/linkedin-callback" element={<LinkedInCallback />} />
            
            {/* Family Routes */}
            <Route path="/families" element={<FamiliesIndex />} />
            <Route path="/families/start/aspiring" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AspiringStart />
              </Suspense>
            } />
            <Route path="/families/start/retirees" element={
              <Suspense fallback={<div>Loading...</div>}>
                <RetireesStart />
              </Suspense>
            } />
            <Route path="/families/:type" element={<FamilyTypeDashboard />} />
            <Route path="/family/home" element={<FamilyDashboard />} />
            <Route path="/pros" element={<ProsIndex />} />
            <Route path="/pros/financial-advisors" element={<Advisors />} />
            <Route path="/pros/accountants" element={<Accountants />} />
            <Route path="/pros/accountants/access" element={<AccountantsAccess />} />
            <Route path="/pros/attorneys" element={<Attorneys />} />
            <Route path="/pros/attorneys/access" element={<AttorneysAccess />} />
            <Route path="/pros/accountants-cta" element={<AccountantsCTA />} />
            <Route path="/pros/attorneys-cta" element={<AttorneysCTA />} />
            
            {/* New /professionals routes - reusing existing components */}
            <Route path="/professionals" element={<ProfessionalsHub />} />
            <Route path="/professionals/financial-advisors" element={<Advisors />} />
            <Route path="/professionals/accountants" element={<Accountants />} />
            <Route path="/professionals/accountants/access" element={<AccountantsAccess />} />
            <Route path="/professionals/attorneys" element={<Attorneys />} />
            <Route path="/professionals/attorneys/access" element={<AttorneysAccess />} />
            
            <Route path="/pros/:role" element={<ProWorkspaceLayout />}>
              <Route index element={<ToolsLauncher />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="cashflow" element={<CashFlowPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="accounts" element={<Stub title="Accounts - Coming Soon" />} />
              <Route path="recurring" element={<Stub title="Recurring Transactions - Coming Soon" />} />
              <Route path="investments" element={<Stub title="Investments - Coming Soon" />} />
              <Route path="advice" element={<Stub title="Advisory Services - Coming Soon" />} />
            </Route>
        
        <Route path="/healthcare" element={<HealthcareNew />} />
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
            
            <Route path="/health" element={<Health />} />
            <Route path="/healthz" element={<Healthz />} />
            <Route path="/__debug" element={<DebugStatus />} />
            
            {/* Family Routes */}
            <Route path="/family/roadmap" element={<FamilyRoadmap />} />
            
            {/* Integration Routes */}
            <Route path="/integration" element={<ProjectIntegration />} />
            
            {/* Route Redirects */}
            <Route path="/family" element={<Navigate to="/family/home" replace />} />
            <Route path="/advisors" element={<Navigate to="/pros/advisors" replace />} />
            <Route path="/pros/onboarding/advisors" element={<Navigate to="/pros/advisors" replace />} />
            <Route path="/insurance" element={<Navigate to="/pros/insurance" replace />} />
            
            
            {/* Pros sub-routes */}
            <Route path="/pros/advisors" element={<Advisors />} />
            <Route path="/pros/advisors/platform" element={<AdvisorPlatformLayout />}>
              <Route index element={<AdvisorPlatformDashboard />} />
              <Route path="invite" element={<InviteFamily />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="prospects" element={<ProspectsPage />} />
              <Route path="recordings" element={<RecordingsPage />} />
              <Route path="questionnaires" element={<QuestionnairesPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="roi" element={<ROITrackerPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="settings/social" element={<SocialSettingsPage />} />
            </Route>
            <Route path="/pros/accountants/dashboard" element={
              <PersonaGuard allowedPersonas={['accountant']}>
                <AccountantDashboard />
              </PersonaGuard>
            } />
            <Route path="/pros/attorneys/dashboard" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <AttorneysAccess />
              </PersonaGuard>
            } />
            <Route path="/accountants" element={<AccountantDashboard />} />
            <Route path="/pros/insurance/life" element={<Navigate to="/personas/insurance/life" replace />} />
            <Route path="/pros/insurance/other" element={<Navigate to="/personas/insurance" replace />} />
            
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplaceIndex />} />
            <Route path="/marketplace/advisors" element={<MarketplaceAdvisors />} />
            <Route path="/marketplace/advisors/:id" element={<AdvisorDetail />} />
            {/* Professional Dashboard Routes */}
            <Route path="/cpa" element={<CPADashboardPage />} />
            <Route path="/attorney" element={<EstateAttorneyDashboardPage />} />
            <Route path="/accountant" element={<Navigate to="/personas/accountant" replace />} />
            <Route path="/advisor" element={<Navigate to="/advisors/home" replace />} />
            
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
            <Route path="/advisors/roi-tracker" element={
              <Suspense fallback={<div>Loading...</div>}>
                <AdvisorROITracker />
              </Suspense>
            } />
            
            <Route path="/families/retirees/goals" element={<RetireeGoals />} />
            
            {/* Remove old stub routes that now have proper pages */}
            <Route path="/platform" element={<Stub title="Platform overview (stub)" />} />
            <Route path="/services" element={<Stub title="Services (stub)" />} />
            
            {/* Helpful redirects for old links */}
            <Route path="/personas" element={<Navigate to="/pros" replace />} />
            <Route path="/discover" element={<Navigate to="/catalog" replace />} />
            
            
            {/* NIL Routes - Flag Gated */}
            {(window as any).__ENABLE_NIL__ ? (
              <>
                <Route path="/nil" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading NIL...</div>}>
                    <NILLandingPage />
                  </Suspense>
                } />
                <Route path="/nil/university" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading NIL...</div>}>
                    <NILUniversity />
                  </Suspense>
                } />
                <Route path="/nil/education" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading NIL...</div>}>
                    <NILEducationCenter />
                  </Suspense>
                } />
                <Route path="/nil/demo" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading NIL...</div>}>
                    <NILSearchDemo />
                  </Suspense>
                } />
              </>
            ) : (
              <Route path="/nil/*" element={<NilDisabled />} />
            )}

            {/* Demo Routes for NIL personas - Flag Gated */}
            {(window as any).__ENABLE_NIL__ ? (
              <>
                <Route path="/demos/nil-athlete" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                    <DemoPage />
                  </Suspense>
                } />
                <Route path="/demos/nil-school" element={
                  <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading demo...</div>}>
                    <DemoPage />
                  </Suspense>
                } />
              </>
            ) : null}
            
            {/* Public Pages - Flag Protected */}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/discover" element={<Discover />} />}
            {getFlag('PUBLIC_DISCOVER_ENABLED') && <Route path="/search" element={<SearchPage />} />}
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/annuities" element={<Annuities />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/investments" element={<SolutionsInvestmentsPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/insurance" element={<SolutionsInsurancePage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/lending" element={<SolutionsLendingPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/tax" element={<SolutionsTaxPage />} />}
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/estate" element={<SolutionsEstatePage />} />}
            <Route path="/solutions/:slug" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SolutionsDetailPage />
              </Suspense>
            } />
            {getFlag('SOLUTIONS_ENABLED') && <Route path="/solutions/:solutionKey" element={<SolutionCategoryPage />} />}
            
            
            {/* New Home Pages */}
            <Route path="/advisor/home" element={<AdvisorHome />} />
            
            
            {/* Onboarding Routes - Flag Protected */}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/families" element={<FamilyOnboarding />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/advisors" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/cpas" element={<ProfessionalOnboarding professionalType="cpas" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/attorneys" element={<ProfessionalOnboarding professionalType="attorneys" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/realtor" element={<ProfessionalOnboarding professionalType="realtor" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/insurance" element={<ProfessionalOnboarding professionalType="advisors" />} />}
            {getFlag('ONBOARDING_PUBLIC_ENABLED') && <Route path="/start/healthcare" element={<HealthcareOnboarding segment="providers" />} />}
            {getFlag('BRAND_PUBLIC_ENABLED') && <Route path="/start/brand" element={<BrandOnboarding />} />}
            
            {/* Direct Onboarding Routes */}
            <Route path="/onboarding/family" element={<Suspense fallback={<div>Loading...</div>}><FamilyOnboarding /></Suspense>} />
            <Route path="/onboarding/advisor" element={<Suspense fallback={<div>Loading...</div>}><AdvisorOnboarding /></Suspense>} />
            
            {/* Persona Dashboard Routes */}
            <Route path="/personas/advisors" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <AdvisorPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/personas/advisor" element={<AdvisorPersonaDashboard />} />
            <Route path="/personas/accountant" element={<AccountantPersonaDashboard />} />
            <Route path="/personas/attorney" element={<AttorneyPersonaDashboard />} />
            <Route path="/personas/insurance" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <InsurancePersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/personas/insurance/:subPersonaId" element={
              <PersonaGuard allowedPersonas={['advisor']}>
                <InsurancePersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/personas/attorney" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <AttorneyPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/personas/attorney/:subPersonaId" element={
              <PersonaGuard allowedPersonas={['attorney']}>
                <AttorneyPersonaDashboard />
              </PersonaGuard>
            } />
            <Route path="/personas/cpa" element={
              <PersonaGuard allowedPersonas={['accountant']}>
                <AccountantPersonaDashboard />
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
            <Route path="/wealth/retirement/start" element={
              <Suspense fallback={<div>Loading...</div>}>
                <PreRetirement />
              </Suspense>
            } />
            <Route path="/wealth/retirement/minimal" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SwagMinimalPage />
              </Suspense>
            } />
            <Route path="/wealth/retirement" element={
              <Suspense fallback={<div>Loading...</div>}>
                <SwagAnalyzerPage />
              </Suspense>
            } />
            
            {/* Legacy route redirects */}
            <Route path="/retirement-analyzer" element={<Navigate to="/wealth/retirement" replace />} />
            
            {/* Persona-Specific Tool Routes */}
            <Route path="/advisors/tools/retirement" element={<RetirementRoadmapTool />} />
            <Route path="/advisors/tools/estate" element={<EstateToolPage />} />
            <Route path="/accountants/tools/retirement" element={<RetirementRoadmapTool />} />
            <Route path="/accountants/tools/tax" element={<TaxToolPage />} />
            <Route path="/attorneys/tools/estate" element={<EstateToolPage />} />
            <Route path="/attorneys/tools/vault" element={<VaultPage />} />
            
            {/* Tax Planning Routes */}
            <Route path="/tax" element={<TaxShell />}>
              <Route index element={<TaxLauncher />} />
              <Route path="roth-conversion" element={<TaxRothConversion />} />
              <Route path="appreciated-stock" element={<TaxAppreciatedStock />} />
              <Route path="qsbs" element={<TaxQsbs />} />
              <Route path="nua" element={<TaxNua />} />
              <Route path="loss-harvest" element={<TaxLossHarvest />} />
              <Route path="basis-planning" element={<TaxBasisPlanning />} />
              <Route path="charitable-gift" element={<TaxCharitableGift />} />
              <Route path="daf" element={<TaxDonorAdvisedFund />} />
              <Route path="tax-return-analyzer" element={<TaxReturnAnalyzer />} />
              <Route path="bracket-manager" element={<TaxBracketManager />} />
              <Route path="social-security" element={<TaxSocialSecurity />} />
            </Route>
            
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
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/pricing/checkout" element={<Checkout />} />
            
            {/* Documentation Routes */}
            <Route path="/docs/legacy" element={<LegacyDoc />} />
            
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
            <Route path="/admin/diagnostics" element={<NonProdOnly><AdminDiagnostics /></NonProdOnly>} />
            <Route path="/admin/legacy-kpis" element={<NonProdOnly><LegacyKPIDashboard /></NonProdOnly>} />
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/qa-coverage" element={<NonProdOnly><QACoverage /></NonProdOnly>} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ready-check" element={<NonProdOnly><ReadyCheck /></NonProdOnly>} />}
            {getFlag('ADMIN_TOOLS_ENABLED') && <Route path="/admin/ready-check-enhanced" element={<NonProdOnly><ReadyCheckEnhanced /></NonProdOnly>} />}
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
               
                  {/* Public Health Check Routes */}
                  {getFlag('HEALTH_PUBLIC') && <Route path="/__health" element={<HealthCheck />} />}
                  {getFlag('HEALTH_PUBLIC') && <Route path="/healthz" element={<HealthCheck />} />}
                  
                  {/* Smoke Test Route */}
                  <Route path="/_smoke" element={<SmokeCheck />} />
            
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
              <>
                <Route path="/dev/fixtures" element={<FixturesPanel />} />
                <Route path="/dev/try" element={<DevTryPage />} />
              </>
            )}
            
            {/* Dev Tools */}
            <Route path="/dev/try" element={<DevTryPage />} />
            
            {/* Preview Routes - Marketing pages for missing tools */}
            <Route path="/preview/:key" element={
              <Suspense fallback={<div className="flex items-center justify-center h-64">Loading preview...</div>}>
                <PreviewPage />
              </Suspense>
            } />
            
            {/* Stub Routes - Prevent 404s */}
            <Route path="/marketplace/advisors" element={<Stub title="Find Advisors" />} />
            <Route path="/marketplace/cpa" element={<CPAIndex />} />
            <Route path="/marketplace/cpa/:id" element={<CPADetail />} />
            <Route path="/marketplace/cpas" element={<Stub title="Find CPAs" />} />
            <Route path="/marketplace/insurance" element={<Stub title="Insurance Solutions" />} />
            <Route path="/tools/retirement-roadmap" element={<Stub title="Retirement Roadmap Tool" />} />
            <Route path="/tools/tax-projection" element={<Stub title="Tax Projection Tool" />} />
            <Route path="/tools/estate-planning" element={<Navigate to="/estate/diy" replace />} />
            <Route path="/vault" element={<Stub title="Secure Document Vault" />} />
            {/* Goals route moved to main routes section */}
            <Route path="/discover" element={<Stub title="Discover Solutions" />} />
            <Route path="/diag/canonical" element={<CanonicalExports />} />
            <Route path="/react-diag" element={<ReactDiag />} />
            
            {/* NotFound Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Conditionally render DevPanel based on environment flag */}
          {ENABLE_DEV_PANEL && <DevPanel />}
          <AutoLoadDemo />
          
           
            {/* Show CTA bar on public pages only - Flag Protected */}
            {!isAuthenticated && getFlag('PUBLIC_CTA_BAR') && <CTAStickyBar />}
            
            <BehaviorTracker>
              <div /> {/* Empty children since tracker runs in background */}
            </BehaviorTracker>
           {/* Build tag footer - always visible */}
           <div className="fixed bottom-1 right-2">
             <FooterBuildTag />
           </div>
           <Toaster richColors />
         </div>
        </ThemeProvider>
      </HelmetProvider>
  );
}

export default App;