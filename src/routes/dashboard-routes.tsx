
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";

const dashboardRoutes = [
  <Route key="landing" path="/" element={<Landing />} />,
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />
];

export default dashboardRoutes;
