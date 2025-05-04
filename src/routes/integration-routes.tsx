
import { RouteObject } from "react-router-dom";
import { SecureAuthWrapper } from "@/components/auth/SecureAuthWrapper";
import ProjectIntegrationPage from "@/pages/ProjectIntegrationPage";

/**
 * Routes for Project Integration functionality
 * - Connected Projects
 * - Architecture
 * - API Integrations
 * - Plugins
 */
export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: (
      <SecureAuthWrapper requireMFA={false}>
        <ProjectIntegrationPage />
      </SecureAuthWrapper>
    ),
  },
];
