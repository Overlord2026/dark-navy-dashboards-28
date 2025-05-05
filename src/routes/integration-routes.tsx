
import React from "react";
import { RouteObject } from "react-router-dom";
import { SecureAuthWrapper } from "@/components/auth/SecureAuthWrapper";
import ProjectIntegration from "@/pages/ProjectIntegration";

export const integrationRoutes: RouteObject[] = [
  {
    path: "/integration",
    element: (
      <SecureAuthWrapper>
        <ProjectIntegration />
      </SecureAuthWrapper>
    ),
  },
  {
    path: "/project-integration",
    element: (
      <SecureAuthWrapper>
        <ProjectIntegration />
      </SecureAuthWrapper>
    ),
  },
  {
    path: "/marketplace",
    element: (
      <SecureAuthWrapper>
        <ProjectIntegration />
      </SecureAuthWrapper>
    ),
  },
];
