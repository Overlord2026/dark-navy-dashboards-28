
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
import AllModelPortfolios from "@/pages/AllModelPortfolios";
import StockScreener from "@/pages/investments/StockScreener";
import IPProtection from "@/pages/IPProtection";
import AdvisorFeedback from "@/pages/AdvisorFeedback";
import NotFound from "@/pages/NotFound";
import TaxPlanningEducation from "@/pages/TaxPlanningEducation";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";
import InvestmentPerformance from "@/pages/InvestmentPerformance";
import { ProfessionalsRouteWrapper } from "@/components/providers/ProfessionalsRouteWrapper";
import AlternativeAssetCategory from "@/pages/AlternativeAssetCategory";

// Create a route layout helper to avoid repetition
const createInvestmentProviderRoutes = () => {
  const providers = [
    'bfo-asset-management', 'bfo-model-marketplace', 'adelante', 'alpha-quant', 
    'ativo', 'avantis', 'blackrock', 'brown-advisory', 'camelot-portfolios', 
    'capital-group', 'churchill', 'dearborn', 'dundas', 'easterly', 
    'franklin-templeton', 'gwk', 'goldman-sachs', 'jpmorgan', 'nuveen', 
    'polen', 'saratoga', 'sawgrass', 'schafer-cullen', 'state-street', 
    'suncoast', 'trowe-price', 'victory-capital', 'washington-crossing', 
    'zacks', 'custom-portfolios', 'shared-by-advisor', 'custom'
  ];
  
  return providers.map(provider => ({
    path: `/investments/${provider}`,
    element: <NotFound /> // These could be replaced with proper components later
  }));
};

const alternativeAssetRoutes = [
  {
    path: "/investments/alternative/private-equity",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/private-debt",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/hedge-fund",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/venture-capital",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/collectibles",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/digital-assets",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/real-assets",
    element: <AlternativeAssetCategory />
  },
  {
    path: "/investments/alternative/structured-investments",
    element: <AlternativeAssetCategory />
  },
];

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
    path: "/investment-performance",
    element: <InvestmentPerformance />
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
    path: "/investments/model-portfolios",
    element: <ModelPortfolios />
  },
  {
    path: "/investments/models/all",
    element: <AllModelPortfolios />
  },
  {
    path: "/investments/stock-screener",
    element: <StockScreener />
  },
  ...alternativeAssetRoutes,
  ...createInvestmentProviderRoutes(),
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
