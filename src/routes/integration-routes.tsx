
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import ProjectIntegration from "@/pages/ProjectIntegration";
import ConnectedProjects from "@/pages/integration/ConnectedProjects";
import Architecture from "@/pages/integration/Architecture";
import ApiIntegrations from "@/pages/integration/ApiIntegrations";
import Plugins from "@/pages/integration/Plugins";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const integrationRoutes = [
  {
    path: "/integration",
    element: (
      <AuthGuard>
        <ProjectIntegration />
      </AuthGuard>
    ),
  },
  {
    path: "/integration/connected-projects",
    element: (
      <AuthGuard>
        <ConnectedProjects />
      </AuthGuard>
    ),
  },
  {
    path: "/integration/architecture",
    element: (
      <AuthGuard>
        <Architecture />
      </AuthGuard>
    ),
  },
  {
    path: "/integration/api",
    element: (
      <AuthGuard>
        <ApiIntegrations />
      </AuthGuard>
    ),
  },
  {
    path: "/integration/plugins",
    element: (
      <AuthGuard>
        <Plugins />
      </AuthGuard>
    ),
  },
];
