
import { RouteObject } from "react-router-dom";
import ProjectIntegration from "@/pages/ProjectIntegration";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: (
      <AuthGuard>
        <ProjectIntegration />
      </AuthGuard>
    ),
  },
];
