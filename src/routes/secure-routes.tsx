
import { RouteObject } from "react-router-dom";
import { SecureAuthWrapper } from "@/components/auth/SecureAuthWrapper";
import ProfilePage from "@/pages/ProfilePage";
import IPProtection from "@/pages/IPProtection";

/**
 * Routes that require authentication and security enforcement
 * - Enforces proper authentication
 * - Validates required roles
 * - Enforces MFA where configured
 * - Logs access attempts for audit
 */
export const secureRoutes: RouteObject[] = [
  // Profile routes with standard security
  {
    path: "/profile",
    element: (
      <SecureAuthWrapper requireMFA={false}>
        <ProfilePage />
      </SecureAuthWrapper>
    ),
  },
  
  // IP Protection routes with elevated security and role requirements
  {
    path: "/ip-protection",
    element: (
      <SecureAuthWrapper requiredRole="admin" requireMFA={true}>
        <IPProtection />
      </SecureAuthWrapper>
    ),
  },
];
