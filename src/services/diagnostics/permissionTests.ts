
import { PermissionTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

export const testPermissions = (): PermissionTestResult[] => {
  // Sample permission tests for different roles and resources
  return [
    {
      id: uuidv4(),
      name: "Admin View Dashboard",
      role: "admin",
      permission: "view:dashboard",
      status: "success",
      message: "Admin can access dashboard as expected"
    },
    {
      id: uuidv4(),
      name: "Admin Manage Users",
      role: "admin",
      permission: "manage:users",
      status: "success",
      message: "Admin can manage users as expected"
    },
    {
      id: uuidv4(),
      name: "Editor Edit Content",
      role: "editor",
      permission: "edit:content",
      status: "success",
      message: "Editor can edit content as expected"
    },
    {
      id: uuidv4(),
      name: "Viewer Edit Content",
      role: "viewer",
      permission: "edit:content",
      status: "error",
      message: "Viewer should not be able to edit content but permissions allow it"
    },
    {
      id: uuidv4(),
      name: "Admin Access Analytics",
      role: "admin",
      permission: "access:analytics",
      status: "success",
      message: "Admin can access analytics as expected"
    },
    {
      id: uuidv4(),
      name: "Editor Publish Content",
      role: "editor",
      permission: "publish:content",
      status: "warning",
      message: "Editor can publish content but approval workflow is not enforced"
    }
  ];
};
