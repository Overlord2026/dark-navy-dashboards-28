
import { NavigationDiagnosticResult, NavigationTestResult } from '@/types/diagnostics';
import { v4 as uuidv4 } from 'uuid';

// Mock navigation diagnostics
export const getNavigationDiagnosticsSummary = async () => {
  // Simulated async call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock API endpoints for different tabs
  const homeRoutes = [
    {
      id: uuidv4(),
      route: '/dashboard',
      status: 'success' as const,
      message: 'Dashboard loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/overview',
      status: 'success' as const,
      message: 'Overview loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/home/notifications',
      status: 'warning' as const,
      message: 'Notifications are slow to load (>2s)',
      timestamp: Date.now()
    }
  ];
  
  const educationRoutes = [
    {
      id: uuidv4(),
      route: '/education',
      status: 'success' as const,
      message: 'Education main page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/education/courses',
      status: 'success' as const,
      message: 'Courses page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/education/course/123',
      status: 'warning' as const,
      message: 'Course detail page is slow to load (>2s)',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/education/resources',
      status: 'error' as const,
      message: 'Resources page failed to load due to API error',
      timestamp: Date.now()
    }
  ];
  
  const familyWealthRoutes = [
    {
      id: uuidv4(),
      route: '/family-wealth',
      status: 'success' as const,
      message: 'Family wealth main page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/family-wealth/legacy-vault',
      status: 'success' as const,
      message: 'Legacy vault page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/family-wealth/estate-planning',
      status: 'success' as const,
      message: 'Estate planning page loads correctly',
      timestamp: Date.now()
    }
  ];
  
  const investmentsRoutes = [
    {
      id: uuidv4(),
      route: '/investments',
      status: 'success' as const,
      message: 'Investments main page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/investments/portfolio',
      status: 'success' as const,
      message: 'Portfolio page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/investments/alternatives',
      status: 'error' as const,
      message: 'Alternatives page failed to load due to script error',
      timestamp: Date.now()
    }
  ];
  
  const collaborationRoutes = [
    {
      id: uuidv4(),
      route: '/collaboration',
      status: 'success' as const,
      message: 'Collaboration main page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/collaboration/documents',
      status: 'success' as const,
      message: 'Shared documents page loads correctly',
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      route: '/collaboration/messages',
      status: 'warning' as const,
      message: 'Messages page has layout issues on mobile devices',
      timestamp: Date.now()
    }
  ];
  
  // Calculate statistics
  const results = {
    home: homeRoutes,
    educationSolutions: educationRoutes,
    familyWealth: familyWealthRoutes,
    investments: investmentsRoutes,
    collaboration: collaborationRoutes
  };
  
  // Count total results and status breakdown
  const allRoutes = [...homeRoutes, ...educationRoutes, ...familyWealthRoutes, ...investmentsRoutes, ...collaborationRoutes];
  const totalRoutes = allRoutes.length;
  const successCount = allRoutes.filter(route => route.status === 'success').length;
  const warningCount = allRoutes.filter(route => route.status === 'warning').length;
  const errorCount = allRoutes.filter(route => route.status === 'error').length;
  
  // Determine overall status
  let overallStatus: 'success' | 'warning' | 'error' = 'success';
  if (errorCount > 0) {
    overallStatus = 'error';
  } else if (warningCount > 0) {
    overallStatus = 'warning';
  }
  
  return {
    results,
    totalRoutes,
    successCount,
    warningCount,
    errorCount,
    overallStatus
  };
};
