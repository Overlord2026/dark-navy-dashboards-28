
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";
import { NetWorthProvider } from "@/context/NetWorthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { Toaster } from "@/components/ui/sonner";
import { DiagnosticsProvider } from "@/context/DiagnosticsContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from './context/AdminContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIInsightsProvider } from "./components/insights/AIInsightsProvider";
import { AudienceProvider } from "./context/AudienceContext";
import routes from "./routes";
import { RouterProvider } from "react-router-dom";

// Create a Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <AdminProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <SubscriptionProvider>
                <NetWorthProvider>
                  <DiagnosticsProvider>
                    <AdvisorProvider>
                      <AIInsightsProvider>
                        <AudienceProvider>
                          <TooltipProvider>
                            <RouterProvider router={routes} />
                            <Toaster position="top-right" richColors closeButton />
                          </TooltipProvider>
                        </AudienceProvider>
                      </AIInsightsProvider>
                    </AdvisorProvider>
                  </DiagnosticsProvider>
                </NetWorthProvider>
              </SubscriptionProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AdminProvider>
  );
}

export default App;
