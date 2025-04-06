import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Accounts from '@/pages/Accounts';
import TaxPlanning from '@/pages/TaxPlanning';
import TaxBudgets from '@/pages/TaxBudgets';
import Documents from '@/pages/Documents';
import Investments from '@/pages/Investments';
import InvestmentPerformance from '@/pages/InvestmentPerformance';
import InvestmentRisk from '@/pages/InvestmentRisk';
import InvestmentBuilder from '@/pages/InvestmentBuilder';
import NotFound from '@/pages/NotFound';
import HomePage from '@/pages/HomePage';
import CustomerProfile from '@/pages/CustomerProfile';
import AllAssets from '@/pages/AllAssets';
import Professionals from '@/pages/Professionals';
import ProfessionalSignup from '@/pages/ProfessionalSignup';
import DeveloperAccessControl from '@/pages/DeveloperAccessControl';
import IPProtection from '@/pages/IPProtection';
import LoginPage from '@/pages/LoginPage';
import AdvisorDashboard from '@/pages/AdvisorDashboard';
import AdvisorProfile from '@/pages/AdvisorProfile';
import AdvisorModuleMarketplace from '@/pages/AdvisorModuleMarketplace';
import AdvisorFeedback from '@/pages/AdvisorFeedback';
import AdvisorOnboarding from '@/pages/AdvisorOnboarding';
import AdminSubscription from '@/pages/AdminSubscription';
import BillPay from '@/pages/BillPay';
import PersonalInsurance from '@/pages/PersonalInsurance';
import Insurance from '@/pages/Insurance';
import Properties from '@/pages/Properties';
import LegacyVault from '@/pages/LegacyVault';
import AllModelPortfolios from '@/pages/AllModelPortfolios';
import PortfolioModelDetail from '@/pages/PortfolioModelDetail';
import FundingAccounts from '@/pages/FundingAccounts';
import PortfolioBuilder from '@/pages/PortfolioBuilder';
import Transfers from '@/pages/Transfers';
import ViewAllOfferings from '@/pages/ViewAllOfferings';
import AllAlternativeInvestments from '@/pages/AllAlternativeInvestments';
import BankingTransfers from '@/pages/BankingTransfers';
import CashManagement from '@/pages/CashManagement';
import EstatePlanning from '@/pages/EstatePlanning';
import FinancialPlans from '@/pages/FinancialPlans';
import FormValidationTests from '@/pages/FormValidationTests';
import AlternativeAssetCategory from '@/pages/AlternativeAssetCategory';
import Education from '@/pages/Education';
import Subscription from '@/pages/Subscription';
import Sharing from '@/pages/Sharing';
import SocialSecurity from '@/pages/SocialSecurity';
import Marketplace from '@/pages/Marketplace';
import MarketplaceRfp from '@/pages/MarketplaceRfp';
import MarketplaceRfpDetail from '@/pages/MarketplaceRfpDetail';
import SystemDiagnosticsPage from '@/pages/SystemDiagnostics';
import Lending from '@/pages/Lending';
import NavigationDiagnostics from '@/pages/NavigationDiagnostics';
import PerformanceDiagnostics from '@/pages/PerformanceDiagnostics';

// Mobile
import MobileHome from '@/pages/mobile/MobileHome';
import MobileAccounts from '@/pages/mobile/MobileAccounts';
import MobileDocuments from '@/pages/mobile/MobileDocuments';
import MobileEducation from '@/pages/mobile/MobileEducation';
import MobileMore from '@/pages/mobile/MobileMore';
import MobileTransfers from '@/pages/mobile/MobileTransfers';
import MobileTaxPlanning from '@/pages/mobile/MobileTaxPlanning';
import SystemHealthDashboard from '@/pages/SystemHealthDashboard';

// Marketing site pages
import AboutUsPage from '@/pages/AboutUsPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import DisclosuresPage from '@/pages/DisclosuresPage';
import AccessibilityPage from '@/pages/AccessibilityPage';
import CareersPage from '@/pages/CareersPage';
import TeamPage from '@/pages/TeamPage';

// Diagnostics pages
import ErrorSimulation from '@/pages/ErrorSimulation';
import VisualTesting from '@/pages/VisualTesting';
import AccessibilityAudit from '@/pages/AccessibilityAudit';

