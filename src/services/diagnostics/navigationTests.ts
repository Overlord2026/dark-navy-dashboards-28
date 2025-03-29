
import { NavigationTestResult } from './types';

export const testNavigationRoutes = (): NavigationTestResult[] => {
  // In a real app, would attempt to navigate to each route and verify it loads properly
  return [
    {
      route: "/",
      status: "success",
      message: "Dashboard loads successfully"
    },
    {
      route: "/customer-profile",
      status: "success",
      message: "Customer profile loads successfully"
    },
    {
      route: "/documents",
      status: "success",
      message: "Documents page loads successfully"
    },
    {
      route: "/investments",
      status: "warning",
      message: "Investment page loads with warnings - some alternative assets may not display properly"
    },
    {
      route: "/education/course/fin101",
      status: "error",
      message: "Error loading course content - missing course data"
    },
    {
      route: "/advisor/modules",
      status: "success",
      message: "Advisor modules page loads successfully"
    },
    {
      route: "/professionals",
      status: "success",
      message: "Professionals directory loads successfully"
    }
  ];
};
