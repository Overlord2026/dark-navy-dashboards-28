
import { Route } from "react-router-dom";
// Use an alternative import approach to avoid the casing issue
import Dashboard from "@/pages/Dashboard"; // Direct import from Dashboard component

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="root" path="/" element={<Dashboard />} /> // Root path redirect to Dashboard
];

export default dashboardRoutes;
