import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";

// Auth pages
import Auth from "@/pages/Auth";
import LoginPage from "@/pages/LoginPage";

// Main pages
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Education from "@/pages/Education";
import FinancialPlans from "@/pages/FinancialPlans";
import Investments from "@/pages/Investments";
import TaxPlanning from "@/pages/TaxPlanning";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import Insurance from "@/pages/Insurance";
import PersonalInsurance from "@/pages/PersonalInsurance";
import Lending from "@/pages/Lending";
import EstatePlanning from "@/pages/EstatePlanning";
import Accounts from "@/pages/Accounts";
import AllAssets from "@/pages/AllAssets";
import Properties from "@/pages/Properties";
import CashManagement from "@/pages/CashManagement";
import TaxBudgets from "@/pages/TaxBudgets";
import Transfers from "@/pages/Transfers";
import LegacyVault from "@/pages/LegacyVault";
import ClientLegacyVault from "@/pages/ClientLegacyVault";
import SocialSecurity from "@/pages/SocialSecurity";
import BusinessFilings from "@/pages/BusinessFilings";
import BillPay from "@/pages/BillPay";
import Professionals from "@/pages/Professionals";
import ClientFamily from "@/pages/ClientFamily";
import Help from "@/pages/Help";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

// Investment specific pages
import AllAlternativeInvestments from "@/pages/AllAlternativeInvestments";
import AlternativeAssetCategory from "@/pages/AlternativeAssetCategory";
import AllModelPortfolios from "@/pages/AllModelPortfolios";
import PortfolioModelDetail from "@/pages/PortfolioModelDetail";
import ViewAllOfferings from "@/pages/ViewAllOfferings";
import PortfolioBuilder from "@/pages/PortfolioBuilder";
import InvestmentBuilder from "@/pages/InvestmentBuilder";
import InvestmentPerformance from "@/pages/InvestmentPerformance";
import InvestmentRisk from "@/pages/InvestmentRisk";

// Investment category pages
import PrivateEquity from "@/pages/investments/PrivateEquity";
import PrivateDebt from "@/pages/investments/PrivateDebt";
import DigitalAssets from "@/pages/investments/DigitalAssets";
import RealAssets from "@/pages/investments/RealAssets";
import HedgeFunds from "@/pages/investments/HedgeFunds";
import VentureCapital from "@/pages/investments/VentureCapital";
import StructuredInvestments from "@/pages/investments/StructuredInvestments";
import Collectibles from "@/pages/investments/Collectibles";
import ModelPortfolios from "@/pages/investments/ModelPortfolios";
import StockScreener from "@/pages/investments/StockScreener";

// Other pages
import Subscription from "@/pages/Subscription";
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import AdvisorProfile from "@/pages/AdvisorProfile";
import AdvisorOnboarding from "@/pages/AdvisorOnboarding";
import AdvisorFeedback from "@/pages/AdvisorFeedback";
import AdvisorModuleMarketplace from "@/pages/AdvisorModuleMarketplace";
import ProfessionalSignup from "@/pages/ProfessionalSignup";
import CustomerProfile from "@/pages/CustomerProfile";
import AdminSubscription from "@/pages/AdminSubscription";
import FundingAccounts from "@/pages/FundingAccounts";
import BankingTransfers from "@/pages/BankingTransfers";
import ProjectIntegration from "@/pages/ProjectIntegration";

// Mobile pages
import MobileHome from "@/pages/mobile/MobileHome";
import MobileAccounts from "@/pages/mobile/MobileAccounts";
import MobileDocuments from "@/pages/mobile/MobileDocuments";
import MobileEducation from "@/pages/mobile/MobileEducation";
import MobileTaxPlanning from "@/pages/mobile/MobileTaxPlanning";
import MobileTransfers from "@/pages/mobile/MobileTransfers";
import MobileMore from "@/pages/mobile/MobileMore";

// Marketplace
import Marketplace from "@/pages/Marketplace";
import MarketplaceRfp from "@/pages/MarketplaceRfp";
import MarketplaceRfpDetail from "@/pages/MarketplaceRfpDetail";

