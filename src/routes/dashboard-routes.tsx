
import { default as IndexPage } from "@/pages/index";
import { default as DashboardPage } from "@/pages/Dashboard";
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
