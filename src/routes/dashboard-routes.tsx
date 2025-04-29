
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Using correct casing with capital D

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="root" path="/" element={<Dashboard />} /> // Add root path to redirect to Dashboard
];

export default dashboardRoutes;
