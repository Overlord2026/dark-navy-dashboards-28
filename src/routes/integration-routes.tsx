
import { Route } from "react-router-dom";
import IntegrationPage from "@/pages/IntegrationPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export const integrationRoutes = [
  <Route
    key="integration"
    path="/integration"
    element={
      <ProtectedRoute>
        <IntegrationPage />
      </ProtectedRoute>
    }
  />
];
