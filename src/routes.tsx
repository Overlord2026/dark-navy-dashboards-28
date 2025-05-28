
import React from "react";
import { createBrowserRouter } from "react-router-dom";
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
import LegacyVault from "@/pages/LegacyVault";
import SocialSecurity from "@/pages/SocialSecurity";
import Properties from "@/pages/Properties";
import BillPay from "@/pages/BillPay";
import Documents from "@/pages/Documents";
import Professionals from "@/pages/Professionals";
import ProfessionalSignup from "@/pages/ProfessionalSignup";
import Sharing from "@/pages/Sharing";
import Help from "@/pages/Help";
import Settings from "@/pages/Settings";
import PrivateEquity from "@/pages/investments/PrivateEquity";
import PrivateDebt from "@/pages/investments/PrivateDebt";
import DigitalAssets from "@/pages/investments/DigitalAssets";
import RealAssets from "@/pages/investments/RealAssets";
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
    path: "/accounts",
    element: <ProtectedRoute><Accounts /></ProtectedRoute>
  },
  {
    path: "/client-education",
    element: <ProtectedRoute><Education /></ProtectedRoute>
  },
  {
    path: "/investments",
    element: <ProtectedRoute><Investments /></ProtectedRoute>
  },
  {
    path: "/tax-planning",
    element: <ProtectedRoute><TaxPlanning /></ProtectedRoute>
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
    path: "/estate-planning",
    element: <ProtectedRoute><EstatePlanning /></ProtectedRoute>
  },
  {
    path: "/financial-plans",
    element: <ProtectedRoute><FinancialPlans /></ProtectedRoute>
  },
  {
    path: "/all-assets",
    element: <ProtectedRoute><AllAssets /></ProtectedRoute>
  },
  {
    path: "/cash-management",
    element: <ProtectedRoute><CashManagement /></ProtectedRoute>
  },
  {
    path: "/tax-budgets",
    element: <ProtectedRoute><TaxBudgets /></ProtectedRoute>
  },
  {
    path: "/transfers",
    element: <ProtectedRoute><Transfers /></ProtectedRoute>
  },
  {
    path: "/legacy-vault",
    element: <ProtectedRoute><LegacyVault /></ProtectedRoute>
  },
  {
    path: "/social-security",
    element: <ProtectedRoute><SocialSecurity /></ProtectedRoute>
  },
  {
    path: "/properties",
    element: <ProtectedRoute><Properties /></ProtectedRoute>
  },
  {
    path: "/billpay",
    element: <ProtectedRoute><BillPay /></ProtectedRoute>
  },
  {
    path: "/documents",
    element: <ProtectedRoute><ProfessionalsRouteWrapper><Documents /></ProfessionalsRouteWrapper></ProtectedRoute>
  },
  {
    path: "/professionals",
    element: <ProtectedRoute><ProfessionalsRouteWrapper><Professionals /></ProfessionalsRouteWrapper></ProtectedRoute>
  },
  {
    path: "/professional-signup",
    element: <ProtectedRoute><ProfessionalSignup /></ProtectedRoute>
  },
  {
    path: "/sharing",
    element: <ProtectedRoute><Sharing /></ProtectedRoute>
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
    path: "/ip-protection",
    element: <ProtectedRoute><IPProtection /></ProtectedRoute>
  },
  {
    path: "/advisor-feedback",
    element: <ProtectedRoute><AdvisorFeedback /></ProtectedRoute>
  },
  {
    path: "/advisor-profile",
    element: <ProtectedRoute><AdvisorProfile /></ProtectedRoute>
  },
  {
    path: "/investments/alternative/private-equity",
    element: <ProtectedRoute><PrivateEquity /></ProtectedRoute>
  },
  {
    path: "/investments/alternative/private-debt",
    element: <ProtectedRoute><PrivateDebt /></ProtectedRoute>
  },
  {
    path: "/investments/alternative/digital-assets",
    element: <ProtectedRoute><DigitalAssets /></ProtectedRoute>
  },
  {
    path: "/investments/alternative/real-assets",
    element: <ProtectedRoute><RealAssets /></ProtectedRoute>
  },
  {
    path: "/investments/model-portfolios",
    element: <ProtectedRoute><ModelPortfolios /></ProtectedRoute>
  },
  {
    path: "/investments/stock-screener",
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
