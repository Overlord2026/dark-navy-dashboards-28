
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/dashboard"; // Using @ alias for better path resolution
import AdvisorComingSoon from "@/pages/AdvisorComingSoon";

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
