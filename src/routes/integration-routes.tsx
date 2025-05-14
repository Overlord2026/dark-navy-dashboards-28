
import { RouteObject } from "react-router-dom";
import DefaultLayout from "@/components/layout/DefaultLayout";
import IntegrationHub from "@/pages/integration/IntegrationHub";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <IntegrationHub />,
      }
    ]
  }
];
