
import { lazy } from "react";
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Using lowercase to match the actual filename

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
