
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Fixed import with correct casing

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
