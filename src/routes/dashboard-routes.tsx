
import Landing from "@/pages/Landing";
import DashboardPage from "@/pages/Dashboard";
import IndexPage from "@/pages/Landing";

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
    element: <IndexPage />,
  },
];
