
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/dashboard"; // Using lowercase to match the actual file name

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
];
