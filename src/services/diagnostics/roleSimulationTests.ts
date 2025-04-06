import { RoleSimulationTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';

// Change function name to match import in index.ts
export const testRoleSimulations = (): RoleSimulationTestResult[] => {
  // Sample role simulation tests
  return [
    {
      id: uuidv4(),
      role: "admin",
      action: "view:users",
      module: "users", // Added for backward compatibility
      status: "success",
      message: "Admin can view users list as expected"
    },
    {
      id: uuidv4(),
      role: "admin",
      action: "delete:user",
      module: "users", // Added for backward compatibility
      status: "success",
      message: "Admin can delete users as expected"
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "view:users",
      module: "users", // Added for backward compatibility
      status: "success",
      message: "Manager can view users list as expected"
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "delete:user",
      module: "users", // Added for backward compatibility
      status: "error",
      message: "Manager should not be able to delete users but was able to"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "view:users",
      module: "users", // Added for backward compatibility
      status: "error",
      message: "Regular user should not be able to view all users but was able to"
    },
    
    // Reports module tests
    {
      id: uuidv4(),
      role: "admin",
      action: "export:reports",
      module: "reports", // Added for backward compatibility
      status: "success",
      message: "Admin can export reports as expected"
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "export:reports",
      module: "reports", // Added for backward compatibility
      status: "success",
      message: "Manager can export reports as expected"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "export:reports",
      module: "reports", // Added for backward compatibility
      status: "warning",
      message: "User can export some reports but should be limited to personal reports only"
    },
    {
      id: uuidv4(),
      role: "guest",
      action: "export:reports",
      module: "reports", // Added for backward compatibility
      status: "success",
      message: "Guest correctly denied access to export reports"
    },
    
    // Settings module tests
    {
      id: uuidv4(),
      role: "admin",
      action: "modify:system_settings",
      module: "settings", // Added for backward compatibility
      status: "success",
      message: "Admin can modify system settings as expected"
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "modify:system_settings",
      module: "settings", // Added for backward compatibility
      status: "error",
      message: "Manager should not be able to modify system settings but was able to"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "modify:system_settings",
      module: "settings", // Added for backward compatibility
      status: "success",
      message: "User correctly denied access to modify system settings"
    },
    {
      id: uuidv4(),
      role: "admin",
      action: "modify:personal_settings",
      module: "settings", // Added for backward compatibility
      status: "success",
      message: "Admin can modify personal settings as expected"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "modify:personal_settings",
      module: "settings", // Added for backward compatibility
      status: "success",
      message: "User can modify personal settings as expected"
    },
    
    // Billing module tests
    {
      id: uuidv4(),
      role: "admin",
      action: "view:all_billing",
      module: "billing", // Added for backward compatibility
      status: "success",
      message: "Admin can view all billing information as expected"
    },
    {
      id: uuidv4(),
      role: "manager",
      action: "view:all_billing",
      module: "billing", // Added for backward compatibility
      status: "success",
      message: "Manager can view all billing information as expected"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "view:all_billing",
      module: "billing", // Added for backward compatibility
      status: "error",
      message: "User should not be able to view all billing information but was able to"
    },
    {
      id: uuidv4(),
      role: "user",
      action: "view:personal_billing",
      module: "billing", // Added for backward compatibility
      status: "success",
      message: "User can view personal billing information as expected"
    },
    {
      id: uuidv4(),
      role: "guest",
      action: "view:personal_billing",
      module: "billing", // Added for backward compatibility
      status: "success",
      message: "Guest correctly denied access to billing information"
    }
  ];
};

// Keep the original name for backward compatibility
export const testRoleSimulation = testRoleSimulations;
