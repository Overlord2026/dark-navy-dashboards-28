import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import PublicCalculator from "@/pages/PublicCalculator";
import Accounts from "@/pages/Accounts";
import ResourcesCatalog from "@/pages/ResourcesCatalog";
import Investments from "@/pages/Investments";
import TaxPlanning from "@/pages/TaxPlanning";
import Insurance from "@/pages/Insurance";
import Lending from "@/pages/Lending";
import EstatePlanning from "@/pages/EstatePlanning";
import FinancialPlans from "@/pages/FinancialPlans";
import AllAssets from "@/pages/AllAssets";
import CashManagement from "@/pages/CashManagement";
import TaxBudgets from "@/pages/TaxBudgets";
import Transfers from "@/pages/Transfers";
import CreateTransfer from "@/pages/CreateTransfer";
import ClientLegacyVault from "@/pages/ClientLegacyVault";
import SocialSecurity from "@/pages/SocialSecurity";
import BusinessFilings from "@/pages/BusinessFilings";
import Properties from "@/pages/Properties";
import BillPay from "@/pages/BillPay";
import Documents from "@/pages/Documents";

import ProfessionalSignup from "@/pages/ProfessionalSignup";
import Help from "@/pages/Help";
import Settings from "@/pages/Settings";
import ProjectIntegration from "@/pages/ProjectIntegration";
import ClientFamily from "@/pages/ClientFamily";
import PrivateEquity from "@/pages/investments/PrivateEquity";
import PrivateDebt from "@/pages/investments/PrivateDebt";
import DigitalAssets from "@/pages/investments/DigitalAssets";
import RealAssets from "@/pages/investments/RealAssets";
import HedgeFunds from "@/pages/investments/HedgeFunds";
import VentureCapital from "@/pages/investments/VentureCapital";
import Collectibles from "@/pages/investments/Collectibles";
import StructuredInvestments from "@/pages/investments/StructuredInvestments";
import ModelPortfolios from "@/pages/investments/ModelPortfolios";
import StockScreener from "@/pages/investments/StockScreener";
import IPProtection from "@/pages/IPProtection";
import AdvisorFeedback from "@/pages/AdvisorFeedback";
import AdvisorProfile from "@/pages/AdvisorProfile";
import NotFound from "@/pages/NotFound";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";
import DiagnosticsRunner from "@/pages/DiagnosticsRunner";
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminFAQs from "@/pages/admin/AdminFAQs";
import HelpCenter from "@/pages/HelpCenter";
import EnhancedSettings from "@/pages/EnhancedSettings";
import { TenantAdmin } from "@/pages/TenantAdmin";
import { AnalyticsPage } from "@/pages/AnalyticsPage";

// Health pages
import HealthDashboard from "@/pages/health/HealthDashboard";
import HSAAccounts from "@/pages/health/HSAAccounts";
import HSACalculator from "@/pages/health/HSACalculator";
import DailyMetrics from "@/pages/health/DailyMetrics";
import LabBiomarkers from "@/pages/health/LabBiomarkers";
import Epigenetics from "@/pages/health/Epigenetics";
import Screenings from "@/pages/health/Screenings";
import TrendsCoach from "@/pages/health/TrendsCoach";
import Providers from "@/pages/health/Providers";
import ShareData from "@/pages/health/ShareData";
import Medications from "@/pages/health/Medications";
import Supplements from "@/pages/health/Supplements";
import DocsDirectives from "@/pages/health/DocsDirectives";
import CoachingKB from "@/pages/health/CoachingKB";
import EducationKB from "@/pages/health/EducationKB";
import RecommendationsKB from "@/pages/health/RecommendationsKB";
import HealthSettings from "@/pages/health/HealthSettings";

// Healthcare Optimization pages
import HealthcareDashboard from "@/pages/healthcare/HealthcareDashboard";
import HealthcareSavingsCalculator from "@/pages/healthcare/HealthcareSavingsCalculator";
import HealthcareSavings from "@/pages/HealthcareSavings";
import ValueDrivenSavings from "@/pages/ValueDrivenSavings";
import HealthcareDocuments from "@/pages/healthcare/HealthcareDocuments";
import MedicalRecords from "@/pages/healthcare/MedicalRecords";
import HealthMetrics from "@/pages/healthcare/HealthMetrics";

