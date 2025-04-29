
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/dashboard"; // Using lowercase to match actual file
import AdvisorDashboard from "@/pages/AdvisorDashboard"; // Import the real dashboard

export const dashboardRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/index",
    element: <Landing />,
  },
  {
    path: "/advisor/login",
    element: <AdvisorDashboard />, // Updated to use real dashboard
  },
  {
    path: "/advisor/dashboard",
    element: <AdvisorDashboard />, // Updated to use real dashboard
  },
  {
    path: "/advisor/*",
    element: <AdvisorDashboard />, // Updated to use real dashboard
  },
];
