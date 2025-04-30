
import { Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const dashboardRoutes = [
  <Route 
    key="dashboard" 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
];

export default dashboardRoutes;
