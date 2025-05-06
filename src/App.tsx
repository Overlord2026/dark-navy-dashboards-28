
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import Layout from "./layouts/Layout";
import { dashboardRoutes } from "./routes/dashboard-routes";
import { accountsRoutes } from "./routes/accounts-routes";
import { investmentRoutes } from "./routes/investment-routes";
import { publicRoutes } from "./routes/public-routes";
import { budgetRoutes } from "./routes/budget-routes";
import { goalsRoutes } from "./routes/goals-routes";
import { integrationRoutes } from "./routes/integration-routes";
import { insuranceRoutes } from "./routes/insurance-routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}

              {/* Main application */}
              <Route path="/" element={<Layout />}>
                {/* Dashboard routes */}
                {dashboardRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}

                {/* Account routes */}
                {accountsRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}

                {/* Investment routes */}
                {investmentRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}

                {/* Budget routes */}
                {budgetRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}

                {/* Goals routes */}
                {goalsRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}

                {/* Integration routes */}
                {integrationRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
                
                {/* Insurance routes */}
                {insuranceRoutes.map((route) => (
                  <Route key={route.path} path={route.path} element={route.element} />
                ))}
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
