
import Investments from "@/pages/Investments";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const investmentRoutes = [
  {
    path: "/investments",
    element: (
      <AuthGuard>
        <Investments />
      </AuthGuard>
    ),
  },
];
