
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Updated casing to match actual file

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
