
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { goalsRoutes } from "./routes/goals-routes";
import { budgetRoutes } from "./routes/budget-routes";
import { accountsRoutes } from "./routes/accounts-routes";
import { investmentRoutes } from "./routes/investment-routes";
import { financialPlansRoutes } from "./routes/financial-plans-routes";
import { collaborationRoutes } from "./routes/collaboration-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { publicRoutes } from "./routes/public-routes";
import SecureLogin from "@/pages/SecureLogin";
import Unauthorized from "@/pages/Unauthorized";
import Diagnostics from "@/pages/Diagnostics";
import FamilyVault from "@/pages/FamilyVault";
import Documents from "@/pages/Documents";
import FeedbackPage from "@/pages/FeedbackPage";
import NotificationsPage from "@/pages/NotificationsPage";
import PublicHomePage from "@/pages/PublicHomePage";
import NotFound from "@/pages/NotFound";
import { UserProvider } from "@/context/UserContext";
import { AdvisorProvider } from "@/context/AdvisorContext";

function App() {
  const router = createBrowserRouter([
    ...publicRoutes,
    ...dashboardRoutes,
    ...goalsRoutes,
    ...budgetRoutes,
    ...accountsRoutes,
    ...investmentRoutes,
    ...financialPlansRoutes, 
    ...collaborationRoutes,
    ...integrationRoutes,
    {
      path: "/secure-login",
      element: <SecureLogin />,
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "/diagnostics",
      element: <Diagnostics />,
    },
    {
      path: "/family-vault",
      element: <FamilyVault />,
    },
    {
      path: "/documents",
      element: <Documents />,
    },
    {
      path: "/feedback",
      element: <FeedbackPage />,
    },
    {
      path: "/notifications",
      element: <NotificationsPage />,
    },
    {
      path: "/",
      element: <PublicHomePage />,
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <UserProvider>
      <AdvisorProvider>
        <RouterProvider router={router} />
      </AdvisorProvider>
    </UserProvider>
  );
}

export default App;
