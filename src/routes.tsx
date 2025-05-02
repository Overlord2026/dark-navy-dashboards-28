
import { createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { investmentRoutes } from "./routes/investment-routes";
import { budgetRoutes } from "./routes/budget-routes";
import { goalsRoutes } from "./routes/goals-routes";
import { accountsRoutes } from "./routes/accounts-routes";
import { publicRoutes } from "./routes/public-routes";

const routes = createBrowserRouter([
  ...publicRoutes, // Add the public routes first
  ...dashboardRoutes,
  ...educationRoutes,
  ...planningRoutes,
  ...settingsRoutes,
  ...integrationRoutes,
  ...investmentRoutes,
  ...budgetRoutes,
  ...goalsRoutes,
  ...accountsRoutes,
]);

export default routes;
