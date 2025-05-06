
import { RouteObject } from "react-router-dom";
import ProfilePage from "@/pages/ProfilePage";
import AdvisorProfile from "@/pages/AdvisorProfile";
import { AuthGuard } from "./auth-routes";

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
