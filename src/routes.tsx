
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { collaborationRoutes } from "./routes/collaboration-routes";
// Integration routes import removed
import NotFound from "./pages/NotFound";

const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...educationRoutes,
  ...planningRoutes,
  ...settingsRoutes,
  ...collaborationRoutes,
  // Integration routes removed
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
