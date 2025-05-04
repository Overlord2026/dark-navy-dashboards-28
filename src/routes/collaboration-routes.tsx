
import { RouteObject } from "react-router-dom";
import ServiceProfessionalsCollab from "@/pages/collaboration/service-professionals";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const collaborationRoutes: RouteObject[] = [
  {
    path: "/collaboration/service-professionals",
    element: (
      <AuthGuard>
        <ServiceProfessionalsCollab />
      </AuthGuard>
    ),
  },
];
