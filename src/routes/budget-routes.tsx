
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import Budget from "@/pages/Budget";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const budgetRoutes = [
  {
    path: "/budget",
    element: (
      <AuthGuard>
        <Budget />
      </AuthGuard>
    ),
  },
];
