
import { RouteObject } from "react-router-dom";
import ProjectIntegration from "@/pages/ProjectIntegration";
import ProjectIntegrationPage from "@/pages/ProjectIntegrationPage";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/project-integration",
    element: <ProjectIntegration />,
  },
  // Legacy route for backwards compatibility
  {
    path: "/integration",
    element: <ProjectIntegrationPage />,
  }
];
