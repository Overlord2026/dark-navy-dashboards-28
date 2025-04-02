
import { PermissionTestResult } from './types';

export const testPermissions = (): PermissionTestResult[] => {
  // Sample permission tests for different roles and resources
  return [
    {
      name: "Admin View Dashboard",
      role: "admin",
      permission: "view:dashboard",
      status: "success",
      message: "Admin can access dashboard as expected"
    },
    {
      name: "Admin Manage Users",
      role: "admin",
      permission: "manage:users",
      status: "success",
      message: "Admin can manage users as expected"
    },
    {
      name: "Editor Edit Content",
      role: "editor",
      permission: "edit:content",
      status: "success",
      message: "Editor can edit content as expected"
    },
    {
      name: "Viewer Edit Content",
      role: "viewer",
      permission: "edit:content",
      status: "error",
      message: "Viewer should not be able to edit content but permissions allow it"
    },
    {
      name: "Admin Access Analytics",
      role: "admin",
      permission: "access:analytics",
      status: "success",
      message: "Admin can access analytics as expected"
    },
    {
      name: "Editor Publish Content",
      role: "editor",
      permission: "publish:content",
      status: "warning",
      message: "Editor can publish content but approval workflow is not enforced"
    }
  ];
};
