
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
]);

// Add default export to fix the TS error
export default function Routes() {
  return null;
}
