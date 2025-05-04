
import { RouteObject } from "react-router-dom";
import FinancialPlans from "@/pages/FinancialPlans";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const financialPlansRoutes: RouteObject[] = [
  {
    path: "/financial-plans",
    element: (
      <AuthGuard>
        <FinancialPlans />
      </AuthGuard>
    ),
  },
];
