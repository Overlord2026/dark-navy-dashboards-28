
import { Route } from "react-router-dom";
// Use an alternative import approach to avoid the casing issue
import Dashboard from "@/pages/index"; // Using the index file which exports the correct dashboard

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="root" path="/" element={<Dashboard />} /> // Root path redirect to Dashboard
];

export default dashboardRoutes;
