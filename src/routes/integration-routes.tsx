
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import ProjectIntegration from "@/pages/ProjectIntegration";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
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
];
