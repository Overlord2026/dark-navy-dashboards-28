
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";

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
    element: <Index />,
  },
];