// Wealth pages
import WealthOverview from "@/pages/wealth";
import WealthAccounts from "@/pages/wealth/WealthAccounts";
import CashTransfers from "@/pages/wealth/CashTransfers";
import WealthCashManagement from "@/pages/wealth/WealthCashManagement";
import WealthTransfers from "@/pages/wealth/WealthTransfers";
import WealthProperties from "@/pages/wealth/WealthProperties";
import GoalsBudgets from "@/pages/wealth/GoalsBudgets";
import WealthDocuments from "@/pages/wealth/WealthDocuments";
import WealthSocialSecurity from "@/pages/wealth/WealthSocialSecurity";
import WealthBusinessFilings from "@/pages/wealth/WealthBusinessFilings";
import WealthBillPay from "@/pages/wealth/WealthBillPay";

// Premium wealth pages
import HighNetWorthTax from "@/pages/wealth/premium/HighNetWorthTax";
import AppreciatedStock from "@/pages/wealth/premium/AppreciatedStock";
import CharitableGifting from "@/pages/wealth/premium/CharitableGifting";
import NuaEsppRsu from "@/pages/wealth/premium/NuaEsppRsu";
import RothConversion from "@/pages/wealth/premium/RothConversion";
import StateResidency from "@/pages/wealth/premium/StateResidency";
import TrustEntityTax from "@/pages/wealth/premium/TrustEntityTax";
import AdvancedProperty from "@/pages/wealth/premium/AdvancedProperty";
import FamilyLegacyBox from "@/pages/wealth/premium/FamilyLegacyBox";
import PrivateMarket from "@/pages/wealth/premium/PrivateMarket";
import BusinessConcierge from "@/pages/wealth/premium/BusinessConcierge";
import HealthPremium from "@/pages/health/HealthPremium";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/calculator" replace />
  },
  {
    path: "/calculator",
    element: <PublicCalculator />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/client-dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/client-accounts",
    element: <ProtectedRoute><Accounts /></ProtectedRoute>
  },
  {
    path: "/accounts",
    element: <Navigate to="/client-accounts" replace />
  },
  {
    path: "/client-education",
    element: <ProtectedRoute><ResourcesCatalog /></ProtectedRoute>
  },
  {
    path: "/client-investments",
    element: <ProtectedRoute><Investments /></ProtectedRoute>
  },
  {
    path: "/client-tax-planning",
    element: <ProtectedRoute><TaxPlanning /></ProtectedRoute>
  },
  {
    path: "/tax-planning",
    element: <Navigate to="/client-tax-planning" replace />
  },
  {
    path: "/client-insurance",
    element: <ProtectedRoute><Insurance /></ProtectedRoute>
  },
  {
    path: "/client-lending",
    element: <ProtectedRoute><Lending /></ProtectedRoute>
  },
  {
    path: "/client-estate-planning",
    element: <ProtectedRoute><EstatePlanning /></ProtectedRoute>
  },
  {
    path: "/estate-planning",
    element: <Navigate to="/client-estate-planning" replace />
  },
  {
    path: "/client-financial-plans",
    element: <ProtectedRoute><FinancialPlans /></ProtectedRoute>
  },
  {
    path: "/financial-plans",
    element: <Navigate to="/client-financial-plans" replace />
  },
  {
    path: "/client-all-assets",
    element: <ProtectedRoute><AllAssets /></ProtectedRoute>
  },
  {
    path: "/client-cash-management",
    element: <ProtectedRoute><CashManagement /></ProtectedRoute>
  },
  {
    path: "/client-tax-budgets",
    element: <ProtectedRoute><TaxBudgets /></ProtectedRoute>
  },
  {
    path: "/client-transfers",
    element: <ProtectedRoute><Transfers /></ProtectedRoute>
  },
  {
    path: "/create-transfer",
    element: <ProtectedRoute><CreateTransfer /></ProtectedRoute>
  },
  {
    path: "/client-legacy-vault",
    element: <ProtectedRoute><ClientLegacyVault /></ProtectedRoute>
  },
  {
    path: "/legacy-vault",
    element: <Navigate to="/client-legacy-vault" replace />
  },
  {
    path: "/client-social-security",
    element: <ProtectedRoute><SocialSecurity /></ProtectedRoute>
  },
  {
    path: "/social-security",
    element: <Navigate to="/client-social-security" replace />
  },
  {
    path: "/client-business-filings",
    element: <ProtectedRoute><BusinessFilings /></ProtectedRoute>
  },
  {
    path: "/client-properties",
    element: <ProtectedRoute><Properties /></ProtectedRoute>
  },
  {
    path: "/client-billpay",
    element: <ProtectedRoute><BillPay /></ProtectedRoute>
  },
  {
    path: "/client-documents",
    element: <ProtectedRoute><ProfessionalsRouteWrapper><Documents /></ProfessionalsRouteWrapper></ProtectedRoute>
  },
  {
    path: "/client-family",
    element: <ProtectedRoute><ClientFamily /></ProtectedRoute>
  },
  {
    path: "/professional-signup",
    element: <ProtectedRoute><ProfessionalSignup /></ProtectedRoute>
  },
  {
    path: "/help",
    element: <ProtectedRoute><Help /></ProtectedRoute>
  },
  {
    path: "/settings",
    element: <ProtectedRoute><EnhancedSettings /></ProtectedRoute>
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
  },
  {
    path: "/admin/faqs",
    element: <ProtectedRoute requiredRole="admin"><AdminFAQs /></ProtectedRoute>
  },
  {
    path: "/tenant-admin",
    element: <ProtectedRoute><TenantAdmin /></ProtectedRoute>
  },
  {
    path: "/analytics",
    element: <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
  },
  {
    path: "/help-center",
    element: <ProtectedRoute><HelpCenter /></ProtectedRoute>
  },
  {
    path: "/project-integration",
    element: <ProtectedRoute><ProjectIntegration /></ProtectedRoute>
  },
  {
    path: "/ip-protection",
    element: <ProtectedRoute><IPProtection /></ProtectedRoute>
  },
  {
    path: "/advisor-feedback",
    element: <ProtectedRoute><AdvisorFeedback /></ProtectedRoute>
  },
  {
    path: "/client-advisor-profile",
    element: <ProtectedRoute><AdvisorProfile /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/private-equity",
    element: <ProtectedRoute><PrivateEquity /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/private-debt",
    element: <ProtectedRoute><PrivateDebt /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/hedge-fund",
    element: <ProtectedRoute><HedgeFunds /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/venture-capital",
    element: <ProtectedRoute><VentureCapital /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/collectibles",
    element: <ProtectedRoute><Collectibles /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/digital-assets",
    element: <ProtectedRoute><DigitalAssets /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/real-assets",
    element: <ProtectedRoute><RealAssets /></ProtectedRoute>
  },
  {
    path: "/client-investments/alternative/structured-investments",
    element: <ProtectedRoute><StructuredInvestments /></ProtectedRoute>
  },
  {
    path: "/client-investments/model-portfolios",
    element: <ProtectedRoute><ModelPortfolios /></ProtectedRoute>
  },
  {
    path: "/client-investments/stock-screener",
    element: <ProtectedRoute><StockScreener /></ProtectedRoute>
  },
  {
    path: '/vehicles-collectibles',
    element: <ProtectedRoute><AllAssets /></ProtectedRoute>
  },
  {
    path: '/art-valuables',
    element: <ProtectedRoute><AllAssets /></ProtectedRoute>
  },
  {
    path: "/client-education/tax-planning",
    element: <ProtectedRoute><TaxPlanningEducation /></ProtectedRoute>
  },
  {
    path: "/navigation-diagnostics",
    element: <ProtectedRoute><NavigationDiagnostics /></ProtectedRoute>
  },
  {
    path: "/diagnostics-runner",
    element: <ProtectedRoute><DiagnosticsRunner /></ProtectedRoute>
  },
  // Health routes
  {
    path: "/health",
    element: <ProtectedRoute><HealthDashboard /></ProtectedRoute>
  },
  {
    path: "/health/accounts/hsa",
    element: <ProtectedRoute><HSAAccounts /></ProtectedRoute>
  },
  {
    path: "/health/accounts/hsa/calculator",
    element: <ProtectedRoute><HSACalculator /></ProtectedRoute>
  },
  {
    path: "/health/insights/vitals",
    element: <ProtectedRoute><DailyMetrics /></ProtectedRoute>
  },
  {
    path: "/health/insights/labs",
    element: <ProtectedRoute><LabBiomarkers /></ProtectedRoute>
  },
  {
    path: "/health/insights/epigenetics",
    element: <ProtectedRoute><Epigenetics /></ProtectedRoute>
  },
  {
    path: "/health/insights/screenings",
    element: <ProtectedRoute><Screenings /></ProtectedRoute>
  },
  {
    path: "/health/insights/trends",
    element: <ProtectedRoute><TrendsCoach /></ProtectedRoute>
  },
  {
    path: "/health/care/providers",
    element: <ProtectedRoute><Providers /></ProtectedRoute>
  },
  {
    path: "/health/care/share",
    element: <ProtectedRoute><ShareData /></ProtectedRoute>
  },
  {
    path: "/health/pharmacy/meds",
    element: <ProtectedRoute><Medications /></ProtectedRoute>
  },
  {
    path: "/health/pharmacy/supps",
    element: <ProtectedRoute><Supplements /></ProtectedRoute>
  },
  {
    path: "/health/docs",
    element: <ProtectedRoute><DocsDirectives /></ProtectedRoute>
  },
  {
    path: "/health/knowledge/coaching",
    element: <ProtectedRoute><CoachingKB /></ProtectedRoute>
  },
  {
    path: "/health/knowledge/education",
    element: <ProtectedRoute><EducationKB /></ProtectedRoute>
  },
  {
    path: "/health/knowledge/recommendations",
    element: <ProtectedRoute><RecommendationsKB /></ProtectedRoute>
  },
  {
    path: "/health/settings",
    element: <ProtectedRoute><HealthSettings /></ProtectedRoute>
  },
  {
    path: "/health/records",
    element: <ProtectedRoute><MedicalRecords /></ProtectedRoute>
  },
  {
    path: "/health/metrics",
    element: <ProtectedRoute><HealthMetrics /></ProtectedRoute>
  },
  // Healthcare Optimization routes (new navigation structure)
  {
    path: "/healthcare-dashboard",
    element: <ProtectedRoute><HealthcareDashboard /></ProtectedRoute>
  },
  {
    path: "/healthcare-hsa-accounts",
    element: <ProtectedRoute><HSAAccounts /></ProtectedRoute>
  },
  {
    path: "/healthcare-savings",
    element: <ProtectedRoute><HealthcareSavings /></ProtectedRoute>
  },
  {
    path: "/health/accounts/hsa/calculator", 
    element: <ProtectedRoute><HealthcareSavings /></ProtectedRoute>
  },
  {
    path: "/value-driven-savings",
    element: <ProtectedRoute><ValueDrivenSavings /></ProtectedRoute>
  },
  {
    path: "/healthcare-providers",
    element: <ProtectedRoute><Providers /></ProtectedRoute>
  },
  {
    path: "/healthcare-medications",
    element: <ProtectedRoute><Medications /></ProtectedRoute>
  },
  {
    path: "/healthcare-supplements",
    element: <ProtectedRoute><Supplements /></ProtectedRoute>
  },
  {
    path: "/healthcare-healthspan",
    element: <ProtectedRoute><TrendsCoach /></ProtectedRoute>
  },
  {
    path: "/healthcare-documents",
    element: <ProtectedRoute><HealthcareDocuments /></ProtectedRoute>
  },
  {
    path: "/health/documents",
    element: <ProtectedRoute><HealthcareDocuments /></ProtectedRoute>
  },
  {
    path: "/healthcare-knowledge",
    element: <ProtectedRoute><CoachingKB /></ProtectedRoute>
  },
  {
    path: "/healthcare-share-data",
    element: <ProtectedRoute><ShareData /></ProtectedRoute>
  },
  {
    path: "/healthcare-coaching",
    element: <ProtectedRoute><CoachingKB /></ProtectedRoute>
  },
  {
    path: "/healthcare-education",
    element: <ProtectedRoute><EducationKB /></ProtectedRoute>
  },
  {
    path: "/healthcare-recommendations",
    element: <ProtectedRoute><RecommendationsKB /></ProtectedRoute>
  },
  {
    path: "/healthcare-settings",
    element: <ProtectedRoute><HealthSettings /></ProtectedRoute>
  },
  {
    path: "/health/biomarkers",
    element: <ProtectedRoute><LabBiomarkers /></ProtectedRoute>
  },
  {
    path: "/health/biological-age",
    element: <ProtectedRoute><Epigenetics /></ProtectedRoute>
  },
  {
    path: "/health/preventive",
    element: <ProtectedRoute><Screenings /></ProtectedRoute>
  },
  {
    path: "/health/trends",
    element: <ProtectedRoute><TrendsCoach /></ProtectedRoute>
  },
  // Wealth Management routes
  {
    path: "/wealth",
    element: <ProtectedRoute><WealthOverview /></ProtectedRoute>
  },
  {
    path: "/wealth/accounts",
    element: <ProtectedRoute><WealthAccounts /></ProtectedRoute>
  },
  {
    path: "/wealth/cash",
    element: <ProtectedRoute><CashTransfers /></ProtectedRoute>
  },
  {
    path: "/wealth/cash/management",
    element: <ProtectedRoute><WealthCashManagement /></ProtectedRoute>
  },
  {
    path: "/wealth/cash/transfers",
    element: <ProtectedRoute><WealthTransfers /></ProtectedRoute>
  },
  {
    path: "/wealth/properties",
    element: <ProtectedRoute><WealthProperties /></ProtectedRoute>
  },
  {
    path: "/wealth/goals",
    element: <ProtectedRoute><GoalsBudgets /></ProtectedRoute>
  },
  {
    path: "/wealth/goals/retirement",
    element: <ProtectedRoute><GoalsBudgets /></ProtectedRoute>
  },
  {
    path: "/wealth/goals/bucket-list",
    element: <ProtectedRoute><GoalsBudgets /></ProtectedRoute>
  },
  {
    path: "/wealth/goals/budgets",
    element: <ProtectedRoute><GoalsBudgets /></ProtectedRoute>
  },
  {
    path: "/wealth/docs",
    element: <ProtectedRoute><WealthDocuments /></ProtectedRoute>
  },
  {
    path: "/wealth/social-security",
    element: <ProtectedRoute><WealthSocialSecurity /></ProtectedRoute>
  },
  {
    path: "/wealth/business-filings",
    element: <ProtectedRoute><WealthBusinessFilings /></ProtectedRoute>
  },
  {
    path: "/wealth/bill-pay",
    element: <ProtectedRoute><WealthBillPay /></ProtectedRoute>
  },
  // Premium wealth routes
  {
    path: "/wealth/premium/tax/high-net-worth",
    element: <ProtectedRoute><HighNetWorthTax /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/appreciated-stock",
    element: <ProtectedRoute><AppreciatedStock /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/charitable-gifting",
    element: <ProtectedRoute><CharitableGifting /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/nua-espp-rsu",
    element: <ProtectedRoute><NuaEsppRsu /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/roth-conversion",
    element: <ProtectedRoute><RothConversion /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/state-residency",
    element: <ProtectedRoute><StateResidency /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/tax/trust-entity",
    element: <ProtectedRoute><TrustEntityTax /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/properties",
    element: <ProtectedRoute><AdvancedProperty /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/legacy-box",
    element: <ProtectedRoute><FamilyLegacyBox /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/private-market",
    element: <ProtectedRoute><PrivateMarket /></ProtectedRoute>
  },
  {
    path: "/wealth/premium/business-concierge",
    element: <ProtectedRoute><BusinessConcierge /></ProtectedRoute>
  },
  {
    path: "/health/premium",
    element: <ProtectedRoute><HealthPremium /></ProtectedRoute>
  },
  // Legacy redirects
  {
    path: "/family-wealth/*",
    element: <Navigate to="/wealth" replace />
  },
  {
    path: "/client-tools/wealth/*",
    element: <Navigate to="/wealth" replace />
  },
  {
    path: "/healthcare-optimization/*",
    element: <Navigate to="/health" replace />
  },
  {
    path: "/tracking/*",
    element: <Navigate to="/health/insights" replace />
  },
  {
    path: "/hsa-accounts/*",
    element: <Navigate to="/health/accounts/hsa" replace />
  },
  {
    path: "/healthcare-savings-calculator",
    element: <Navigate to="/health/accounts/hsa/calculator" replace />
  },
  // Legacy health redirects
  {
    path: "/client-legacy-vault",
    element: <Navigate to="/health" replace />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
