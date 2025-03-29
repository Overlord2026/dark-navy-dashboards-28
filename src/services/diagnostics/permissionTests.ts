
import { PermissionsTestResult } from './types';

export const testPermissions = (): PermissionsTestResult[] => {
  // In a real app, would test user role permissions against routes and features
  return [
    {
      role: "client",
      permission: "view-dashboard",
      status: "success",
      message: "Clients can view dashboard"
    },
    {
      role: "client",
      permission: "access-documents",
      status: "success",
      message: "Clients can access documents"
    },
    {
      role: "advisor",
      permission: "view-client-profiles",
      status: "success",
      message: "Advisors can view client profiles"
    },
    {
      role: "client",
      permission: "modify-advisor-settings",
      status: "error",
      message: "Permission conflict: Clients should not be able to modify advisor settings"
    },
    {
      role: "advisor",
      permission: "create-financial-plans",
      status: "success",
      message: "Advisors can create financial plans"
    },
    {
      role: "admin",
      permission: "manage-subscriptions",
      status: "warning",
      message: "Admin subscription management partially available - some features hidden"
    }
  ];
};
