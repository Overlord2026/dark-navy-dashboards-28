
import { RoleSimulationTestResult } from './types';

export const testRoleSimulations = (): RoleSimulationTestResult[] => {
  // In a real app, this would actually test user role access with real authentication and authorization
  return [
    // Client/Consumer role tests
    {
      role: "client",
      module: "dashboard",
      accessStatus: "granted",
      status: "success",
      message: "Clients can access dashboard",
      expectedAccess: true
    },
    {
      role: "client",
      module: "documents",
      accessStatus: "granted",
      status: "success",
      message: "Clients can access documents",
      expectedAccess: true
    },
    {
      role: "client",
      module: "investments",
      accessStatus: "granted",
      status: "success", 
      message: "Clients can access investments",
      expectedAccess: true
    },
    {
      role: "client",
      module: "advisor-module-marketplace",
      accessStatus: "denied",
      status: "success",
      message: "Clients correctly blocked from advisor module marketplace",
      expectedAccess: false
    },
    {
      role: "client",
      module: "admin-subscription",
      accessStatus: "denied",
      status: "success",
      message: "Clients correctly blocked from admin subscription page",
      expectedAccess: false
    },
    
    // Advisor role tests
    {
      role: "advisor",
      module: "dashboard",
      accessStatus: "granted",
      status: "success",
      message: "Advisors can access dashboard",
      expectedAccess: true
    },
    {
      role: "advisor",
      module: "advisor-module-marketplace",
      accessStatus: "granted",
      status: "success",
      message: "Advisors can access module marketplace",
      expectedAccess: true
    },
    {
      role: "advisor",
      module: "client-profiles",
      accessStatus: "granted",
      status: "success",
      message: "Advisors can access client profiles",
      expectedAccess: true
    },
    {
      role: "advisor",
      module: "admin-subscription",
      accessStatus: "granted", 
      status: "error",
      message: "Advisors have incorrect access to admin subscription page",
      expectedAccess: false
    },
    
    // Admin role tests
    {
      role: "admin",
      module: "dashboard",
      accessStatus: "granted",
      status: "success",
      message: "Admins can access dashboard",
      expectedAccess: true
    },
    {
      role: "admin",
      module: "advisor-module-marketplace",
      accessStatus: "granted",
      status: "success",
      message: "Admins can access module marketplace",
      expectedAccess: true
    },
    {
      role: "admin",
      module: "admin-subscription",
      accessStatus: "granted",
      status: "success",
      message: "Admins can access subscription management",
      expectedAccess: true
    },
    {
      role: "admin",
      module: "system-diagnostics",
      accessStatus: "granted",
      status: "success",
      message: "Admins can access system diagnostics",
      expectedAccess: true
    },
    {
      role: "admin",
      module: "audit-logs",
      accessStatus: "denied",
      status: "error",
      message: "Admins cannot access audit logs despite having proper permissions",
      expectedAccess: true
    },
    
    // Professional role tests
    {
      role: "accountant",
      module: "tax-budgets",
      accessStatus: "granted",
      status: "success",
      message: "Accountants can access tax budgets",
      expectedAccess: true
    },
    {
      role: "accountant",
      module: "client-finances",
      accessStatus: "granted",
      status: "success",
      message: "Accountants can access client finances",
      expectedAccess: true
    },
    {
      role: "accountant",
      module: "investments",
      accessStatus: "granted",
      status: "warning",
      message: "Accountants have too broad access to investments module",
      expectedAccess: false
    },
    {
      role: "attorney",
      module: "legal-documents",
      accessStatus: "granted",
      status: "success",
      message: "Attorneys can access legal documents",
      expectedAccess: true
    },
    {
      role: "attorney",
      module: "legacy-vault",
      accessStatus: "granted",
      status: "success",
      message: "Attorneys can access legacy vault",
      expectedAccess: true
    },
    {
      role: "attorney",
      module: "client-finances",
      accessStatus: "denied",
      status: "error", 
      message: "Attorneys need access to client finances for certain document preparation",
      expectedAccess: true
    }
  ];
};
