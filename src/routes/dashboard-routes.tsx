
import Landing from "@/pages/Landing";
import DashboardPage from "@/pages/dashboard";

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
