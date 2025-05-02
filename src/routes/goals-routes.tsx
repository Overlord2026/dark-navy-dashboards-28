
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Goals from "@/pages/Goals";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const goalsRoutes = [
  {
    path: "/goals",
    element: (
      <AuthGuard>
        <Goals />
      </AuthGuard>
    ),
  },
];
