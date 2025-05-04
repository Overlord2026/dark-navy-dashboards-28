
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Fixed import to match actual file casing

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
