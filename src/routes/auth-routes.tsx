
import { RouteObject } from "react-router-dom";
import Auth from "@/pages/Auth";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Auth guard for protected routes
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Guard to prevent authenticated users from accessing auth pages
export const UnauthenticatedGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <UnauthenticatedGuard><Auth /></UnauthenticatedGuard>,
  },
  {
    path: "/login",
    element: <Navigate to="/auth" replace />,
  },
  {
    path: "/signup",
    element: <Navigate to="/auth?tab=signup" replace />,
  },
];
