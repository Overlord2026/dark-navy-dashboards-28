
import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Fixed casing to match file name
import Accounts from "@/pages/Accounts";
import CustomerProfile from "@/pages/CustomerProfile";

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
    path: "/accounts",
    element: <Accounts />,
  },
  {
    path: "/profile",
    element: <CustomerProfile />,
  },
  {
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
  },
];
