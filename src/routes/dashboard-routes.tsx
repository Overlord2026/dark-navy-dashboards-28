
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
