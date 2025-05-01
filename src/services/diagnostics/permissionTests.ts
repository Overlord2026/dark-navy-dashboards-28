
import { v4 as uuidv4 } from "uuid";
import { DiagnosticTestStatus } from "./types";
import { PermissionTestResult } from "@/types/diagnostics";

export function runPermissionTests(): PermissionTestResult[] {
  const results: PermissionTestResult[] = [];
  
  // Mock permission tests
  const permissionTests = [
    { role: "admin", resource: "dashboard", permission: "view", status: "pass", message: "Admin can view dashboard" },
    { role: "admin", resource: "settings", permission: "modify", status: "pass", message: "Admin can modify settings" },
    { role: "user", resource: "dashboard", permission: "view", status: "pass", message: "User can view dashboard" },
    { role: "user", resource: "settings", permission: "view", status: "pass", message: "User can view settings" },
    { role: "user", resource: "settings", permission: "modify", status: "fail", message: "User cannot modify settings as expected" },
    { role: "guest", resource: "dashboard", permission: "view", status: "pass", message: "Guest can view dashboard" },
    { role: "guest", resource: "settings", permission: "view", status: "fail", message: "Guest should not view settings" },
  ];
  
  permissionTests.forEach(test => {
    results.push({
      id: uuidv4(),
      role: test.role,
      resource: test.resource,
      permission: test.permission,
      status: test.status as "pass" | "fail" | "warn",
      message: test.message
    });
  });

  return results;
}
