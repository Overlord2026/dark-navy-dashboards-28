
import { createBrowserRouter, RouteObject, Outlet } from "react-router-dom";
import dashboardRoutes from "./routes/dashboard-routes";
import { educationRoutes } from "./routes/education-routes";
import { planningRoutes } from "./routes/planning-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { integrationRoutes } from "./routes/integration-routes";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Header from "./components/Header";

// Root layout component that includes the Header
const RootLayout = () => {
  return (
    <>
      <Header isConnected={false} />
      <Outlet />
    </>
  );
};

// Convert all route elements to RouteObject type
const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "/auth",
        element: <AuthPage />
      },
      ...dashboardRoutes as unknown as RouteObject[],
      ...educationRoutes as unknown as RouteObject[],
      ...planningRoutes as unknown as RouteObject[],
      ...settingsRoutes as unknown as RouteObject[],
      ...integrationRoutes as unknown as RouteObject[],
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default routes;
