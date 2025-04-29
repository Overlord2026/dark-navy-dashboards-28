
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Fixed import with correct lowercase casing

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
