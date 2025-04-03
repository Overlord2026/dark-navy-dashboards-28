
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
import SimpleDiagnosticsView from "./components/diagnostics/SimpleDiagnosticsView";
import { FinancialPlanProvider } from "./context/FinancialPlanContext";
import { ProfessionalsProvider } from "./hooks/useProfessionals";
import { Button } from "./components/ui/button";
import { Calendar } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <NextThemesProvider defaultTheme="system" storageKey="vite-ui-theme">
        <CustomThemeProvider>
          <UserProvider>
            <NetWorthProvider>
              <SubscriptionProvider>
                <DiagnosticsProvider>
                  <FinancialPlanProvider>
                    <ProfessionalsProvider>
                      <AppRoutes />
                      <Toaster position="top-right" />
                      <DiagnosticsTrigger />
                      <DiagnosticsSummary />
                      <SimpleDiagnosticsView />
                      <div className="fixed bottom-4 right-4 z-50">
                        <a 
                          href="https://calendly.com/tonygomes/60min"
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="no-underline"
                        >
                          <Button 
                            className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Talk to an Advisor
                          </Button>
                        </a>
                      </div>
                    </ProfessionalsProvider>
                  </FinancialPlanProvider>
                </DiagnosticsProvider>
              </SubscriptionProvider>
            </NetWorthProvider>
          </UserProvider>
        </CustomThemeProvider>
      </NextThemesProvider>
    </BrowserRouter>
  );
}

export default App;
