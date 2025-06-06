
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Education from "@/pages/Education";
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
import ClientLegacyVault from "@/pages/ClientLegacyVault";
import SocialSecurity from "@/pages/SocialSecurity";
import Properties from "@/pages/Properties";
import BillPay from "@/pages/BillPay";
import Documents from "@/pages/Documents";
import Professionals from "@/pages/Professionals";
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
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";
import Auth from "@/pages/Auth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Auth />
  },
  {
    path: "/auth",
    element: <Auth />
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
    element: <ProtectedRoute><Education /></ProtectedRoute>
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
    path: "/client-professionals",
    element: <ProtectedRoute><ProfessionalsRouteWrapper><Professionals /></ProfessionalsRouteWrapper></ProtectedRoute>
  },
  {
    path: "/professionals",
    element: <Navigate to="/client-professionals" replace />
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
    element: <ProtectedRoute><Settings /></ProtectedRoute>
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
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
