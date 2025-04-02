
import { NavigationDiagnosticResult } from "@/types/diagnostics";

// Dashboard tab diagnostics
export const diagnoseDashboardTab = async (): Promise<NavigationDiagnosticResult> => {
  try {
    console.log("Running Dashboard tab diagnostics");
    
    // Simulate component rendering checks
    const componentCheck = Math.random() > 0.1; // 90% success rate for demo
    
    // Simulate data fetching
    const dataFetchCheck = Math.random() > 0.15; // 85% success rate for demo
    
    if (!componentCheck) {
      return {
        route: "/dashboard",
        status: "error",
        message: "Dashboard components failed to render properly",
        componentStatus: {
          rendered: false,
          errors: ["NetWorthSummary component failed to load"]
        }
      };
    }
    
    if (!dataFetchCheck) {
      return {
        route: "/dashboard",
        status: "warning",
        message: "Dashboard loaded but some data couldn't be fetched",
        componentStatus: {
          rendered: true,
          loadTime: 1200,
          errors: ["Failed to fetch recent activity data"]
        },
        apiStatus: [
          {
            endpoint: "/api/activity/recent",
            status: "error",
            responseTime: 3500,
            errorMessage: "Timeout while fetching recent activity"
          }
        ]
      };
    }
    
    return {
      route: "/dashboard",
      status: "success",
      message: "Dashboard loaded successfully",
      componentStatus: {
        rendered: true,
        loadTime: 850
      }
    };
  } catch (error) {
    return {
      route: "/dashboard",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error in Dashboard diagnostics",
      consoleErrors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
};

// Cash Management tab diagnostics
export const diagnoseCashManagementTab = async (): Promise<NavigationDiagnosticResult> => {
  try {
    console.log("Running Cash Management tab diagnostics");
    
    // Simulate component rendering
    const componentCheck = Math.random() > 0.1; // 90% success rate for demo
    
    // Simulate API integration checks
    const apiCheck = Math.random() > 0.2; // 80% success rate for demo
    
    if (!componentCheck) {
      return {
        route: "/cash-management",
        status: "error",
        message: "Cash Management components failed to render properly",
        componentStatus: {
          rendered: false,
          errors: ["Account summary components failed to load"]
        }
      };
    }
    
    if (!apiCheck) {
      return {
        route: "/cash-management",
        status: "warning",
        message: "Cash Management loaded but API integration issues detected",
        componentStatus: {
          rendered: true,
          loadTime: 950
        },
        apiStatus: [
          {
            endpoint: "/api/accounts/balances",
            status: "warning",
            responseTime: 2800,
            errorMessage: "Slow response from account balance service"
          }
        ]
      };
    }
    
    return {
      route: "/cash-management",
      status: "success",
      message: "Cash Management loaded successfully",
      componentStatus: {
        rendered: true,
        loadTime: 780
      },
      apiStatus: [
        {
          endpoint: "/api/accounts/balances",
          status: "success",
          responseTime: 450
        }
      ]
    };
  } catch (error) {
    return {
      route: "/cash-management",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error in Cash Management diagnostics",
      consoleErrors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
};

// Transfers tab diagnostics
export const diagnoseTransfersTab = async (): Promise<NavigationDiagnosticResult> => {
  try {
    console.log("Running Transfers tab diagnostics");
    
    // Simulate component rendering
    const componentCheck = Math.random() > 0.05; // 95% success rate for demo
    
    // Simulate API integration
    const apiCheck = Math.random() > 0.15; // 85% success rate for demo
    
    if (!componentCheck) {
      return {
        route: "/transfers",
        status: "error",
        message: "Transfers components failed to render properly",
        componentStatus: {
          rendered: false,
          errors: ["Transfer form components failed to initialize"]
        }
      };
    }
    
    if (!apiCheck) {
      return {
        route: "/transfers",
        status: "warning",
        message: "Transfers loaded but API connectivity issues detected",
        componentStatus: {
          rendered: true,
          loadTime: 650
        },
        apiStatus: [
          {
            endpoint: "/api/transfers/history",
            status: "error",
            responseTime: 0,
            errorMessage: "Failed to connect to transfer history service"
          },
          {
            endpoint: "/api/accounts/eligible",
            status: "success",
            responseTime: 320
          }
        ]
      };
    }
    
    return {
      route: "/transfers",
      status: "success",
      message: "Transfers loaded successfully",
      componentStatus: {
        rendered: true,
        loadTime: 520
      },
      apiStatus: [
        {
          endpoint: "/api/transfers/history",
          status: "success",
          responseTime: 380
        },
        {
          endpoint: "/api/accounts/eligible",
          status: "success",
          responseTime: 290
        }
      ]
    };
  } catch (error) {
    return {
      route: "/transfers",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error in Transfers diagnostics",
      consoleErrors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
};

// Funding Accounts tab diagnostics
export const diagnoseFundingAccountsTab = async (): Promise<NavigationDiagnosticResult> => {
  try {
    console.log("Running Funding Accounts tab diagnostics");
    
    // Simulate component rendering
    const componentCheck = Math.random() > 0.08; // 92% success rate for demo
    
    // Simulate API integration
    const apiCheck = Math.random() > 0.2; // 80% success rate for demo
    
    if (!componentCheck) {
      return {
        route: "/funding-accounts",
        status: "error",
        message: "Funding Accounts components failed to render properly",
        componentStatus: {
          rendered: false,
          errors: ["Account listing component failed to initialize"]
        }
      };
    }
    
    if (!apiCheck) {
      return {
        route: "/funding-accounts",
        status: "warning",
        message: "Funding Accounts loaded but some integrations have issues",
        componentStatus: {
          rendered: true,
          loadTime: 920
        },
        apiStatus: [
          {
            endpoint: "/api/accounts/funding",
            status: "warning",
            responseTime: 3200,
            errorMessage: "Slow response from funding accounts service"
          },
          {
            endpoint: "/api/plaid/link",
            status: "success",
            responseTime: 450
          }
        ]
      };
    }
    
    return {
      route: "/funding-accounts",
      status: "success",
      message: "Funding Accounts loaded successfully",
      componentStatus: {
        rendered: true,
        loadTime: 680
      },
      apiStatus: [
        {
          endpoint: "/api/accounts/funding",
          status: "success",
          responseTime: 520
        },
        {
          endpoint: "/api/plaid/link",
          status: "success",
          responseTime: 350
        }
      ]
    };
  } catch (error) {
    return {
      route: "/funding-accounts",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error in Funding Accounts diagnostics",
      consoleErrors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
};

// Investments tab diagnostics
export const diagnoseInvestmentsTab = async (): Promise<NavigationDiagnosticResult> => {
  try {
    console.log("Running Investments tab diagnostics");
    
    // Simulate component rendering
    const componentCheck = Math.random() > 0.15; // 85% success rate for demo
    
    // Simulate API integration
    const apiCheck = Math.random() > 0.25; // 75% success rate for demo
    
    if (!componentCheck) {
      return {
        route: "/investments",
        status: "error",
        message: "Investments components failed to render properly",
        componentStatus: {
          rendered: false,
          errors: ["Investment portfolio component failed to initialize"]
        }
      };
    }
    
    if (!apiCheck) {
      return {
        route: "/investments",
        status: "warning",
        message: "Investments loaded but market data service has issues",
        componentStatus: {
          rendered: true,
          loadTime: 1250
        },
        apiStatus: [
          {
            endpoint: "/api/market/data",
            status: "error",
            responseTime: 0,
            errorMessage: "Failed to connect to market data service"
          },
          {
            endpoint: "/api/portfolio/summary",
            status: "success",
            responseTime: 680
          }
        ]
      };
    }
    
    return {
      route: "/investments",
      status: "success",
      message: "Investments loaded successfully",
      componentStatus: {
        rendered: true,
        loadTime: 950
      },
      apiStatus: [
        {
          endpoint: "/api/market/data",
          status: "success",
          responseTime: 750
        },
        {
          endpoint: "/api/portfolio/summary",
          status: "success",
          responseTime: 580
        }
      ]
    };
  } catch (error) {
    return {
      route: "/investments",
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error in Investments diagnostics",
      consoleErrors: [error instanceof Error ? error.message : "Unknown error"]
    };
  }
};

// Run all tab diagnostics
export const runAllTabDiagnostics = async (): Promise<Record<string, NavigationDiagnosticResult>> => {
  return {
    dashboard: await diagnoseDashboardTab(),
    cashManagement: await diagnoseCashManagementTab(),
    transfers: await diagnoseTransfersTab(),
    fundingAccounts: await diagnoseFundingAccountsTab(),
    investments: await diagnoseInvestmentsTab(),
  };
};
