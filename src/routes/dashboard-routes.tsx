
import Landing from "@/pages/Landing";
// Resolve the casing issue by using the relative path directly
import Dashboard from "../pages/Dashboard";

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
];
