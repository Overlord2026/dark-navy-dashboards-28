
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Insurance from "@/pages/Insurance";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const integrationRoutes = [
  {
    path: "/insurance",
    element: (
      <AuthGuard>
        <Insurance />
      </AuthGuard>
    ),
  },
];
