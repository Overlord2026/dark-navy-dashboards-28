
import { RouteObject } from "react-router-dom";
import IntegrationHub from "@/pages/integration/IntegrationHub";
import NavigationDiagnostics from "@/pages/NavigationDiagnostics";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: <IntegrationHub />
  },
  {
    path: "/navigation-diagnostics",
    element: <NavigationDiagnostics />
  }
];
