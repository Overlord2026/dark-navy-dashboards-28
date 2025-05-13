
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { collaborationRoutes } from "./routes/collaboration-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/auth",
    element: <Auth />
  },
  {
    element: <ProtectedRoute />,
    children: [
      ...dashboardRoutes,
      ...educationRoutes,
      ...planningRoutes,
      ...settingsRoutes,
      ...collaborationRoutes,
      ...integrationRoutes,
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
