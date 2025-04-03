
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <SubscriptionProvider>
              <NetWorthProvider>
                <AuthProvider>
                  <DiagnosticsProvider>
                    <AdvisorProvider>
                      <AppRoutes />
                      <Toaster />
                    </AdvisorProvider>
                  </DiagnosticsProvider>
                </AuthProvider>
              </NetWorthProvider>
            </SubscriptionProvider>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
