
import Dashboard from "@/pages/Dashboard";
import FinancialPlans from "@/pages/FinancialPlans";
import Accounts from "@/pages/Accounts";
import WealthManagement from "@/pages/WealthManagement";
import Properties from "@/pages/Properties";
import Integration from "@/pages/Integration";
import LegacyVault from "@/pages/LegacyVault";
import Documents from "@/pages/Documents";
import TaxBudgets from "@/pages/TaxBudgets";
import BillPay from "@/pages/BillPay";

export const dashboardRoutes = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/financial-plans",
    element: <FinancialPlans />,
  },
  {
    path: "/accounts",
    element: <Accounts />,
  },
  {
    path: "/wealth-management",
    element: <WealthManagement />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  {
    path: "/integration",
    element: <Integration />,
  },
  {
    path: "/legacy-vault",
    element: <LegacyVault />,
  },
  {
    path: "/documents",
    element: <Documents />,
  },
  {
    path: "/tax-budgets",
    element: <TaxBudgets />,
  },
  {
    path: "/billpay",
    element: <BillPay />,
  }
];
