
import React from "react";
import { Route, Navigate } from "react-router-dom";

// Import admin pages
import AdminSubscription from "../pages/AdminSubscription";
import SystemDiagnostics from "../pages/SystemDiagnostics";
import NavigationDiagnostics from "../pages/NavigationDiagnostics";
import DeveloperAccessControl from "../pages/DeveloperAccessControl";
import IPProtection from "../pages/IPProtection";
import SystemHealthDashboard from "../pages/SystemHealthDashboard";

const AdminRoutes: React.FC = () => {
  return (
    <>
      <Route path="/admin/subscription" element={<AdminSubscription />} />
      <Route path="/admin/system-diagnostics" element={<SystemDiagnostics />} />
      <Route path="/admin/navigation-diagnostics" element={<NavigationDiagnostics />} />
      <Route path="/admin/developer-access" element={<DeveloperAccessControl />} />
      <Route path="/admin/ip-protection" element={<IPProtection />} />
      <Route path="/admin/system-health" element={<SystemHealthDashboard />} />
      <Route path="/dev/diagnostics" element={<NavigationDiagnostics />} />
    </>
  );
};

export default AdminRoutes;
