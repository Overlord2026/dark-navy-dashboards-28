
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import Goals from "@/pages/Goals";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
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
