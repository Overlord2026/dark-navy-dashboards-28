
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard"; // Fixed casing in the import
import AdvisorDashboard from "@/pages/AdvisorDashboard";
import LoginPage from "@/pages/LoginPage";
import AdvisorLanding from "@/pages/AdvisorLanding";

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
    element: <LoginPage isAdvisor={true} />,
  },
  {
    path: "/advisor/dashboard",
    element: <AdvisorDashboard />,
  },
  {
    path: "/advisor",
    element: <AdvisorLanding />,
  },
  {
    path: "/advisor/*",
    element: <AdvisorDashboard />,
  },
];
