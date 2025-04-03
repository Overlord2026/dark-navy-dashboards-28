
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import Documents from "./pages/Documents";
import HomePage from "./pages/HomePage";
import Accounts from "./pages/Accounts";
import FinancialPlans from "./pages/FinancialPlans";
import Investments from "./pages/Investments";
import Insurance from "./pages/Insurance";
import Lending from "./pages/Lending";
import EstatePlanning from "./pages/EstatePlanning";
import Properties from "./pages/Properties";
import SocialSecurity from "./pages/SocialSecurity";
import CashManagement from "./pages/CashManagement";
import Sharing from "./pages/Sharing";
import Education from "./pages/Education";
import Professionals from "./pages/Professionals";
import Transfers from "./pages/Transfers";
import FundingAccounts from "./pages/FundingAccounts";
import LegacyVault from "./pages/LegacyVault";
import TaxPlanning from "./pages/TaxPlanning";
import SystemDiagnostics from "./pages/SystemDiagnostics";
import NavigationDiagnostics from "./pages/NavigationDiagnostics";
import CustomerProfile from "./pages/CustomerProfile";
import AdvisorProfile from "./pages/AdvisorProfile";
import AdvisorOnboarding from "./pages/AdvisorOnboarding";
import AdvisorFeedback from "./pages/AdvisorFeedback";
import AdvisorModuleMarketplace from "./pages/AdvisorModuleMarketplace";
import ProfessionalSignup from "./pages/ProfessionalSignup";
import { SubscriptionPlans } from "./components/subscription/SubscriptionPlans";
import Subscription from "./pages/Subscription";
import ViewAllOfferings from "./pages/ViewAllOfferings";
import AdminSubscription from "./pages/AdminSubscription";
import Marketplace from "./pages/Marketplace";
import MarketplaceRfp from "./pages/MarketplaceRfp";
import MarketplaceRfpDetail from "./pages/MarketplaceRfpDetail";
import TaxBudgets from "./pages/TaxBudgets";
import PersonalInsurance from "./pages/PersonalInsurance";
import AllModelPortfolios from "./pages/AllModelPortfolios";
import PortfolioModelDetail from "./pages/PortfolioModelDetail";
import AllAlternativeInvestments from "./pages/AllAlternativeInvestments";
import AlternativeAssetCategory from "./pages/AlternativeAssetCategory";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import InvestmentBuilder from "./pages/InvestmentBuilder";
import InvestmentPerformance from "./pages/InvestmentPerformance";
import InvestmentRisk from "./pages/InvestmentRisk";
import DeveloperAccessControl from "./pages/DeveloperAccessControl";
import IPProtection from "./pages/IPProtection";
import SystemHealthDashboard from "./pages/SystemHealthDashboard";
import BankingTransfers from "./pages/BankingTransfers";
import BillPay from "./pages/BillPay";
import AllAssets from "./pages/AllAssets";
import AdvisorDashboard from "./pages/AdvisorDashboard";

// Import new pages
import ServicesPage from "./pages/ServicesPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";
import TeamPage from "./pages/TeamPage";
import CareersPage from "./pages/CareersPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import DisclosuresPage from "./pages/DisclosuresPage";
import AccessibilityPage from "./pages/AccessibilityPage";

import { useUser } from "./context/UserContext";
import { TutorialButton } from "./components/navigation/TutorialButton";

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  const isDeveloper = isAdmin || userProfile?.role === "developer";

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/disclosures" element={<DisclosuresPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/documents/:sectionId" element={<Documents />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/all-assets" element={<AllAssets />} />
      <Route path="/financial-plans" element={<FinancialPlans />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/investments/view-all-offerings" element={<ViewAllOfferings />} />
      <Route path="/investments/all-models" element={<AllModelPortfolios />} />
      <Route path="/investments/model/:modelId" element={<PortfolioModelDetail />} />
      <Route path="/investments/models/:modelId" element={<PortfolioModelDetail />} />
      <Route path="/investments/alternatives" element={<AllAlternativeInvestments />} />
      <Route path="/investments/alternative/:categoryId" element={<AlternativeAssetCategory />} />
      <Route path="/investments/alternative/:categoryId/view-all" element={<ViewAllOfferings />} />
      <Route path="/investments/portfolio-builder" element={<PortfolioBuilder />} />
      <Route path="/investments/investment-builder" element={<InvestmentBuilder />} />
      <Route path="/investments/performance" element={<InvestmentPerformance />} />
      <Route path="/investments/risk" element={<InvestmentRisk />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/personal-insurance" element={<PersonalInsurance />} />
      <Route path="/lending" element={<Lending />} />
      <Route path="/estate-planning" element={<EstatePlanning />} />
      <Route path="/billpay" element={<BillPay />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/social-security" element={<SocialSecurity />} />
      
      <Route path="/cash-management" element={<CashManagement />} />
      
      <Route path="/transfers" element={<Transfers />} />
      <Route path="/banking-transfers" element={<BankingTransfers />} />
      <Route path="/funding-accounts" element={<FundingAccounts />} />
      
      <Route path="/legacy-vault" element={<LegacyVault />} />
      <Route path="/sharing" element={<Sharing />} />
      <Route path="/sharing/:sectionId" element={<Sharing />} />
      <Route path="/education" element={<Education />} />
      <Route path="/education/:sectionId" element={<Education />} />
      <Route path="/education/tax-planning" element={<TaxPlanning />} />
      <Route path="/tax-budgets" element={<TaxBudgets />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/professionals/signup" element={<ProfessionalSignup />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/advisor-profile" element={<AdvisorProfile />} />
      <Route path="/advisor-onboarding" element={<AdvisorOnboarding />} />
      <Route path="/advisor-feedback" element={<AdvisorFeedback />} />
      <Route path="/advisor-marketplace" element={<AdvisorModuleMarketplace />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/rfp" element={<MarketplaceRfp />} />
      <Route path="/marketplace/rfp/:rfpId" element={<MarketplaceRfpDetail />} />
      <Route path="/login" element={<Navigate to="/" />} />
      
      {/* Advisor Routes */}
      <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      <Route path="/advisor/login" element={<LoginPage isAdvisor={true} />} />
      
      {isAdmin ? (
        <>
          <Route path="/admin/subscription" element={<AdminSubscription />} />
          <Route path="/admin/system-diagnostics" element={<SystemDiagnostics />} />
          <Route path="/admin/navigation-diagnostics" element={<NavigationDiagnostics />} />
          <Route path="/admin/developer-access" element={<DeveloperAccessControl />} />
          <Route path="/admin/ip-protection" element={<IPProtection />} />
          <Route path="/admin/system-health" element={<SystemHealthDashboard />} />
        </>
      ) : (
        <>
          <Route path="/admin/*" element={
            <Navigate to="/" replace />
          } />
        </>
      )}
      
      {isDeveloper ? (
        <>
          <Route path="/dev/diagnostics" element={<NavigationDiagnostics />} />
        </>
      ) : (
        <>
          <Route path="/dev/*" element={
            <Navigate to="/" replace />
          } />
        </>
      )}
      
      {/* Public pages (accessible when logged in) */}
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/disclosures" element={<DisclosuresPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