// Marketing pages
import HomePage from "@/pages/HomePage";
import AboutUsPage from "@/pages/AboutUsPage";
import ServicesPage from "@/pages/ServicesPage";
import TeamPage from "@/pages/TeamPage";
import CareersPage from "@/pages/CareersPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import DisclosuresPage from "@/pages/DisclosuresPage";
import AccessibilityPage from "@/pages/AccessibilityPage";

// Diagnostics and testing pages
import SystemDiagnostics from "@/pages/SystemDiagnostics";
import SystemHealthDashboard from "@/pages/SystemHealthDashboard";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";
import PerformanceDiagnostics from "@/pages/PerformanceDiagnostics";
import FormValidationTests from "@/pages/FormValidationTests";
import VisualTesting from "@/pages/VisualTesting";
import ErrorSimulation from "@/pages/ErrorSimulation";
import AccessibilityAudit from "@/pages/AccessibilityAudit";
import DeveloperAccessControl from "@/pages/DeveloperAccessControl";
import IPProtection from "@/pages/IPProtection";

const router = createBrowserRouter([
  // Public Marketing Routes
  { path: "/home", element: <HomePage /> },
  { path: "/about", element: <AboutUsPage /> },
  { path: "/services", element: <ServicesPage /> },
  { path: "/team", element: <TeamPage /> },
  { path: "/careers", element: <CareersPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/privacy", element: <PrivacyPolicyPage /> },
  { path: "/terms", element: <TermsOfServicePage /> },
  { path: "/disclosures", element: <DisclosuresPage /> },
  { path: "/accessibility", element: <AccessibilityPage /> },

  // Auth Routes
  { path: "/auth", element: <Auth /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/professional-signup", element: <ProfessionalSignup /> },

  // Protected Routes
  { path: "/", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: "/documents", element: <ProtectedRoute><Documents /></ProtectedRoute> },
  { path: "/education", element: <ProtectedRoute><Education /></ProtectedRoute> },
  { path: "/financial-plans", element: <ProtectedRoute><FinancialPlans /></ProtectedRoute> },
  { path: "/investments", element: <ProtectedRoute><Investments /></ProtectedRoute> },
  { path: "/tax-planning", element: <ProtectedRoute><TaxPlanning /></ProtectedRoute> },
  { path: "/education/tax-planning", element: <ProtectedRoute><TaxPlanningEducation /></ProtectedRoute> },
  { path: "/insurance", element: <ProtectedRoute><Insurance /></ProtectedRoute> },
  { path: "/personal-insurance", element: <ProtectedRoute><PersonalInsurance /></ProtectedRoute> },
  { path: "/client-lending", element: <ProtectedRoute><Lending /></ProtectedRoute> },
  { path: "/lending", element: <ProtectedRoute><Lending /></ProtectedRoute> },
  { path: "/estate-planning", element: <ProtectedRoute><EstatePlanning /></ProtectedRoute> },

  // Family Wealth Routes
  { path: "/accounts", element: <ProtectedRoute><Accounts /></ProtectedRoute> },
  { path: "/client-accounts", element: <ProtectedRoute><Accounts /></ProtectedRoute> },
  { path: "/all-assets", element: <ProtectedRoute><AllAssets /></ProtectedRoute> },
  { path: "/client-all-assets", element: <ProtectedRoute><AllAssets /></ProtectedRoute> },
  { path: "/properties", element: <ProtectedRoute><Properties /></ProtectedRoute> },
  { path: "/client-properties", element: <ProtectedRoute><Properties /></ProtectedRoute> },
  { path: "/cash-management", element: <ProtectedRoute><CashManagement /></ProtectedRoute> },
  { path: "/client-cash-management", element: <ProtectedRoute><CashManagement /></ProtectedRoute> },
  { path: "/tax-budgets", element: <ProtectedRoute><TaxBudgets /></ProtectedRoute> },
  { path: "/client-tax-budgets", element: <ProtectedRoute><TaxBudgets /></ProtectedRoute> },
  { path: "/transfers", element: <ProtectedRoute><Transfers /></ProtectedRoute> },
  { path: "/client-transfers", element: <ProtectedRoute><Transfers /></ProtectedRoute> },
  { path: "/legacy-vault", element: <ProtectedRoute><LegacyVault /></ProtectedRoute> },
  { path: "/client-legacy-vault", element: <ProtectedRoute><ClientLegacyVault /></ProtectedRoute> },
  { path: "/client-social-security", element: <ProtectedRoute><SocialSecurity /></ProtectedRoute> },
  { path: "/social-security", element: <ProtectedRoute><SocialSecurity /></ProtectedRoute> },
  { path: "/client-business-filings", element: <ProtectedRoute><BusinessFilings /></ProtectedRoute> },
  { path: "/business-filings", element: <ProtectedRoute><BusinessFilings /></ProtectedRoute> },
  { path: "/billpay", element: <ProtectedRoute><BillPay /></ProtectedRoute> },
  { path: "/client-billpay", element: <ProtectedRoute><BillPay /></ProtectedRoute> },

  // Investment Routes
  { path: "/investments/all-alternatives", element: <ProtectedRoute><AllAlternativeInvestments /></ProtectedRoute> },
  { path: "/investments/alternative/:category", element: <ProtectedRoute><AlternativeAssetCategory /></ProtectedRoute> },
  { path: "/investments/all-model-portfolios", element: <ProtectedRoute><AllModelPortfolios /></ProtectedRoute> },
  { path: "/investments/model-portfolio/:id", element: <ProtectedRoute><PortfolioModelDetail /></ProtectedRoute> },
  { path: "/investments/view-all/:category", element: <ProtectedRoute><ViewAllOfferings /></ProtectedRoute> },
  { path: "/investments/portfolio-builder", element: <ProtectedRoute><PortfolioBuilder /></ProtectedRoute> },
  { path: "/investments/investment-builder", element: <ProtectedRoute><InvestmentBuilder /></ProtectedRoute> },
  { path: "/investments/performance", element: <ProtectedRoute><InvestmentPerformance /></ProtectedRoute> },
  { path: "/investments/risk", element: <ProtectedRoute><InvestmentRisk /></ProtectedRoute> },

  // Specific Investment Categories
  { path: "/investments/alternative/private-equity", element: <ProtectedRoute><PrivateEquity /></ProtectedRoute> },
  { path: "/investments/alternative/private-debt", element: <ProtectedRoute><PrivateDebt /></ProtectedRoute> },
  { path: "/investments/alternative/digital-assets", element: <ProtectedRoute><DigitalAssets /></ProtectedRoute> },
  { path: "/investments/alternative/real-assets", element: <ProtectedRoute><RealAssets /></ProtectedRoute> },
  { path: "/investments/alternative/hedge-funds", element: <ProtectedRoute><HedgeFunds /></ProtectedRoute> },
  { path: "/investments/alternative/venture-capital", element: <ProtectedRoute><VentureCapital /></ProtectedRoute> },
  { path: "/investments/alternative/structured-investments", element: <ProtectedRoute><StructuredInvestments /></ProtectedRoute> },
  { path: "/investments/alternative/collectibles", element: <ProtectedRoute><Collectibles /></ProtectedRoute> },
  { path: "/investments/model-portfolios", element: <ProtectedRoute><ModelPortfolios /></ProtectedRoute> },
  { path: "/investments/stock-screener", element: <ProtectedRoute><StockScreener /></ProtectedRoute> },

  // Collaboration Routes
  { 
    path: "/professionals", 
    element: (
      <ProtectedRoute>
        <ProfessionalsRouteWrapper>
          <Professionals />
        </ProfessionalsRouteWrapper>
      </ProtectedRoute>
    )
  },
  { path: "/sharing", element: <ProtectedRoute><ClientFamily /></ProtectedRoute> },

  // Other App Routes
  { path: "/help", element: <ProtectedRoute><Help /></ProtectedRoute> },
  { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
  { path: "/subscription", element: <ProtectedRoute><Subscription /></ProtectedRoute> },
  { path: "/advisor-dashboard", element: <ProtectedRoute><AdvisorDashboard /></ProtectedRoute> },
  { path: "/advisor-profile", element: <ProtectedRoute><AdvisorProfile /></ProtectedRoute> },
  { path: "/advisor-onboarding", element: <ProtectedRoute><AdvisorOnboarding /></ProtectedRoute> },
  { path: "/advisor-feedback", element: <ProtectedRoute><AdvisorFeedback /></ProtectedRoute> },
  { path: "/advisor-modules", element: <ProtectedRoute><AdvisorModuleMarketplace /></ProtectedRoute> },
  { path: "/customer-profile", element: <ProtectedRoute><CustomerProfile /></ProtectedRoute> },
  { path: "/admin-subscription", element: <ProtectedRoute><AdminSubscription /></ProtectedRoute> },
  { path: "/funding-accounts", element: <ProtectedRoute><FundingAccounts /></ProtectedRoute> },
  { path: "/banking-transfers", element: <ProtectedRoute><BankingTransfers /></ProtectedRoute> },
  { path: "/project-integration", element: <ProtectedRoute><ProjectIntegration /></ProtectedRoute> },

  // Mobile Routes
  { path: "/mobile/home", element: <ProtectedRoute><MobileHome /></ProtectedRoute> },
  { path: "/mobile/accounts", element: <ProtectedRoute><MobileAccounts /></ProtectedRoute> },
  { path: "/mobile/documents", element: <ProtectedRoute><MobileDocuments /></ProtectedRoute> },
  { path: "/mobile/education", element: <ProtectedRoute><MobileEducation /></ProtectedRoute> },
  { path: "/mobile/tax-planning", element: <ProtectedRoute><MobileTaxPlanning /></ProtectedRoute> },
  { path: "/mobile/transfers", element: <ProtectedRoute><MobileTransfers /></ProtectedRoute> },
  { path: "/mobile/more", element: <ProtectedRoute><MobileMore /></ProtectedRoute> },

  // Marketplace Routes
  { path: "/marketplace", element: <ProtectedRoute><Marketplace /></ProtectedRoute> },
  { path: "/marketplace/rfp", element: <ProtectedRoute><MarketplaceRfp /></ProtectedRoute> },
  { path: "/marketplace/rfp/:id", element: <ProtectedRoute><MarketplaceRfpDetail /></ProtectedRoute> },

  // Diagnostics Routes
  { path: "/system-diagnostics", element: <ProtectedRoute><SystemDiagnostics /></ProtectedRoute> },
  { path: "/system-health", element: <ProtectedRoute><SystemHealthDashboard /></ProtectedRoute> },
  { path: "/navigation-diagnostics", element: <ProtectedRoute><NavigationDiagnostics /></ProtectedRoute> },
  { path: "/performance-diagnostics", element: <ProtectedRoute><PerformanceDiagnostics /></ProtectedRoute> },
  { path: "/form-validation-tests", element: <ProtectedRoute><FormValidationTests /></ProtectedRoute> },
  { path: "/visual-testing", element: <ProtectedRoute><VisualTesting /></ProtectedRoute> },
  { path: "/error-simulation", element: <ProtectedRoute><ErrorSimulation /></ProtectedRoute> },
  { path: "/accessibility-audit", element: <ProtectedRoute><AccessibilityAudit /></ProtectedRoute> },
  { path: "/developer-access", element: <ProtectedRoute><DeveloperAccessControl /></ProtectedRoute> },
  { path: "/ip-protection", element: <ProtectedRoute><IPProtection /></ProtectedRoute> },
  { path: "/tab-pages", element: <ProtectedRoute><TabPages /></ProtectedRoute> },

  // Catch-all route
  { path: "*", element: <NotFound /> }
]);

export default router;
