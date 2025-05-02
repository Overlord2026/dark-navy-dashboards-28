
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Fixing the import to match the actual file name

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
