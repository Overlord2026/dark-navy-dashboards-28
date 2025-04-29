
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AdvisorDashboard from "@/pages/AdvisorDashboard";

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
    element: <AdvisorDashboard />,
  },
  {
    path: "/advisor/dashboard",
    element: <AdvisorDashboard />,
  },
  {
    path: "/advisor/*",
    element: <AdvisorDashboard />,
  },
];
