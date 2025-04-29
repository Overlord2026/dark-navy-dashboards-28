
import { Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Using lowercase to match the actual file name

const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<Dashboard />} />,
  <Route key="root" path="/" element={<Dashboard />} /> // Root path redirect to Dashboard
];

export default dashboardRoutes;
