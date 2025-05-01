
import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Fixed casing to match file name

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
    path: "/home",
    element: <Navigate to="/dashboard" replace />,
  },
];
