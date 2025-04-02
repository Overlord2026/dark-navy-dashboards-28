
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider as NextThemesProvider } from "./components/ui/ThemeProvider";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import { NetWorthProvider } from "./context/NetWorthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { DiagnosticsProvider } from "./context/DiagnosticsContext";
import { DiagnosticsTrigger } from "./components/diagnostics/DiagnosticsTrigger";
import { DiagnosticsSummary } from "./components/diagnostics/DiagnosticsSummary";
import { NavigationHealthIndicator } from "./components/diagnostics/NavigationHealthIndicator";
import SimpleDiagnosticsView from "./components/diagnostics/SimpleDiagnosticsView";
import { FinancialPlanProvider } from "./context/FinancialPlanContext";
import { HelpAndSupport } from "./components/support/HelpAndSupport";

function App() {
  return (
    <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
      <CustomThemeProvider>
        <UserProvider>
          <NetWorthProvider>
            <SubscriptionProvider>
              <DiagnosticsProvider>
                <FinancialPlanProvider>
                  <BrowserRouter>
                    <AppRoutes />
                    <HelpAndSupport />
                    <Toaster position="top-right" />
                    <DiagnosticsTrigger />
                    <DiagnosticsSummary />
                    <NavigationHealthIndicator />
                    <SimpleDiagnosticsView />
                  </BrowserRouter>
                </FinancialPlanProvider>
              </DiagnosticsProvider>
            </SubscriptionProvider>
          </NetWorthProvider>
        </UserProvider>
      </CustomThemeProvider>
    </NextThemesProvider>
  );
}

export default App;
