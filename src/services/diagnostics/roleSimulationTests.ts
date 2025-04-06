
import { RoleSimulationTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

export const testRoleSimulations = async (): Promise<RoleSimulationTestResult[]> => {
  // Simulate response delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sample role simulation tests
  return [
    {
      id: uuidv4(),
      role: "admin",
      action: "view_dashboard",
      status: "success",
      message: "Admin can view dashboard",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "admin",
      action: "manage_users",
      status: "success",
      message: "Admin can manage users",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "admin",
      action: "access_settings",
      status: "success",
      message: "Admin can access settings",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "view_dashboard",
      status: "success",
      message: "Manager can view dashboard",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "manage_team",
      status: "success",
      message: "Manager can manage team",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "access_settings",
      status: "error",
      message: "Manager cannot access settings but should be able to",
      expected: true,
      actual: false,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "client",
      action: "view_dashboard",
      status: "success",
      message: "Client can view dashboard",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "client",
      action: "manage_profile",
      status: "success",
      message: "Client can manage profile",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "client",
      action: "access_settings",
      status: "success",
      message: "Client cannot access settings",
      expected: false,
      actual: false,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "advisor",
      action: "view_dashboard",
      status: "success",
      message: "Advisor can view dashboard",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "advisor",
      action: "manage_clients",
      status: "success",
      message: "Advisor can manage clients",
      expected: true,
      actual: true,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "advisor",
      action: "view_reports",
      status: "warning",
      message: "Advisor can view reports but with limited data",
      expected: true,
      actual: true,
      timestamp: Date.now(),
      details: {
        limitations: "Can only see reports for assigned clients"
      }
    },
    {
      id: uuidv4(),
      role: "guest",
      action: "view_dashboard",
      status: "success",
      message: "Guest cannot view dashboard",
      expected: false,
      actual: false,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      role: "guest",
      action: "view_public_content",
      status: "success",
      message: "Guest can view public content",
      expected: true,
      actual: true,
      timestamp: Date.now()
    }
  ];
};
