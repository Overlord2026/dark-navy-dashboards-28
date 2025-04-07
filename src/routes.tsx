
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
import NotFound from "@/pages/NotFound";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/accounts",
    element: <Accounts />
  },
  {
    path: "/education",
    element: <Education />
  },
  {
    path: "/investments",
    element: <Investments />
  },
  {
    path: "/tax-planning",
    element: <TaxPlanning />
  },
  {
    path: "/insurance",
    element: <Insurance />
  },
  {
    path: "/lending",
    element: <Lending />
  },
  {
    path: "/estate-planning",
    element: <EstatePlanning />
  },
  {
    path: "/financial-plans",
    element: <FinancialPlans />
  },
  {
    path: "/all-assets",
    element: <AllAssets />
  },
  {
    path: "/cash-management",
    element: <CashManagement />
  },
  {
    path: "/tax-budgets",
    element: <TaxBudgets />
  },
  {
    path: "/transfers",
    element: <Transfers />
  },
  {
    path: "/legacy-vault",
    element: <LegacyVault />
  },
  {
    path: "/social-security",
    element: <SocialSecurity />
  },
  {
    path: "/properties",
    element: <Properties />
  },
  {
    path: "/billpay",
    element: <BillPay />
  },
  {
    path: "/documents",
    element: <ProfessionalsRouteWrapper><Documents /></ProfessionalsRouteWrapper>
  },
  {
    path: "/professionals",
    element: <ProfessionalsRouteWrapper><Professionals /></ProfessionalsRouteWrapper>
  },
  {
    path: "/professional-signup",
    element: <ProfessionalSignup />
  },
  {
    path: "/sharing",
    element: <Sharing />
  },
  {
    path: "/help",
    element: <Help />
  },
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/ip-protection",
    element: <IPProtection />
  },
  {
    path: "/advisor-feedback",
    element: <AdvisorFeedback />
  },
  {
    path: "/investments/alternative/private-equity",
    element: <PrivateEquity />
  },
  {
    path: "/investments/alternative/private-debt",
    element: <PrivateDebt />
  },
  {
    path: "/investments/alternative/digital-assets",
    element: <DigitalAssets />
  },
  {
    path: "/investments/alternative/real-assets",
    element: <RealAssets />
  },
  {
    path: "/investments/model-portfolios",
    element: <ModelPortfolios />
  },
  {
    path: "/investments/stock-screener",
    element: <StockScreener />
  },
  {
    path: '/vehicles-collectibles',
    element: <AllAssets />
  },
  {
    path: '/art-valuables',
    element: <AllAssets />
  },
  {
    path: "/education/tax-planning",
    element: <TaxPlanningEducation />
  },
  {
    path: "/navigation-diagnostics",
    element: <NavigationDiagnostics />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
