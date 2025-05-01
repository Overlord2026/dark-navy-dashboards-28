
import { PermissionTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export const testPermissions = (): PermissionTestResult[] => {
  // Sample permission tests
  return [
    {
      id: uuidv4(),
      permission: "settings:read",
      status: "success",
      message: "Admin can read settings",
      role: "admin",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      permission: "settings:write",
      status: "success",
      message: "Admin can write settings",
      role: "admin",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      permission: "users:read",
      status: "success",
      message: "Manager can read users",
      role: "manager",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      permission: "users:write",
      status: "error",
      message: "Manager cannot write users but should be able to",
      role: "manager",
      expected: true,
      actual: false,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      permission: "api:access",
      status: "warning",
      message: "Client has API access but it should be limited",
      role: "client",
      expected: false,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      permission: "reports:delete",
      status: "success",
      message: "Client cannot delete reports",
      role: "client",
      expected: false,
      actual: false,
      timestamp: Date.now()
    }
  ];
};
