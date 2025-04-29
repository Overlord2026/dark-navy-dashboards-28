
import IndexPage from "@/pages/index";
import DashboardPage from "@/pages/dashboard";
import Landing from "@/pages/Landing";

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
