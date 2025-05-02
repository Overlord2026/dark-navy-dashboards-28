
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Using the original casing to fix build error

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
