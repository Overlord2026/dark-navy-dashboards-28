
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import IndexPage from "@/pages/IndexPage";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import Professionals from "@/pages/Professionals";
import { DebugPage } from "@/pages/DebugPage";
import CashManagement from "@/pages/CashManagement";
import BankingTransfers from "@/pages/BankingTransfers";
import FundingAccounts from "@/pages/FundingAccounts";
import SocialSecurity from "@/pages/SocialSecurity";
import NotFound from "@/pages/NotFound";
import Properties from "@/pages/Properties";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/professionals",
    element: <Professionals />,
  },
  {
    path: "/debug",
    element: <DebugPage />,
  },
  {
    path: "/cash-management",
    element: <CashManagement />,
  },
  {
    path: "/banking-transfers",
    element: <BankingTransfers />,
  },
  {
    path: "/funding-accounts",
    element: <FundingAccounts />,
  },
  {
    path: "/social-security",
    element: <SocialSecurity />,
  },
  {
    path: "/properties",
    element: <Properties />,
  },
  // Education & Solutions routes
  {
    path: "/education",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/investments",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/investments/alternative/private-equity",
    element: <NotFound />, // Placeholder for private equity investments
  },
  {
    path: "/investments/alternative/private-debt",
    element: <NotFound />, // Placeholder for private debt investments
  },
  {
    path: "/investments/alternative/digital-assets",
    element: <NotFound />, // Placeholder for digital assets
  },
  {
    path: "/investments/alternative/real-assets",
    element: <NotFound />, // Placeholder for real assets
  },
  {
    path: "/investments/model-portfolios",
    element: <NotFound />, // Placeholder for model portfolios
  },
  {
    path: "/investments/stock-screener",
    element: <NotFound />, // Placeholder for stock screener
  },
  {
    path: "/education/tax-planning",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/insurance",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/lending",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/estate-planning",
    element: <NotFound />, // Placeholder until we implement this page
  },
  // Family Wealth routes
  {
    path: "/financial-plans",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/accounts",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/personal-insurance",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/legacy-vault",
    element: <NotFound />, // Placeholder until we implement this page
  },
  // Collaboration & Sharing routes
  {
    path: "/documents",
    element: <NotFound />, // Placeholder until we implement this page
  },
  {
    path: "/sharing",
    element: <NotFound />, // Placeholder until we implement this page
  },
  // Bottom nav routes
  {
    path: "/help",
    element: <NotFound />, // Placeholder until we implement this page
  },
  // Catch-all route for 404 pages
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Add default export to fix the TS error
export default function Routes() {
  return null;
}
