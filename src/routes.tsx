
import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import CustomerProfile from "@/pages/CustomerProfile";
import SystemDiagnostics from "@/pages/SystemDiagnostics";
import SystemHealthDashboard from "@/pages/SystemHealthDashboard";

// Import other pages as needed

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/customer-profile" element={<CustomerProfile />} />
      <Route path="/system-diagnostics" element={<SystemDiagnostics />} />
      <Route path="/system-health" element={<SystemHealthDashboard />} />
      
      {/* Add other routes as needed */}
    </Routes>
  );
}
