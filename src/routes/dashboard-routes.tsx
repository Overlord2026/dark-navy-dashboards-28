
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/dashboard"; // Using lowercase to match the actual file

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
];
