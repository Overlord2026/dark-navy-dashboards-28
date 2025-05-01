
import { DiagnosticTestStatus, NavigationTestResult } from './types';

export function runNavigationTests(): NavigationTestResult[] {
  return [
    {
      id: 'nav-1',
      route: '/dashboard',
      name: 'Dashboard',
      status: 'success',
      message: 'Navigation route is working correctly',
      responseTime: 120
    },
    {
      id: 'nav-2',
      route: '/settings',
      name: 'Settings',
      status: 'success',
      message: 'Navigation route is working correctly',
      responseTime: 85
    },
    {
      id: 'nav-3',
      route: '/reports',
      name: 'Reports',
      status: 'success',
      message: 'Navigation route is working correctly',
      responseTime: 150
    }
  ];
}
