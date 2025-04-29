
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard"; // Fixed casing to match actual file

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
