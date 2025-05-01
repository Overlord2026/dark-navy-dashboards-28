
import { Route } from "react-router-dom";
import Integration from "@/pages/Integration";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const integrationRoutes = [
  <Route 
    key="integration" 
    path="/integration" 
    element={
      <ProtectedRoute>
        <Integration />
      </ProtectedRoute>
    } 
  />
];
