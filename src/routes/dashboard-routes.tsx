
import Landing from "@/pages/Landing";
// Use a different import approach to avoid TypeScript casing issues
import { default as Dashboard } from "../pages/dashboard";

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
