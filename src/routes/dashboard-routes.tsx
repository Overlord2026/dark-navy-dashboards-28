
import Landing from "@/pages/Landing";
import DashboardPage from "@/pages/Dashboard";

export const dashboardRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/index",
    element: <Landing />,
  },
];
