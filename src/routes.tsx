import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import TabPages from "@/pages/TabPages";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/disclosures" element={<DisclosuresPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/professional-signup" element={<ProfessionalSignup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/financial-plans" element={<ProtectedRoute><FinancialPlans /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
        <Route path="/tax-planning" element={<ProtectedRoute><TaxPlanning /></ProtectedRoute>} />
        <Route path="/education/tax-planning" element={<ProtectedRoute><TaxPlanningEducation /></ProtectedRoute>} />
        <Route path="/insurance" element={<ProtectedRoute><Insurance /></ProtectedRoute>} />
        <Route path="/personal-insurance" element={<ProtectedRoute><PersonalInsurance /></ProtectedRoute>} />
        <Route path="/client-lending" element={<ProtectedRoute><Lending /></ProtectedRoute>} />
        <Route path="/lending" element={<ProtectedRoute><Lending /></ProtectedRoute>} />
        <Route path="/estate-planning" element={<ProtectedRoute><EstatePlanning /></ProtectedRoute>} />

        {/* Family Wealth Routes */}
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/client-accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/all-assets" element={<ProtectedRoute><AllAssets /></ProtectedRoute>} />
        <Route path="/client-all-assets" element={<ProtectedRoute><AllAssets /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/client-properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/cash-management" element={<ProtectedRoute><CashManagement /></ProtectedRoute>} />
        <Route path="/client-cash-management" element={<ProtectedRoute><CashManagement /></ProtectedRoute>} />
        <Route path="/tax-budgets" element={<ProtectedRoute><TaxBudgets /></ProtectedRoute>} />
        <Route path="/client-tax-budgets" element={<ProtectedRoute><TaxBudgets /></ProtectedRoute>} />
        <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/client-transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
        <Route path="/legacy-vault" element={<ProtectedRoute><LegacyVault /></ProtectedRoute>} />
        <Route path="/client-legacy-vault" element={<ProtectedRoute><ClientLegacyVault /></ProtectedRoute>} />
        <Route path="/client-social-security" element={<ProtectedRoute><SocialSecurity /></ProtectedRoute>} />
        <Route path="/social-security" element={<ProtectedRoute><SocialSecurity /></ProtectedRoute>} />
        <Route path="/client-business-filings" element={<ProtectedRoute><BusinessFilings /></ProtectedRoute>} />
        <Route path="/business-filings" element={<ProtectedRoute><BusinessFilings /></ProtectedRoute>} />
        <Route path="/billpay" element={<ProtectedRoute><BillPay /></ProtectedRoute>} />
        <Route path="/client-billpay" element={<ProtectedRoute><BillPay /></ProtectedRoute>} />

        {/* Investment Routes */}
        <Route path="/investments/all-alternatives" element={<ProtectedRoute><AllAlternativeInvestments /></ProtectedRoute>} />
        <Route path="/investments/alternative/:category" element={<ProtectedRoute><AlternativeAssetCategory /></ProtectedRoute>} />
        <Route path="/investments/all-model-portfolios" element={<ProtectedRoute><AllModelPortfolios /></ProtectedRoute>} />
        <Route path="/investments/model-portfolio/:id" element={<ProtectedRoute><PortfolioModelDetail /></ProtectedRoute>} />
        <Route path="/investments/view-all/:category" element={<ProtectedRoute><ViewAllOfferings /></ProtectedRoute>} />
        <Route path="/investments/portfolio-builder" element={<ProtectedRoute><PortfolioBuilder /></ProtectedRoute>} />
        <Route path="/investments/investment-builder" element={<ProtectedRoute><InvestmentBuilder /></ProtectedRoute>} />
        <Route path="/investments/performance" element={<ProtectedRoute><InvestmentPerformance /></ProtectedRoute>} />
        <Route path="/investments/risk" element={<ProtectedRoute><InvestmentRisk /></ProtectedRoute>} />

        {/* Specific Investment Categories */}
        <Route path="/investments/alternative/private-equity" element={<ProtectedRoute><PrivateEquity /></ProtectedRoute>} />
        <Route path="/investments/alternative/private-debt" element={<ProtectedRoute><PrivateDebt /></ProtectedRoute>} />
        <Route path="/investments/alternative/digital-assets" element={<ProtectedRoute><DigitalAssets /></ProtectedRoute>} />
        <Route path="/investments/alternative/real-assets" element={<ProtectedRoute><RealAssets /></ProtectedRoute>} />
        <Route path="/investments/alternative/hedge-funds" element={<ProtectedRoute><HedgeFunds /></ProtectedRoute>} />
        <Route path="/investments/alternative/venture-capital" element={<ProtectedRoute><VentureCapital /></ProtectedRoute>} />
        <Route path="/investments/alternative/structured-investments" element={<ProtectedRoute><StructuredInvestments /></ProtectedRoute>} />
        <Route path="/investments/alternative/collectibles" element={<ProtectedRoute><Collectibles /></ProtectedRoute>} />
        <Route path="/investments/model-portfolios" element={<ProtectedRoute><ModelPortfolios /></ProtectedRoute>} />
        <Route path="/investments/stock-screener" element={<ProtectedRoute><StockScreener /></ProtectedRoute>} />

        {/* Collaboration Routes */}
        <Route path="/professionals" element={
          <ProtectedRoute>
            <ProfessionalsRouteWrapper>
              <Professionals />
            </ProfessionalsRouteWrapper>
          </ProtectedRoute>
        } />
        <Route path="/sharing" element={<ProtectedRoute><ClientFamily /></ProtectedRoute>} />

        {/* Other App Routes */}
        <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/advisor-dashboard" element={<ProtectedRoute><AdvisorDashboard /></ProtectedRoute>} />
        <Route path="/advisor-profile" element={<ProtectedRoute><AdvisorProfile /></ProtectedRoute>} />
        <Route path="/advisor-onboarding" element={<ProtectedRoute><AdvisorOnboarding /></ProtectedRoute>} />
        <Route path="/advisor-feedback" element={<ProtectedRoute><AdvisorFeedback /></ProtectedRoute>} />
        <Route path="/advisor-modules" element={<ProtectedRoute><AdvisorModuleMarketplace /></ProtectedRoute>} />
        <Route path="/customer-profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
        <Route path="/admin-subscription" element={<ProtectedRoute><AdminSubscription /></ProtectedRoute>} />
        <Route path="/funding-accounts" element={<ProtectedRoute><FundingAccounts /></ProtectedRoute>} />
        <Route path="/banking-transfers" element={<ProtectedRoute><BankingTransfers /></ProtectedRoute>} />
        <Route path="/project-integration" element={<ProtectedRoute><ProjectIntegration /></ProtectedRoute>} />

        {/* Mobile Routes */}
        <Route path="/mobile/home" element={<ProtectedRoute><MobileHome /></ProtectedRoute>} />
        <Route path="/mobile/accounts" element={<ProtectedRoute><MobileAccounts /></ProtectedRoute>} />
        <Route path="/mobile/documents" element={<ProtectedRoute><MobileDocuments /></ProtectedRoute>} />
        <Route path="/mobile/education" element={<ProtectedRoute><MobileEducation /></ProtectedRoute>} />
        <Route path="/mobile/tax-planning" element={<ProtectedRoute><MobileTaxPlanning /></ProtectedRoute>} />
        <Route path="/mobile/transfers" element={<ProtectedRoute><MobileTransfers /></ProtectedRoute>} />
        <Route path="/mobile/more" element={<ProtectedRoute><MobileMore /></ProtectedRoute>} />

        {/* Marketplace Routes */}
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/marketplace/rfp" element={<ProtectedRoute><MarketplaceRfp /></ProtectedRoute>} />
        <Route path="/marketplace/rfp/:id" element={<ProtectedRoute><MarketplaceRfpDetail /></ProtectedRoute>} />

        {/* Diagnostics Routes */}
        <Route path="/system-diagnostics" element={<ProtectedRoute><SystemDiagnostics /></ProtectedRoute>} />
        <Route path="/system-health" element={<ProtectedRoute><SystemHealthDashboard /></ProtectedRoute>} />
        <Route path="/navigation-diagnostics" element={<ProtectedRoute><NavigationDiagnostics /></ProtectedRoute>} />
        <Route path="/performance-diagnostics" element={<ProtectedRoute><PerformanceDiagnostics /></ProtectedRoute>} />
        <Route path="/form-validation-tests" element={<ProtectedRoute><FormValidationTests /></ProtectedRoute>} />
        <Route path="/visual-testing" element={<ProtectedRoute><VisualTesting /></ProtectedRoute>} />
        <Route path="/error-simulation" element={<ProtectedRoute><ErrorSimulation /></ProtectedRoute>} />
        <Route path="/accessibility-audit" element={<ProtectedRoute><AccessibilityAudit /></ProtectedRoute>} />
        <Route path="/developer-access" element={<ProtectedRoute><DeveloperAccessControl /></ProtectedRoute>} />
        <Route path="/ip-protection" element={<ProtectedRoute><IPProtection /></ProtectedRoute>} />
        <Route path="/tab-pages" element={<ProtectedRoute><TabPages /></ProtectedRoute>} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
