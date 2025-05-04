
import Investments from "@/pages/Investments";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
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
