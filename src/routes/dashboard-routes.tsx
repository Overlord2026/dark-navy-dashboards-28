
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard.tsx"; // Fixed import with explicit extension

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
