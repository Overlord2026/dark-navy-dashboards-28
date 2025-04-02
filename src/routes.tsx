
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
  {
    path: "/properties",
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
