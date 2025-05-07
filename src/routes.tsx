
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { collaborationRoutes } from "./routes/collaboration-routes";
import { integrationRoutes } from "./routes/integration-routes";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...educationRoutes,
  ...planningRoutes,
  ...settingsRoutes,
  ...collaborationRoutes,
  ...integrationRoutes,
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
