
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
