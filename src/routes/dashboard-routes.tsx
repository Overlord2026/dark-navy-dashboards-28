
import Landing from "@/pages/Landing";
// Import using the exact casing that matches the file system
import Dashboard from "../pages/Dashboard";
import AdvisorComingSoon from "../pages/AdvisorComingSoon";

export const dashboardRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/index",
    element: <Landing />,
  },
  {
    path: "/advisor/login",
    element: <AdvisorComingSoon />,
  },
  {
    path: "/advisor/dashboard",
    element: <AdvisorComingSoon />,
  },
  {
    path: "/advisor/*",
    element: <AdvisorComingSoon />,
  },
];