// Import TabPages
import { 
  HomePage as TabHomePage, 
  AccountsPage, 
  EducationPage, 
  FamilyWealthPage, 
  CollaborationPage, 
  SettingsPage 
} from '@/pages/TabPages';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/accounts',
    element: <Accounts />
  },
  {
    path: '/tax-planning',
    element: <TaxPlanning />
  },
  {
    path: '/tax-budgets',
    element: <TaxBudgets />
  },
  {
    path: '/documents',
    element: <Documents />
  },
  {
    path: '/investments',
    element: <Investments />
  },
  {
    path: '/investments/performance',
    element: <InvestmentPerformance />
  },
  {
    path: '/investments/risk',
    element: <InvestmentRisk />
  },
  {
    path: '/investments/builder',
    element: <InvestmentBuilder />
  },
  {
    path: '/investments/all-assets',
    element: <AllAssets />
  },
  {
    path: '/home',
    element: <HomePage />
  },
  {
    path: '/profile',
    element: <CustomerProfile />
  },
  {
    path: '/professionals',
    element: <Professionals />
  },
  {
    path: '/professional-signup',
    element: <ProfessionalSignup />
  },
  {
    path: '/developer-access-control',
    element: <DeveloperAccessControl />
  },
  {
    path: '/ip-protection',
    element: <IPProtection />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/advisor/dashboard',
    element: <AdvisorDashboard />
  },
  {
    path: '/advisor/profile',
    element: <AdvisorProfile />
  },
  {
    path: '/advisor/modules',
    element: <AdvisorModuleMarketplace />
  },
  {
    path: '/advisor/feedback',
    element: <AdvisorFeedback />
  },
  {
    path: '/advisor/onboarding',
    element: <AdvisorOnboarding />
  },
  {
    path: '/admin/subscription',
    element: <AdminSubscription />
  },
  {
    path: '/billpay',
    element: <BillPay />
  },
  {
    path: '/insurance/personal',
    element: <PersonalInsurance />
  },
  {
    path: '/insurance',
    element: <Insurance />
  },
  {
    path: '/properties',
    element: <Properties />
  },
  {
    path: '/legacy-vault',
    element: <LegacyVault />
  },
  {
    path: '/investments/model-portfolios',
    element: <AllModelPortfolios />
  },
  {
    path: '/investments/model-portfolios/:id',
    element: <PortfolioModelDetail />
  },
  {
    path: '/funding-accounts',
    element: <FundingAccounts />
  },
  {
    path: '/portfolio-builder',
    element: <PortfolioBuilder />
  },
  {
    path: '/transfers',
    element: <Transfers />
  },
  {
    path: '/investments/offerings',
    element: <ViewAllOfferings />
  },
  {
    path: '/investments/alternative',
    element: <AllAlternativeInvestments />
  },
  {
    path: '/banking/transfers',
    element: <BankingTransfers />
  },
  {
    path: '/banking/cash-management',
    element: <CashManagement />
  },
  {
    path: '/estate-planning',
    element: <EstatePlanning />
  },
  {
    path: '/financial-plans',
    element: <FinancialPlans />
  },
  {
    path: '/form-validation-tests',
    element: <FormValidationTests />
  },
  {
    path: '/investments/alternative/:categoryId',
    element: <AlternativeAssetCategory />
  },
  {
    path: '/education',
    element: <Education />
  },
  {
    path: '/subscription',
    element: <Subscription />
  },
  {
    path: '/sharing',
    element: <Sharing />
  },
  {
    path: '/social-security',
    element: <SocialSecurity />
  },
  {
    path: '/marketplace',
    element: <Marketplace />
  },
  {
    path: '/marketplace/rfp',
    element: <MarketplaceRfp />
  },
  {
    path: '/marketplace/rfp/:id',
    element: <MarketplaceRfpDetail />
  },
  {
    path: '/admin/system-diagnostics',
    element: <SystemDiagnosticsPage />
  },
  {
    path: '/admin/system-health',
    element: <SystemHealthDashboard />
  },
  {
    path: '/lending',
    element: <Lending />
  },
  {
    path: '/navigation-diagnostics',
    element: <NavigationDiagnostics />
  },
  {
    path: '/diagnostics/error-simulation',
    element: <ErrorSimulation />
  },
  {
    path: '/diagnostics/visual-testing',
    element: <VisualTesting />
  },
  {
    path: '/diagnostics/accessibility-audit',
    element: <AccessibilityAudit />
  },
  {
    path: '/diagnostics/performance',
    element: <PerformanceDiagnostics />
  },
  
  // Mobile routes
  {
    path: '/mobile/home',
    element: <MobileHome />
  },
  {
    path: '/mobile/accounts',
    element: <MobileAccounts />
  },
  {
    path: '/mobile/documents',
    element: <MobileDocuments />
  },
  {
    path: '/mobile/education',
    element: <MobileEducation />
  },
  {
    path: '/mobile/more',
    element: <MobileMore />
  },
  {
    path: '/mobile/transfers',
    element: <MobileTransfers />
  },
  {
    path: '/mobile/tax-planning',
    element: <MobileTaxPlanning />
  },
  
  // Tab page routes (added from routes-addition.tsx)
  {
    path: '/home-tab',
    element: <TabHomePage />
  },
  {
    path: '/accounts-tab',
    element: <AccountsPage />
  },
  {
    path: '/education-tab',
    element: <EducationPage />
  },
  {
    path: '/family-wealth-tab',
    element: <FamilyWealthPage />
  },
  {
    path: '/collaboration-tab',
    element: <CollaborationPage />
  },
  {
    path: '/settings-tab',
    element: <SettingsPage />
  },
  
  // Add routes for marketing pages
  {
    path: '/about-us',
    element: <AboutUsPage />
  },
  {
    path: '/services',
    element: <ServicesPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />
  },
  {
    path: '/terms-of-service',
    element: <TermsOfServicePage />
  },
  {
    path: '/disclosures',
    element: <DisclosuresPage />
  },
  {
    path: '/accessibility',
    element: <AccessibilityPage />
  },
  {
    path: '/careers',
    element: <CareersPage />
  },
  {
    path: '/team',
    element: <TeamPage />
  },
  
  // Always keep the 404 route as the last route
  {
    path: '*',
    element: <NotFound />
  }
]);

export default routes;
