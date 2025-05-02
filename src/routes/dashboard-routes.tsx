
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/Dashboard"; // Using the correct casing

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
