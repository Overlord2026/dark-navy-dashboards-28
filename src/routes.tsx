
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { investmentRoutes } from "./routes/investment-routes";

const routes = createBrowserRouter([
  ...dashboardRoutes,
  ...educationRoutes,
  ...planningRoutes,
  ...settingsRoutes,
  ...integrationRoutes,
  ...investmentRoutes,
]);

export default routes;
