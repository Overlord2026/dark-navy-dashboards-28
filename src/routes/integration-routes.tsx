
import { RouteObject } from "react-router-dom";
import Integration from "@/pages/Integration";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: <Integration />
  },
  {
    path: "/navigation-diagnostics",
    element: <NavigationDiagnostics />
  }
];
