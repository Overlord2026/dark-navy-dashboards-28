
import { RouteObject } from "react-router-dom";
import ProfilePage from "@/pages/ProfilePage";
import AdvisorProfile from "@/pages/AdvisorProfile";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

// Auth guard to protect routes
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/secure-login" />;
  }
  
  return <>{children}</>;
};

export const profileRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    ),
  },
  {
    path: "/advisor-profile",
    element: (
      <AuthGuard>
        <AdvisorProfile />
      </AuthGuard>
    ),
  },
];
