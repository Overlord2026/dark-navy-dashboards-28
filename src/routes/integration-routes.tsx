
import React from "react";
import { RouteObject } from "react-router-dom";
import IntegrationHub from "@/pages/IntegrationHub";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: <IntegrationHub />,
  },
];
